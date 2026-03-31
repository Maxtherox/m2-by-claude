import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../services/api';

export const fetchInventory = createAsyncThunk(
  'inventory/fetch',
  async (charId, { rejectWithValue }) => {
    try {
      const r = await api.getInventory(charId);
      return r.data || r;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Erro ao carregar inventario');
    }
  }
);

export const equipItem = createAsyncThunk(
  'inventory/equip',
  async ({ charId, invId }, { rejectWithValue }) => {
    try {
      return await api.equipItem(charId, invId);
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Erro ao equipar');
    }
  }
);

export const unequipItem = createAsyncThunk(
  'inventory/unequip',
  async ({ charId, invId }, { rejectWithValue }) => {
    try {
      return await api.unequipItem(charId, invId);
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Erro ao desequipar');
    }
  }
);

export const sellItem = createAsyncThunk(
  'inventory/sell',
  async ({ charId, invId, quantity }, { rejectWithValue }) => {
    try {
      return await api.sellItem(charId, invId, quantity);
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Erro ao vender');
    }
  }
);

export const useItem = createAsyncThunk(
  'inventory/use',
  async ({ charId, invId }, { rejectWithValue }) => {
    try {
      return await api.useItem(charId, invId);
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Erro ao usar item');
    }
  }
);

const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    items: [],
    equipment: {},
    selectedItem: null,
    loading: false,
    error: null,
  },
  reducers: {
    selectItem: (state, action) => {
      state.selectedItem = action.payload;
    },
    clearSelectedItem: (state) => {
      state.selectedItem = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload;
        state.items = Array.isArray(data) ? data : (data.items || []);
        state.equipment = data.equipment || {};
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(equipItem.fulfilled, (state, action) => {
        state.items = action.payload.items || state.items;
        state.equipment = action.payload.equipment || state.equipment;
        state.selectedItem = null;
      })
      .addCase(unequipItem.fulfilled, (state, action) => {
        state.items = action.payload.items || state.items;
        state.equipment = action.payload.equipment || state.equipment;
      })
      .addCase(sellItem.fulfilled, (state, action) => {
        state.items = action.payload.items || state.items;
        state.selectedItem = null;
      })
      .addCase(useItem.fulfilled, (state, action) => {
        state.items = action.payload.items || state.items;
        state.selectedItem = null;
      });
  },
});

export const { selectItem, clearSelectedItem } = inventorySlice.actions;
export default inventorySlice.reducer;
