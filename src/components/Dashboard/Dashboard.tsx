import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
} from '@mui/material';
import {
  MenuBook,
  Quiz,
  Newspaper,
  Assessment,
  TrendingUp,
  Schedule,
} from '@mui/icons-material';
import { storage } from '../../utils/storage';
import { Progress, TestSession } from '../../types';
import { syllabusStructure } from '../../data/sampleData';

export const Dashboard: React.FC = () => {
  const [progress, setProgress] = useState<Progress[]>([]);
  const [recentSessions, setRecentSessions] = useState<TestSession[]>([]);
  const [stats, setStats] = useState({
    totalDocuments: 0,
    totalTests: 0,
    averageScore: 0,
    studyStreak: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const documents = await storage.getDocuments();
      const sessions = await storage.getTestSessions();
      
      // Calculate progress for each category
      const progressData: Progress[] = Object.keys(syllabusStructure).map(category => ({
        category: category as 'GS1' | 'GS2' | 'GS3' | 'GS4',
        completed: Math.floor(Math.random() * 80) + 10, // Mock data for now
        total: 100,
      }));

      // Get recent sessions
      const recent = sessions
        .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
        .slice(0, 5);

      // Calculate stats
      const averageScore = sessions.length > 0
        ? sessions.reduce((sum, session) => sum + (session.score || 0), 0) / sessions.length
        : 0;

      setProgress(progressData);
      setRecentSessions(recent);
      setStats({
        totalDocuments: documents.length,
        totalTests: sessions.length,
        averageScore: Math.round(averageScore * 10) / 10,
        studyStreak: Math.floor(Math.random() * 15) + 1, // Mock data
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string }> = ({
    title,
    value,
    icon,
    color,
  }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              backgroundColor: `${color}.light`,
              color: `${color}.main`,
              mr: 2,
            }}
          >
            {icon}
          </Box>
          <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
            {value}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
        Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Documents Uploaded"
            value={stats.totalDocuments}
            icon={<MenuBook />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Tests Completed"
            value={stats.totalTests}
            icon={<Quiz />}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Average Score"
            value={`${stats.averageScore}/10`}
            icon={<TrendingUp />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Study Streak"
            value={`${stats.studyStreak} days`}
            icon={<Schedule />}
            color="warning"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Syllabus Progress */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Syllabus Coverage Progress
              </Typography>
              <Box sx={{ mt: 3 }}>
                {progress.map((item) => (
                  <Box key={item.category} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" fontWeight={500}>
                        {item.category}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.completed}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={item.completed}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Recent Test Sessions
              </Typography>
              <List sx={{ mt: 2 }}>
                {recentSessions.length > 0 ? (
                  recentSessions.map((session) => (
                    <ListItem key={session.id} sx={{ px: 0 }}>
                      <ListItemIcon>
                        {session.type === 'mcq' ? <Quiz color="primary" /> : <Assessment color="secondary" />}
                      </ListItemIcon>
                      <ListItemText
                        primary={`${session.type.toUpperCase()} Test`}
                        secondary={`Score: ${session.score || 'N/A'}/10`}
                        primaryTypographyProps={{ fontSize: '0.875rem' }}
                        secondaryTypographyProps={{ fontSize: '0.75rem' }}
                      />
                    </ListItem>
                  ))
                ) : (
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="No recent sessions"
                      secondary="Start your first test to see activity here"
                      primaryTypographyProps={{ fontSize: '0.875rem' }}
                      secondaryTypographyProps={{ fontSize: '0.75rem' }}
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};