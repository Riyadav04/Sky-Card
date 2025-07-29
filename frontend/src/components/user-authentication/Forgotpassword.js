import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Apis from "../../Apis.js";                // explicit extension (recommended)
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../HeaderPage/Header";
import Footer from "../Footer/Footer";

function ForgotPassword() {
  const navigate = useNavigate();

  // Flow step: 1=enter email, 2=enter OTP, 3=new password
  const [step, setStep] = useState(1);

  // Form state
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetToken, setResetToken] = useState("");

  // Simple loading flags (per step)
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [resetting, setResetting] = useState(false);

  /* ---------------- Step 1: Send OTP ---------------- */
  const handleSendOtp = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      toast.error("Email required.");
      return;
    }
    try {
      setSendingOtp(true);
      const res = await axios.post(Apis.FORGOT_PASSWORD, { email: cleanEmail });
      toast.success(res.data.msg || "OTP sent!");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to send OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  /* ---------------- Step 2: Verify OTP ---------------- */
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      toast.error("Enter the OTP.");
      return;
    }
    try {
      setVerifyingOtp(true);
      const res = await axios.post(Apis.VERIFY_OTP, { email: email.trim(), otp: otp.trim() });
      toast.success(res.data.msg || "OTP verified!");
      setResetToken(res.data.resetToken);
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Invalid OTP");
    } finally {
      setVerifyingOtp(false);
    }
  };

  /* ---------------- Step 3: Reset Password ---------------- */
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword.trim()) {
      toast.error("Enter new password.");
      return;
    }
    if (!resetToken) {
      toast.error("Reset token missing — please restart the flow.");
      setStep(1);
      return;
    }
    try {
      setResetting(true);
      await axios.post(
        Apis.RESET_PASSWORD,
        { newPassword: newPassword.trim() },
        {
          headers: {
            Authorization: `Bearer ${resetToken}`,
          },
        }
      );
      toast.success("Password reset successfully");
      setTimeout(() => navigate("/sign-in"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Password reset failed");
    } finally {
      setResetting(false);
    }
  };

  return (
    <>
      <Header />
      <ToastContainer />

      <div className="min-h-screen bg-gradient-to-br from-teal-100 via-white to-teal-200 flex items-start justify-center pt-10 mt-8 px-4">
        <div
          className="w-full max-w-6xl bg-white shadow-2xl rounded-2xl p-10 border border-gray-200 min-h-[250px]"
          style={{ marginTop: "90px" }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-teal-700 mb-8 text-center">
            Forgot Password
          </h2>

          {/* STEP 1 */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="flex flex-col gap-8 text-4xl">
              <input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="submit"
                disabled={sendingOtp}
                className={`bg-teal-600 hover:bg-teal-700 text-white py-4 rounded font-semibold transition ${
                  sendingOtp ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {sendingOtp ? "Sending..." : "Send OTP"}
              </button>
            </form>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="submit"
                disabled={verifyingOtp}
                className={`bg-teal-600 hover:bg-teal-700 text-white py-2 rounded font-semibold transition ${
                  verifyingOtp ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {verifyingOtp ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="submit"
                disabled={resetting}
                className={`bg-teal-600 hover:bg-teal-700 text-white py-2 rounded font-semibold transition ${
                  resetting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {resetting ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}

          <div className="mt-8 text-center text-3xl">
            <button
              onClick={() => navigate("/sign-in")}
              className="text-teal-600 hover:underline text-2xl"
            >
              ⬅️ Back to Sign In
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default ForgotPassword;
