export default function Calendar() {
  const months = [
    { name: "January", type: "recommended" },
    { name: "February", type: "recommended" },
    { name: "March", type: "not" },
    { name: "April", type: "not" },
    { name: "May", type: "not" },
    { name: "June", type: "high" },
    { name: "July", type: "high" },
    { name: "August", type: "high" },
    { name: "September", type: "high" },
    { name: "October", type: "recommended" },
    { name: "November", type: "recommended" },
    { name: "December", type: "recommended" },
  ];

  const getColor = (type) => {
    if (type === "high") return "bg-green-300 text-green-900";
    if (type === "recommended") return "bg-yellow-300 text-yellow-900";
    return "bg-red-300 text-red-900";
  };

  return (
    <div className="w-full min-h-screen bg-[#e3e3e3] px-12 py-16">
      {/* TITLE */}
      <h1 className="text-3xl font-semibold text-green-900 mb-12">
        Seasonal Calendar
      </h1>

      {/* MONTH GRID */}
      <div className="grid grid-cols-4 gap-8 mb-16">
        {months.map((month) => (
          <div
            key={month.name}
            className="bg-[#f3f3f3] p-3 shadow-inner border border-gray-400"
          >
            <div
              className={`text-center py-2 font-semibold tracking-widest uppercase text-sm ${getColor(
                month.type
              )}`}
            >
              {month.name}
            </div>
          </div>
        ))}
      </div>

      {/* LEGEND */}
      <div className="flex items-center gap-16 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-green-300 inline-block"></span>
          <span>Highly Recommended</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-yellow-300 inline-block"></span>
          <span>Recommended</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-red-300 inline-block"></span>
          <span>Not Recommended</span>
        </div>
      </div>
      <div>
        <button
        onClick={() => window.location.href = "/Map"}
        className="bg-green-700 text-white px-6 py-2 rounded-lg mt-8 hover:bg-green-800 transition">
          Show Map        
          </button>
      </div>
    </div>
  );
}
