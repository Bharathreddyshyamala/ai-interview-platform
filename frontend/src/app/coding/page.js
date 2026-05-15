"use client";

import { useEffect, useState } from "react";

export default function CodingInterview() {

  const [question, setQuestion] = useState("");
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);

  // Load coding question
  useEffect(() => {
    fetchQuestion();
  }, []);

  const fetchQuestion = async () => {

    const res = await fetch(
      "http://localhost:8000/coding/question"
    );

    const data = await res.json();

    setQuestion(data.question);
  };

  const submitCode = async () => {

    const res = await fetch(
      "http://localhost:8000/coding/submit",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          code
        })
      }
    );

    const data = await res.json();

    setResult(data);
  };

  return (
    <div style={{ padding: "20px" }}>

      <h1>Coding Interview</h1>

      <h3>Question:</h3>

      <p>{question}</p>

      <textarea
        rows={12}
        cols={80}
        value={code}
        onChange={(e) =>
          setCode(e.target.value)
        }
        placeholder="Write code here..."
      />

      <br /><br />

      <button onClick={submitCode}>
        Submit Code
      </button>

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h3>Evaluation Result</h3>

          <p>Score: {result.score}</p>

          <ul>
            {result.feedback.map((item, index) => (
              <li key={index}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
