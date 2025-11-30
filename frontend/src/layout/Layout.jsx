// src/layout/Layout.jsx
import React from "react";
import Sidebar from "../components/layout/Sidebar";
import TopBar from "../components/layout/TopBar";

export default function Layout({ children, user }) {
  return (
    <div className="flex">
      <Sidebar user={user} />

      <div className="flex-1 ml-64">
        <TopBar user={user} />
        <main className="p-6 mt-20">{children}</main>
      </div>
    </div>
  );
}
