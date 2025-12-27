import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "./userService";

/* ================= LOCAL STORAGE ================= */
const customer = localStorage.getItem("customer")
  ? JSON.parse(localStorage.getItem("customer"))
  : null;

/* ================= AUTH ================= */

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      return await authService.register(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      return await authService.login(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

/* ================= WISHLIST ================= */

export const getuserProductWishlist = createAsyncThunk(
  "user/wishlist",
  async (_, thunkAPI) => {
    try {
      return await authService.getUserWislist();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

/* ================= CART ================= */

export const addProdToCart = createAsyncThunk(
  "user/cart/add",
  async (cartData, thunkAPI) => {
    try {
      return await authService.addToCart(cartData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

export const getUserCart = createAsyncThunk(
  "user/cart/get",
  async (_, thunkAPI) => {
    try {
      return await authService.getCart();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

export const deleteCartProduct = createAsyncThunk(
  "user/cart/product/delete",
  async (data, thunkAPI) => {
    try {
      return await authService.removeProductFromCart(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

export const updateCartProduct = createAsyncThunk(
  "user/cart/product/update",
  async (cartDetail, thunkAPI) => {
    try {
      return await authService.updateProductFromCart(cartDetail);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

export const deleteUserCart = createAsyncThunk(
  "user/cart/delete",
  async (_, thunkAPI) => {
    try {
      return await authService.emptyCart();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

/* ================= ORDER ================= */

export const createAnOrder = createAsyncThunk(
  "user/order/create",
  async (orderDetail, thunkAPI) => {
    try {
      return await authService.createOrder(orderDetail);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

export const getOrders = createAsyncThunk(
  "user/order/get",
  async (_, thunkAPI) => {
    try {
      return await authService.getUserOrders();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

/* ================= PROFILE ================= */

export const updateProfile = createAsyncThunk(
  "user/profile/update",
  async (data, thunkAPI) => {
    try {
      return await authService.updateUser(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

/* ================= PASSWORD ================= */

export const forgotPasswordToken = createAsyncThunk(
  "user/password/token",
  async (data, thunkAPI) => {
    try {
      return await authService.forgotPasswordToken(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "user/password/reset",
  async (data, thunkAPI) => {
    try {
      return await authService.resetPassword(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

/* ================= INITIAL STATE ================= */

const initialState = {
  user: customer,
  wishlist: [],
  cartProducts: [],
  getorderedProduct: null,
  orderedProduct: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

/* ================= SLICE ================= */

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetState: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
    logout: (state) => {
      state.user = null;
      state.wishlist = [];
      state.cartProducts = [];
      state.getorderedProduct = null;
      state.orderedProduct = null;
      localStorage.removeItem("customer");
    },
  },
  extraReducers: (builder) => {
    builder

      // REGISTER
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        localStorage.setItem("customer", JSON.stringify(action.payload));
      })

      // LOGIN
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        localStorage.setItem("customer", JSON.stringify(action.payload));
      })

      // WISHLIST
      .addCase(getuserProductWishlist.fulfilled, (state, action) => {
        state.wishlist = action.payload || [];
      })

      // CART
      .addCase(getUserCart.fulfilled, (state, action) => {
        state.cartProducts = action.payload || [];
      })

      // ORDER
      .addCase(createAnOrder.fulfilled, (state, action) => {
        state.orderedProduct = action.payload;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.getorderedProduct = action.payload;
      });
  },
});

/* ================= EXPORTS ================= */

export const { resetState, logout } = authSlice.actions;
export default authSlice.reducer;
