import axios from "axios";
import { base_url, config } from "../../utils/axiosConfig";

// ================= AUTH =================

const register = async (userData) => {
  const response = await axios.post(`${base_url}user/register`, userData);
  return response.data;
};

const login = async (userData) => {
  const response = await axios.post(`${base_url}user/login`, userData);

  if (response.data) {
    localStorage.setItem("customer", JSON.stringify(response.data));
  }

  return response.data;
};

// ================= WISHLIST =================

const getUserWislist = async () => {
  const response = await axios.get(`${base_url}user/wishlist`, config);
  return response.data;
};

// ================= CART =================

const addToCart = async (cartData) => {
  const response = await axios.post(`${base_url}user/cart`, cartData, config);
  return response.data;
};

const getCart = async () => {
  const response = await axios.get(`${base_url}user/cart`, config);
  return response.data;
};

const removeProductFromCart = async (data) => {
  const response = await axios.delete(
    `${base_url}user/delete-product-cart/${data.id}`,
    config
  );
  return response.data;
};

const updateProductFromCart = async (cartDetail) => {
  const response = await axios.delete(
    `${base_url}user/update-product-cart/${cartDetail.cartItemId}/${cartDetail.quantity}`,
    config
  );
  return response.data;
};

const emptyCart = async () => {
  const response = await axios.delete(`${base_url}user/empty-cart`, config);
  return response.data;
};

// ================= ORDER =================

const createOrder = async (orderDetail) => {
  const response = await axios.post(
    `${base_url}user/cart/create-order`,
    orderDetail,
    config
  );
  return response.data;
};

const getUserOrders = async () => {
  const response = await axios.get(`${base_url}user/getmyorders`, config);
  return response.data;
};

// ================= USER PROFILE =================

const updateUser = async (data) => {
  const response = await axios.put(
    `${base_url}user/edit-user`,
    data.data,
    data.config2 || config
  );

  if (response.data) {
    localStorage.setItem("customer", JSON.stringify(response.data));
  }

  return response.data;
};

// ================= PASSWORD =================

const forgotPasswordToken = async (data) => {
  const response = await axios.post(
    `${base_url}user/forgot-password-token`,
    data
  );
  return response.data;
};

const resetPassword = async (data) => {
  const response = await axios.put(
    `${base_url}user/reset-password/${data.token}`,
    { password: data.password }
  );
  return response.data;
};

// ================= EXPORT SERVICE =================

export const authService = {
  register,
  login,
  getUserWislist,
  addToCart,
  getCart,
  removeProductFromCart,
  updateProductFromCart,
  emptyCart,
  createOrder,
  getUserOrders,
  updateUser,
  forgotPasswordToken,
  resetPassword,
};
