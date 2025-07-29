import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import connect from "../../connectapi";
import Apis from "../../Apis";
import Header from "../HeaderPage/Header";
import { toast } from "react-toastify";

const SelectCard = () => {
  const { cardId } = useParams() || {};
  const navigate = useNavigate();
  const location = useLocation();

  const { profilePicURL } = location.state || {};
  const [templates, setTemplates] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const res = await connect.get(Apis.ADMIN_GET_TEMPLATES, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTemplates(res.data);
      } catch (err) {
        console.error("Failed to load templates:", err);
        setError("Failed to load templates. Please try again.");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const categories = ["All", ...new Set(templates.map((t) => t.category || t.title))];

  const filteredTemplates =
    selectedCategory === "All"
      ? templates
      : templates.filter((t) => (t.category || t.title) === selectedCategory);

  const handleSelect = (card) => {
    setSelectedCategory(card.category);
    setSelectedCard(card);
  };

  const handleNext = () => {
    const token = localStorage.getItem("token");

    if (!selectedCard) {
      setError("Please select a card template.");
      setSnackbarOpen(true);
      return;
    }

    if (!token) {
      toast.warn("Please login first!");
      navigate("/sign-in");
      return;
    }

    console.log("Navigating to fillform with cardId:", selectedCard._id);

    navigate(`/fillform/${selectedCard._id}`, {
      state: {
        selectedCard,
        templateId: selectedCard._id,
        selectedCategory: selectedCard.category,
        profilePicURL: profilePicURL || null,
      },
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Header />
      <div className="px-4 md:px-10 py-8 bg-gray-100">
        <button
          onClick={() => navigate(-1)}
          className="bg-teal-600 hover:bg-teal-500 text-white font-semibold text-lg py-2 px-6 mt-4 rounded-full shadow-md transition"
        >
          ← Back
        </button>

        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
          <div className="text-center mb-6">
            <h1 className="text-6xl font-bold text-gray-800">
              Choose Your Perfect Card Design
            </h1>
            <p className="text-2xl text-teal-600 mt-2">
              Select from our curated collection of beautiful templates
            </p>
          </div>

          {categories.length > 1 && (
            <div className="flex flex-wrap justify-center gap-3 mb-6 border-b pb-4 border-teal-300 text-2xl">
              {categories.map((cat, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-3 rounded-full text-xl transition ${
                    selectedCategory === cat
                      ? "bg-teal-600 text-white"
                      : "bg-white text-teal-700 border border-teal-300 hover:bg-teal-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <div className="w-12 h-12 border-4 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 x:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredTemplates.map((template) => (
                <div
                  key={template._id}
                  className={`cursor-pointer rounded-lg overflow-hidden border-2 transition duration-300 transform hover:-translate-y-1 ${
                    selectedCard?._id === template._id
                      ? "border-teal-600 bg-teal-50 shadow-lg"
                      : "border-gray-200 bg-white shadow"
                  }`}
                  onClick={() => handleSelect(template)}
                >
                  <img
                    src={`${Apis.BASE_URL}/${template.previewImage}`}
                    alt={template.category}
                    className="w-full h-48 object-contain p-3"
                  />
                  <div className="text-center text-xl py-2 border-t border-gray-200 text-teal-700 font-semibold">
                    {template.category || template.title}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-center mt-10">
            <button
              onClick={handleNext}
              disabled={!selectedCard || loading}
              className={`px-8 py-3 text-white rounded-full font-semibold text-lg shadow-md transition ${
                !selectedCard || loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-teal-600 to-teal-800 hover:from-teal-700 hover:to-teal-900"
              }`}
            >
              Continue
            </button>
          </div>
        </div>

        {snackbarOpen && error && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50">
            <div className="flex items-center justify-between gap-4">
              <span>{error}</span>
              <button onClick={handleCloseSnackbar} className="text-white text-xl leading-none">
                &times;
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SelectCard;
