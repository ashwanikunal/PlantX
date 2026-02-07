import bg from "../src/assets/bg.png";
import { useNavigate } from "react-router-dom";
import bg3 from "../src/assets/bg3.png";

export default function Login() {
  const navigate = useNavigate(); // ✅ correct usage

  return (
    <div
      className="w-full min-h-screen bg-[#f7f6f4]"
      style={{
        backgroundImage: `url(${bg3})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center bottom",
        backgroundSize: "cover",
      }}
    >
      {/* CONTENT */}
      <div className="flex justify-center flex-col items-center pt-16 gap-20">
        <div className="text-center px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-green-900 tracking-widest">
            Let’s move toward a <br />
            sustainable green India
          </h1>
        </div>

        {/* Input + Button */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <input
            type="email"
            placeholder="E - mail"
            className="w-72 md:w-80 px-4 py-3 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300"
          />

          <button
            className="bg-black text-white px-8 py-3 font-medium shadow-md hover:opacity-90 transition"
            onClick={() => navigate("/MapPage")} 
          >
            Join Us
          </button>
        </div>
      </div>
    </div>
  );
}
