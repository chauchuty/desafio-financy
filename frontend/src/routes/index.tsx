import { Routes, Route } from "react-router-dom";
import { Login } from "./../pages/Login"
import { Dashboard } from "./../pages/Dashboard"
import { SignUp } from "../pages/SignUp";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
}