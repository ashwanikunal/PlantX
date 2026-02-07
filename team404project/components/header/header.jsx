import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import logo from "../../src/assets/logo.png";

export default function Header() {
  return (
    <header className="flex items-center justify-between bg-[#faf9fb] px-6 py-4 shadow-md">
      
      {/* Logo */}
      <Link to="/" className="flex items-center ">
        <img
          src={logo}
          alt="PlantX Logo"
          className="h-20 w-auto blend-multiply"
        />
       
      </Link>

      {/* Hamburger menu */}
      <button className="text-gray-800">
        <Menu size={22} />
      </button>

    </header>
  );
}
