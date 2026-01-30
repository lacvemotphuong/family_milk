import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import UserProfile from "./pages/UserProfile"; // ✅ PROFILE (MỚI)
import UpdateProfilePage from "./pages/UpdateProfilePage"; // ✅ UPDATE PROFILE
import ChangePasswordPage from "./pages/ChangePasswordPage"; // ✅ CHANGE PASSWORD
import UserHistory from "./pages/UserHistory"; // ✅ USER HISTORY
import UserSidebar from "./components/UserSidebar"; // ✅ SIDEBAR (MỚI)
import { User, Package, Menu } from "lucide-react";
import { api } from "./services/api";

export default function App() {
  const [page, setPage] = useState("home");
  const [userRole, setUserRole] = useState(null); // 'admin' | 'user'
  const [currentUser, setCurrentUser] = useState(null); // ✅ user info
  const [openSidebar, setOpenSidebar] = useState(false); // ✅ sidebar state

  // ================= LOGIN =================
const handleLogin = async (role, data) => {
  if (role === "admin") {
    if (data.username === "admin" && data.password === "123") {
      const fakeAdmin = {
        username: "admin",
        fullname: "Administrator",
        role: "admin"
      };

      localStorage.setItem("token", "admin-demo-token"); // fake cũng được
      setUserRole("admin");
      setCurrentUser(fakeAdmin);
      setPage("admin-dashboard");
      return;
    }

    alert("Sai thông tin admin!");
    return;
  }

  // ===== USER LOGIN =====
  const res = await api.login(data);
  if (res.status === "success") {
    localStorage.setItem("token", res.token);
    setUserRole(res.user.role);
    setCurrentUser(res.user);
    setPage("user-dashboard");
  } else {
    alert(res.message);
  }
};

  // ================= REGISTER =================
  const handleRegister = async (data) => {
    const res = await api.register(data);
    if (res.status === "success") {
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      setPage("login");
    } else {
      alert(res.message);
    }
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserRole(null);
    setCurrentUser(null);
    setOpenSidebar(false);
    setPage("home");
  };

  return (
    /**
     * NOTE:
     * ❌ ĐÃ LOẠI BỎ `font-sans`
     * 👉 Giữ nguyên font Bootstrap mặc định
     * 👉 Fix lỗi font "Đăng nhập / Tra cứu" khác ban đầu
     */
    <div className="min-vh-100 d-flex flex-column position-relative overflow-hidden">

      {/* ================= NAVBAR ================= */}
      {(page === "home" || page === "user-dashboard") && (
        <nav className="navbar sticky-top px-4 mt-3 rounded-pill mx-4 glass-panel">
          <div className="container-fluid d-flex justify-content-between align-items-center">

            {/* LEFT */}
            <div className="d-flex align-items-center gap-3">
              {userRole && (
                <Menu
                  size={22}
                  style={{ cursor: "pointer" }}
                  onClick={() => setOpenSidebar(true)} // ✅ OPEN SIDEBAR
                />
              )}

              <span
                className="navbar-brand fw-bold"
                style={{ cursor: "pointer" }}
                onClick={() => setPage("home")}
              >
                Milk<span className="text-primary">Family</span>
              </span>
            </div>

            {/* RIGHT */}
            {!userRole ? (
              <div className="d-flex gap-2">
                <button
                  className="btn btn-light rounded-pill fw-bold d-flex align-items-center gap-2"
                  onClick={() => setPage("login")}
                >
                  <User size={18} /> Đăng nhập
                </button>

                <button
                  className="btn btn-primary rounded-pill fw-bold d-flex align-items-center gap-2"
                  onClick={() => setPage("user-dashboard")}
                >
                  <Package size={18} /> Tra cứu
                </button>
              </div>
            ) : (
              <div
                className="d-flex align-items-center gap-2"
                style={{ cursor: "pointer" }}
                onClick={() => setOpenSidebar(true)}
              >
                <span className="fw-semibold">
                  { currentUser?.fullname || currentUser?.username}
                </span>
                <User size={20} />
              </div>
            )}
          </div>
        </nav>
      )}

      {/* ================= SIDEBAR (MỚI) ================= */}
      <UserSidebar
        open={openSidebar}
        user={currentUser} 
        onClose={() => setOpenSidebar(false)}
        onProfile={() => {
          setPage("profile");
          setOpenSidebar(false);
        }}
        onHistory={() => {
          console.log("Sidebar onHistory clicked");
          setPage("user-history");
          setOpenSidebar(false);
        }}
        onLogout={handleLogout}
      />

      {/* ================= CONTENT ================= */}
      <div className="flex-grow-1">
        <AnimatePresence mode="wait">

          {page === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <HomePage onStart={() => setPage("user-dashboard")} />
            </motion.div>
          )}

          {page === "login" && (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <LoginPage
                onLogin={handleLogin}
                onSwitchToRegister={() => setPage("register")}
                onBack={() => setPage("home")}
              />
            </motion.div>
          )}

          {page === "register" && (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <RegisterPage
                onRegister={handleRegister}
                onSwitchToLogin={() => setPage("login")}
              />
            </motion.div>
          )}

          {page === "admin-dashboard" && userRole === "admin" && (
            <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <AdminDashboard onLogout={handleLogout} />
            </motion.div>
          )}

          {page === "user-dashboard" && (
            <motion.div key="user" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <UserDashboard />
            </motion.div>
          )}

          {page === "profile" && (
            <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <UserProfile
                user={currentUser}
                onBack={() => setPage("user-dashboard")}
                onLogout={handleLogout}
                onUpdateProfile={() => setPage("update-profile")}
                onChangePassword={() => setPage("change-password")}
                onViewHistory={() => setPage("user-history")}
              />
            </motion.div>
          )}

          {page === "update-profile" && (
            <motion.div key="update-profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <UpdateProfilePage
                user={currentUser}
                onBack={() => setPage("profile")}
                onUpdateSuccess={(updatedUser) => setCurrentUser(updatedUser)}
              />
            </motion.div>
          )}

          {page === "change-password" && (
            <motion.div key="change-password" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ChangePasswordPage
                onBack={() => setPage("profile")}
              />
            </motion.div>
          )}

          {page === "user-history" && userRole === "user" && (
            <motion.div key="user-history" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <UserHistory
                onBack={() => setPage("user-dashboard")}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
