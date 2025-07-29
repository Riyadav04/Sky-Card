import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import connect from "../../../connectapi.js";
import Apis from "../../../Apis.js";
import AdminLayout from "../AdminLayout/AdminLayout";

const AdminDashboard = () => {
  const [templates, setTemplates] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await connect.get(Apis.ADMIN_GET_TEMPLATES);
        setTemplates(res.data);
      } catch (error) {
        console.error("Error fetching templates:", error);
      }
    };
    fetchTemplates();
  }, []);

  // Safe image builder for template previews
  const templateImgSrc = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    // strip any leading slash then prefix BASE_URL
    return `${Apis.BASE_URL}/${path.replace(/^\/+/, "")}`;
  };

  return (
    <AdminLayout>
      <h1 className="text-4xl font-bold text-teal-700 mb-10">
        Welcome to your dashboard!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            title: "Users",
            value: "1,245",
            icon: "/images/users.png",
            route: "/admin/users",
          },
          {
            title: "Add Cards",
            value: "67",
            icon: "/images/add-card.png",
            route: "/admin/add-template",
          },
          {
            title: "Manage Cards",
            value: "103",
            icon: "/images/manage-card.png",
            route: "/admin/manage-template",
          },
        ].map(({ title, value, icon, route }) => (
          <div
            key={title}
            onClick={() => navigate(route)}
            className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center hover:scale-105 cursor-pointer"
          >
            <img src={icon} alt={title} className="w-16 h-16 mb-4 animate-pulse" />
            <h2 className="text-2xl font-semibold text-gray-700">{title}</h2>
            <p className="text-4xl font-extrabold text-blue-600 mt-2">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="text-3xl font-bold text-teal-700 mb-6">
          Added Card Templates
        </h2>
        {templates.length === 0 ? (
          <p className="text-gray-600 text-lg">No templates available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {templates.map((template) => (
              <div
                key={template._id}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:scale-105 transition"
              >
                <img
                  src={templateImgSrc(template.previewImage)}
                  alt={template.category}
                  className="w-full h-64 object-contain bg-gray-100"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-teal-700">
                    {template.category}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
