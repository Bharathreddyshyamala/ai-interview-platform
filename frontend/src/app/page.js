"use client";

import { useState } from "react";

export default function Home() {
    const [file, setFile] = useState(null);
    const [jd, setJd] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");
    const API = process.env.NEXT_PUBLIC_API_URL;

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
            const resumeRes = await fetch(`${API}/upload-resume`, {
                method: "POST",
                body: resumeData,
            });

            if (!resumeRes.ok) throw new Error("Resume upload failed");

            setStatus("Submitting Job Description...");

            // Step B: Submit JD
            const jdData = new FormData();
            jdData.append("jd", jd);
            const jdRes = await fetch(`${API}/submit-jd`, {
                method: "POST",
                body: jdData,
            });

            if (!jdRes.ok) throw new Error("JD submission failed");

            setStatus("Success! Redirecting to Interview...");

            // Step C: AUTOMATIC REDIRECT
            // Using window.location.href to avoid build-time module resolution issues in this environment
            window.location.href = "/interview";
        } catch (error) {
            console.error(error);
            setStatus("Error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100">
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
                        className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
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
