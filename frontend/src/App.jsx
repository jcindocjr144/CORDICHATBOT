import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import StudentChat from "./pages/StudentChat.jsx";
import GuestDashboard from "./pages/GuestDashboard.jsx";
import AutoResponses from "./pages/AutoResponses.jsx";
import Users from "./pages/Users.jsx";
import Chat from "./pages/Chat.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import LandingPage from "./pages/LandingPage.jsx";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page */}
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<LandingPage />} />

        {/* Auth routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Admin routes */}
        <Route
          path="/admindashboard"
          element={
            <ProtectedRoute roleRequired="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admindashboard/auto_responses"
          element={
            <ProtectedRoute roleRequired="admin">
              <AutoResponses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admindashboard/users"
          element={
            <ProtectedRoute roleRequired="admin">
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admindashboard/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />

        {/* Student route */}
        <Route
          path="/studentchat"
          element={
            <ProtectedRoute roleRequired="student">
              <StudentChat />
            </ProtectedRoute>
          }
        />

        {/* Guest route */}
        <Route
          path="/guestdashboard"
          element={
            <ProtectedRoute roleRequired="guest">
              <GuestDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
