import express from 'express';
import cors from 'cors';
import { spawn } from 'child_process'; // python file run karne ke liye

const app = express();


app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {    
    res.send('Hello Sherrr!');
});

// Ollama ka route hai ji
app.post('/process-text', (req, res) => {
    const extractedText = req.body.text;
    console.log("Received text from frontend:", extractedText);


    const pythonProcess = spawn('python', ['run_ollama.py']);

    
    pythonProcess.stdin.write(extractedText);
    pythonProcess.stdin.end();  // or input send nahi hoga 

    //Whenever the Python script sends data back, the below callback function will be executed.

    pythonProcess.stdout.on('data', (data) => {
        const ollamaResponse = data.toString(); //buffer form mein hai issliye string convert karra
        console.log("Ollama Model Response:", ollamaResponse); // yeh log remove kanra hai production ke time pr 
        // response ko frontend bhejte hueeeee(after lots of debug)!!!!
        res.json({ summary: ollamaResponse });
    });


    pythonProcess.stderr.on('data', (data) => {
        console.error(`Error from Python script: ${data}`);
        res.status(500).json({ error: 'Error processing text with Ollama model' });
    });

    //jab python proess execute hoga tab yeh callback function exceute hoga
    
    pythonProcess.on('close', (code) => {
        console.log(`Python process exited with code ${code}`);
    });
});


const port = 3001;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
