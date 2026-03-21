import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../services/api';

export const fetchKingdoms = createAsyncThunk('game/fetchKingdoms', async (_, { rejectWithValue }) => {
  try { const r = await api.getKingdoms(); return r.data || r; } catch (err) { return rejectWithValue(err.response?.data?.error || 'Erro'); }
});

export const fetchClasses = createAsyncThunk('game/fetchClasses', async (_, { rejectWithValue }) => {
  try { const r = await api.getClasses(); return r.data || r; } catch (err) { return rejectWithValue(err.response?.data?.error || 'Erro'); }
});

export const fetchAreas = createAsyncThunk('game/fetchAreas', async (_, { rejectWithValue }) => {
  try { const r = await api.getAreas(); return r.data || r; } catch (err) { return rejectWithValue(err.response?.data?.error || 'Erro'); }
});

export const fetchAreaDetails = createAsyncThunk('game/fetchAreaDetails', async (areaId, { rejectWithValue }) => {
  try { const r = await api.getAreaDetails(areaId); return r.data || r; } catch (err) { return rejectWithValue(err.response?.data?.error || 'Erro'); }
});

export const startIdleSession = createAsyncThunk('game/startIdle', async ({ charId, data }, { rejectWithValue }) => {
  try { return await api.startIdleSession(charId, data); } catch (err) { return rejectWithValue(err.response?.data?.message || 'Erro'); }
});

export const checkIdleSession = createAsyncThunk('game/checkIdle', async (charId, { rejectWithValue }) => {
  try { return await api.checkIdleSession(charId); } catch (err) { return rejectWithValue(err.response?.data?.message || 'Erro'); }
});

export const collectIdleResults = createAsyncThunk('game/collectIdle', async (charId, { rejectWithValue }) => {
  try { return await api.collectIdleResults(charId); } catch (err) { return rejectWithValue(err.response?.data?.message || 'Erro'); }
});

export const performLifeskill = createAsyncThunk('game/performLifeskill', async ({ charId, type, areaId }, { rejectWithValue }) => {
  try { return await api.performLifeskill(charId, type, areaId); } catch (err) { return rejectWithValue(err.response?.data?.error || err.response?.data?.message || 'Erro'); }
});

export const fetchLifeskills = createAsyncThunk('game/fetchLifeskills', async (charId, { rejectWithValue }) => {
  try { return await api.getLifeskills(charId); } catch (err) { return rejectWithValue(err.response?.data?.message || 'Erro'); }
});

const gameSlice = createSlice({
  name: 'game',
  initialState: {
    kingdoms: [],
    classes: [],
    areas: [],
    areaDetails: null,
    lifeskills: null,
    idleSession: null,
    idleResults: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearIdleResults: (state) => {
      state.idleResults = null;
    },
    clearAreaDetails: (state) => {
      state.areaDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchKingdoms.fulfilled, (state, action) => { state.kingdoms = action.payload; })
      .addCase(fetchClasses.fulfilled, (state, action) => { state.classes = action.payload; })
      .addCase(fetchAreas.pending, (state) => { state.loading = true; })
      .addCase(fetchAreas.fulfilled, (state, action) => { state.loading = false; state.areas = action.payload; })
      .addCase(fetchAreas.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchAreaDetails.fulfilled, (state, action) => { state.areaDetails = action.payload; })
      .addCase(startIdleSession.fulfilled, (state, action) => { state.idleSession = action.payload; })
      .addCase(checkIdleSession.fulfilled, (state, action) => { state.idleSession = action.payload; })
      .addCase(collectIdleResults.fulfilled, (state, action) => {
        state.idleResults = action.payload;
        state.idleSession = null;
      })
      .addCase(performLifeskill.fulfilled, (state, action) => {
        state.lifeskills = action.payload.lifeskills || state.lifeskills;
      })
      .addCase(fetchLifeskills.fulfilled, (state, action) => { state.lifeskills = action.payload; });
  },
});

export const { clearIdleResults, clearAreaDetails } = gameSlice.actions;
export default gameSlice.reducer;
