import { Routes, Route } from "react-router-dom";
import { Login } from "./../pages/Login"
import { Dashboard } from "./../pages/Dashboard"
import { Transactions } from "./../pages/Transactions.tsx"
import { Categories } from "./../pages/Categories.tsx"
import { SignUp } from "../pages/SignUp";
import EditUser from "../pages/EditUser";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/transactions" element={<Transactions />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/account" element={<EditUser />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
}