"use client"

import { ReactSketchCanvas } from "react-sketch-canvas";
import { useRef, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Confetti from 'react-confetti';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export default function Home() {
  const canvasRef = useRef(null);
  const [word, setWord] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [eraseMode, setEraseMode] = useState(false);

  const getWord = async () => {
    setIsLoading(true);
    try {
      // Placeholder for Gemini API call Replace this with actual Gemini implementation
      const chatSession = model.startChat({
        generationConfig,
        history: [],
      });

      const result = await chatSession.sendMessage(`Generate a simple word in 
        English for a student to practice writing in Spanish. The word should 
        not be too long, and should be no harder than B2 level. **Important: Return only the word in English, no other text.**`);
      const generatedWord = result.response.text().trim();
      setWord(generatedWord);
      // setWord(data.word);
    } catch (error) {
      console.error('Error fetching word:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!canvasRef.current || !word) return;

    // setIsLoading(true);
    try {
      const imageData = await canvasRef.current.exportImage("png");


      const chatSession = model.startChat({
        generationConfig,
        history: [],
      });

      const prompt = `I'm showing you a handwritten Spanish word. 
      The original English word was "${word}". 
    Please analyze if this drawing represents the correct Spanish translation 
    and spelling.
    Drawing: ${imageData}
    Respond in this exact format:
    CORRECT: true/false
    FEEDBACK: your feedback here`;

      const result = await chatSession.sendMessage(prompt);

      const response = result.response.text();
      const isCorrectMatch = response.match(/CORRECT:\s*(true|false)/i);
      const feedbackMatch = response.match(/FEEDBACK:\s*(.*)/i);

      const isCorrectResponse = isCorrectMatch ? isCorrectMatch[1].toLowerCase() === 'true' : false;
      const feedbackResponse = feedbackMatch ? feedbackMatch[1] : "Please try again";

      setIsCorrect(isCorrectResponse);
      setFeedback(feedbackResponse);

      if (isCorrectResponse) {
        // You'll need to install react-confetti npm package npm install react-confetti
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    } catch (error) {
      console.error('Error exporting image:', error);
      setFeedback("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEraserClick = () => {
    setEraseMode(true);
    canvasRef.current?.eraseMode(true);
  };

  const handlePenClick = () => {
    setEraseMode(false);
    canvasRef.current?.eraseMode(false);
  };

  const handleUndoClick = () => {
    canvasRef.current?.undo();
  };

  const handleRedoClick = () => {
    canvasRef.current?.redo();
  };

  const handleClearClick = () => {
    canvasRef.current?.clearCanvas();
  };

  const handleResetClick = () => {
    canvasRef.current?.resetCanvas();
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {showConfetti && <Confetti />}
      <h1 className="text-4xl font-bold">Writing practice in Spanish</h1>

      <div className="flex flex-col items-center gap-4 w-full">
        <button
          onClick={getWord}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
        >
          {isLoading ? 'Getting word...' : 'Get a new word'}
        </button>

        {word && (
          <div className="text-xl font-semibold mb-4">
            Write this word in Spanish: <span className="text-purple-500">{word}</span>
          </div>
        )}

        <div className="flex flex-col gap-2 items-center">
          <h2 className="text-2xl font-bold">Tools</h2>
          <div className="flex flex-row gap-2">
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              disabled={!eraseMode}
              onClick={handlePenClick}
            >
              Pen
            </button>
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              disabled={eraseMode}
              onClick={handleEraserClick}
            >
              Eraser
            </button>
            <div className="vr" />
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleUndoClick}
            >
              Undo
            </button>
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleRedoClick}
            >
              Redo
            </button>
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleClearClick}
            >
              Clear
            </button>
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleResetClick}
            >
              Reset
            </button>
          </div>
        </div>
        <ReactSketchCanvas
          width="100%"
          height="100%"
          canvasColor="transparent"
          strokeColor="#a855f7"
          ref={canvasRef}
          disabled={!word}
        />

        <button
          onClick={handleSubmit}
          disabled={!word}
          className="mt-4 px-4 py-2 bg-purple-500 text-white rounded disabled:bg-purple-300"
        >
          Submit
        </button>

        {feedback && (
          <div className={`mt-4 p-4 rounded ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
            {feedback}
          </div>
        )}
      </div>

      <p>
        This is a tool to help you practice writing words in Spanish.
      </p>
    </div>
  );
}
