import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    activePanel: null,
    activeNpc: null,
    activeMob: null,
    killedMobInstanceId: null,
    tooltip: null,
    notifications: [],
    modal: null,
  },
  reducers: {
    setActivePanel: (state, action) => {
      const nextPanel = state.activePanel === action.payload ? null : action.payload;
      state.activePanel = nextPanel;

      if (nextPanel !== 'combat') {
        state.activeMob = null;
      }

      if (!['npc', 'shop', 'blacksmith', 'healer', 'trainer', 'storage', 'dialog'].includes(nextPanel)) {
        state.activeNpc = null;
      }
    },
    closePanel: (state) => {
      state.activePanel = null;
      state.activeNpc = null;
      state.activeMob = null;
    },
    setActiveNpc: (state, action) => {
      state.activeNpc = action.payload;
      state.activePanel = 'npc';
    },
    setActiveMob: (state, action) => {
      state.activeMob = action.payload;
      state.activePanel = 'combat';
    },
    clearActiveMob: (state) => {
      state.activeMob = null;
      if (state.activePanel === 'combat') {
        state.activePanel = null;
      }
    },
    closeNpc: (state) => {
      state.activeNpc = null;
      if (state.activePanel === 'npc' || state.activePanel === 'shop' ||
          state.activePanel === 'blacksmith' || state.activePanel === 'healer' ||
          state.activePanel === 'trainer' || state.activePanel === 'storage' ||
          state.activePanel === 'dialog') {
        state.activePanel = null;
      }
    },
    showTooltip: (state, action) => {
      state.tooltip = action.payload;
    },
    hideTooltip: (state) => {
      state.tooltip = null;
    },
    addNotification: (state, action) => {
      const id = Date.now() + Math.random();
      state.notifications.push({ id, ...action.payload });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },
    setModal: (state, action) => {
      state.modal = action.payload;
    },
    closeModal: (state) => {
      state.modal = null;
    },
    setKilledMobInstanceId: (state, action) => {
      state.killedMobInstanceId = action.payload;
    },
    clearKilledMobInstanceId: (state) => {
      state.killedMobInstanceId = null;
    },
  },
});

export const {
  setActivePanel,
  closePanel,
  setActiveNpc,
  setActiveMob,
  clearActiveMob,
  closeNpc,
  showTooltip,
  hideTooltip,
  addNotification,
  removeNotification,
  setModal,
  closeModal,
  setKilledMobInstanceId,
  clearKilledMobInstanceId,
} = uiSlice.actions;
export default uiSlice.reducer;
