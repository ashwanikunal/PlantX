import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";


export default function Timeline() {
  const [month, setMonth] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handleBlur = (e) => {
    if (!containerRef.current.contains(e.relatedTarget)) {
      setShowDropdown(false);
    }
  };

  const handleEnter = () => {
    if (!month) return;

    if (["March", "April", "May"].includes(month)) {
      setRecommendation({ text: "Not recommended", color: "red" });
    } 
    else if (["June", "July", "August", "September"].includes(month)) {
      setRecommendation({ text: "Highly recommended", color: "green" });
    } 
    else {
      setRecommendation({ text: "Recommended", color: "yellow" });
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-200 flex items-center justify-center">
      <div className="w-full max-w-4xl px-10" ref={containerRef}>

        {/* TITLE */}
        <h1 className="text-4xl font-semibold text-green-900 mb-2 flex items-center gap-2">
          Choose Timeline <span className="text-2xl">📅</span>
        </h1>

        {/* SUBTITLE */}
        <p className="text-gray-700 mb-10">
          Timeline recommendations according to city and season
        </p>

        {/* INPUT + ENTER */}
        <div className="flex items-center gap-6 mb-4 relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Month"
              value={month}
              readOnly
              onFocus={() => setShowDropdown(true)}
              onBlur={handleBlur}
              className="w-72 px-4 py-2 bg-gray-300 text-gray-700 shadow-inner focus:outline-none cursor-pointer"
            />

            {showDropdown && (
              <div className="absolute top-full mt-1 w-72 bg-white shadow-lg border border-gray-200 z-10">
                {months.map((m) => (
                  <div
                    key={m}
                    tabIndex={0}
                    onClick={() => {
                      setMonth(m);
                      setShowDropdown(false);
                      setRecommendation(null);
                    }}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  >
                    {m}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleEnter}
            className="bg-black text-white px-8 py-2 shadow-md hover:opacity-90 transition"
          >
            Enter
          </button>
        </div>

        {/* RECOMMENDATION OUTPUT */}
        {recommendation && (
          <div className="flex items-center gap-2 mb-10">
            <span
              className={`w-3 h-3 inline-block ${
                recommendation.color === "red"
                  ? "bg-red-500"
                  : recommendation.color === "green"
                  ? "bg-green-500"
                  : "bg-yellow-400"
              }`}
            />
            <span
              className={`font-semibold ${
                recommendation.color === "red"
                  ? "text-red-600"
                  : recommendation.color === "green"
                  ? "text-green-700"
                  : "text-yellow-700"
              }`}
            >
              {recommendation.text}
            </span>
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-6">
         <button
  className="bg-[#cfdac3] text-green-900 px-8 py-2 shadow-md hover:bg-[#c1cfb3] transition"
  onClick={() => navigate("/Calender")}
>
  Check out the organized calendar
</button>


          <button className="bg-[#d6d6d6] text-gray-800 px-8 py-2 shadow-md hover:bg-[#c8c8c8] transition">
            Skip
          </button>
        </div>

      </div>
    </div>
  );
}
