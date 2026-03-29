import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Chip,
  Slider,
  List,
  ListItem,
  ListItemText,
  Paper,
} from '@mui/material';
import { Compare, Highlight, Score } from '@mui/icons-material';

interface EvaluationResult {
  score: number;
  keywords: string[];
  strengths: string[];
  improvements: string[];
  highlightedText: string;
}

export const AnswerEvaluator: React.FC = () => {
  const [userAnswer, setUserAnswer] = useState('');
  const [modelAnswer, setModelAnswer] = useState('');
  const [keywords, setKeywords] = useState('');
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [customScore, setCustomScore] = useState(5);

  const evaluateAnswer = () => {
    if (!userAnswer.trim() || !modelAnswer.trim()) {
      return;
    }

    // Simple keyword matching and evaluation logic
    const keywordList = keywords.split(',').map(k => k.trim().toLowerCase()).filter(k => k);
    const userText = userAnswer.toLowerCase();
    const modelText = modelAnswer.toLowerCase();
    
    // Find matching keywords
    const foundKeywords = keywordList.filter(keyword => 
      userText.includes(keyword)
    );

    // Calculate basic similarity score
    const commonWords = userText.split(' ').filter(word => 
      modelText.includes(word) && word.length > 3
    );
    
    const similarityScore = Math.min(
      (foundKeywords.length / Math.max(keywordList.length, 1)) * 5 +
      (commonWords.length / Math.max(modelText.split(' ').length, 1)) * 5,
      10
    );

    // Generate highlights
    let highlightedText = userAnswer;
    foundKeywords.forEach(keyword => {
      const regex = new RegExp(`(${keyword})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
    });

    // Generate feedback
    const strengths = [
      foundKeywords.length > 0 ? `Good use of key terms: ${foundKeywords.join(', ')}` : null,
      userAnswer.length > 100 ? 'Adequate length of response' : null,
      commonWords.length > 5 ? 'Good coverage of relevant concepts' : null,
    ].filter(Boolean) as string[];

    const improvements = [
      foundKeywords.length < keywordList.length / 2 ? 'Include more key terminology' : null,
      userAnswer.length < 100 ? 'Provide more detailed explanation' : null,
      commonWords.length < 3 ? 'Address the question more directly' : null,
      'Consider adding examples to support your points',
    ].filter(Boolean) as string[];

    setEvaluation({
      score: Math.round(similarityScore * 10) / 10,
      keywords: foundKeywords,
      strengths,
      improvements,
      highlightedText,
    });
  };

  const resetEvaluation = () => {
    setUserAnswer('');
    setModelAnswer('');
    setKeywords('');
    setEvaluation(null);
    setCustomScore(5);
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'success';
    if (score >= 6) return 'warning';
    return 'error';
  };

  const sampleModelAnswer = `Digital India is a flagship programme of the Government of India with a vision to transform India into a digitally empowered society and knowledge economy. Launched in 2015, it aims to provide digital infrastructure, deliver services digitally, and achieve digital literacy.

Key Components:
1. Digital Infrastructure: Broadband highways, universal phone connectivity, public internet access points, and digital identity (Aadhaar).
2. Governance & Services on Demand: Online platform for government services, electronic delivery of services, and digital locker.
3. Digital Empowerment: Universal digital literacy, digitally empowered citizens, and collaborative digital platforms.

Opportunities:
- Enhanced governance through e-governance initiatives
- Economic growth through digital payments and e-commerce
- Improved healthcare delivery through telemedicine
- Educational advancement through online learning platforms
- Financial inclusion through digital banking

Challenges:
- Digital divide between urban and rural areas
- Cybersecurity threats and data privacy concerns
- Lack of digital literacy among elderly and marginalized populations
- Infrastructure gaps in remote areas
- High cost of internet services

The success of Digital India depends on addressing these challenges while leveraging the opportunities to create an inclusive digital ecosystem.`;

  const loadSampleData = () => {
    setModelAnswer(sampleModelAnswer);
    setKeywords('digital infrastructure, e-governance, digital literacy, cybersecurity, financial inclusion, digital divide, telemedicine, Aadhaar');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
        Answer Evaluator
      </Typography>

      <Grid container spacing={3}>
        {/* Input Section */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Answer Comparison
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={loadSampleData}
                >
                  Load Sample
                </Button>
              </Box>
              
              <TextField
                label="Your Answer"
                multiline
                rows={8}
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
                placeholder="Enter your answer here..."
              />

              <TextField
                label="Model Answer"
                multiline
                rows={8}
                value={modelAnswer}
                onChange={(e) => setModelAnswer(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
                placeholder="Enter the model/reference answer here..."
              />

              <TextField
                label="Keywords (comma-separated)"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
                placeholder="digital infrastructure, e-governance, cybersecurity..."
              />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<Compare />}
                  onClick={evaluateAnswer}
                  disabled={!userAnswer.trim() || !modelAnswer.trim()}
                >
                  Evaluate Answer
                </Button>
                <Button
                  variant="outlined"
                  onClick={resetEvaluation}
                >
                  Reset
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Manual Scoring */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Manual Scoring
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Adjust the score based on your own evaluation (0-10)
              </Typography>
              
              <Box sx={{ px: 2 }}>
                <Slider
                  value={customScore}
                  onChange={(_, value) => setCustomScore(value as number)}
                  min={0}
                  max={10}
                  step={0.5}
                  marks
                  valueLabelDisplay="auto"
                />
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Chip
                  label={`Score: ${customScore}/10`}
                  color={getScoreColor(customScore)}
                  sx={{ fontSize: '1rem', px: 2, py: 1 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Results Section */}
        <Grid item xs={12} lg={6}>
          {evaluation ? (
            <Box>
              {/* Score Card */}
              <Card sx={{ mb: 3 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" color="primary" sx={{ fontWeight: 700 }}>
                    {evaluation.score}/10
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    Automatic Score
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Based on keyword matching and content similarity
                  </Typography>
                </CardContent>
              </Card>

              {/* Highlighted Answer */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    <Highlight sx={{ mr: 1 }} />
                    Highlighted Answer
                  </Typography>
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 2, 
                      '& mark': { 
                        backgroundColor: 'primary.light', 
                        color: 'white',
                        fontWeight: 'bold'
                      } 
                    }}
                  >
                    <Typography 
                      variant="body1" 
                      sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}
                      dangerouslySetInnerHTML={{ __html: evaluation.highlightedText }}
                    />
                  </Paper>
                  
                  {evaluation.keywords.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Found Keywords:
                      </Typography>
                      {evaluation.keywords.map((keyword) => (
                        <Chip
                          key={keyword}
                          label={keyword}
                          size="small"
                          color="primary"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>

              {/* Feedback */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    <Score sx={{ mr: 1 }} />
                    Evaluation Feedback
                  </Typography>
                  
                  {evaluation.strengths.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" color="success.main" gutterBottom>
                        Strengths:
                      </Typography>
                      <List dense>
                        {evaluation.strengths.map((strength, index) => (
                          <ListItem key={index} sx={{ py: 0.5 }}>
                            <ListItemText 
                              primary={`• ${strength}`}
                              primaryTypographyProps={{ fontSize: '0.875rem' }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}

                  {evaluation.improvements.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" color="warning.main" gutterBottom>
                        Areas for Improvement:
                      </Typography>
                      <List dense>
                        {evaluation.improvements.map((improvement, index) => (
                          <ListItem key={index} sx={{ py: 0.5 }}>
                            <ListItemText 
                              primary={`• ${improvement}`}
                              primaryTypographyProps={{ fontSize: '0.875rem' }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Box>
          ) : (
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <Compare sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Enter your answer and model answer to begin evaluation
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};