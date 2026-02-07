import { useNavigate } from "react-router-dom";
import { useState } from "react";
import bg from "../src/assets/bg.png";
import bg2 from "../src/assets/bg2.png";

export default function HomePage() {
  const navigate = useNavigate();
  const [slide, setSlide] = useState(0);

  return (
    <div className="w-full min-h-screen bg-[#faf9fb]">
      {/* ================= HERO SECTION ================= */}
      <section 
        className="w-full min-h-screen flex items-start justify-center pt-24 md:pt-32"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center bottom",
          backgroundSize: "cover",
        }}
      >
        <div className="text-center pb-16">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-widest text-green-900 mb-10">
            GREEN INDIA
          </h1>

          <div className="flex gap-6 pt-16 justify-center">
            <button
              onClick={() => navigate("/getstarted")}
              className="bg-black text-white px-8 py-3 text-sm font-medium shadow-lg shadow-gray-400 transition"
            >
              Get Started
            </button>

            <button
              onClick={() => navigate("#learnmore")}
              className="bg-[#bab6ac] text-gray-700 px-8 py-3 text-sm font-medium shadow-md hover:bg-gray-100 transition"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* ================= MISSION SLIDER ================= */}
      <section class="learnmore" className="relative w-full min-h-[90vh] bg-[#f7f6f4] overflow-hidden flex items-center">
        {/* FIXED BACKGROUND (never moves) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url(${bg2})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "left center",
            backgroundSize: "contain",
            opacity: 0.6,
          }}
        />

        {/* CONTENT */}
        <div className="relative max-w-6xl mx-auto px-6 text-center w-full">
          {/* PAGE INDICATOR */}
          <div className="text-sm text-gray-500 mb-10">
            {slide + 1} / 2
          </div>

          {/* SLIDE CONTAINER */}
          <div className="relative min-h-[360px]">
            {/* -------- SLIDE 1 -------- */}
            <div
              className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                slide === 0
                  ? "opacity-100 pointer-events-auto"
                  : "opacity-0 pointer-events-none"
              }`}
            >
              <h2 className="text-3xl md:text-5xl font-semibold text-green-900 mb-8">
                Our Mission
              </h2>

              <p className="text-gray-800 text-lg leading-relaxed max-w-2xl mx-auto">
                🌱 We help people make smarter decisions using clear data and
                visual insights.
                <br />
                <br />
                Our platform simplifies complex environmental information so
                anyone can understand their options and act with confidence.
              </p>
            </div>

            {/* -------- SLIDE 2 -------- */}
            <div
              className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                slide === 1
                  ? "opacity-100 pointer-events-auto"
                  : "opacity-0 pointer-events-none"
              }`}
            >
              <h2 className="text-3xl md:text-5xl font-semibold text-green-900 mb-16">
                What we do?
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="bg-white/90 p-8 rounded-xl shadow-lg">
                  <h3 className="font-semibold mb-3">Clear information</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    We turn scattered or confusing data into simple visual
                    insights so you clearly understand the situation.
                  </p>
                </div>

                <div className="bg-white/90 p-8 rounded-xl shadow-lg">
                  <h3 className="font-semibold mb-3">Better decisions</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Once things are clear, decisions are made calmly and
                    confidently — not on assumptions.
                  </p>
                </div>

                <div className="bg-white/90 p-8 rounded-xl shadow-lg">
                  <h3 className="font-semibold mb-3">Better outcomes</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Better decisions reduce costly mistakes and lead to long-
                    lasting, impactful results.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* NAVIGATION */}
          <div className="flex justify-center items-center gap-10 mt-20">
            <button
              onClick={() => slide > 0 && setSlide(slide - 1)}
              disabled={slide === 0}
              className={`text-2xl transition ${
                slide === 0
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-700 hover:text-black"
              }`}
            >
              ←
            </button>

            <button
              onClick={() => slide < 1 && setSlide(slide + 1)}
              disabled={slide === 1}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition ${
                slide === 1
                  ? "bg-gray-200 cursor-not-allowed"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            >
              →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
