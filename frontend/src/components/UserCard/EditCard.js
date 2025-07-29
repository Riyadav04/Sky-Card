import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Apis from "../../Apis";
import { toast } from "react-toastify";
import Header from  "../HeaderPage/Header.js";
import Footer from "../Footer/Footer.js"

const BASE_URL = "http://localhost:5000";

const EditCard = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    phone: "",
    jobtitle: "",
    website: "",
    address: "",
    profilePic: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Card Data
  useEffect(() => {
    const fetchCard = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.warn("Please login to edit your card");
          navigate("/sign-in");
          return;
        }

        const res = await axios.get(`${BASE_URL}/card/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setForm(res.data);
        if (res.data.profilePic) {
          setPreview(`${BASE_URL}/${res.data.profilePic}`);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load card data");
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, [id, navigate]);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Image Change + Preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, profilePic: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  // Submit Updated Data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      for (let key in form) {
        if (form[key]) formData.append(key, form[key]);
      }

      await axios.put(`${BASE_URL}/card/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Card updated successfully");
      navigate("/my-cards");
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
    <Header/>
    <div className="p-20 bg-gray-100 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white shadow-lg p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-teal-700">
          Edit Card
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="fullname"
            value={form.fullname}
            onChange={handleChange}
            placeholder="Full Name"
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="jobtitle"
            value={form.jobtitle}
            onChange={handleChange}
            placeholder="Job Title"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="website"
            value={form.website}
            onChange={handleChange}
            placeholder="Website"
            className="w-full p-2 border rounded"
          />
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Address"
            className="w-full p-2 border rounded"
          />

          {/* Profile Image Preview */}
          {preview && (
            <div className="flex justify-center mb-4">
              <img
                src={preview}
                alt="Preview"
                className="w-24 h-24 rounded-full object-cover border"
              />
            </div>
          )}

          <input
            type="file"
            name="profilePic"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border rounded"
          />

          <button
            type="submit"
            className="w-full bg-teal-600 text-white p-2 rounded hover:bg-teal-700"
          >
            Update Card
          </button>
        </form>
      </div>
    </div>
    <Footer/>
        </>
  );
};

export default EditCard;
