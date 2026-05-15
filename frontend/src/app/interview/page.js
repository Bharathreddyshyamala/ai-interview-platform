"use client";
import { useState, useEffect, useRef } from "react";

// This pulls your Render link from Vercel settings, or uses localhost if you're home.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function InterviewPage() {
    const [messages, setMessages] = useState([]);
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);
    const [completed, setCompleted] = useState(false);
    
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
            // FIXED: Using API_BASE_URL
            const response = await fetch(`${API_BASE_URL}/interview/start`, {
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
            setMessages([{ role: "ai", text: "Connection error. Ensure the server is reachable." }]);
        }
        setLoading(false);
    };

    const getNextQuestion = async () => {
        try {
            // FIXED: Using API_BASE_URL
            const res = await fetch(`${API_BASE_URL}/interview/next`);
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
            // FIXED: Using API_BASE_URL
            await fetch(`${API_BASE_URL}/interview/answer`, {
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

    // ... rest of your return() code remains exactly the same ...