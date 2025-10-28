import React, { useState } from 'react';
import { useFormik } from 'formik';
import { forgotPasswordSchema } from '../../schemas/schemas';
import API from '../api/axiosConfig';
import { useNavigate, Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        email: '',
      },
      validationSchema: forgotPasswordSchema,
      onSubmit: async (values) => {
        try {
          setLoading(true);
          setError('');
          setSuccess(false);

          // API call to request password reset
          const { data } = await API.post('/api/auth/forgot-password', {
            email: values.email,
          });

          // Show success message
          setSuccess(true);

          // Option 1: Redirect to OTP verification immediately
          // navigate('/verify-reset-otp', { 
          //   state: { 
          //     email: values.email,
          //     purpose: 'password_reset'
          //   } 
          // });

        } catch (err) {
          setError(
            err.response?.data?.message || 
            'Failed to send reset instructions. Please try again.'
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
          {/* Back to Login */}
          <div className="mb-6">
            <Link 
              to="/login" 
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Login
            </Link>
          </div>

          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Forgot Password?</h1>
            <p className="text-gray-600 text-sm">
              {success 
                ? "We've sent reset instructions to your email"
                : "Enter your email and we'll send you instructions to reset your password"
              }
            </p>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg text-sm">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-200 text-green-700 rounded-lg text-sm">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Password reset instructions sent successfully!
              </div>
            </div>
          )}

          {!success ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                    errors.email && touched.email 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-300 focus:border-blue-500'
                  }`}
                  placeholder="Enter your email address"
                />
                {errors.email && touched.email && (
                  <div className="text-red-500 text-xs mt-1 flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.email}
                  </div>
                )}
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className={`w-full text-white py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition font-medium ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 shadow-sm'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending Instructions...
                  </span>
                ) : (
                  'Send Reset Instructions'
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  Check your email at <strong>{values.email}</strong> for instructions to reset your password.
                </p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setSuccess(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
                >
                  Try Different Email
                </button>
                <button
                  onClick={() => navigate('/verify-reset-otp', { 
                    state: { 
                      email: values.email,
                      purpose: 'password_reset'
                    } 
                  })}
                  className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Enter OTP
                </button>
              </div>
            </div>
          )}

          {/* Additional Help */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center text-sm text-gray-600">
              <p>Didn't receive the email? Check your spam folder or{' '}
                <button 
                  type="button" 
                  onClick={() => !success && handleSubmit()}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  resend instructions
                </button>
              </p>
            </div>
          </div>

          {/* Support Contact */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Need help? <a href="mailto:support@yourapp.com" className="text-blue-600 hover:text-blue-800">Contact support</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;