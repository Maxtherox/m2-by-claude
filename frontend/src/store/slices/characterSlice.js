import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../services/api';

export const createCharacter = createAsyncThunk(
  'character/create',
  async (data, { rejectWithValue }) => {
    try {
      const result = await api.createCharacter(data);
      return result.data || result;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Erro ao criar personagem');
    }
  }
);

export const loadCharacter = createAsyncThunk(
  'character/load',
  async (id, { rejectWithValue }) => {
    try {
      const result = await api.getCharacter(id);
      return result.data || result;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Personagem nao encontrado');
    }
  }
);

export const allocatePoints = createAsyncThunk(
  'character/allocatePoints',
  async ({ id, points }, { rejectWithValue }) => {
    try {
      const result = await api.allocatePoints(id, points);
      return result.data || result;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Erro ao alocar pontos');
    }
  }
);

export const healCharacter = createAsyncThunk(
  'character/heal',
  async (id, { rejectWithValue }) => {
    try {
      const result = await api.healCharacter(id);
      return result.data || result;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Erro ao curar');
    }
  }
);

const characterSlice = createSlice({
  name: 'character',
  initialState: {
    data: null,
    loading: false,
    error: null,
    created: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCreated: (state) => {
      state.created = false;
    },
    updateCharacterData: (state, action) => {
      if (state.data) {
        state.data = { ...state.data, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createCharacter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCharacter.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.created = true;
      })
      .addCase(createCharacter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Load
      .addCase(loadCharacter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadCharacter.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(loadCharacter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Allocate
      .addCase(allocatePoints.pending, (state) => {
        state.loading = true;
      })
      .addCase(allocatePoints.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(allocatePoints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Heal
      .addCase(healCharacter.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(healCharacter.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCreated, updateCharacterData } = characterSlice.actions;
export default characterSlice.reducer;
