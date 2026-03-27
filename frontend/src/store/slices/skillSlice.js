import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../services/api';

export const fetchClassSkills = createAsyncThunk('skills/fetchClass', async (classId, { rejectWithValue }) => {
  try { const r = await api.getClassSkills(classId); return r.data || r; } catch (err) { return rejectWithValue(err.response?.data?.error || 'Erro'); }
});

export const fetchCharacterSkills = createAsyncThunk('skills/fetchCharacter', async (charId, { rejectWithValue }) => {
  try { const r = await api.getCharacterSkills(charId); return r.data || r; } catch (err) { return rejectWithValue(err.response?.data?.error || 'Erro'); }
});

export const learnSkill = createAsyncThunk('skills/learn', async ({ charId, skillId }, { rejectWithValue }) => {
  try { const r = await api.learnSkill(charId, skillId); return r.data || r; } catch (err) { return rejectWithValue(err.response?.data?.error || 'Erro'); }
});

export const upgradeSkill = createAsyncThunk('skills/upgrade', async ({ charId, skillId }, { rejectWithValue }) => {
  try { const r = await api.upgradeSkill(charId, skillId); return r.data || r; } catch (err) { return rejectWithValue(err.response?.data?.error || 'Erro'); }
});

export const readSkillBook = createAsyncThunk('skills/readBook', async ({ charId, skillId }, { rejectWithValue }) => {
  try { const r = await api.readSkillBook(charId, skillId); return r.data || r; } catch (err) { return rejectWithValue(err.response?.data?.error || 'Erro'); }
});

export const useSpiritStone = createAsyncThunk('skills/spiritStone', async ({ charId, skillId }, { rejectWithValue }) => {
  try { const r = await api.useSpiritStone(charId, skillId); return r.data || r; } catch (err) { return rejectWithValue(err.response?.data?.error || 'Erro'); }
});

const skillSlice = createSlice({
  name: 'skills',
  initialState: {
    classSkills: [],
    characterSkills: [],
    loading: false,
    error: null,
    lastProgressionResult: null,
  },
  reducers: {
    clearProgressionResult: (state) => {
      state.lastProgressionResult = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClassSkills.pending, (state) => { state.loading = true; })
      .addCase(fetchClassSkills.fulfilled, (state, action) => {
        state.loading = false;
        state.classSkills = action.payload;
      })
      .addCase(fetchClassSkills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCharacterSkills.fulfilled, (state, action) => {
        state.characterSkills = action.payload;
      })
      .addCase(learnSkill.fulfilled, (state, action) => {
        state.characterSkills = action.payload.skills || action.payload;
      })
      .addCase(upgradeSkill.fulfilled, (state, action) => {
        state.characterSkills = action.payload.skills || action.payload;
      })
      .addCase(readSkillBook.fulfilled, (state, action) => {
        state.lastProgressionResult = action.payload;
      })
      .addCase(readSkillBook.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(useSpiritStone.fulfilled, (state, action) => {
        state.lastProgressionResult = action.payload;
      })
      .addCase(useSpiritStone.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearProgressionResult } = skillSlice.actions;
export default skillSlice.reducer;
