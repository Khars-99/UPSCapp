import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Chip,
  Grid,
  Alert,
  List,
  ListItem,
  ListItemText,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  SelectChangeEvent,
} from '@mui/material';
import { Upload, Add, Delete, Newspaper } from '@mui/icons-material';
import { storage } from '../../utils/storage';
import { CurrentAffairsItem } from '../../types';
import { v4 as uuidv4 } from 'uuid';

const categories = ['GS1', 'GS2', 'GS3', 'GS4', 'Economy', 'Environment', 'International', 'Governance'];

export const CurrentAffairs: React.FC = () => {
  const [pdfText, setPdfText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [questions, setQuestions] = useState<string[]>(['']);
  const [title, setTitle] = useState('');
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [currentAffairsItems, setCurrentAffairsItems] = useState<CurrentAffairsItem[]>([]);

  React.useEffect(() => {
    loadCurrentAffairs();
  }, []);

  const loadCurrentAffairs = async () => {
    try {
      const items = await storage.getCurrentAffairsItems();
      setCurrentAffairsItems(items);
    } catch (error) {
      console.error('Error loading current affairs:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setMessage({ type: 'error', text: 'Please upload a PDF file.' });
      return;
    }

    setProcessing(true);
    setMessage(null);

    try {
      // Note: In a real implementation, you would use pdf-parse here
      // For demo purposes, we'll simulate PDF text extraction
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = `Extracted text from ${file.name}:\n\nThis is a simulated PDF text extraction. In a real implementation, this would contain the actual extracted text from the PDF file. The text would include current affairs content that can be tagged and processed for UPSC preparation.\n\nKey Points:\n- Important policy updates\n- Economic developments\n- International relations\n- Environmental issues\n- Government schemes\n\nThis extracted content can then be tagged with relevant syllabus categories and used to generate practice questions.`;
        
        setPdfText(text);
        setTitle(file.name.replace('.pdf', ''));
        setProcessing(false);
        setMessage({ type: 'success', text: 'PDF text extracted successfully!' });
      };
      
      reader.readAsText(file); // In real implementation, use pdf-parse
    } catch (error) {
      setProcessing(false);
      setMessage({ type: 'error', text: 'Error processing PDF. Please try again.' });
    }
  };

  const handleTagChange = (event: SelectChangeEvent<typeof selectedTags>) => {
    const value = event.target.value;
    setSelectedTags(typeof value === 'string' ? value.split(',') : value);
  };

  const addQuestion = () => {
    setQuestions([...questions, '']);
  };

  const updateQuestion = (index: number, value: string) => {
    const updated = [...questions];
    updated[index] = value;
    setQuestions(updated);
  };

  const removeQuestion = (index: number) => {
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
  };

  const saveCurrentAffairsItem = async () => {
    if (!title || !pdfText || selectedTags.length === 0) {
      setMessage({ type: 'error', text: 'Please fill in all required fields.' });
      return;
    }

    try {
      const item: CurrentAffairsItem = {
        id: uuidv4(),
        title,
        content: pdfText,
        date: new Date(),
        tags: selectedTags,
        questions: questions.filter(q => q.trim() !== ''),
      };

      await storage.saveCurrentAffairsItem(item);
      setCurrentAffairsItems([item, ...currentAffairsItems]);
      
      // Reset form
      setTitle('');
      setPdfText('');
      setSelectedTags([]);
      setQuestions(['']);
      setMessage({ type: 'success', text: 'Current affairs item saved successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Error saving item. Please try again.' });
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
        Current Affairs Processor
      </Typography>

      <Grid container spacing={3}>
        {/* PDF Upload and Processing */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                PDF Text Extraction
              </Typography>
              
              {message && (
                <Alert severity={message.type} sx={{ mb: 2 }}>
                  {message.text}
                </Alert>
              )}

              <Button
                variant="outlined"
                component="label"
                startIcon={<Upload />}
                disabled={processing}
                sx={{ mb: 2 }}
              >
                Upload PDF
                <input
                  type="file"
                  hidden
                  accept=".pdf"
                  onChange={handleFileUpload}
                />
              </Button>

              {processing && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Processing PDF... Please wait.
                </Alert>
              )}

              <TextField
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />

              <TextField
                label="Extracted Text"
                multiline
                rows={8}
                value={pdfText}
                onChange={(e) => setPdfText(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Syllabus Tags</InputLabel>
                <Select
                  multiple
                  value={selectedTags}
                  onChange={handleTagChange}
                  input={<OutlinedInput label="Syllabus Tags" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                Critical Questions:
              </Typography>
              
              {questions.map((question, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    placeholder={`Question ${index + 1}`}
                    value={question}
                    onChange={(e) => updateQuestion(index, e.target.value)}
                    fullWidth
                    size="small"
                  />
                  <IconButton
                    onClick={() => removeQuestion(index)}
                    disabled={questions.length === 1}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </Box>
              ))}

              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button
                  startIcon={<Add />}
                  onClick={addQuestion}
                  variant="outlined"
                  size="small"
                >
                  Add Question
                </Button>
                <Button
                  variant="contained"
                  onClick={saveCurrentAffairsItem}
                  disabled={!title || !pdfText || selectedTags.length === 0}
                >
                  Save Item
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Saved Items */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Saved Items ({currentAffairsItems.length})
              </Typography>
              
              {currentAffairsItems.length === 0 ? (
                <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No current affairs items saved yet.
                </Typography>
              ) : (
                <List>
                  {currentAffairsItems.slice(0, 5).map((item) => (
                    <ListItem key={item.id} sx={{ px: 0 }}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Newspaper color="primary" fontSize="small" />
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {item.title}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              {formatDate(item.date)}
                            </Typography>
                            <Box sx={{ mt: 1 }}>
                              {item.tags.slice(0, 3).map((tag) => (
                                <Chip
                                  key={tag}
                                  label={tag}
                                  size="small"
                                  sx={{ mr: 0.5, mb: 0.5 }}
                                />
                              ))}
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              {item.questions.length} questions
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};