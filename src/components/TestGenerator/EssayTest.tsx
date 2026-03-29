import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
} from '@mui/material';
import { PlayArrow, Pause, Refresh, CheckCircle, Timer } from '@mui/icons-material';
import { storage } from '../../utils/storage';
import { EssayTopic, TestSession } from '../../types';
import { sampleEssayTopics } from '../../data/sampleData';
import { v4 as uuidv4 } from 'uuid';

export const EssayTest: React.FC = () => {
  const [topics, setTopics] = useState<EssayTopic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<EssayTopic | null>(null);
  const [essayContent, setEssayContent] = useState('');
  const [isTestActive, setIsTestActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60 * 60); // 60 minutes
  const [isPaused, setIsPaused] = useState(false);
  const [showSubmission, setShowSubmission] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    loadTopics();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isTestActive && !isPaused && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => time - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isTestActive) {
      finishTest();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTestActive, isPaused, timeRemaining, finishTest]);

  useEffect(() => {
    const words = essayContent.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [essayContent]);

  const loadTopics = async () => {
    try {
      let essayTopics = await storage.getEssayTopics();
      
      if (essayTopics.length === 0) {
        // Save sample topics if none exist
        for (const topic of sampleEssayTopics) {
          await storage.saveEssayTopic(topic);
        }
        essayTopics = sampleEssayTopics;
      }
      
      setTopics(essayTopics);
    } catch (error) {
      console.error('Error loading topics:', error);
      setTopics(sampleEssayTopics);
    }
  };

  const startTest = (topic: EssayTopic) => {
    setSelectedTopic(topic);
    setIsTestActive(true);
    setIsPaused(false);
    setEssayContent('');
    setTimeRemaining(topic.timeLimit * 60);
    setShowSubmission(false);
  };

  const pauseResumeTest = () => {
    setIsPaused(!isPaused);
  };

  const resetTest = () => {
    setIsTestActive(false);
    setIsPaused(false);
    setSelectedTopic(null);
    setEssayContent('');
    setTimeRemaining(60 * 60);
    setShowSubmission(false);
    setWordCount(0);
  };

  const finishTest = useCallback(async () => {
    setIsTestActive(false);
    setShowSubmission(true);

    // Save test session
    try {
      const session: TestSession = {
        id: uuidv4(),
        type: 'essay',
        questions: selectedTopic ? [selectedTopic.id] : [],
        answers: { essay: essayContent, wordCount },
        startTime: new Date(Date.now() - ((selectedTopic?.timeLimit || 60) * 60 - timeRemaining) * 1000),
        endTime: new Date(),
      };
      
      await storage.saveTestSession(session);
    } catch (error) {
      console.error('Error saving test session:', error);
    }
  }, [essayContent, selectedTopic, timeRemaining, wordCount]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getWordCountColor = () => {
    if (!selectedTopic) return 'text.secondary';
    const limit = selectedTopic.wordLimit;
    const percentage = (wordCount / limit) * 100;
    
    if (percentage > 110) return 'error.main';
    if (percentage > 90) return 'warning.main';
    if (percentage > 70) return 'success.main';
    return 'text.secondary';
  };

  const getTimeProgress = () => {
    if (!selectedTopic) return 0;
    const totalTime = selectedTopic.timeLimit * 60;
    return ((totalTime - timeRemaining) / totalTime) * 100;
  };

  return (
    <Box sx={{ p: 3 }}>
      {!isTestActive && !showSubmission ? (
        <Box>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Essay Test - Mains Style
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Choose a topic to begin your essay writing practice. Each topic has a recommended word limit and time duration.
          </Typography>

          {topics.map((topic) => (
            <Card key={topic.id} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Chip label={topic.category} color="primary" size="small" />
                      <Chip label={`${topic.wordLimit} words`} variant="outlined" size="small" />
                      <Chip 
                        label={`${topic.timeLimit} min`} 
                        variant="outlined" 
                        size="small"
                        icon={<Timer />}
                      />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>
                      {topic.topic}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    startIcon={<PlayArrow />}
                    onClick={() => startTest(topic)}
                  >
                    Start Essay
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : isTestActive && selectedTopic ? (
        <Box>
          {/* Test Header */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {selectedTopic.topic}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip label={selectedTopic.category} color="primary" size="small" />
                    <Chip label={`Target: ${selectedTopic.wordLimit} words`} variant="outlined" size="small" />
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Chip
                    label={formatTime(timeRemaining)}
                    color={timeRemaining < 600 ? 'error' : 'primary'}
                    sx={{ fontSize: '1rem', fontWeight: 600 }}
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={pauseResumeTest}
                    startIcon={isPaused ? <PlayArrow /> : <Pause />}
                  >
                    {isPaused ? 'Resume' : 'Pause'}
                  </Button>
                </Box>
              </Box>
              
              <LinearProgress 
                variant="determinate" 
                value={getTimeProgress()} 
                sx={{ height: 8, borderRadius: 4 }}
              />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                <Typography 
                  variant="body2" 
                  sx={{ color: getWordCountColor(), fontWeight: 500 }}
                >
                  Word Count: {wordCount} / {selectedTopic.wordLimit}
                </Typography>
                <Button
                  onClick={finishTest}
                  variant="contained"
                  color="success"
                  startIcon={<CheckCircle />}
                  disabled={wordCount < 50}
                >
                  Submit Essay
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Essay Writing Area */}
          <Card>
            <CardContent>
              <TextField
                multiline
                rows={20}
                value={essayContent}
                onChange={(e) => setEssayContent(e.target.value)}
                placeholder="Begin writing your essay here..."
                variant="outlined"
                fullWidth
                disabled={isPaused}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontSize: '1rem',
                    lineHeight: 1.6,
                  },
                }}
              />
            </CardContent>
          </Card>

          {isPaused && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Test is paused. Click Resume to continue writing.
            </Alert>
          )}

          {wordCount < 50 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Minimum 50 words required to submit the essay.
            </Alert>
          )}
        </Box>
      ) : null}

      {/* Submission Dialog */}
      <Dialog open={showSubmission} onClose={() => setShowSubmission(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Essay Submitted Successfully
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Topic: {selectedTopic?.topic}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip label={`Words: ${wordCount}`} color="primary" />
              <Chip 
                label={`Time Used: ${formatTime((selectedTopic?.timeLimit || 60) * 60 - timeRemaining)}`} 
                color="secondary" 
              />
            </Box>
          </Box>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Your Essay:
          </Typography>
          
          <Card variant="outlined">
            <CardContent>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                {essayContent}
              </Typography>
            </CardContent>
          </Card>

          <Alert severity="info" sx={{ mt: 2 }}>
            Your essay has been saved. Use the Answer Evaluator to analyze and improve your writing.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={resetTest} startIcon={<Refresh />}>
            Write Another Essay
          </Button>
          <Button onClick={() => setShowSubmission(false)} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};