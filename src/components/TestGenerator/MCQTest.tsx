import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { PlayArrow, Pause, Refresh, CheckCircle } from '@mui/icons-material';
import { storage } from '../../utils/storage';
import { MCQQuestion, TestSession } from '../../types';
import { sampleMCQQuestions } from '../../data/sampleData';
import { v4 as uuidv4 } from 'uuid';

export const MCQTest: React.FC = () => {
  const [questions, setQuestions] = useState<MCQQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isTestActive, setIsTestActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes
  const [isPaused, setIsPaused] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [testResults, setTestResults] = useState<{ score: number; details: any[] }>({ score: 0, details: [] });

  useEffect(() => {
    loadQuestions();
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
  }, [isTestActive, isPaused, timeRemaining]);

  const loadQuestions = async () => {
    try {
      let mcqQuestions = await storage.getMCQQuestions();
      
      if (mcqQuestions.length === 0) {
        // Save sample questions if none exist
        for (const question of sampleMCQQuestions) {
          await storage.saveMCQQuestion(question);
        }
        mcqQuestions = sampleMCQQuestions;
      }
      
      // Shuffle and take 10 questions
      const shuffled = mcqQuestions.sort(() => 0.5 - Math.random()).slice(0, 10);
      setQuestions(shuffled);
    } catch (error) {
      console.error('Error loading questions:', error);
      setQuestions(sampleMCQQuestions.slice(0, 10));
    }
  };

  const startTest = () => {
    setIsTestActive(true);
    setIsPaused(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setTimeRemaining(30 * 60);
    setShowResults(false);
  };

  const pauseResumeTest = () => {
    setIsPaused(!isPaused);
  };

  const resetTest = () => {
    setIsTestActive(false);
    setIsPaused(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setTimeRemaining(30 * 60);
    setShowResults(false);
    loadQuestions();
  };

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const finishTest = async () => {
    setIsTestActive(false);
    
    // Calculate results
    let correctAnswers = 0;
    const details = questions.map((question, index) => {
      const userAnswer = selectedAnswers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      if (isCorrect) correctAnswers++;
      
      return {
        question: question.question,
        userAnswer: userAnswer !== undefined ? question.options[userAnswer] : 'Not answered',
        correctAnswer: question.options[question.correctAnswer],
        isCorrect,
        explanation: question.explanation,
      };
    });

    const score = (correctAnswers / questions.length) * 10;
    setTestResults({ score, details });
    setShowResults(true);

    // Save test session
    try {
      const session: TestSession = {
        id: uuidv4(),
        type: 'mcq',
        questions: questions.map(q => q.id),
        answers: selectedAnswers,
        startTime: new Date(Date.now() - (30 * 60 - timeRemaining) * 1000),
        endTime: new Date(),
        score: Math.round(score * 10) / 10,
      };
      
      await storage.saveTestSession(session);
    } catch (error) {
      console.error('Error saving test session:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  return (
    <Box sx={{ p: 3 }}>
      {!isTestActive && !showResults ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              MCQ Test - Prelims Style
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              10 questions • 30 minutes • Multiple choice
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<PlayArrow />}
              onClick={startTest}
              sx={{ px: 4 }}
            >
              Start Test
            </Button>
          </CardContent>
        </Card>
      ) : isTestActive ? (
        <Box>
          {/* Test Header */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Question {currentQuestionIndex + 1} of {questions.length}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Chip
                    label={formatTime(timeRemaining)}
                    color={timeRemaining < 300 ? 'error' : 'primary'}
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
              <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
            </CardContent>
          </Card>

          {/* Question Card */}
          {currentQuestion && (
            <Card>
              <CardContent>
                <Box sx={{ mb: 3 }}>
                  <Chip
                    label={currentQuestion.category}
                    color="primary"
                    size="small"
                    sx={{ mb: 2 }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 500, lineHeight: 1.4 }}>
                    {currentQuestion.question}
                  </Typography>
                </Box>

                <FormControl component="fieldset" fullWidth>
                  <RadioGroup
                    value={selectedAnswers[currentQuestionIndex] ?? ''}
                    onChange={(e) => handleAnswerSelect(currentQuestionIndex, parseInt(e.target.value))}
                  >
                    {currentQuestion.options.map((option, index) => (
                      <FormControlLabel
                        key={index}
                        value={index}
                        control={<Radio />}
                        label={
                          <Typography variant="body1" sx={{ py: 1 }}>
                            {String.fromCharCode(65 + index)}. {option}
                          </Typography>
                        }
                        sx={{
                          border: 1,
                          borderColor: selectedAnswers[currentQuestionIndex] === index ? 'primary.main' : 'divider',
                          borderRadius: 2,
                          m: 0.5,
                          p: 1,
                          '&:hover': {
                            backgroundColor: 'action.hover',
                          },
                        }}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                  <Button
                    onClick={previousQuestion}
                    disabled={currentQuestionIndex === 0}
                    variant="outlined"
                  >
                    Previous
                  </Button>
                  
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    {currentQuestionIndex === questions.length - 1 ? (
                      <Button
                        onClick={finishTest}
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircle />}
                      >
                        Finish Test
                      </Button>
                    ) : (
                      <Button
                        onClick={nextQuestion}
                        variant="contained"
                      >
                        Next
                      </Button>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}

          {isPaused && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Test is paused. Click Resume to continue.
            </Alert>
          )}
        </Box>
      ) : null}

      {/* Results Dialog */}
      <Dialog open={showResults} onClose={() => setShowResults(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Test Results
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h3" color="primary" sx={{ fontWeight: 700 }}>
              {testResults.score.toFixed(1)}/10
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {Math.round((testResults.score / 10) * 100)}% Score
            </Typography>
          </Box>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Question Analysis:
          </Typography>
          
          {testResults.details.map((detail, index) => (
            <Card key={index} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mr: 1 }}>
                    Q{index + 1}:
                  </Typography>
                  <Chip
                    label={detail.isCorrect ? 'Correct' : 'Incorrect'}
                    color={detail.isCorrect ? 'success' : 'error'}
                    size="small"
                  />
                </Box>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Your Answer:</strong> {detail.userAnswer}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Correct Answer:</strong> {detail.correctAnswer}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {detail.explanation}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={resetTest} startIcon={<Refresh />}>
            Take Another Test
          </Button>
          <Button onClick={() => setShowResults(false)} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};