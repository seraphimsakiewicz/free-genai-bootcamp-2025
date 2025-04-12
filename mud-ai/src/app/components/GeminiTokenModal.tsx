"use client"

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface GeminiTokenModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function GeminiTokenModal({ isOpen, onClose }: GeminiTokenModalProps) {
    const { data: session, update } = useSession();
    const [encryptedToken, setEncryptedToken] = useState("");
    const [decryptedToken, setDecryptedToken] = useState("");
    const [newToken, setNewToken] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDecrypting, setIsDecrypting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [showToken, setShowToken] = useState(false);
    const [mode, setMode] = useState<"update" | "view">("update");

    // Pre-fill encryptedToken from session if available
    useEffect(() => {
        if (session?.user?.geminiToken) {
            setEncryptedToken(session.user.geminiToken);
            setMode("view");
        }
    }, [session?.user?.geminiToken]);

    // Handle decryption when toggling to show password
    useEffect(() => {
        if (showToken && encryptedToken && !decryptedToken && mode === "view") {
            handleGetToken();
        }
    }, [showToken, encryptedToken, decryptedToken, mode]);

    // Function to get decrypted token from API
    const handleGetToken = async () => {
        try {
            setIsDecrypting(true);
            setError("");

            const response = await fetch("/api/user/gemini-token");
            const data = await response.json();

            if (response.ok && data.decryptedToken) {
                setDecryptedToken(data.decryptedToken);
            } else {
                throw new Error(data.message || "Could not decrypt token");
            }
        } catch (err) {
            console.error("Error fetching decrypted token:", err);
            setError("Failed to decrypt token. Please try again.");
        } finally {
            setIsDecrypting(false);
        }
    };

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setIsSubmitting(true);
            setError("");

            // Use decrypted token if showing password, otherwise use encrypted
            const tokenToSubmit = newToken.trim();

            const response = await fetch("/api/user/gemini-token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token: tokenToSubmit }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to save token");
            }

            setSuccess(true);

            // Update the session to include the gemini token info
            await update();

            // Close the modal after a short delay
            setTimeout(() => {
                onClose();
                setEncryptedToken("");
                setDecryptedToken("");
                setNewToken("");
                setMode("update");
                setSuccess(false);
            }, 1500);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleTokenVisibility = () => {
        setShowToken(!showToken);
    };

    const tokenValue = showToken && mode === "view" ? decryptedToken : mode === "view" ? encryptedToken : newToken;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">Enter Gemini API Key</h2>

                {success ? (
                    <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">
                        {(showToken ? decryptedToken : encryptedToken).trim() === ""
                            ? "Key removed successfully!"
                            : "Key saved successfully!"}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {error && (
                            <div className="mb-4 p-2 bg-red-100 text-red-800 rounded">
                                {error}
                            </div>
                        )}

                        <div className="mb-4">
                            <label htmlFor="token" className="block mb-2 text-sm font-medium">
                                Gemini API Key
                            </label>
                            <div className="relative">
                                <input
                                    type={showToken ? "text" : "password"}
                                    id="token"
                                    value={isDecrypting ? "Decrypting..." : tokenValue}
                                    onChange={(e) => {
                                        if (mode === "view") {
                                            return;
                                        }
                                        setNewToken(e.target.value);
                                    }}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                                    placeholder="Enter your new Gemini API key"
                                    disabled={isSubmitting || isDecrypting || mode === "view"}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
                                    onClick={toggleTokenVisibility}
                                    disabled={isDecrypting || isSubmitting}
                                >
                                    {isDecrypting ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-blue-600"></div>
                                    ) : showToken ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            <div className="mt-1 text-xs text-gray-500">
                                <p>Your key will be securely stored in your user account.</p>
                                <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md">
                                    <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-1">
                                        How to get your Gemini API key
                                    </h3>
                                    <ol className="list-decimal ml-4 space-y-1 text-gray-700 dark:text-gray-300">
                                        <li>Visit <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline">Google AI Studio</a></li>
                                        <li>Sign in with your Google account</li>
                                        <li>Click on &quot;Create API key&quot;</li>
                                        <li>Copy the generated API key</li>
                                        <li>Paste it in the field above</li>
                                    </ol>
                                    <p className="mt-2 text-gray-600 dark:text-gray-400 italic">
                                        Note: Google allows free use of the Gemini API with a monthly limit.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                                disabled={isSubmitting || isDecrypting}
                            >
                                Cancel
                            </button>
                            {(showToken ? decryptedToken : encryptedToken).trim() !== "" && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEncryptedToken("");
                                        setDecryptedToken("");
                                        setNewToken("");
                                        setMode("update");
                                    }}
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                    disabled={isSubmitting || isDecrypting}
                                >
                                    Clear Key
                                </button>
                            )}
                            {mode === "view" && (
                                <button
                                    type="button"
                                    onClick={() => setMode("update")}
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-600"
                                >
                                    Edit Key
                                </button>
                            )}
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                disabled={isSubmitting || isDecrypting || mode === "view"}
                            >
                                {isSubmitting ? "Saving..." : "Save Key"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}