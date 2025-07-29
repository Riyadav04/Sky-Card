import Header from "../HeaderPage/Header";
import Footer from "../Footer/Footer";
import { useState } from "react";
import connect from "../../connectapi";
import { useNavigate } from "react-router-dom";
import Apis from "../../Apis.js"; // Import API endpoints
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUp = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await connect.post(Apis.SIGN_UP, form);
      toast.success(res.data.msg + " Please check your email for verification.");
      setTimeout(() => navigate("/sign-in"), 2000);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || "Sign up failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <ToastContainer />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
        <div className="flex w-full max-w-5xl bg-white shadow-lg rounded-lg overflow-hidden min-h-[70vh]">
          {/* Left Welcome Panel */}
          <div className="w-1/2 bg-teal-600 text-white p-12 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-6">Welcome Back!</h2>
              <p className="mb-8">To keep connected with us please login with your personal info</p>
              <button
                onClick={() => navigate("/sign-in")}
                className="border border-white px-6 py-2 rounded-full hover:bg-white hover:text-teal-600 transition"
              >
                SIGN IN
              </button>
            </div>
            <img
              src="/images/signup-img.png"
              alt="Welcome"
              className="w-full mx-auto mt-8"
            />
          </div>

          {/* Right Sign Up Form */}
          <div className="w-1/2 p-12">
            <h2 className="text-5xl font-bold text-teal-600 mb-6">Create Account</h2>
            <p className="text-xl text-gray-500 mb-6">Use your email for registration</p>

            <form onSubmit={handleSubmit} className="space-y-8 text-2xl mt-5">
              <input
                type="text"
                name="username"
                placeholder="Name"
                value={form.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />

              <button
                type="submit"
                className="w-full bg-teal-600 text-white py-3 rounded-md hover:bg-teal-700 transition"
                disabled={loading}
              >
                {loading ? "Signing Up..." : "SIGN UP"}
              </button>
            </form>

            <p className="mt-4 text-sm text-center text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/sign-in")}
                className="text-teal-600 font-semibold hover:underline"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SignUp;
