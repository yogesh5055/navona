import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Roadmap.css";

const Roadmap = () => {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState("");
  const [customGoal, setCustomGoal] = useState("");
  const [skill, setSkill] = useState("");
  const [time, setTime] = useState("");
  const [deadline, setDeadline] = useState("");
  const [resourcePreference, setResourcePreference] = useState("");

  const navigate = useNavigate();

  const handleNext = () => {
    if (
      (step === 1 && (goal || customGoal)) ||
      (step === 2 && skill) ||
      (step === 3 && time) ||
      (step === 4 && deadline) ||
      (step === 5 && resourcePreference)
    ) {
      setStep((prevStep) => prevStep + 1);
    } else {
      alert("Please fill the field before moving to the next step 😅");
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep((prevStep) => prevStep - 1);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!resourcePreference) {
      alert("Please select a resource preference before generating the roadmap 😅");
      return;
    }

    const requestData = {
      goal: customGoal || goal,
      skill_level: skill,
      time_per_day: time,
      deadline: deadline,
      resource_preference: resourcePreference,
    };

    console.log("Sending data to AI Model:", requestData);

    navigate("/loading"); // ✅ Navigate to loading page before API call

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/generate-roadmap`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Received AI Response:", data);

      if (!data || !data.roadmap) {
        throw new Error("Invalid response format from API.");
      }

      navigate("/output", { state: { roadmap: data.roadmap, userInput: requestData } });
    } catch (error) {
      console.error("Error generating roadmap:", error);
      alert("Failed to generate roadmap. Please try again later.");
      navigate("/roadmap"); // ✅ Redirect back to roadmap page if error occurs
    }
  };

  return (
    <div className="roadmap-page">
      <h1>Generate Your Custom Roadmap 🚀</h1>

      <div className="progress-bar">
        <div style={{ width: `${(step / 5) * 100}%` }}></div>
      </div>

      <div className="content-box">
        {step === 1 && (
          <div className="step">
            <h2>🎯 What do you want to become?</h2>
            <select value={goal} onChange={(e) => setGoal(e.target.value)}>
              <option value="">Select Your Goal</option>
              <option>Data Scientist</option>
              <option>Full Stack Developer</option>
              <option>AI Engineer</option>
              <option>Cyber Security Expert</option>
              <option>Web Developer</option>
              <option>Blockchain Developer</option>
              <option>Other</option>
            </select>

            {goal === "Other" && (
              <input
                type="text"
                placeholder="Enter your custom goal"
                value={customGoal}
                onChange={(e) => setCustomGoal(e.target.value)}
              />
            )}
          </div>
        )}

        {step === 2 && (
          <div className="step">
            <h2>🧐 What's your current skill level?</h2>
            <select value={skill} onChange={(e) => setSkill(e.target.value)}>
              <option value="">Select Skill Level</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>
        )}

        {step === 3 && (
          <div className="step">
            <h2>⏳ How much time can you spend daily?</h2>
            <select value={time} onChange={(e) => setTime(e.target.value)}>
              <option value="">Select Time</option>
              <option>1 Hour</option>
              <option>2 Hours</option>
              <option>4 Hours</option>
              <option>Full Time</option>
            </select>
          </div>
        )}

        {step === 4 && (
          <div className="step">
            <h2>📅 What's your target to achieve this goal?</h2>
            <select value={deadline} onChange={(e) => setDeadline(e.target.value)}>
              <option value="">Select Deadline</option>
              <option>3 Months</option>
              <option>6 Months</option>
              <option>1 Year</option>
              <option>No Deadline</option>
            </select>
          </div>
        )}

        {step === 5 && (
          <div className="step">
            <h2>📖 What type of resources do you prefer?</h2>
            <select value={resourcePreference} onChange={(e) => setResourcePreference(e.target.value)}>
              <option value="">Select Resource Preference</option>
              <option>YouTube Videos</option>
              <option>Online Courses</option>
              <option>Books</option>
              <option>Projects & Hands-on Labs</option>
            </select>
          </div>
        )}

        <div className="btn-group">
          {step > 1 && (
            <button className="btn prev-btn" onClick={handlePrevious}>
              Previous
            </button>
          )}

          {step < 5 ? (
            <button className="btn next-btn" onClick={handleNext}>
              Next
            </button>
          ) : (
            <button className="btn submit-btn" onClick={handleSubmit}>
              Generate Roadmap 🚀
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
