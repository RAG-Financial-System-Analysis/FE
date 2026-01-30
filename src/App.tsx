import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import FPTDetail from "./pages/FPTDetail";
import VinamilkDetail from "./pages/VinamilkDetail";
import './index.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/fpt" element={<FPTDetail />} />
            <Route path="/vinamilk" element={<VinamilkDetail />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
