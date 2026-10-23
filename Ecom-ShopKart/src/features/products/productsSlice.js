import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const API_URL = 'https://fakestoreapi.com/products';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Could not load products. Please try again.');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong while loading products.');
    }
  },
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) throw new Error('Could not load this product.');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message || 'Could not load this product.');
    }
  },
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    selectedProduct: null,
    selectedStatus: 'idle',
    selectedError: null,
  },
  reducers: {
    clearSelectedProduct(state) {
      state.selectedProduct = null;
      state.selectedStatus = 'idle';
      state.selectedError = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Unable to load products.';
      })
      .addCase(fetchProductById.pending, (state) => {
        state.selectedStatus = 'loading';
        state.selectedError = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.selectedStatus = 'succeeded';
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.selectedStatus = 'failed';
        state.selectedError = action.payload || 'Unable to load this product.';
      });
  },
});

export const { clearSelectedProduct } = productsSlice.actions;
export default productsSlice.reducer;