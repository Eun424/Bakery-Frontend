import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../Axios/axios";

const initialState = {
  users: null,
  loading: false,
  error: null,
  profile: null,
  success: false,
};

export const register = createAsyncThunk(
  "auth/register",
  async (registerData, thunkAPI) => {
    try {
      const response = await api.post("/auth/register", registerData);
      // console.log(response.data)
      return response.data;
    } catch (error) {
      console.log(error);
      if (error?.response && error?.response?.data?.message) {
        return thunkAPI.rejectWithValue(error?.response?.data?.message);
      }

      return thunkAPI.rejectWithValue("Something went wrong");
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (loginData, thunkAPI) => {
    try {
      const response = await api.post("/auth/login", loginData);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      if (error?.response && error?.response?.data?.message) {
        return thunkAPI.rejectWithValue(error?.response?.data?.message);
      }

      return thunkAPI.rejectWithValue("Something went wrong");
    }
  }
);

export const logout = createAsyncThunk("logout", async (_, thunkAPI) => {
  try {
    const response = await api.post("/auth/logout");
    return response.data;
  } catch (error) {
    if (error?.message && error?.response?.data?.message) {
      return thunkAPI.rejectWithValue(error?.response?.data?.message);
    }

    return thunkAPI.rejectWithValue("Something went wrong");
  }
});

export const forgotPassword = createAsyncThunk(
  "forgotPass",
  async (fdata, thunkAPI) => {
    try {
      const response = await api.post("/auth/forgotPassword", fdata);
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      if (error.response && error.response.data.message) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }

      return thunkAPI.rejectWithValue("something went wrong");
    }
  }
);

export const resetPassword = createAsyncThunk(
  "reset",
  async (rData, thunkAPI) => {
    try {
      const response = await api.post(
        `/auth/resetPassword/${rData.resetPasswordtoken}`,
        { password: rData.password }
      );

      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      if (error.response && error.response.data.message) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }

      return thunkAPI.rejectWithValue("something went wrong");
    }
  }
);

export const changePassword = createAsyncThunk(
  "changePassword",
  async (cdata, thunkAPI) => {
    try {
      const response = await api.post("/auth/changePassword", cdata);
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      if (error.response && error.response.data.message) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }

      return thunkAPI.rejectWithValue("something went wrong");
    }
  }
);

export const sellerProfile = createAsyncThunk(
  "profile",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/auth/profile");
      console.log(response.data.seller);
      return response.data.seller;
    } catch (error) {
      if (error?.message && error?.response?.data?.message) {
        return thunkAPI.rejectWithValue(error?.response?.data?.message);
      }

      return thunkAPI.rejectWithValue("Something went wrong");
    }
  }
);

export const updateSellerProfile = createAsyncThunk(
  "updateprofile",
  async (profileData, thunkAPI) => {
    try {
      const response = await api.put("/auth/profile/edit", profileData);
      console.log(response.data.seller);
      return response.data.seller;
    } catch (error) {
      if (error?.message && error?.response?.data?.message) {
        return thunkAPI.rejectWithValue(error?.response?.data?.message);
      }

      return thunkAPI.rejectWithValue("Something went wrong");
    }
  }
);

export const currentUser = createAsyncThunk("me", async (_, thunkAPI) => {
  try {
    const response = await api.get("/auth/currentUser");
    console.log(response.data.user);
    return response.data.user;
  } catch (error) {
    if (error?.message && error?.response?.data?.message) {
      return thunkAPI.rejectWithValue(null);
    }
    return thunkAPI.rejectWithValue(null);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(register.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.loading = false;
      state.users = null;
      state.success = true;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.users = null;
      state.error = action.payload;
    });

    //login
    builder.addCase(login.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.users = null;
      state.error = action.payload;
    });

    //logout
    builder.addCase(logout.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(logout.fulfilled, (state, action) => {
      state.loading = false;
      state.users = null;
    });
    builder
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.users = null;
        state.error = action.payload;
      })

      //  forgotpassword
      .addCase(forgotPassword.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.message = null;
        state.error = action.payload;
      })

      //  resetpassword
      .addCase(resetPassword.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.message = null;
        state.error = action.payload;
      })
      // for changepassword
      .addCase(changePassword.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.message = null;
        state.error = action.payload;
      });

    //sellerprofile
    builder.addCase(sellerProfile.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(sellerProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.profile = action.payload;
    });
    builder.addCase(sellerProfile.rejected, (state, action) => {
      state.loading = false;
      state.profile = null;
      state.error = action.payload;
    });

    //update seller
    builder.addCase(updateSellerProfile.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(updateSellerProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.profile = action.payload;
    });
    builder.addCase(updateSellerProfile.rejected, (state, action) => {
      state.loading = false;
      state.profile = null;
      state.error = action.payload;
    });

    builder.addCase(currentUser.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(currentUser.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload;
    });
    builder.addCase(currentUser.rejected, (state, action) => {
      state.loading = false;
      state.users = null;
      state.error = action.payload;
    });
  },
});

export default authSlice.reducer;
