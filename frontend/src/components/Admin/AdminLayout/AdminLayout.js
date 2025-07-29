import React from "react";
import AdminSidebar from "../AdminSidebar/AdminSidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#f0ffff]">
      <AdminSidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
};

export default AdminLayout;
