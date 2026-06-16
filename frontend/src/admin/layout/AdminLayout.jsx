
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "../pages/Header";
import "../../assets/css/Admin.css";

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <Sidebar />

      <div className="admin-main">
        <Header />
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}