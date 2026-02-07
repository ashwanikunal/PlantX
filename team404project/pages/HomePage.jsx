import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";

import bg2 from "../src/assets/bg2.png";
import bg3 from "../src/assets/bg3.png";

export default function HomePage() {
  const navigate = useNavigate();
  const [slide, setSlide] = useState(0);
  const missionRef = useRef(null);

  return (
    <div className="w-full min-h-screen bg-[#faf9fb]">

      {/* ================= HERO SECTION ================= */}
      <section
        className="relative w-full min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: `url(${bg3})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center bottom",
          backgroundSize: "cover",
        }}
      >
        {/* overlay */}
        <div className="absolute inset-0 "></div>

        {/* content */}
        <div className="relative text-center max-w-4xl px-6">
          <div className="inline-block mb-6 px-4 py-1 text-xs tracking-wider text-green-900 bg-green-100 rounded-full">
            Data-powered sustainability
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-widest text-green-900 mb-6">
            GREEN INDIA
          </h1>

          <p className="text-lg md:text-2xl text-gray-700 mb-12 leading-relaxed">
            <span className="font-semibold">Data-driven </span> insights to build a greener, smarter,
            and more sustainable India.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-8">
            <button
              onClick={() => navigate("/login")}
              className="bg-black text-white px-10 py-4 text-sm font-medium shadow-xl hover:bg-gray-800 transition"
            >
              Get Started
            </button>

            <button
              onClick={() =>
                missionRef.current?.scrollIntoView({ behavior: "smooth" })
              }
              className="bg-[#cfcac0] text-gray-800 px-10 py-4 text-sm font-medium shadow-md hover:bg-[#bfb9ad] transition"
            >
              Learn More
            </button>
          </div>

          {/* <div className="flex flex-wrap justify-center gap-6 mt-16 text-md text-gray-600">
            <span> City-wise analysis</span>
            <span> Heat & green cover</span>
            <span> Smart plantation zones</span>
          </div> */}
        </div>

        <div className="absolute bottom-6 w-full text-center text-gray-500 animate-bounce">
          ↓
        </div>
      </section>

      <section
        ref={missionRef}
        className="relative w-full min-h-[90vh] bg-[#f7f6f4] overflow-hidden flex items-center">
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

        <div className="relative max-w-6xl mx-auto px-6 text-center w-full">
          <div className="text-sm text-gray-500 mb-10">
            {slide + 1} / 2
          </div>

          <div className="relative min-h-[360px]">

            {/* SLIDE 1 */}
            <div
              className={`absolute inset-0 transition-opacity duration-500 ${
                slide === 0 ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <h2 className="text-3xl md:text-5xl font-semibold text-green-900 mb-8">
                Our Mission
              </h2>

              <p className="text-gray-800 text-lg leading-relaxed max-w-2xl mx-auto">
                 We help people make smarter decisions using clear data and
                visual insights.
                <br />
                <br />
                Our platform simplifies complex environmental information so
                anyone can act with confidence.
              </p>
            </div>

            <div
              className={`absolute inset-0 transition-opacity duration-500 ${
                slide === 1 ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <h2 className="text-3xl md:text-5xl font-semibold text-green-900 mb-16">
                What we do?
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="bg-white/90 p-8 rounded-xl shadow-lg">
                  <h3 className="font-semibold mb-3">Clear information</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
When information is scattered, confusing, or incomplete, people rely on guesswork or outside opinions.  We collect relevant details and present them in a simple visual form so you can actually understand the situation you are dealing with.                  </p>
                </div>

                <div className="bg-white/90 p-8 rounded-xl shadow-lg">
                  <h3 className="font-semibold mb-3">Better decisions</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Once things are clear, choosing becomes easier.  You can compare options calmly, think logically, and decide based on understanding instead of pressure, urgency, or assumptions.</p>
                </div>
                <div className="bg-white/90 p-8 rounded-xl shadow-lg">
                  <h3 className="font-semibold mb-3">Better outcomes</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
Decisions made with clarity usually avoid costly mistakes and regret.  Whether planning, investing, or acting on the ground, informed choices lead to results that last longer and work better over time.                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* NAVIGATION */}
          <div className="flex justify-center items-center gap-10 mt-20">
            <button
              onClick={() => slide > 0 && setSlide(slide - 1)}
              disabled={slide === 0}
              className={`w-12 h-12 flex items-center justify-center text-2xl rounded-full transition ${
                slide === 1
                  ? "bg-gray-300 text-black"
                  : "text-gray-400 cursor-not-allowed"
              }`}
            >
              ←
            </button>

            <button
              onClick={() => slide < 1 && setSlide(slide + 1)}
              disabled={slide === 1}
              className={`w-12 h-12 flex items-center justify-center text-2xl rounded-full transition ${
                slide === 0
                  ? "bg-gray-300 text-black"
                  : "text-gray-400 cursor-not-allowed"
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

