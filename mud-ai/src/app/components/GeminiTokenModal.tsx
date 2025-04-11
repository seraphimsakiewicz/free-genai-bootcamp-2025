"use client"

import { useState } from "react";
import { useSession } from "next-auth/react";

interface GeminiTokenModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function GeminiTokenModal({ isOpen, onClose }: GeminiTokenModalProps) {
    const [token, setToken] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const { update } = useSession();

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token.trim()) {
            setError("Please enter a valid token");
            return;
        }

        try {
            setIsSubmitting(true);
            setError("");

            const response = await fetch("/api/user/gemini-token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token: token.trim() }),
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
                setToken("");
                setSuccess(false);
            }, 1500);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">Enter Gemini API Token</h2>

                {success ? (
                    <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">
                        Token saved successfully!
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
                                Gemini API Token
                            </label>
                            <input
                                type="password"
                                id="token"
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your Gemini API token"
                                disabled={isSubmitting}
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Your token will be securely stored in your user account.
                            </p>
                        </div>

                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Saving..." : "Save Token"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
} 