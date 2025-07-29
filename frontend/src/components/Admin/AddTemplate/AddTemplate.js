import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../AdminLayout/AdminLayout.js";
import Apis from "../../../Apis.js"; // <-- Imported Apis

const AddTemplate = () => {
  const [theme, setTheme] = useState("light");
  const [selectedFile, setSelectedFile] = useState(null);
  const [category, setCategory] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category || !selectedFile) {
      toast.error("Please select a category and upload a file.");
      return;
    }

    const formData = new FormData();
    formData.append("category", category);
    formData.append("templateImage", selectedFile);
    formData.append("fieldStyles", JSON.stringify([]));

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(Apis.ADD_CARD_TEMPLATE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        toast.success("Template created successfully!");
        setCategory("");
        setSelectedFile(null);
        navigate("/admin/dashboard");
      } else {
        toast.error("Something went wrong!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error.");
    }
  };

  return (
    <AdminLayout>
      <ToastContainer />

      {/* Theme Switch & Back Button */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="bg-teal-600 hover:bg-teal-500 text-white font-semibold text-lg py-2 px-6 rounded-full shadow-md transition"
        >
          ← Back
        </button>
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold text-lg py-2 px-6 rounded-full shadow-md transition"
        >
          {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>
      </div>

      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 bg-opacity-90 dark:bg-opacity-80 backdrop-blur-xl rounded-3xl shadow-2xl p-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-teal-700 dark:text-teal-300 mb-3">
            Upload Card Template
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Upload your image and assign a category to build a card layout
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 text-lg">
          <div>
            <label className="block mb-3 font-semibold text-gray-800 dark:text-white text-2xl">
              Template Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl p-4 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-1xl"
            >
              <option value="">-- Select Category --</option>
              <option value="Business">Business</option>
              <option value="Freelancer">Freelancer</option>
              <option value="Student">Student</option>
              <option value="Artist">Artist</option>
            </select>
          </div>

          <div>
            <label className="block mb-3 font-semibold text-gray-800 dark:text-white text-2xl">
              Upload Template Image
            </label>
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-teal-400 rounded-xl cursor-pointer bg-teal-50 hover:bg-teal-100 dark:bg-gray-800 dark:hover:bg-gray-700 transition"
            >
              <div className="text-5xl mb-2">📤</div>
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                Drag & drop or click to upload
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Recommended: 1200x800 px
              </p>
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
            </label>
            {selectedFile && (
              <p className="mt-2 text-md text-teal-600 dark:text-teal-300 font-medium">
                ✅ Selected: {selectedFile.name}
              </p>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-4 text-xl font-bold text-white bg-gradient-to-r from-teal-500 to-teal-700 rounded-full shadow-lg hover:from-teal-600 hover:to-teal-800 transition"
            >
              Create Template
            </button>
          </div>
        </form>

        <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-8">
          Make sure your image is optimized and looks great on all screen sizes.
        </p>
      </div>
    </AdminLayout>
  );
};

export default AddTemplate;
