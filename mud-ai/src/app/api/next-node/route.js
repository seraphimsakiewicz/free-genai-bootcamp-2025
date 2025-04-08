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
        const { userInput, currentNode, inventory = [] } = body;

        // Get the current node data
        const currentNodeData = nodes[currentNode];


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
                guidingQuestion: '<p>La aventura ha terminado. ¿Quieres empezar de nuevo?</p>'
            });
        }

        // For initial loading or empty user input, just return the current node without AI
        // processing
        if (!userInput || userInput.trim() === '') {
            return NextResponse.json({
                nextNode: currentNode,
                nodeText: currentNodeData.text,
                guidingQuestion: '<p>¿Qué harás ahora?</p>',
                isEndNode: false
            });
        }

        // Prepare the available options for the AI prompt
        const optionsText = availableOptions.map(optionId => {
            const nodeData = nodes[optionId];
            return `${optionId}: ${nodeData.text}`;
        }).join('\n');

        // Create the prompt for the AI
        const prompt = `
    You are helping with a text adventure game in Spanish. The player is currently in this node:
    
    "${currentNodeData.text}"
    
    The player has entered: "${userInput}"
    
    The player's inventory contains: ${inventory.join(', ') || 'nothing'}
    
    IMPORTANT GAME RULES:
    1. The player CANNOT open the stone door without having the key in their inventory
    2. If they try to open the door without the key, tell them they need to find a key first
    3. The key can be found in the forest clearing on a pedestal
    
    Based on their input and inventory, determine which of the following nodes is most appropriate:
    
    ${optionsText}
    
    Rules:
    1. If the user responds in English or any language other than Spanish, ask them to write in Spanish.
    2. If the user's input does not clearly match any option, ask for clarification in Spanish.
    3. If the input contains inappropriate content, YOU MUST use game_over.
    4. If the input is appropriate, use choose_node to select the next node.
    `;

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

        try {
            // Generate content from the AI
            const result = await model.generateContent({
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
            });

            const response = result.response;

            // Use function call method instead of property
            const functionCalls = response.functionCalls();
            if (!functionCalls || functionCalls.length === 0) {
                // If no function calls, ask the user to clarify in Spanish
                return NextResponse.json({
                    nextNode: currentNode,
                    nodeText: currentNodeData.text,
                    guidingQuestion: "<p>No entiendo lo que quieres hacer. Por favor, expresa tu acción en español de manera más clara.</p>"
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
                    guidingQuestion: '<p>La aventura ha terminado. ¿Quieres empezar de nuevo y mantener el juego apropiado para todos?</p>'
                });
            }

            // Get the function call for choosing the next node
            const chooseNodeCall = functionCalls.find(call => call.name === 'choose_node');

            if (!chooseNodeCall) {
                return NextResponse.json({
                    nextNode: currentNode,
                    nodeText: currentNodeData.text,
                    guidingQuestion: "<p>No entiendo lo que quieres hacer. Por favor, expresa tu acción en español de manera más clara.</p>"
                });
            }

            // Parse the function arguments
            const args = chooseNodeCall.args;
            let { destination, explanation } = args;

            if(destination === "abrir_puerta" && inventory.includes('llave')) {
                return NextResponse.json({
                    nextNode: "puerta_exitosa",
                    nodeText: nodes['puerta_exitosa'].text,
                    explanation,
                    guidingQuestion: '<p>¿Quieres entrar?</p>',
                    isEndNode: nodes['puerta_exitosa'].options.length === 0
            });
            } else if(destination === "abrir_puerta" && !inventory.includes('llave')) {
                // destination = "seguir_pasadizo";
                return NextResponse.json({
                nextNode: "seguir_pasadizo",
                nodeText: currentNodeData.text,
                guidingQuestion: '<p>La puerta está cerrada con llave. Necesitas encontrar una llave para abrirla.</p>',
                isEndNode: false
            });
            }

            // Validate the destination node exists
            if (!nodes[destination]) {
                return NextResponse.json({
                    nextNode: currentNode,
                    nodeText: currentNodeData.text,
                    guidingQuestion: "<p>Lo siento, esa acción no es posible en este momento. ¿Qué más te gustaría hacer?</p>"
                });
            }

            // If valid, get the next node data
            const nextNodeData = nodes[destination];

            // Get the guiding question function call if it exists
            const questionCall = functionCalls.find(call => call.name === 'generate_question');
            let guidingQuestion = '<p>¿Qué harás ahora?</p>'; // Default question

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
                    guidingQuestion: '<p>La aventura ha terminado. ¿Quieres empezar de nuevo con más precaución?</p>'
                });
            }

            // Handle other API errors normally
            return NextResponse.json({
                nextNode: currentNode,
                nodeText: currentNodeData.text,
                guidingQuestion: "<p>Lo siento, estoy teniendo problemas para procesar tu solicitud. Por favor, inténtalo de nuevo o prueba con otra acción.</p>",
                error: true
            });
        }
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
    }
} 