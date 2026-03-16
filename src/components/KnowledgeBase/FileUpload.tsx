import React, { useCallback, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  LinearProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  SelectChangeEvent,
} from '@mui/material';
import { CloudUpload, Description } from '@mui/icons-material';
import { storage } from '../../utils/storage';
import { Document } from '../../types';
import { v4 as uuidv4 } from 'uuid';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const categories = ['GS1', 'GS2', 'GS3', 'GS4'];
const subCategories = {
  GS1: ['History', 'Geography', 'Culture', 'Society'],
  GS2: ['Polity', 'Governance', 'International Relations', 'Social Justice'],
  GS3: ['Economy', 'Science & Technology', 'Environment', 'Security'],
  GS4: ['Ethics', 'Integrity', 'Aptitude', 'Case Studies'],
};

interface FileUploadProps {
  onUploadComplete: () => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onUploadComplete }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleFiles = useCallback(async (files: FileList) => {
    const file = files[0];
    
    // Validate file type
    const allowedTypes = ['.pdf', '.epub', '.docx'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!allowedTypes.includes(fileExtension)) {
      setMessage({ type: 'error', text: 'Only PDF, EPUB, and DOCX files are supported.' });
      return;
    }

    if (selectedTags.length === 0) {
      setMessage({ type: 'error', text: 'Please select at least one tag before uploading.' });
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setMessage(null);

    try {
      // Simulate file processing with progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Read file content (simplified for demo)
      const reader = new FileReader();
      reader.onload = async (ev) => {
        try {
          const content = ev.target?.result as string;
          
          const document: Document = {
            id: uuidv4(),
            name: file.name,
            content: content.substring(0, 1000) + '...', // Truncated for demo
            type: fileExtension.substring(1) as 'pdf' | 'epub' | 'docx',
            tags: selectedTags,
            uploadDate: new Date(),
            size: file.size,
          };

          await storage.saveDocument(document);
          
          setUploadProgress(100);
          setMessage({ type: 'success', text: 'File uploaded successfully!' });
          setSelectedTags([]);
          onUploadComplete();
          
          setTimeout(() => {
            setUploading(false);
            setUploadProgress(0);
            setMessage(null);
          }, 2000);
        } catch {
          setMessage({ type: 'error', text: 'Error processing file. Please try again.' });
          setUploading(false);
          setUploadProgress(0);
        }
      };

      reader.readAsText(file);
    } catch {
      setMessage({ type: 'error', text: 'Error uploading file. Please try again.' });
      setUploading(false);
      setUploadProgress(0);
    }
  }, [onUploadComplete, selectedTags]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleTagChange = (event: SelectChangeEvent<typeof selectedTags>) => {
    const value = event.target.value;
    setSelectedTags(typeof value === 'string' ? value.split(',') : value);
  };

  const getAllTags = () => {
    const allTags: string[] = [];
    categories.forEach(category => {
      allTags.push(category);
      allTags.push(...subCategories[category as keyof typeof subCategories]);
    });
    return allTags;
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Upload Study Materials
        </Typography>
        
        {message && (
          <Alert severity={message.type} sx={{ mb: 2 }}>
            {message.text}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Tags</InputLabel>
            <Select
              multiple
              value={selectedTags}
              onChange={handleTagChange}
              input={<OutlinedInput label="Tags" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {getAllTags().map((tag) => (
                <MenuItem key={tag} value={tag}>
                  {tag}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          sx={{
            border: 2,
            borderColor: dragActive ? 'primary.main' : 'grey.300',
            borderStyle: 'dashed',
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            backgroundColor: dragActive ? 'primary.50' : 'background.paper',
            transition: 'all 0.2s ease-in-out',
            cursor: 'pointer',
          }}
        >
          <input
            type="file"
            id="file-upload"
            accept=".pdf,.epub,.docx"
            onChange={handleChange}
            style={{ display: 'none' }}
            disabled={uploading}
          />
          
          <CloudUpload
            sx={{
              fontSize: 48,
              color: dragActive ? 'primary.main' : 'grey.400',
              mb: 2,
            }}
          />
          
          <Typography variant="h6" gutterBottom>
            {dragActive ? 'Drop files here' : 'Drag & drop files here'}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Supported formats: PDF, EPUB, DOCX
          </Typography>
          
          <Button
            variant="contained"
            component="label"
            htmlFor="file-upload"
            disabled={uploading}
            startIcon={<Description />}
          >
            Choose Files
          </Button>
        </Box>

        {uploading && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Processing file... {uploadProgress}%
            </Typography>
            <LinearProgress variant="determinate" value={uploadProgress} />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};