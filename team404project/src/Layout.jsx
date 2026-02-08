import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import { Outlet } from "react-router-dom";



export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* main content */}
      <main className="flex-1 relative">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

