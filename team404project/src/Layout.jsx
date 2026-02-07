import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* THIS is the critical line */}
      <main className="flex-1 flex min-h-screen">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
