import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../services/api';

export const fetchSaveSlots = createAsyncThunk('saves/fetchSlots', async (charId, { rejectWithValue }) => {
  try { const r = await api.getSaveSlots(charId); return r.data || r; } catch (err) { return rejectWithValue(err.response?.data?.error || 'Erro'); }
});

export const saveGame = createAsyncThunk('saves/save', async ({ charId, slotNumber, label }, { rejectWithValue }) => {
  try { const r = await api.saveGame(charId, slotNumber, label); return r.data || r; } catch (err) { return rejectWithValue(err.response?.data?.error || 'Erro'); }
});

export const loadGame = createAsyncThunk('saves/load', async ({ charId, slotNumber }, { rejectWithValue }) => {
  try { const r = await api.loadGame(charId, slotNumber); return r.data || r; } catch (err) { return rejectWithValue(err.response?.data?.error || 'Erro'); }
});

export const deleteSave = createAsyncThunk('saves/delete', async ({ charId, slotNumber }, { rejectWithValue }) => {
  try { const r = await api.deleteSave(charId, slotNumber); return r.data || r; } catch (err) { return rejectWithValue(err.response?.data?.error || 'Erro'); }
});

const saveSlice = createSlice({
  name: 'saves',
  initialState: {
    slots: [],
    loading: false,
    error: null,
    lastAction: null,
  },
  reducers: {
    clearSaveError: (state) => { state.error = null; },
    clearLastAction: (state) => { state.lastAction = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSaveSlots.pending, (state) => { state.loading = true; })
      .addCase(fetchSaveSlots.fulfilled, (state, action) => {
        state.loading = false;
        state.slots = action.payload;
      })
      .addCase(fetchSaveSlots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(saveGame.pending, (state) => { state.loading = true; })
      .addCase(saveGame.fulfilled, (state, action) => {
        state.loading = false;
        state.lastAction = { type: 'saved', data: action.payload };
        const idx = state.slots.findIndex(s => s.slot_number === action.payload.slot_number);
        if (idx >= 0) {
          state.slots[idx] = action.payload;
        } else {
          state.slots.push(action.payload);
        }
      })
      .addCase(saveGame.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loadGame.pending, (state) => { state.loading = true; })
      .addCase(loadGame.fulfilled, (state, action) => {
        state.loading = false;
        state.lastAction = { type: 'loaded', data: action.payload };
      })
      .addCase(loadGame.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteSave.fulfilled, (state, action) => {
        state.slots = state.slots.filter(s => s.slot_number !== action.payload.slot_number);
        state.lastAction = { type: 'deleted' };
      });
  },
});

export const { clearSaveError, clearLastAction } = saveSlice.actions;
export default saveSlice.reducer;
