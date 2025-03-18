import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { nodes } from '../../gameData';
import { NextResponse } from 'next/server';

// Initialize the Google Generative AI with the API key
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_API_KEY);

// Set up safety settings to avoid harmful content
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

// Define the function schema for the AI to call
const functionDeclarations = [
    {
        name: "choose_node",
        description: "Selecciona el siguiente nodo basado en la entrada del usuario",
        parameters: {
            type: "object",
            properties: {
                destination: {
                    type: "string",
                    description: "El ID del nodo de destino",
                },
                explanation: {
                    type: "string",
                    description: "Explicación en español de por qué se eligió este nodo",
                },
            },
            required: ["destination", "explanation"],
        },
    },
    {
        name: "generate_question",
        description: "Genera una pregunta de guía para el usuario en español",
        parameters: {
            type: "object",
            properties: {
                question: {
                    type: "string",
                    description: "Una pregunta en español que guía al usuario sobre qué hacer a continuación",
                },
            },
            required: ["question"],
        },
    },
];

export async function POST(request) {
    try {
        // Parse the request body
        const body = await request.json();
        const { userInput, currentNode } = body;

        // Get the current node data
        const currentNodeData = nodes[currentNode];

        if (!currentNodeData) {
            return NextResponse.json({ error: 'Nodo no encontrado' }, { status: 400 });
        }

        // Get the available options for the current node
        const availableOptions = currentNodeData.options;

        // If there are no available options, this is an end node
        if (availableOptions.length === 0) {
            return NextResponse.json({
                nextNode: currentNode,
                nodeText: currentNodeData.text,
                isEndNode: true,
                guidingQuestion: "La aventura ha terminado. ¿Quieres empezar de nuevo?"
            });
        }

        // For initial loading or empty user input, just return the current node without AI
        // processing
        if (!userInput || userInput.trim() === '') {
            return NextResponse.json({
                nextNode: currentNode,
                nodeText: currentNodeData.text,
                guidingQuestion: "¿Qué harás ahora?",
                isEndNode: false
            });
        }

        // Prepare the available options for the AI prompt
        const optionsText = availableOptions.map(optionId => {
            const nodeData = nodes[optionId];
            return `${optionId}: ${nodeData.text}`;
        }).join('\n');

        // Initialize the Gemini model with function calling
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            safetySettings,
            generationConfig: {
                temperature: 0.2, // Lower temperature for more predictable outputs
                maxOutputTokens: 1024,
            },
            tools: [{ functionDeclarations }],
        });

        // Create the prompt for the AI
        const prompt = `
    Estás ayudando con un juego de aventura de texto en español. El jugador está actualmente en este nodo:
    
    "${currentNodeData.text}"
    
    El jugador ha ingresado: "${userInput}"
    
    Basado en su entrada, debes determinar cuál de los siguientes nodos de destino es el más apropiado:
    
    ${optionsText}
    
    Reglas:
    1. Si el usuario responde en inglés o cualquier idioma que no sea español, debes pedirle que escriba en español.
    2. Si la entrada del usuario no coincide claramente con ninguna opción, pídele una aclaración en español.
    3. Siempre elige el nodo más apropiado basado en la intención del usuario.
    
    Usa la función choose_node para seleccionar el próximo nodo y luego genera_question para crear una pregunta guía.
    `;

        try {
            // Generate content from the AI
            const result = await model.generateContent({
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
            });

            const response = result.response;

            // Check if the AI returned function calls
            if (!response.functionCalls || response.functionCalls.length === 0) {
                // If no function calls, ask the user to clarify in Spanish
                return NextResponse.json({
                    nextNode: currentNode,
                    nodeText: currentNodeData.text,
                    guidingQuestion: "No entiendo lo que quieres hacer. Por favor, expresa tu acción en español de manera más clara."
                });
            }

            // Get the function call for choosing the next node
            const chooseNodeCall = response.functionCalls.find(call => call.name === 'choose_node');

            if (!chooseNodeCall) {
                return NextResponse.json({
                    nextNode: currentNode,
                    nodeText: currentNodeData.text,
                    guidingQuestion: "No entiendo lo que quieres hacer. Por favor, expresa tu acción en español de manera más clara."
                });
            }

            // Parse the function arguments
            const args = JSON.parse(chooseNodeCall.args);
            const { destination, explanation } = args;

            // Validate the destination node exists
            if (!nodes[destination]) {
                return NextResponse.json({
                    nextNode: currentNode,
                    nodeText: currentNodeData.text,
                    guidingQuestion: "Lo siento, esa acción no es posible en este momento. ¿Qué más te gustaría hacer?"
                });
            }

            // If valid, get the next node data
            const nextNodeData = nodes[destination];

            // Get the guiding question function call if it exists
            const questionCall = response.functionCalls.find(call => call.name === 'generate_question');
            let guidingQuestion = "¿Qué harás ahora?"; // Default question

            if (questionCall) {
                const questionArgs = JSON.parse(questionCall.args);
                guidingQuestion = questionArgs.question;
            }

            // Return the next node and guiding question
            return NextResponse.json({
                nextNode: destination,
                nodeText: nextNodeData.text,
                explanation,
                guidingQuestion,
                isEndNode: nextNodeData.options.length === 0
            });
        } catch (error) {
            console.error('Error calling Gemini API:', error);
            // Return a friendly error response if Gemini API fails
            return NextResponse.json({
                nextNode: currentNode,
                nodeText: currentNodeData.text,
                guidingQuestion: "Lo siento, estoy teniendo problemas para procesar tu solicitud. Por favor, inténtalo de nuevo o prueba con otra acción.",
                error: true
            });
        }
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
    }
} 