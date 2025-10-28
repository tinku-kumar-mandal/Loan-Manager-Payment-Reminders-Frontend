import { useFormik } from "formik";
import { registerSchema } from "../../schemas/schemas";
import { useState } from "react";
import API from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
      validationSchema: registerSchema,
      onSubmit: async (values) => {
        try {
          setLoading(true);
          const { data } = await API.post("/api/auth/register", {
            name: values.name,
            email: values.email,
            password: values.password,
          });
          // Redirect to OTP verification page with email
          navigate("/verify-otp", {
            state: { email: values.email },
          });
        } catch (err) {
          setError(
            err.response?.data?.message ||
              "Registration failed. Please try again."
          );
        } finally {
          setLoading(false);
        }
      },
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-md">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Create your account</h1>
            {/* <p className="text-gray-600">Sign up to enjoy the best managing experience</p> */}
          </div>
          
          <div className="flex border-b border-gray-200 mb-6">
            <button 
              className="flex-1 py-4 font-semibold text-gray-500 hover:text-gray-700"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
            <button className="flex-1 py-4 font-semibold text-blue-600 border-b-2 border-blue-600">Register</button>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={loading}
                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                  errors.name && touched.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
              />
              {errors.name && touched.name && (
                <div className="text-red-500 text-xs mt-1">{errors.name}</div>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={loading}
                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                  errors.email && touched.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your email"
              />
              {errors.email && touched.email && (
                <div className="text-red-500 text-xs mt-1">{errors.email}</div>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={loading}
                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                  errors.password && touched.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Create a password"
              />
              {errors.password && touched.password && (
                <div className="text-red-500 text-xs mt-1">{errors.password}</div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={loading}
                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                  errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && touched.confirmPassword && (
                <div className="text-red-500 text-xs mt-1">{errors.confirmPassword}</div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition font-medium mt-2 ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Register'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <span>Already have an account?{' '}
              <a href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign In
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;