import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import {
  Description,
  Delete,
  Visibility,
  Edit,
  PictureAsPdf,
  MenuBook,
} from '@mui/icons-material';
import { storage } from '../../utils/storage';
import { Document } from '../../types';

interface DocumentListProps {
  refreshTrigger: number;
}

export const DocumentList: React.FC<DocumentListProps> = ({ refreshTrigger }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [viewDialog, setViewDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, [refreshTrigger]);

  const loadDocuments = async () => {
    try {
      const docs = await storage.getDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await storage.deleteDocument(id);
      setDocuments(documents.filter(doc => doc.id !== id));
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const handleView = (doc: Document) => {
    setSelectedDoc(doc);
    setViewDialog(true);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <PictureAsPdf color="error" />;
      case 'epub':
        return <MenuBook color="primary" />;
      case 'docx':
        return <Description color="info" />;
      default:
        return <Description />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography>Loading documents...</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Document Library ({documents.length})
          </Typography>
          
          {documents.length === 0 ? (
            <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No documents uploaded yet. Upload your first study material above.
            </Typography>
          ) : (
            <List>
              {documents.map((doc) => (
                <ListItem
                  key={doc.id}
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 2,
                    mb: 1,
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <ListItemIcon>
                    {getFileIcon(doc.type)}
                  </ListItemIcon>
                  
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {doc.name}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          {formatFileSize(doc.size)} • {formatDate(doc.uploadDate)}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          {doc.tags.map((tag) => (
                            <Chip
                              key={tag}
                              label={tag}
                              size="small"
                              sx={{ mr: 0.5, mb: 0.5 }}
                              color={tag.startsWith('GS') ? 'primary' : 'default'}
                            />
                          ))}
                        </Box>
                      </Box>
                    }
                  />
                  
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => handleView(doc)}
                      sx={{ mr: 1 }}
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={() => handleDelete(doc.id)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Document Viewer Dialog */}
      <Dialog
        open={viewDialog}
        onClose={() => setViewDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {selectedDoc && getFileIcon(selectedDoc.type)}
            <Typography variant="h6" component="span">
              {selectedDoc?.name}
            </Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Tags:
            </Typography>
            {selectedDoc?.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                sx={{ mr: 0.5, mb: 0.5 }}
                color={tag.startsWith('GS') ? 'primary' : 'default'}
              />
            ))}
          </Box>
          
          <Typography variant="subtitle2" gutterBottom>
            Content Preview:
          </Typography>
          <TextField
            multiline
            rows={12}
            value={selectedDoc?.content || ''}
            variant="outlined"
            fullWidth
            InputProps={{
              readOnly: true,
            }}
          />
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setViewDialog(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};