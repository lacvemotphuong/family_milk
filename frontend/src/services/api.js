const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

/**
 * Tạo header kèm JWT token
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

export const api = {
  /* PRODUCT */

  // Lấy danh sách sản phẩm
  getProducts: async () => {
    const res = await fetch(`${API_URL}/products`);
    return res.json();
  },

  // Tạo sản phẩm mới
  createProduct: async (productData) => {
    const res = await fetch(`${API_URL}/create_product`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });
    return res.json();
  },

  // Nhập sản phẩm hàng loạt
  createProductsBulk: async (products) => {
    try {
      const res = await fetch(`${API_URL}/create_products_bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products }),
      });
      return await res.json();
    } catch (err) {
      console.error("Bulk import error:", err);
      return { status: "error", message: err.message };
    }
  },

  // Xác thực sản phẩm bằng UID
  verifyProduct: async (uid) => {
    const res = await fetch(`${API_URL}/verify/${uid}`);
    return res.json();
  },

  /* SCAN HISTORY */

  // Ghi lịch sử quét QR
  recordScan: async (uid, location, status = "valid") => {
    await fetch(`${API_URL}/record_scan`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        uid,
        location,
        status,
      }),
    });
  },

  // Lịch sử quét (Admin)
  getHistory: async () => {
    const res = await fetch(`${API_URL}/scan_history`);
    return res.json();
  },

  // Lịch sử quét của user đang đăng nhập
  getMyHistory: async () => {
    const res = await fetch(`${API_URL}/my_scan_history`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  /* AI */

  // Chat với AI
  askAI: async (productName, question) => {
    const res = await fetch(`${API_URL}/ask_ai`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_name: productName,
        question,
      }),
    });
    return res.json();
  },

  /* AUTH  */

  // Đăng ký
  register: async (userData) => {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    return res.json();
  },

  // Đăng nhập
  login: async (credentials) => {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    return res.json();
  },

  /* USER */

  // Lấy thông tin user hiện tại
  getMyProfile: async () => {
    const res = await fetch(`${API_URL}/me`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // Cập nhật thông tin user
  updateMyProfile: async (data) => {
    const res = await fetch(`${API_URL}/me`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Danh sách user (Admin)
  getUsers: async () => {
    const res = await fetch(`${API_URL}/users`);
    return res.json();
  },

  // Cập nhật thông tin user đang đăng nhập
  updateProfile: async (data) => {
    const res = await fetch(`${API_URL}/me`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },
};
