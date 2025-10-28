import "./App.css";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./components/dashboard/UserDashboard";
import ProtectedRoute from "./pages/routes/ProtectedRoute";
import Register from "./components/auth/Register";
import VerifyOTP from "./components/auth/VerifyOTP";
import Login from "./components/auth/Login";
import ForgotPassword from "./components/auth/ForgotPassword";
import VerifyResetOTP from "./components/auth/VerifyResetOTP";

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-reset-otp" element={<VerifyResetOTP />} />
      </Routes>
    </>
  );
}

export default App;
