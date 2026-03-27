import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../services/api';

export const fetchHotbar = createAsyncThunk('hotbar/fetch', async (charId, { rejectWithValue }) => {
  try { const r = await api.getHotbar(charId); return r.data || r; } catch (err) { return rejectWithValue(err.response?.data?.error || 'Erro'); }
});

export const setHotbarSlot = createAsyncThunk('hotbar/setSlot', async ({ charId, slotIndex, type, referenceId }, { rejectWithValue }) => {
  try { const r = await api.setHotbarSlot(charId, slotIndex, type, referenceId); return r.data || r; } catch (err) { return rejectWithValue(err.response?.data?.error || 'Erro'); }
});

export const clearHotbarSlot = createAsyncThunk('hotbar/clearSlot', async ({ charId, slotIndex }, { rejectWithValue }) => {
  try { const r = await api.clearHotbarSlot(charId, slotIndex); return r.data || r; } catch (err) { return rejectWithValue(err.response?.data?.error || 'Erro'); }
});

const hotbarSlice = createSlice({
  name: 'hotbar',
  initialState: {
    slots: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHotbar.pending, (state) => { state.loading = true; })
      .addCase(fetchHotbar.fulfilled, (state, action) => {
        state.loading = false;
        state.slots = action.payload;
      })
      .addCase(fetchHotbar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(setHotbarSlot.fulfilled, (state, action) => {
        state.slots = action.payload;
      })
      .addCase(clearHotbarSlot.fulfilled, (state, action) => {
        state.slots = action.payload;
      });
  },
});

export default hotbarSlice.reducer;
