const express = require('express');
const multer = require('multer');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const apiKey = 'AIzaSyCjixdZt8tzlv95uSpzCip-RDDk7F5L1Cs';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const systemPrompt = `
You are tasked with providing a detailed analysis of diseases based on the user's query. Your responsibilities include:
[... Full system prompt ...]
`;

app.post('/analyze-image', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    try {
        const imageData = req.file.buffer.toString('base64');

        // Prepare the data for the request
        const data = {
            model: 'gemini-1.5-pro',
            prompt: `${systemPrompt}\nImage Data: ${imageData}`,
            temperature: 1,
            top_p: 1,
            top_k: 32,
            max_output_tokens: 8192,
        };

        // Make the request to Google API using Axios
        const response = await axios.post('https://api.generative.google.com/v1/generate', data, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
        });

        res.json({ analysis: response.data.choices[0].message.text });
    } catch (error) {
        console.error('Error during image analysis:', error.response ? error.response.data : error.message);

        // Respond with the error details
        res.status(500).json({
            error: 'Internal Server Error. Failed to process the image.',
            details: error.response ? error.response.data : error.message,
        });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
