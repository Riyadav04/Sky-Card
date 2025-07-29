import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaPlus,
  FaTrash,
  FaEdit,
  FaRegCreditCard,
} from "react-icons/fa";
import connect from "../../../connectapi.js";
import Apis from "../../../Apis.js";
import AdminLayout from "../AdminLayout/AdminLayout.js";

function ManageTemplate() {
  const [templates, setTemplates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const res = await connect.get(Apis.ADMIN_GET_TEMPLATES);
      setTemplates(res.data);
    } catch (err) {
      console.error("Failed to fetch templates", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await connect.delete(`${Apis.DELETE_CARD_TEMPLATE}/${id}`);
      fetchTemplates();
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  const filteredTemplates = templates.filter((t) =>
    t?.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to build image URL safely
  const getTemplateImage = (path) => {
    if (!path) return "";
    return path.startsWith("http")
      ? path
      : `${Apis.BASE_URL}/${path.replace(/^\/+/, "")}`;
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-teal-600 hover:bg-teal-500 text-white font-semibold text-lg py-2 px-6 rounded-full shadow-md transition"
        >
          ← Back
        </button>
        <h1 className="text-4xl font-bold text-teal-700 flex items-center gap-3">
          <FaRegCreditCard /> Manage Card Templates
        </h1>
        <button
          onClick={() => navigate("/admin/add-template")}
          className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-teal-700 hover:from-teal-600 hover:to-teal-800 text-white px-6 py-3 rounded-full shadow-md transition-all text-lg"
        >
          <FaPlus /> Add New Template
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-12 flex justify-center">
        <div className="relative w-full max-w-2xl">
          <input
            type="text"
            placeholder="Search by category..."
            className="w-full py-4 px-6 pr-14 rounded-full border border-gray-300 shadow focus:ring-2 focus:ring-teal-500 focus:outline-none text-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute top-1/2 right-5 transform -translate-y-1/2 text-teal-600 text-2xl" />
        </div>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="text-center text-2xl text-teal-700 py-20 font-semibold animate-pulse">
          Loading Templates...
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="text-center text-gray-600 text-xl py-20">
          No templates found.
        </div>
      ) : (
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredTemplates.map((template, index) => (
            <div
              key={template._id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] animate-fadeIn"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <img
                src={getTemplateImage(template.previewImage)}
                alt={template.category}
                className="w-full h-64 object-contain bg-gray-100"
              />
              <div className="p-5">
                <h3 className="text-2xl font-semibold text-teal-700 mb-2 capitalize">
                  {template.category || "Untitled"}
                </h3>
                <div className="flex items-center justify-between mt-4">
                  <button
                    onClick={() =>
                      navigate(`/admin/customize-template/${template._id}`)
                    }
                    className="text-teal-600 font-medium hover:underline flex items-center gap-1 text-base"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(template._id)}
                    className="text-red-600 font-medium hover:underline flex items-center gap-1 text-base"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Animation */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease forwards;
        }
      `}</style>
    </AdminLayout>
  );
}

export default ManageTemplate;
