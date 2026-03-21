import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../services/api';

export const startCombat = createAsyncThunk(
  'combat/start',
  async ({ charId, mobId }, { rejectWithValue }) => {
    try {
      const r = await api.startCombat(charId, mobId);
      return r.data || r;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Erro ao iniciar combate');
    }
  }
);

export const executeCombatAction = createAsyncThunk(
  'combat/action',
  async ({ charId, combatState, action }, { rejectWithValue }) => {
    try {
      const r = await api.combatTurn(charId, combatState, action);
      return r.data || r;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Erro na acao de combate');
    }
  }
);

const combatSlice = createSlice({
  name: 'combat',
  initialState: {
    active: false,
    state: null,
    log: [],
    result: null,
    animating: false,
    loading: false,
    error: null,
  },
  reducers: {
    resetCombat: (state) => {
      state.active = false;
      state.state = null;
      state.log = [];
      state.result = null;
      state.animating = false;
      state.error = null;
    },
    setAnimating: (state, action) => {
      state.animating = action.payload;
    },
    addLogEntry: (state, action) => {
      state.log.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startCombat.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.log = [];
        state.result = null;
      })
      .addCase(startCombat.fulfilled, (state, action) => {
        state.loading = false;
        state.active = true;
        state.state = action.payload;
        state.log = action.payload.log || [];
      })
      .addCase(startCombat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(executeCombatAction.pending, (state) => {
        state.animating = true;
      })
      .addCase(executeCombatAction.fulfilled, (state, action) => {
        state.animating = false;
        state.state = action.payload;
        if (action.payload.log) {
          state.log = [...state.log, ...action.payload.log];
        }
        if (action.payload.result) {
          state.result = action.payload.result;
          state.active = false;
        }
      })
      .addCase(executeCombatAction.rejected, (state, action) => {
        state.animating = false;
        state.error = action.payload;
      });
  },
});

export const { resetCombat, setAnimating, addLogEntry } = combatSlice.actions;
export default combatSlice.reducer;
