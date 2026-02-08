import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import HomePage from "../pages/HomePage";
import MapPage from "../pages/MapPage";
import Login from "../pages/Login";
import Calender from "../pages/Calender";
import "./index.css";
import Timeline from "../pages/timeline";
import Map from "../pages/Map";
import WardTreeTable from "../pages/WardTreeTable";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/MapPage" element={<MapPage />} />
          <Route path='/Timeline' element={<Timeline />} />
          <Route path='/Calender' element={<Calender />} />
          <Route path='/Map' element={<Map />} />
          <Route path='/WardTreeTable' element={<WardTreeTable />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
