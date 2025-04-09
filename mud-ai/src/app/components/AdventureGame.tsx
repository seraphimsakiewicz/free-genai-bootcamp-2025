"use client";

import { useState, useRef, useEffect, FormEvent, ChangeEvent } from 'react';
import styles from './AdventureGame.module.css';
import { nodes } from '@/app/gameData';

interface HistoryEntry {
    type: 'system' | 'user' | 'hint';
    text: string;
}

interface ApiResponse {
    nextNode: string;
    nodeText: string;
    isEndNode?: boolean;
    guidingQuestion?: string;
    error?: string;
}

const AdventureGame = () => {
    // State variables for the game
    const [currentNode, setCurrentNode] = useState<string>('inicio');
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [userInput, setUserInput] = useState<string>('');
    const [guidingQuestion, setGuidingQuestion] = useState<string>('<p>¿Qué harás ahora?</p>');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isGameOver, setIsGameOver] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [inventory, setInventory] = useState<string[]>(["llave"]);

    // Ref for auto-scrolling
    const historyEndRef = useRef<HTMLDivElement>(null);

    // Load initial node text when component mounts
    useEffect(() => {
        // Get the initial node directly from the game data instead of making an API call
        const initialNodeData = nodes['inicio'];
        if (initialNodeData) {
            setHistory([{
                type: 'system',
                text: initialNodeData.text,
            }]);
        } else {
            setError('Error iniciando el juego. No se pudo cargar el nodo inicial.');
        }
    }, []);

    // Auto-scroll to the bottom of the history when it updates
    useEffect(() => {
        historyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    // Handle user input submission
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!userInput.trim() || isLoading) return;

        // Add user input to history
        setHistory(prev => [...prev, {
            type: 'user',
            text: userInput,
        }]);

        // Clear input field and show loading state
        const inputText = userInput;
        setUserInput('');
        setIsLoading(true);
        setError('');

        try {
            // Call the API to get the next node
            const response = await fetch('/api/next-node', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userInput: inputText,
                    currentNode,
                    inventory,
                }),
            });

            const data: ApiResponse = await response.json();

            if (response.ok) {
                // Update state with the response
                setCurrentNode(data.nextNode);

                // Update inventory if key was picked up
                if (data.nextNode === 'tomar_llave' && !inventory.includes('llave')) {
                    setInventory(prev => [...prev, 'llave']);
                    setHistory(prev => [...prev, {
                        type: 'hint',
                        text: '¡Has encontrado una llave antigua!',
                    }]);
                }

                // Check if game over
                setIsGameOver(data.isEndNode || false);

                // Add system response to history
                setHistory(prev => [...prev, {
                    type: 'system',
                    text: data.nodeText,
                }]);

                // Set guiding question
                setGuidingQuestion(data.guidingQuestion || '<p>¿Qué harás ahora?</p>');

                if (data.error) {
                    setError('Error al comunicarse con la IA. Intenta de nuevo.');
                }
            } else {
                setError(data.error || 'Error procesando tu respuesta');
            }
        } catch (err) {
            setError('Error de conexión. Inténtalo de nuevo.');
            console.error('Error submitting user input:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Reset the game
    const handleReset = () => {
        const initialNodeData = nodes['inicio'];

        setCurrentNode('inicio');
        setUserInput('');
        setGuidingQuestion('<p>¿Qué harás ahora?</p>');
        setIsLoading(false);
        setIsGameOver(false);
        setError('');
        setInventory([]);

        // Set initial history with the starting node
        setHistory([{
            type: 'system',
            text: initialNodeData.text,
        }]);
    };

    return (
        <div className={styles.gameContainer}>
            <h1 className={styles.gameTitle}>Aventura de Texto</h1>

            {/* Add inventory display */}
            <div className={styles.inventoryContainer}>
                <h3>Inventario:</h3>
                {inventory.length === 0 ? (
                    <p>No tienes objetos</p>
                ) : (
                    <ul>
                        {inventory.map(item => (
                            <li key={item}>{item === 'llave' ? 'Llave antigua' : item}</li>
                        ))}
                    </ul>
                )}
            </div>

            <div className={styles.gameHistory}>
                {history.map((entry, index) => (
                    <div
                        key={index}
                        className={`${styles.historyEntry} ${styles[entry.type]}`}
                    >
                        {entry.text}
                    </div>
                ))}

                {isLoading && (
                    <div className={styles.loading}>Pensando...</div>
                )}

                {error && (
                    <div className={styles.error}>{error}</div>
                )}

                <div ref={historyEndRef} />
            </div>

            <div className={styles.inputArea}>
                {!isGameOver ? (
                    <form onSubmit={handleSubmit} className={styles.inputForm}>
                        <div className={styles.guidingQuestion} dangerouslySetInnerHTML={{ __html: guidingQuestion }} />
                        <div className={styles.inputWrapper}>
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setUserInput(e.target.value)}
                                placeholder="Escribe tu acción en español..."
                                disabled={isLoading}
                                className={styles.textInput}
                                autoFocus
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !userInput.trim()}
                                className={styles.submitButton}
                            >
                                Enviar
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className={styles.gameOverContainer}>
                        <p className={styles.gameOverText}>Fin de la aventura</p>
                        <button
                            onClick={handleReset}
                            className={styles.resetButton}
                        >
                            Iniciar Nueva Aventura
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdventureGame;
