import React, { useState } from "react";
import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      className="flex h-screen"
      style={{
        backgroundColor: "#F9FAFB",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Sidebar for larger screens */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar setSidebarOpen={setSidebarOpen} />

        <main
          className="flex-1 p-4 sm:p-6 overflow-y-auto"
          style={{ backgroundColor: "#F9FAFB" }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
