import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { Quiz, Edit, Visibility, Delete } from '@mui/icons-material';
import { storage } from '../../utils/storage';
import { TestSession } from '../../types';

export const TestHistory: React.FC = () => {
  const [sessions, setSessions] = useState<TestSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<TestSession | null>(null);
  const [viewDialog, setViewDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTestHistory();
  }, []);

  const loadTestHistory = async () => {
    try {
      const testSessions = await storage.getTestSessions();
      const sortedSessions = testSessions.sort(
        (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
      );
      setSessions(sortedSessions);
    } catch (error) {
      console.error('Error loading test history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (session: TestSession) => {
    setSelectedSession(session);
    setViewDialog(true);
  };

  const handleDelete = async (sessionId: string) => {
    // Note: This would require implementing a delete method in storage
    console.log('Delete session:', sessionId);
    // For now, just remove from local state
    setSessions(sessions.filter(session => session.id !== sessionId));
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (startTime: Date | string, endTime?: Date | string) => {
    if (!endTime) return 'Incomplete';
    
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMs = end.getTime() - start.getTime();
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    
    return `${minutes}m ${seconds}s`;
  };

  const getTestIcon = (type: string) => {
    return type === 'mcq' ? <Quiz color="primary" /> : <Edit color="secondary" />;
  };

  const getScoreColor = (score?: number) => {
    if (!score) return 'default';
    if (score >= 8) return 'success';
    if (score >= 6) return 'warning';
    return 'error';
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading test history...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Test History ({sessions.length})
      </Typography>
      
      {sessions.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Typography color="text.secondary">
              No test sessions found. Take your first test to see history here.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <List>
          {sessions.map((session) => (
            <Card key={session.id} sx={{ mb: 2 }}>
              <ListItem>
                <ListItemIcon>
                  {getTestIcon(session.type)}
                </ListItemIcon>
                
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {session.type.toUpperCase()} Test
                      </Typography>
                      {session.score !== undefined && (
                        <Chip
                          label={`${session.score}/10`}
                          color={getScoreColor(session.score)}
                          size="small"
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Started: {formatDate(session.startTime)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Duration: {formatDuration(session.startTime, session.endTime)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Questions: {session.questions.length}
                      </Typography>
                    </Box>
                  }
                />
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    onClick={() => handleView(session)}
                    color="primary"
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(session.id)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </ListItem>
            </Card>
          ))}
        </List>
      )}

      {/* Session Details Dialog */}
      <Dialog
        open={viewDialog}
        onClose={() => setViewDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6">
            {selectedSession?.type.toUpperCase()} Test Details
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          {selectedSession && (
            <Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Test Information:
                </Typography>
                <Typography variant="body2">
                  <strong>Started:</strong> {formatDate(selectedSession.startTime)}
                </Typography>
                <Typography variant="body2">
                  <strong>Duration:</strong> {formatDuration(selectedSession.startTime, selectedSession.endTime)}
                </Typography>
                <Typography variant="body2">
                  <strong>Questions:</strong> {selectedSession.questions.length}
                </Typography>
                {selectedSession.score !== undefined && (
                  <Typography variant="body2">
                    <strong>Score:</strong> {selectedSession.score}/10
                  </Typography>
                )}
              </Box>

              <Typography variant="subtitle2" gutterBottom>
                Answers:
              </Typography>
              
              {selectedSession.type === 'mcq' ? (
                <Box>
                  {Object.entries(selectedSession.answers).map(([questionIndex, answerIndex]) => (
                    <Typography key={questionIndex} variant="body2" sx={{ mb: 1 }}>
                      Question {parseInt(questionIndex) + 1}: Option {answerIndex + 1}
                    </Typography>
                  ))}
                </Box>
              ) : (
                <Card variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {selectedSession.answers.essay || 'No essay content available'}
                  </Typography>
                  {selectedSession.answers.wordCount && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                      Word Count: {selectedSession.answers.wordCount}
                    </Typography>
                  )}
                </Card>
              )}
            </Box>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setViewDialog(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};