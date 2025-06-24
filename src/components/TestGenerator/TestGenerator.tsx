import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  Button,
  Grid,
} from '@mui/material';
import { Quiz, Edit } from '@mui/icons-material';
import { MCQTest } from './MCQTest';
import { EssayTest } from './EssayTest';
import { TestHistory } from './TestHistory';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

export const TestGenerator: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
        Test Generator
      </Typography>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={currentTab} 
            onChange={handleTabChange}
            sx={{ px: 3, pt: 2 }}
          >
            <Tab 
              icon={<Quiz />} 
              label="MCQ Test" 
              iconPosition="start"
              sx={{ textTransform: 'none', fontWeight: 500 }}
            />
            <Tab 
              icon={<Edit />} 
              label="Essay Test" 
              iconPosition="start"
              sx={{ textTransform: 'none', fontWeight: 500 }}
            />
            <Tab 
              label="Test History" 
              sx={{ textTransform: 'none', fontWeight: 500 }}
            />
          </Tabs>
        </Box>

        <TabPanel value={currentTab} index={0}>
          <MCQTest />
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          <EssayTest />
        </TabPanel>

        <TabPanel value={currentTab} index={2}>
          <TestHistory />
        </TabPanel>
      </Card>
    </Box>
  );
};