import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface MenuItem {
  id: string;
  name: string;
  parentData: string | null;
  depth: number;
  children: MenuItem[];
}

interface MenuState {
  items: MenuItem[];
  loading: boolean;
  error: string | null;
}

const initialState: MenuState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchMenus = createAsyncThunk(
  'menu/fetchMenus',
  async () => {
    const response = await fetch('/api/menus');
    const data = await response.json();
    return data;
  }
);

export const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenus.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMenus.fulfilled, (state, action: PayloadAction<MenuItem[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMenus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch menus';
      });
  },
});

export default menuSlice.reducer;