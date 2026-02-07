import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import HomePage from "../pages/HomePage";
import MapPage from "../pages/MapPage";
import Login from "../pages/Login";
import timeline from "../pages/timeline";
import "./index.css";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/MapPage" element={<MapPage />} />
          <Route path='/timeline' element={<timeline />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
