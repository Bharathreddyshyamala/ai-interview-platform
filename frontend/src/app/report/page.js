"use client";

import { useEffect, useState } from "react";

export default function ReportPage() {

  const [report, setReport] = useState(null);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {

    const res = await fetch(
      "http://localhost:8000/final-report"
    );

    const data = await res.json();

    setReport(data);
  };

  if (!report) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>

      <h1>Final Hiring Report</h1>

      <p>
        Communication:
        {report.communication_score}
      </p>

      <p>
        Technical:
        {report.technical_score}
      </p>

      <p>
        Coding:
        {report.coding_score}
      </p>

      <h2>
        Overall:
        {report.overall_score}
      </h2>

      <h2>
        Decision:
        {report.decision}
      </h2>

    </div>
  );
}
