import { useNavigate } from "react-router-dom";
import bg from "../src/assets/bg.jpg";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen bg-cover bg-center" style={{ backgroundImage: bg }}>
  <div className="absolute inset-0 bg-black bg-opacity-50"></div>

  <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
    <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to My Website</h1>
    <p className="text-lg md:text-xl mb-6">Your catchy tagline goes here</p>
    <div className="space-x-4">
      <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold">Get Started</button>
      <button className="bg-transparent border border-white hover:bg-white hover:text-black px-6 py-3 rounded-lg font-semibold">Learn More</button>
    </div>
  </div>
</div>

  );
}
