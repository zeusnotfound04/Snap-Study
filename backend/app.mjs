import express from 'express';
import cors from 'cors';
import { spawn } from 'child_process';
const app = express();


app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {    
    res.send('Home page');
});
app.post('/process-text', (req, res) => {
    const extractedText = req.body.text;
    console.log("Received text from frontend:", extractedText);


    const pythonProcess = spawn('python', ['run_ollama.py']);

    
    pythonProcess.stdin.write(extractedText);
    pythonProcess.stdin.end(); 


    pythonProcess.stdout.on('data', (data) => {
        const ollamaResponse = data.toString(); 
        console.log("Ollama Model Response:", ollamaResponse); 
        res.json({ summary: ollamaResponse });
    });


    pythonProcess.stderr.on('data', (data) => {
        console.error(`Error from Python script: ${data}`);
        res.status(500).json({ error: 'Error processing text with Ollama model' });
    });

    
    pythonProcess.on('close', (code) => {
        console.log(`Python process exited with code ${code}`);
    });
});


const port = 3001;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
