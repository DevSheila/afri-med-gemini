require('dotenv').config();
const express = require('express');
const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  }  = require("@google/generative-ai");

const  {removeSpecialCharacters} = require("./helpers/responseFormatter");
  
const app = express();
const MODEL_NAME = process.env.VITE_GEMINI_MODEL_NAME;
const API_KEY = process.env.VITE_GEMINI_API_KEY;

// Middleware to parse JSON bodies
app.use(express.json());

app.get('/', (req, res) => {

    res.send("hello");
  });



app.post('/api/gemini', async(req, res) => {
    const {prompt}  = req.body;

    // Process the request data
    if (!prompt ) {
        return res.status(400).json({ error: 'Prompt is required.' });
    }

    try{
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });
      
        const generationConfig = {
            temperature: 0.9,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
        };
        
        const safetySettings = [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        ];
    
        const chat = model.startChat({
        generationConfig,
        safetySettings,
        history: [],
        });
    
        const result = await chat.sendMessage(prompt);
        const response = result.response;
        const text=response.text();

        let cleanText = await removeSpecialCharacters(text);

        res.json({"response":cleanText});
        // res.json({"prompt":prompt});

    
    }catch(error){
        console.log("error",error)
        res.json({"error":error});

    }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
