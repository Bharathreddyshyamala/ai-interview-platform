"use client";

import { useState } from "react";

// This checks if we are on Vercel. If so, it uses your Render link. 
// Otherwise, it defaults to localhost for your local testing.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Home() {
    const [file, setFile] = useState(null);
    const [jd, setJd] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");

    const handleStartProcess = async () => {
        if (!file || !jd) {
            alert("Please upload a resume and provide a JD first!");
            return;
        }

        setLoading(true);
        setStatus("Uploading Resume...");

        try {
            // Step A: Upload Resume
            const resumeData = new FormData();
            resumeData.append("file", file);
            // Updated to use the variable instead of hardcoded localhost
            const resumeRes = await fetch(`${API_BASE_URL}/upload-resume`, {
                method: "POST",
                body: resumeData,
            });

            if (!resumeRes.ok) throw new Error("Resume upload failed");

            setStatus("Submitting Job Description...");

            // Step B: Submit JD
            const jdData = new FormData();
            jdData.append("jd", jd);
            // Updated to use the variable instead of hardcoded localhost
            const jdRes = await fetch(`${API_BASE_URL}/submit-jd`, {
                method: "POST",
                body: jdData,
            });

            if (!jdRes.ok) throw new Error("JD submission failed");

            setStatus("Success! Redirecting to Interview...");

            window.location.href = "/interview";
        } catch (error) {
            console.error(error);
            setStatus("Error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100 text-black">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center text-blue-800">Welcome</h1>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Resume (PDF)</label>
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
                    <textarea
                        rows="4"
                        className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Paste the job requirements here..."
                        value={jd}
                        onChange={(e) => setJd(e.target.value)}
                    />
                </div>

                <button
                    onClick={handleStartProcess}
                    disabled={loading}
                    className={`w-full py-3 rounded-xl font-bold text-white transition-all ${
                        loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700 shadow-lg"
                    }`}
                >
                    {loading ? "Processing..." : "Start Interview"}
                </button>

                {status && <p className="mt-4 text-center text-sm font-semibold text-blue-600">{status}</p>}
            </div>
        </div>
    );
}