"use client"

import { useState } from "react";
import { useSession } from "next-auth/react";
import GeminiTokenModal from "./GeminiTokenModal";

export default function GeminiTokenButton() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: session } = useSession();

    // Don't render if user is not logged in
    if (!session || !session.user) {
        return null;
    }

    const hasToken = session.user.geminiToken;

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className={`px-4 py-2 rounded font-medium ${hasToken
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
            >
                {hasToken ? "Update Gemini Key" : "Add Gemini Key"}
            </button>

            {isModalOpen && (
                <GeminiTokenModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </>
    );
} 