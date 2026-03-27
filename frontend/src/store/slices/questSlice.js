import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../services/api';

export const fetchAvailableQuests = createAsyncThunk('quests/fetchAvailable', async (charId, { rejectWithValue }) => {
  try { const r = await api.getAvailableQuests(charId); return r.data || r; } catch (err) { return rejectWithValue(err.response?.data?.error || 'Erro'); }
});

export const fetchActiveQuests = createAsyncThunk('quests/fetchActive', async (charId, { rejectWithValue }) => {
  try { const r = await api.getActiveQuests(charId); return r.data || r; } catch (err) { return rejectWithValue(err.response?.data?.error || 'Erro'); }
});

export const fetchCompletedQuests = createAsyncThunk('quests/fetchCompleted', async (charId, { rejectWithValue }) => {
  try { const r = await api.getCompletedQuests(charId); return r.data || r; } catch (err) { return rejectWithValue(err.response?.data?.error || 'Erro'); }
});

export const acceptQuest = createAsyncThunk('quests/accept', async ({ charId, questId }, { rejectWithValue }) => {
  try { const r = await api.acceptQuest(charId, questId); return r.data || r; } catch (err) { return rejectWithValue(err.response?.data?.error || 'Erro'); }
});

export const turnInQuest = createAsyncThunk('quests/turnIn', async ({ charId, questId }, { rejectWithValue }) => {
  try { const r = await api.turnInQuest(charId, questId); return r.data || r; } catch (err) { return rejectWithValue(err.response?.data?.error || 'Erro'); }
});

export const abandonQuest = createAsyncThunk('quests/abandon', async ({ charId, questId }, { rejectWithValue }) => {
  try { const r = await api.abandonQuest(charId, questId); return r.data || r; } catch (err) { return rejectWithValue(err.response?.data?.error || 'Erro'); }
});

const questSlice = createSlice({
  name: 'quests',
  initialState: {
    available: [],
    active: [],
    completed: [],
    loading: false,
    error: null,
    lastReward: null,
  },
  reducers: {
    clearQuestError: (state) => { state.error = null; },
    clearLastReward: (state) => { state.lastReward = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAvailableQuests.pending, (state) => { state.loading = true; })
      .addCase(fetchAvailableQuests.fulfilled, (state, action) => {
        state.loading = false;
        state.available = action.payload;
      })
      .addCase(fetchAvailableQuests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchActiveQuests.fulfilled, (state, action) => {
        state.active = action.payload;
      })
      .addCase(fetchCompletedQuests.fulfilled, (state, action) => {
        state.completed = action.payload;
      })
      .addCase(acceptQuest.fulfilled, (state, action) => {
        state.active.push(action.payload);
        state.available = state.available.filter(q => q.id !== action.payload.id);
      })
      .addCase(acceptQuest.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(turnInQuest.fulfilled, (state, action) => {
        state.active = state.active.filter(q => q.id !== action.payload.quest_id);
        state.lastReward = action.payload.rewards;
      })
      .addCase(turnInQuest.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(abandonQuest.fulfilled, (state, action) => {
        state.active = state.active.filter(q => q.id !== action.payload.quest_id);
      });
  },
});

export const { clearQuestError, clearLastReward } = questSlice.actions;
export default questSlice.reducer;
