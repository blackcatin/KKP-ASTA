import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Auth/Login";
import Layout from "./components/Layout/Layout";
import StaffPage from "./components/Staff/StaffPage";
import ReportPage from "./components/ReportPage/ReportPage";
import ItemPage from "./components/ItemPage/ItemPage";
import CategoryPage from "./components/CategoryPage/CategoryPage";
import TransactionHistory from "./components/Transaction/TransactionHistory";
import Dashboard from "./components/Dashboard/Dashboard";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import Unauthorized from "./components/Auth/Unauthorized";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route path="/dashboard" element={<Layout />}>
            <Route path="home" element={<Dashboard />} />
            <Route path="transaction" element={<TransactionHistory />} />
            <Route path="items" element={<ItemPage />} />

            <Route
              path="staff"
              element={
                <ProtectedRoute
                  element={<StaffPage />}
                  allowedRoles={["owner"]}
                />
              }
            />
            <Route
              path="reports"
              element={
                <ProtectedRoute
                  element={<ReportPage />}
                  allowedRoles={["owner"]}
                />
              }
            />
            <Route
              path="categories"
              element={
                <ProtectedRoute
                  element={<CategoryPage />}
                  allowedRoles={["owner"]}
                />
              }
            />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
