import { configureStore } from '@reduxjs/toolkit';
import characterReducer from './slices/characterSlice';
import inventoryReducer from './slices/inventorySlice';
import combatReducer from './slices/combatSlice';
import uiReducer from './slices/uiSlice';
import gameReducer from './slices/gameSlice';
import skillReducer from './slices/skillSlice';
import questReducer from './slices/questSlice';
import dungeonReducer from './slices/dungeonSlice';
import hotbarReducer from './slices/hotbarSlice';
import saveReducer from './slices/saveSlice';

export const store = configureStore({
  reducer: {
    character: characterReducer,
    inventory: inventoryReducer,
    combat: combatReducer,
    ui: uiReducer,
    game: gameReducer,
    skills: skillReducer,
    quests: questReducer,
    dungeons: dungeonReducer,
    hotbar: hotbarReducer,
    saves: saveReducer,
  },
});
