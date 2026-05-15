"use client";
import { useState, useEffect, useRef } from "react";

export default function InterviewPage() {
    const [messages, setMessages] = useState([]);
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);
    const [completed, setCompleted] = useState(false);
    
    // Create a ref to automatically scroll to the bottom of the chat
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const startInterview = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:8000/interview/start", {
                method: "POST",
            });
            const data = await response.json();
            if (data.error) {
                setMessages([{ role: "ai", text: "Error: " + data.error }]);
            } else {
                await getNextQuestion();
            }
        } catch (error) {
            console.error("Error:", error);
            setMessages([{ role: "ai", text: "Connection error. Ensure FastAPI is running." }]);
        }
        setLoading(false);
    };

    const getNextQuestion = async () => {
        try {
            const res = await fetch("http://localhost:8000/interview/next");
            const data = await res.json();
            if (data.message === "Interview completed") {
                setCompleted(true);
                setMessages((prev) => [...prev, { role: "ai", text: "Interview completed! Well done." }]);
            } else if (data.question) {
                setMessages((prev) => [...prev, { role: "ai", text: data.question }]);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const submitAnswer = async () => {
        if (!answer || loading) return;
        const userMsg = answer;
        setAnswer("");
        setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
        setLoading(true);
        try {
            await fetch("http://localhost:8000/interview/answer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ answer: userMsg }),
            });
            await getNextQuestion();
        } catch (error) {
            console.error("Error:", error);
        }
        setLoading(false);
    };

    return (
        /* Use 100dvh (Dynamic Viewport Height) to handle mobile browser toolbars correctly */
        <div className="flex flex-col h-[100dvh] bg-gray-50 text-gray-900">
            
            {/* Header: Fixed Height */}
            <header className="p-4 bg-white border-b border-gray-200 flex-shrink-0">
                <h1 className="text-xl sm:text-2xl font-bold text-center text-blue-800">
                    Interview Round 1
                </h1>
            </header>

            {/* Main Content Area: Fills remaining space */}
            <main className="flex-1 overflow-hidden relative flex flex-col items-center">
                
                <div className="w-full max-w-4xl h-full flex flex-col p-4 sm:p-6 lg:p-8">
                    
                    {messages.length === 0 ? (
                        /* Initial Start State */
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center bg-white p-6 sm:p-10 rounded-2xl shadow-xl border border-gray-100 max-w-md w-full">
                                <p className="mb-8 text-gray-600 text-lg">
                                    Ready to start your technical assessment?
                                </p>
                                <button
                                    onClick={startInterview}
                                    disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg active:scale-95 disabled:bg-gray-400"
                                >
                                    {loading ? "Waking up AI..." : "Begin Session"}
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Chat Interface */
                        <div className="flex flex-col h-full space-y-4">
                            
                            {/* Scrollable Messages Container */}
                            <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-gray-200">
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                        <div
                                            className={`max-w-[90%] sm:max-w-[80%] p-4 rounded-2xl shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                                                msg.role === "user"
                                                    ? "bg-blue-600 text-white rounded-tr-none"
                                                    : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
                                            }`}
                                        >
                                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">
                                                {msg.role === "user" ? "You" : "Interviewer"}
                                            </p>
                                            <p className="text-sm sm:text-base leading-relaxed">{msg.text}</p>
                                        </div>
                                    </div>
                                ))}

                                {loading && (
                                    <div className="flex justify-start">
                                        <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 animate-pulse text-gray-400 text-sm">
                                            AI is thinking...
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            {/* Input / Completion Footer */}
                            <div className="flex-shrink-0 pt-4 bg-gray-50">
                                {!completed ? (
                                    <div className="flex gap-2 items-center">
                                        <input
                                            className="flex-1 bg-white border-2 border-gray-200 p-3 sm:p-4 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50 focus:outline-none transition-all shadow-sm text-sm sm:text-base"
                                            value={answer}
                                            onChange={(e) => setAnswer(e.target.value)}
                                            placeholder="Type your answer..."
                                            onKeyDown={(e) => e.key === "Enter" && submitAnswer()}
                                            disabled={loading}
                                        />
                                        <button
                                            onClick={submitAnswer}
                                            disabled={loading || !answer}
                                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold shadow-md transition-all active:scale-95"
                                        >
                                            Send
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center p-6 bg-blue-600 rounded-3xl shadow-xl animate-in zoom-in duration-500">
                                        <h2 className="text-xl font-bold text-white mb-4">Interview Finished!</h2>
                                        <button
                                            onClick={() => (window.location.href = "/report")}
                                            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-full font-black shadow-lg transition-all"
                                        >
                                            View My Report
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}