import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, Box, Button, Stepper, Step, StepLabel } from '@mui/material';

// Define the states of the application
const AppState = {
  UPLOAD: 'UPLOAD',
  FILLING: 'FILLING',
  DOWNLOAD: 'DOWNLOAD',
};

function App() {
  const [appState, setAppState] = useState(AppState.UPLOAD);
  const [file, setFile] = useState(null);
  const [placeholders, setPlaceholders] = useState([]);
  const [userData, setUserData] = useState({});
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('https://lexsy-backend-6dcj.onrender.com/api/extract-placeholders', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setPlaceholders(response.data.placeholders);
      if (response.data.placeholders.length > 0) {
        setAppState(AppState.FILLING);
      } else {
        alert('No placeholders found in the document.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please check the console for details.');
    }
  };

  const handleUserDataChange = (event) => {
    const { name, value } = event.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextPlaceholder = (event) => {
    event.preventDefault();
    if (currentPlaceholderIndex < placeholders.length - 1) {
      setCurrentPlaceholderIndex(currentPlaceholderIndex + 1);
    } else {
      setAppState(AppState.DOWNLOAD);
    }
  };

  const handleDownload = async () => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('data', JSON.stringify(userData));

    try {
      const response = await axios.post('https://lexsy-backend-6dcj.onrender.com/api/generate-document', formData, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'completed_document.docx');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Error generating document:', error);
      alert('Error generating document. Please check the console for details.');
    }
  };
  
  const handleReset = () => {
    setAppState(AppState.UPLOAD);
    setFile(null);
    setPlaceholders([]);
    setUserData({});
    setCurrentPlaceholderIndex(0);
  };

  const renderContent = () => {
    switch (appState) {
      case AppState.UPLOAD:
        return (
          <Box>
            <Typography variant="h5" gutterBottom>Upload Document</Typography>
            <input type="file" accept=".docx" onChange={handleFileChange} />
            <Button variant="contained" onClick={handleUpload} sx={{ mt: 2 }}>Upload and Start</Button>
          </Box>
        );
      case AppState.FILLING:
        const currentPlaceholder = placeholders[currentPlaceholderIndex];
        return (
          <Box>
            <Stepper activeStep={currentPlaceholderIndex} alternativeLabel sx={{ mb: 4 }}>
              {placeholders.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <Typography variant="h5" gutterBottom>Fill in: {currentPlaceholder}</Typography>
            <form onSubmit={handleNextPlaceholder}>
              <input
                name={currentPlaceholder}
                value={userData[currentPlaceholder] || ''}
                onChange={handleUserDataChange}
                autoFocus
                style={{ width: '100%', padding: '10px', fontSize: '1rem' }}
              />
              <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                {currentPlaceholderIndex < placeholders.length - 1 ? 'Next' : 'Finish'}
              </Button>
            </form>
          </Box>
        );
      case AppState.DOWNLOAD:
        return (
          <Box>
            <Typography variant="h5" gutterBottom>Document Ready!</Typography>
            <Button variant="contained" color="primary" onClick={handleDownload} sx={{ mr: 2 }}>Download Document</Button>
            <Button variant="outlined" onClick={handleReset}>Start Over</Button>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Lexsy Document Assistant
        </Typography>
        {renderContent()}
      </Box>
    </Container>
  );
}

export default App;