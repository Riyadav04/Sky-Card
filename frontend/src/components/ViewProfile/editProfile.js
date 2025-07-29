import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Apis from '../../Apis';
import { useNavigate } from 'react-router-dom';
import Footer from "../Footer/Footer";
import Header from "../HeaderPage/Header";

const EditProfile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    jobTitle: '',
    company: '',
    phone: '',
    address: '',
    city: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImageUrl, setPreviewImageUrl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(Apis.GET_USER_PROFILE, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        setUser(res.data.user);
        setFormData({
          username: res.data.user.username || '',
          jobTitle: res.data.user.jobTitle || '',
          company: res.data.user.company || '',
          phone: res.data.user.phone || '',
          address: res.data.user.address || '',
          city: res.data.user.city || '',
        });
      } catch (err) {
        console.error('Error loading profile:', err);
        alert('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (selectedImage) {
      const url = URL.createObjectURL(selectedImage);
      setPreviewImageUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [selectedImage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      if (selectedImage) {
        data.append('profilePic', selectedImage);
      }

      await axios.put(Apis.UPDATE_USER_PROFILE, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Profile updated successfully!');
      navigate('/user-profile');
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-[#f5f7fa]">
      <div className="text-3xl animate-pulse text-[#2C3E50]">Loading...</div>
    </div>
  );

  return (
    <>
      <Header />
      
      <main className="min-h-[calc(100vh-140px)] bg-[#f5f7fa] flex items-center justify-center p-8">
        <div className="w-full max-w-6xl bg-white rounded-xl shadow-2xl overflow-hidden" style={{ minHeight: '600px' }}>
          <div className="p-10">
            <div className="flex justify-between items-center mb-10">
              <h1 className="text-4xl font-bold text-[#2C3E50]">Edit Your Profile</h1>
              <button 
                onClick={() => navigate(-1)}
                className="text-2xl text-[#008080] hover:text-[#4da6a6] font-medium"
              >
                Back
              </button>
            </div>

            <form onSubmit={handleSubmit} >
              <div className="flex flex-col md:flex-row gap-12">
                {/* Left Column - Profile Picture */}
                <div className="w-full md:w-2/5 flex flex-col items-center">
                  <div className="mb-8">
                    {previewImageUrl ? (
                      <img
                        src={previewImageUrl}
                        alt="Preview"
                        className="w-60 h-60 rounded-full object-cover border-4 border-[#F0FFFF] shadow-xl"
                      />
                    ) : user?.profilePic ? (
                      <img
                        src={`http://localhost:5000/uploads/${user.profilePic}`}
                        alt="Profile"
                        className="w-60 h-60 rounded-full object-cover border-4 border-[#F0FFFF] shadow-xl"
                      />
                    ) : (
                      <div className="w-60 h-60 rounded-full bg-[#4da6a6] flex items-center justify-center text-white text-7xl font-bold border-4 border-[#F0FFFF] shadow-xl">
                        {formData.username?.charAt(0).toUpperCase() || "?"}
                      </div>
                    )}
                  </div>
                  
                  <label className="mb-4 block text-xl font-medium text-[#4da6a6]">
                    Choose File
                  </label>
                  <div className="relative w-full">
                    <input
                      type="file"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      accept="image/*"
                      onChange={(e) => setSelectedImage(e.target.files[0])}
                    />
                    <div className="px-4 py-3 bg-[#F0FFFF] border-2 border-[#4da6a6] rounded-xl text-center text-xl">
                      <span className="text-[#2C3E50]">
                        {selectedImage ? selectedImage.name : 'No file chosen'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Column - Form Fields */}
                <div className="w-full md:w-3/5">
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="block text-xl font-medium text-[#4da6a6] mb-2">Username</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 text-xl border-2 border-[#4da6a6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008080]"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xl font-medium text-[#4da6a6] mb-2">Job Title</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 text-xl border-2 border-[#4da6a6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008080]"
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <label className="block text-xl font-medium text-[#4da6a6] mb-2">Company</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 text-xl border-2 border-[#4da6a6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008080]"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <label className="block text-xl font-medium text-[#4da6a6] mb-2">Phone</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 text-xl border-2 border-[#4da6a6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008080]"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <label className="block text-xl font-medium text-[#4da6a6] mb-2">Address</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 text-xl border-2 border-[#4da6a6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008080]"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <label className="block text-xl font-medium text-[#4da6a6] mb-2">City</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 text-xl border-2 border-[#4da6a6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008080]"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="mt-10 text-right">
                    <button
                      type="submit"
                      className="bg-[#008080] hover:bg-[#4da6a6] text-white px-10 py-3 mb-0 rounded-xl font-medium text-2xl transition-colors shadow-xl hover:shadow-2xl disabled:opacity-70"
                      disabled={saving}
                    >
                      {saving ? 'Updating...' : 'Update Profile'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default EditProfile;   