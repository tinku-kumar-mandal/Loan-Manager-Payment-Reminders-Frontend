import { useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import API from "../api/axiosConfig";
import { otpSchema } from "../../schemas/schemas";
import { useEffect, useState } from "react";

const VerifyOTP = () => {
  const [resent, setResent] = useState(false);
  const [countdown, setCountdown] = useState(120); // 2 minutes
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  // Get email from navigation state
  const email = location.state?.email;

  // Redirect if no email provided
  useEffect(() => {
    if (!email) navigate("/register");

    const timer =
      countdown > 0 &&
      setInterval(() => {
        setCountdown(countdown - 1);
      }, 1000);

    return () => clearInterval(timer);
  }, [countdown, email]);

  // formik setup
  const formik = useFormik({
    initialValues: { otp: "" },
    validationSchema: otpSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError("");
        const { data } = await API.post("/api/auth/verify-otp", {
          email,
          otp: values.otp,
        });
        // On successful verification
        navigate("/login", {
          state: { success: "Registration complete! Please login" },
        });
      } catch (err) {
        setError(err.response?.data?.message || "Invalid OTP");
      } finally {
        setLoading(false);
      }
    },
  });

  const handleResendOTP = async () => {
    try {
      await API.post("/auth/resend-otp", { email });
      setResent(true);
      setCountdown(120); // Reset countdown
      setTimeout(() => setResent(false), 3000);
    } catch (err) {
      setError("Failed to resend OTP. Please try again.");
    }
  };

  return (
    <div className="otp-container">
      <h2>Verify Your Email</h2>
      <p>
        Enter the 6-digit code sent to <strong>{email}</strong>
      </p>

      {error && <div className="alert error">{error}</div>}
      {resent && <div className="alert success">New OTP sent!</div>}

      <form onSubmit={formik.handleSubmit}>
        <div className="otp-input-group">
          <label htmlFor="otp">Verification Code</label>
          <input
            type="text"
            id="otp"
            name="otp"
            value={formik.values.otp}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            maxLength={6}
            placeholder="123456"
            className={formik.errors.otp && formik.touched.otp ? "error" : ""}
          />
          {formik.errors.otp && formik.touched.otp && (
            <div className="error-message">{formik.errors.otp}</div>
          )}
        </div>

        <button type="submit" disabled={loading || !formik.isValid}>
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>

      <div className="resend-otp">
        {countdown > 0 ? (
          <p>
            Resend code in {Math.floor(countdown / 60)}:
            {String(countdown % 60).padStart(2, "0")}
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResendOTP}
            className="resend-btn"
          >
            Resend OTP
          </button>
        )}
      </div>
    </div>
  );
};

export default VerifyOTP;
