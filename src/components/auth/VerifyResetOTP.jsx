import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";
import * as Yup from "yup";
import { useFormik } from "formik";

const VerifyResetOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(120); // 2 minutes

  const { email, purpose } = location.state || {};

  // Redirect if no email provided
  useEffect(() => {
    if (!email) navigate("/forgot-password");

    const timer =
      countdown > 0 &&
      setInterval(() => {
        setCountdown(countdown - 1);
      }, 1000);

    return () => clearInterval(timer);
  }, [countdown, email]);

  const formik = useFormik({
    initialValues: { otp: "", newPassword: "" },
    validationSchema: Yup.object({
      otp: Yup.string()
        .required("OTP is required")
        .length(6, "Must be 6 digits"),
      newPassword: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);

        const { data } = await API.post("/auth/reset-password", {
          email,
          otp: values.otp,
          newPassword: values.newPassword,
        });

        // Redirect to login with success message
        navigate("/login", {
          state: { success: "Password reset successfully!" },
        });
      } catch (err) {
        setError(
          err.response?.data?.message || "Invalid OTP or password requirements"
        );
      } finally {
        setLoading(false);
      }
    },
  });

  const handleResendOTP = async () => {
    try {
      await API.post("/auth/resend-password-otp", { email });
      setCountdown(120); // Reset countdown
    } catch (err) {
      setError("Failed to resend OTP");
    }
  };

  return (
    <div className="otp-verification">
      <h2>Reset Your Password</h2>
      <p>Enter the OTP sent to {email} and your new password</p>

      {error && <div className="alert error">{error}</div>}

      <form onSubmit={formik.handleSubmit}>
        <div className="form-group">
          <label>OTP Code</label>
          <input
            type="text"
            name="otp"
            maxLength={6}
            value={formik.values.otp}
            onChange={formik.handleChange}
            className={formik.errors.otp ? "error-input" : ""}
            placeholder="123456"
          />
          {formik.errors.otp && (
            <div className="error-message">{formik.errors.otp}</div>
          )}
        </div>

        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            className={formik.errors.newPassword ? "error-input" : ""}
          />
          {formik.errors.newPassword && (
            <div className="error-message">{formik.errors.newPassword}</div>
          )}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>

      <div className="resend-otp">
        {countdown > 0 ? (
          <p>
            Resend OTP in {Math.floor(countdown / 60)}:
            {String(countdown % 60).padStart(2, "0")}
          </p>
        ) : (
          <button type="button" onClick={handleResendOTP}>
            Resend OTP
          </button>
        )}
      </div>
    </div>
  );
};

export default VerifyResetOTP;
