// Mock data for testing purposes
export const mockListeningPractice = {
  audioPath: "https://example.com/mock-audio.mp3",
  options: [
    "Go to the train station",
    "Take a flight to Madrid",
    "Visit the cherry blossoms"
  ],
  correctAnswer: 2 // Index of the correct answer (0-based)
};

export const mockReadingPractice = {
  text: `# El Café de la Mañana

En España, el desayuno es una parte importante de la rutina diaria. Muchos españoles 
comienzan su día con un café con leche y algún tipo de pan o bollería. Los bares y 
cafeterías suelen estar llenos durante las primeras horas de la mañana, con gente 
tomando su desayuno antes de ir al trabajo.

El café se puede pedir de diferentes maneras: solo (espresso), cortado (espresso con 
un poco de leche), o con leche (café con leche). Algunos también prefieren un café 
americano, que es más suave y tiene más cantidad.`,
  questions: [
    {
      question: "¿Qué bebida es común en el desayuno español?",
      options: [
        "Té verde",
        "Café con leche",
        "Chocolate caliente"
      ],
      correctAnswer: 1
    },
    {
      question: "¿Dónde suelen desayunar muchos españoles?",
      options: [
        "En casa solamente",
        "En bares y cafeterías",
        "En el trabajo"
      ],
      correctAnswer: 1
    },
    {
      question: "¿Qué es un café cortado?",
      options: [
        "Café sin leche",
        "Café con mucha leche",
        "Café con un poco de leche"
      ],
      correctAnswer: 2
    }
  ]
};