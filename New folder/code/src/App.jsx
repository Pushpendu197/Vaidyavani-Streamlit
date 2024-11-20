import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Please upload a file before submitting.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('http://localhost:5000/analyze-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data.analysis);
      setError('');
    } catch (err) {
      // Display error response from server
      const errorMsg = err.response?.data?.error || 'Something went wrong.';
      const errorDetails = err.response?.data?.details || '';
      setError(`${errorMsg}: ${errorDetails}`);
      console.error('Error during image analysis:', err.response ? err.response.data : err.message);
    }
  };

  return (
    <div className="App">
      <h1>VaidyaVani</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleSubmit}>Analyze Image</button>
      {error && <div className="error">{error}</div>}
      {result && <div className="result">{result}</div>}
    </div>
  );
}

export default App;
