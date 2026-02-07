import { Link } from "react-router-dom";
import { Menu } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full flex flex-row items-center justify-end px-6 py-4 bg-[#f6f3ef]">
      
      {/* Left: Brand */}
      <div className="flex">
      <Link
        to="/"
        className="text-lg font-semibold text-green-900"
      >
        PlantX
      </Link>
      </div>
      {/* Right: Hamburger */}
      <div className="flex">
      <button
        className="text-gray-800"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>
    </div>
    </header>
  );
}
