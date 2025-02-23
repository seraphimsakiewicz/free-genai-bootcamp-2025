"use client";

import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThemeToggle } from '@/components/theme-toggle';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { mockListeningPractice, mockReadingPractice } from '@/lib/mock-data';
import ReactMarkdown from 'react-markdown';

type SavedQuestion = {
  id: string;
  title: string;
  date: string;
};

const mockSavedQuestions: SavedQuestion[] = [
  {
    id: '1',
    title: 'Comprensión de lectura - Viajes',
    date: '2024-03-15 14:30',
  },
  {
    id: '2',
    title: 'Comprensión auditiva - Restaurante',
    date: '2024-03-15 15:45',
  },
];

export default function Home() {
  const [practiceType, setPracticeType] = useState<string>('');
  const [practiceContent, setPracticeContent] = useState<any>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState<{ [key: number]: boolean }>({});

  const handleGeneratePractice = () => {
    setPracticeContent(practiceType === 'listening' ? mockListeningPractice : mockReadingPractice);
    setSelectedAnswers({});
    setShowResults({});
  };

  const handleAnswerSelect = (questionIndex: number, value: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: parseInt(value)
    }));
  };

  const handleSubmitAnswer = (questionIndex: number) => {
    if (selectedAnswers[questionIndex] !== undefined) {
      setShowResults(prev => ({
        ...prev,
        [questionIndex]: true
      }));
    }
  };

  const isAnswerCorrect = (questionIndex: number) => {
    if (practiceType === 'listening') {
      return selectedAnswers[questionIndex] === practiceContent.correctAnswer;
    } else {
      return selectedAnswers[questionIndex] === practiceContent.questions[questionIndex].correctAnswer;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-card border-r border-border p-4 min-h-screen">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Preguntas guardadas</h2>
            <div className="space-y-2">
              {mockSavedQuestions.map((question) => (
                <Card key={question.id} className="p-3 hover:bg-accent cursor-pointer">
                  <h3 className="font-medium text-sm">{question.title}</h3>
                  <p className="text-xs text-muted-foreground">{question.date}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">DELE Spanish Listening and Reading Practice</h1>
              <ThemeToggle />
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-full max-w-xs">
                  <Select value={practiceType} onValueChange={setPracticeType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select practice type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="listening">Comprensión auditiva</SelectItem>
                      <SelectItem value="reading">Comprensión de lectura</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {practiceType && (
                  <Button onClick={handleGeneratePractice} className="bg-blue-600 hover:bg-blue-700">
                    Generate Question
                  </Button>
                )}
              </div>

              {practiceContent && (
                <div className="bg-card rounded-lg p-6 shadow-sm space-y-6">
                  {practiceType === 'listening' ? (
                    <div className="space-y-4">
                      <audio controls className="w-full" src={practiceContent.audioPath}>
                        Your browser does not support the audio element.
                      </audio>
                      <h3 className="text-lg font-semibold">{practiceContent.question}</h3>
                      {practiceContent?.options && (
                        <RadioGroup
                          value={selectedAnswers[0]?.toString()}
                          onValueChange={(value) => handleAnswerSelect(0, value)}
                          className="space-y-2"
                        >
                          {practiceContent.options.map((option: string, index: number) => (
                            <div key={index} className="flex items-center space-x-2">
                              <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                              <label htmlFor={`option-${index}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                {option}
                              </label>
                            </div>
                          ))}
                        </RadioGroup>
                      )}
                      <div className="pt-4">
                        <Button
                          onClick={() => handleSubmitAnswer(0)}
                          disabled={selectedAnswers[0] === undefined}
                        >
                          Submit Answer
                        </Button>
                        {showResults[0] && (
                          <div className={`mt-4 p-4 rounded-md ${isAnswerCorrect(0)
                            ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100'
                            : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100'
                            }`}>
                            {isAnswerCorrect(0)
                              ? '¡Correcto! Well done!'
                              : '¡Incorrecto! Try again.'}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="prose dark:prose-invert max-w-none">
                        <ReactMarkdown>{practiceContent.text}</ReactMarkdown>
                      </div>
                      <div className="space-y-6">
                        {practiceContent?.questions?.map((q: any, qIndex: number) => (
                          <div key={qIndex} className="space-y-4">
                            <h3 className="text-lg font-semibold">{q.question}</h3>
                            <RadioGroup
                              value={selectedAnswers[qIndex]?.toString()}
                              onValueChange={(value) => handleAnswerSelect(qIndex, value)}
                              className="space-y-2"
                            >
                              {q.options.map((option: string, index: number) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <RadioGroupItem value={index.toString()} id={`question-${qIndex}-option-${index}`} />
                                  <label htmlFor={`question-${qIndex}-option-${index}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    {option}
                                  </label>
                                </div>
                              ))}
                            </RadioGroup>
                            <div className="pt-4">
                              <Button
                                onClick={() => handleSubmitAnswer(qIndex)}
                                disabled={selectedAnswers[qIndex] === undefined}
                              >
                                Submit Answer
                              </Button>
                              {showResults[qIndex] && (
                                <div className={`mt-4 p-4 rounded-md ${isAnswerCorrect(qIndex)
                                  ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100'
                                  : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100'
                                  }`}>
                                  {isAnswerCorrect(qIndex)
                                    ? '¡Correcto! Well done!'
                                    : '¡Incorrecto! Try again.'}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}