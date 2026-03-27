import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../services/api';

export const fetchDungeons = createAsyncThunk('dungeons/fetchAll', async (_, { rejectWithValue }) => {
  try { const r = await api.getDungeons(); return r.data || r; } catch (err) { return rejectWithValue(err.response?.data?.error || 'Erro'); }
});

export const fetchDungeonDetails = createAsyncThunk('dungeons/fetchDetails', async (id, { rejectWithValue }) => {
  try { const r = await api.getDungeonDetails(id); return r.data || r; } catch (err) { return rejectWithValue(err.response?.data?.error || 'Erro'); }
});

export const startDungeonRun = createAsyncThunk('dungeons/startRun', async ({ charId, dungeonId }, { rejectWithValue }) => {
  try { const r = await api.startDungeonRun(charId, dungeonId); return r.data || r; } catch (err) { return rejectWithValue(err.response?.data?.error || 'Erro'); }
});

export const fetchCurrentRun = createAsyncThunk('dungeons/fetchCurrentRun', async (charId, { rejectWithValue }) => {
  try { const r = await api.getCurrentDungeonRun(charId); return r.data || r; } catch (err) { return rejectWithValue(err.response?.data?.error || 'Erro'); }
});

export const advanceFloor = createAsyncThunk('dungeons/advanceFloor', async (charId, { rejectWithValue }) => {
  try { const r = await api.advanceDungeonFloor(charId); return r.data || r; } catch (err) { return rejectWithValue(err.response?.data?.error || 'Erro'); }
});

export const abandonRun = createAsyncThunk('dungeons/abandonRun', async (charId, { rejectWithValue }) => {
  try { const r = await api.abandonDungeonRun(charId); return r.data || r; } catch (err) { return rejectWithValue(err.response?.data?.error || 'Erro'); }
});

const dungeonSlice = createSlice({
  name: 'dungeons',
  initialState: {
    list: [],
    selectedDungeon: null,
    currentRun: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearDungeonError: (state) => { state.error = null; },
    clearSelectedDungeon: (state) => { state.selectedDungeon = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDungeons.pending, (state) => { state.loading = true; })
      .addCase(fetchDungeons.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchDungeons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchDungeonDetails.fulfilled, (state, action) => {
        state.selectedDungeon = action.payload;
      })
      .addCase(startDungeonRun.pending, (state) => { state.loading = true; })
      .addCase(startDungeonRun.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRun = action.payload;
      })
      .addCase(startDungeonRun.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCurrentRun.fulfilled, (state, action) => {
        state.currentRun = action.payload;
      })
      .addCase(advanceFloor.fulfilled, (state, action) => {
        state.currentRun = action.payload;
      })
      .addCase(advanceFloor.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(abandonRun.fulfilled, (state) => {
        state.currentRun = null;
      });
  },
});

export const { clearDungeonError, clearSelectedDungeon } = dungeonSlice.actions;
export default dungeonSlice.reducer;
