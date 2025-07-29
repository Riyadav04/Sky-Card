import React, { useEffect, useState } from "react";
import axios from "axios";
import Apis from "../../Apis";
import { useNavigate } from "react-router-dom";
import Header from "../HeaderPage/Header";
import Footer from "../Footer/Footer";

const ViewProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(Apis.GET_USER_PROFILE, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUser(res.data.user);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          alert("Session expired. Please log in again.");
          localStorage.removeItem("token");
          navigate("/sign-in");
        } else {
          console.error("Error fetching profile:", err);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  const handleEdit = () => navigate("/edit-profile");

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your profile?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(Apis.UPDATE_USER_PROFILE, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("Profile deleted successfully.");
      localStorage.removeItem("token");
      navigate("/sign-up");
    } catch (error) {
      console.error("Delete failed", error);
      alert("Failed to delete profile. Try again later.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-[#f5f7fa]">
        <div className="animate-pulse text-[#2C3E50]">Loading...</div>
      </div>
    );

  if (!user)
    return (
      <div className="flex justify-center items-center h-screen bg-[#f5f7fa]">
        <div className="text-[#2C3E50]">Failed to load user profile.</div>
      </div>
    );

  return (
    <>
      <Header />

      <main className="min-h-[calc(100vh-140px)] bg-[#f5f7fa] flex items-center justify-center p-4">
        <div className="w-full max-w-6xl min-h-[80vh] mx-auto">
          <div className="bg-[#F0FFFF] rounded-lg shadow-[0_5px_15px_rgba(0,0,0,0.1)] overflow-hidden">
            <div className="flex flex-col md:flex-row min-h-[80vh]">
              {/* Left Side - Profile Image */}
              <div className="w-full md:w-1/2 min-h-[80vh] p-8 flex flex-col items-center justify-center bg-gradient-to-b from-[#008080] to-[#4da6a6]">
                {user?.profilePic ? (
                  <img
                    src={
                      user?.profilePic
                        ? `http://localhost:5000/uploads/${user.profilePic}`
                        : "/images/default-avatar.png"
                    }
                    alt="Profile"
                    onError={(e) => {
                      e.currentTarget.onerror = null; // stop re-trigger
                      e.currentTarget.src = "/images/default-avatar.png";
                    }}
                    className="w-48 h-48 rounded-full object-cover mb-6 border-4 border-white shadow-md"
                  />
                ) : (
                  <div className="w-48 h-48 rounded-full bg-white flex items-center justify-center mb-6 text-[#008080] text-6xl font-bold border-4 border-white shadow-md">
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                )}
                <h2 className="text-2xl font-semibold text-white mb-2">
                  {user.username}
                </h2>
                <p className="text-white/90">
                  {user.jobTitle || "No Job Title"}
                </p>
                <p className="text-white/80 mt-1">
                  at {user.company || "No Company"}
                </p>
              </div>

              {/* Right Side - Profile Info */}
              <div className="w-full min-h-[80vh] md:w-1/2 p-8 flex flex-col ">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-4xl font-bold text-[#008080]">
                    Personal Information
                  </h3>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-2xl text-[#4da6a6] font-medium mb-1">
                        Email
                      </p>
                      <p className="text-[#2C3E50] font-semibold">
                        {user.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-2xl text-[#4da6a6] font-medium mb-1">
                        Job Title
                      </p>
                      <p className="text-[#2C3E50] font-semibold">
                        {user.jobTitle || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-2xl text-[#4da6a6] font-medium mb-1">
                        Company
                      </p>
                      <p className="text-[#2C3E50] font-semibold">
                        {user.company || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-2xl text-[#4da6a6] font-medium mb-1">
                        Phone
                      </p>
                      <p className="text-[#2C3E50] font-semibold">
                        {user.phone || "N/A"}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-2xl text-[#4da6a6] font-medium mb-1">
                        Address
                      </p>
                      <p className="text-[#2C3E50] font-semibold">
                        {user.address || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-2xl text-[#4da6a6] font-medium mb-1">
                        City
                      </p>
                      <p className="text-[#2C3E50] font-semibold">
                        {user.city || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-3  py-10">
                  <button
                    onClick={handleEdit}
                    className="bg-[#008080] hover:bg-[#4da6a6] text-white px-4 py-3 rounded-lg transition-all hover:scale-105 text-2xl font-medium shadow-sm"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={handleDelete}
                    className="bg-[#2C3E50] hover:bg-[#4da6a6] text-white px-4 py-3 rounded-lg transition-all hover:scale-105 text-2xl font-medium shadow-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default ViewProfile;
