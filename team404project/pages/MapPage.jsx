import globe from "../src/assets/globe.png";

export default function MapPage() {
  return (
    <div className="w-full min-h-screen bg-[#faf9fb] flex items-center justify-center">
      {/* Main Container */}
      <div className="w-full max-w-6xl flex items-center justify-between px-20">
        
        {/* LEFT : Globe */}
        <div className="flex-shrink-0">
          <img
            src={globe}
            alt="Globe"
            className="w-[260px] opacity-80"
          />
        </div>

        {/* RIGHT : Content */}
        <div className="flex flex-col gap-10">
          {/* Heading */}
          <h1 className="text-3xl font-semibold text-green-900 tracking-wide">
            Choose your city 🗺️
          </h1>

          {/* Input + Button */}
          <div className="flex items-center gap-6">
            <input
              type="text"
              placeholder="Search city"
              className="w-72 px-4 py-2 bg-gray-300 text-gray-700 placeholder-gray-500 shadow-inner focus:outline-none"
            />

            <button className="bg-black text-white px-8 py-2 shadow-md hover:opacity-90 transition">
              Enter
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
