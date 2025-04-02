import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { nodes } from '../../gameData.js';
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
        description: "Select the next node based on the user's input",
        parameters: {
            type: "object",
            properties: {
                destination: {
                    type: "string",
                    description: "The ID of the next node",
                },
                explanation: {
                    type: "string",
                    description: "Explanation in Spanish of why this node was chosen",
                },
            },
            required: ["destination", "explanation"],
        },
    },
    {
        name: "game_over",
        description: "End the game due to inappropriate content",
        parameters: {
            type: "object",
            properties: {
                reason: {
                    type: "string",
                    enum: ["violence", "profanity", "inappropriate", "offensive"],
                    description: "The category of inappropriate content detected",
                },
            },
            required: ["reason"],
        },
    },
    {
        name: "generate_question",
        description: "Generate a guiding question for the user in Spanish",
        parameters: {
            type: "object",
            properties: {
                question: {
                    type: "string",
                    description: "A question in Spanish that guides the user on what to do next",
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

        console.log("currentNodeData=====>", currentNodeData);

        if (!currentNodeData) {
            return NextResponse.json({ error: 'Node not found' }, { status: 400 });
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

        console.log("availableOptions=====>", availableOptions);

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
                temperature: 0.2,
                maxOutputTokens: 1024,
            },
            tools: {
                functionDeclarations: functionDeclarations
            },
            toolConfig: {
                functionCallingConfig: {
                    mode: "ANY"
                }
            }
        });

        // Create the prompt for the AI
        const prompt = `
    You are helping with a text adventure game in Spanish. The player is currently in this node:
    
    "${currentNodeData.text}"
    
    The player has entered: "${userInput}"
    
    Based on their input, you must:
    1. Analyze if the content is appropriate for all ages.
    2. If you detect violence, profanity, sexual content, or offensive language, use the game_over function.
    3. If the content is appropriate, determine which of the following nodes is the most appropriate:
    
    ${optionsText}
    
    Rules:
    1. If the user responds in English or any language other than Spanish, ask them to write in Spanish.
    2. If the user's input does not clearly match any option, ask for clarification in Spanish.
    3. If the input contains inappropriate content, YOU MUST use game_over.
    4. If the input is appropriate, use choose_node to select the next node.
    `;

        try {
            // Generate content from the AI
            const result = await model.generateContent({
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
            });

            const response = result.response;
            console.log("response=====>", response);

            // Use function call method instead of property
            const functionCalls = response.functionCalls();
            console.log("functionCalls=====>", functionCalls);
            if (!functionCalls || functionCalls.length === 0) {
                // If no function calls, ask the user to clarify in Spanish
                return NextResponse.json({
                    nextNode: currentNode,
                    nodeText: currentNodeData.text,
                    guidingQuestion: "No entiendo lo que quieres hacer. Por favor, expresa tu acción en español de manera más clara. "
                });
            }

            // Get the game_over function call if it exists
            const gameOverCall = functionCalls.find(call => call.name === 'game_over');
            if (gameOverCall) {
                const { reason } = gameOverCall.args;
                let gameOverMessage = "";
                
                switch(reason) {
                    case "violence":
                        gameOverMessage = "Tu aventura ha terminado debido a acciones violentas. Este es un juego pacífico.";
                        break;
                    case "profanity":
                        gameOverMessage = "Tu aventura ha terminado debido al uso de lenguaje inapropiado.";
                        break;
                    case "inappropriate":
                        gameOverMessage = "Tu aventura ha terminado debido a comportamiento inapropiado.";
                        break;
                    case "offensive":
                        gameOverMessage = "Tu aventura ha terminado debido a contenido ofensivo.";
                        break;
                    default:
                        gameOverMessage = "Tu aventura ha terminado debido a comportamiento inaceptable.";
                }
                
                return NextResponse.json({
                    nextNode: 'final',
                    nodeText: gameOverMessage,
                    isEndNode: true,
                    guidingQuestion: "La aventura ha terminado. ¿Quieres empezar de nuevo y mantener el juego apropiado para todos?"
                });
            }

            // Get the function call for choosing the next node
            const chooseNodeCall = functionCalls.find(call => call.name === 'choose_node');

            if (!chooseNodeCall) {
                return NextResponse.json({
                    nextNode: currentNode,
                    nodeText: currentNodeData.text,
                    guidingQuestion: "No entiendo lo que quieres hacer. Por favor, expresa tu acción en español de manera más clara."
                });
            }

            // Parse the function arguments
            const args = chooseNodeCall.args;
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
            const questionCall = functionCalls.find(call => call.name === 'generate_question');
            let guidingQuestion = "¿Qué harás ahora?"; // Default question

            if (questionCall) {
                const questionArgs = questionCall.args;
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
            
            // Check if it's a safety error
            if (error.message?.includes('SAFETY')) {
                return NextResponse.json({
                    nextNode: 'final', // Force game over for unsafe content
                    nodeText: "¡Has tomado una decisión peligrosa! Tu aventura ha terminado prematuramente debido a tus acciones imprudentes.",
                    isEndNode: true,
                    guidingQuestion: "La aventura ha terminado. ¿Quieres empezar de nuevo con más precaución?"
                });
            }

            // Handle other API errors normally
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