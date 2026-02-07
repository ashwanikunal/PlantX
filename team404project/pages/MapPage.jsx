import { useState, useRef } from "react";
import globe from "../src/assets/globe.png";

export default function MapPage() {
  const [city, setCity] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef(null);

  const cities = ["Delhi", "Ahmedabad", "Nagpur", "Gurgaon", "Mumbai"];

  // close dropdown when clicking outside
  const handleBlur = (e) => {
    if (!containerRef.current.contains(e.relatedTarget)) {
      setShowDropdown(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#faf9fb] flex items-center justify-center">
      <div
        ref={containerRef}
        className="w-full max-w-6xl flex items-center justify-between px-20"
      >
        {/* LEFT : Globe */}
        <div className="flex-shrink-0">
          <img src={globe} alt="Globe" className="w-[260px] opacity-80" />
        </div>

        {/* RIGHT : Content */}
        <div className="flex flex-col gap-10 relative">
          <h1 className="text-3xl font-semibold text-green-900 tracking-wide">
            Choose your city 🗺️
          </h1>

          {/* Input + Dropdown */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              onBlur={handleBlur}
              className="w-72 px-4 py-2 bg-gray-300 text-gray-700 placeholder-gray-500 shadow-inner focus:outline-none"
            />

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute top-full mt-1 w-72 bg-white shadow-lg border border-gray-200 z-10">
                {cities.map((c) => (
                  <div
                    key={c}
                    tabIndex={0}
                    onClick={() => {
                      setCity(c);
                      setShowDropdown(false);
                    }}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-gray-700"
                  >
                    {c}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Button */}
          <button className="bg-black text-white px-8 py-2 shadow-md hover:opacity-90 transition w-fit">
            Enter
          </button>
        </div>
      </div>
    </div>
  );
}
