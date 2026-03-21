import { configureStore } from '@reduxjs/toolkit';
import characterReducer from './slices/characterSlice';
import inventoryReducer from './slices/inventorySlice';
import combatReducer from './slices/combatSlice';
import uiReducer from './slices/uiSlice';
import gameReducer from './slices/gameSlice';
import skillReducer from './slices/skillSlice';

export const store = configureStore({
  reducer: {
    character: characterReducer,
    inventory: inventoryReducer,
    combat: combatReducer,
    ui: uiReducer,
    game: gameReducer,
    skills: skillReducer,
  },
});
