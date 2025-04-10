"use client";

import { useState } from "react";

export default function DbTest() {
    const [status, setStatus] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const testConnection = async () => {
        setLoading(true);
        setStatus(null);

        try {
            const response = await fetch("/api/db-test");
            const data = await response.json();

            if (data.status === "success") {
                setStatus("Connected successfully! Check console for details.");
            } else {
                setStatus(`Error: ${data.message}`);
            }
        } catch (error) {
            setStatus(`Error: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="m-4 p-4 border rounded-md">
            <h2 className="text-xl font-bold mb-4">DynamoDB Connection Test</h2>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={testConnection}
                disabled={loading}
            >
                {loading ? "Testing..." : "Test DynamoDB Connection"}
            </button>

            {status && (
                <div className={`mt-4 p-2 rounded ${status.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                    {status}
                </div>
            )}
        </div>
    );
} 