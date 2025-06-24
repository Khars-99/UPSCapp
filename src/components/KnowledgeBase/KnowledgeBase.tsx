import React, { useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { FileUpload } from './FileUpload';
import { DocumentList } from './DocumentList';

export const KnowledgeBase: React.FC = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadComplete = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
        Knowledge Base Manager
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <FileUpload onUploadComplete={handleUploadComplete} />
        </Grid>
        
        <Grid item xs={12} lg={6}>
          <DocumentList refreshTrigger={refreshTrigger} />
        </Grid>
      </Grid>
    </Box>
  );
};