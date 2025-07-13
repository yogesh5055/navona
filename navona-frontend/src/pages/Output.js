import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Output.css";
import Loading from "./Loading.js";

const Output = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { roadmap, userInput } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Prevent back navigation
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const handleBack = () => navigate("/user");
    window.addEventListener("popstate", handleBack);
    return () => window.removeEventListener("popstate", handleBack);
  }, [navigate]);

  if (!userInput) {
    return <p className="error-message">⚠️ No roadmap data found. Please generate a roadmap first.</p>;
  }

  const { goal, skill_level, time_per_day, deadline, resource_preference } = userInput;

  // ✅ Download PDF
  const handleDownload = async () => {
    if (!roadmap || !roadmap.weeks) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/generate-pdf/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(roadmap),
      });

      if (!response.ok) throw new Error("Failed to generate PDF");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Roadmap.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Error downloading PDF:", err);
      setError("❌ Failed to download PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => navigate("/user");

  return (
    <div className="roadmap-output">
      <h1>🎯 Your Custom Roadmap</h1>

      {loading ? (
        <Loading />
      ) : (
        <div className="output-container">
          {error && <p className="error-message">{error}</p>}

          <div className="details">
            <p>🔥 Goal: <span>{goal}</span></p>
            <p>🛤️ Skill Level: <span>{skill_level}</span></p>
            <p>📚 Learning Style: <span>{resource_preference}</span></p>
            <p>⏳ Time Per Day: <span>{time_per_day}</span></p>
            <p>🎯 Deadline: <span>{deadline}</span></p>
          </div>

          <div className="study-plan">
            <h3>📅 Weekly Roadmap:</h3>
            {roadmap?.weeks?.length > 0 ? (
              roadmap.weeks.map((week, index) => (
                <div key={index} className="week-section">
                  <h4>📆 Week {week.week}</h4>
                  <p>📖 Topics: {week.topics?.join(", ") || "No topics available"}</p>
                  <div className="resources">
                    <p>📚 Resources:</p>
                    {week.resources?.length > 0 ? (
                      <div className="resource-list">
                        {week.resources.map((resource, i) => {
                          const isURL = resource.startsWith("http") || resource.includes(".com") || resource.includes(".org");
                          return (
                            <div key={i} className="resource-item">
                              {isURL ? (
                                <a href={resource} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>
                                  {resource}
                                </a>
                              ) : (
                                <span>{resource}</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p>No resources available</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>No roadmap data available.</p>
            )}
          </div>

          <div className="buttons">
            <button className="download-btn" onClick={handleDownload}>📥 Download Roadmap</button>
            <button className="back-btn" onClick={handleGoBack}>🔙 Go Back to Home</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Output;
