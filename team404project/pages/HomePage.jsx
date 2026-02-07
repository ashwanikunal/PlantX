import { useNavigate } from "react-router-dom";
import bg from "../src/assets/bg.png";

export default function HomePage() {
  const navigate = useNavigate();

  return (
   <section
  className="flex-1 w-full flex items-start justify-center pt-24 md:pt-32"
  style={{
    backgroundImage: `url(${bg})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center bottom",
    backgroundSize: "cover",
  }}
>
  <div className="text-center  pb-16">
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
        onClick={() => navigate("/about")}
        className="bg-bab6ac text-gray-700 px-8 py-3 text-sm font-medium shadow-md hover:bg-gray-100 transition"
      >
        Learn More
      </button>
    </div>
  </div>
</section>

  );
}
