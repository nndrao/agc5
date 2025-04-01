import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface GridState {
  // Column state
  columnState: any[];
  setColumnState: (state: any[]) => void;
  
  // Grid settings
  settings: any;
  setSettings: (settings: any) => void;
  
  // Filter and sort state
  filterModel: any;
  setFilterModel: (model: any) => void;
  sortModel: any;
  setSortModel: (model: any) => void;
  
  // Column settings dialog state
  isColumnSettingsOpen: boolean;
  setColumnSettingsOpen: (open: boolean) => void;
  
  // Flags for state updates
  isApplyingColumnChanges: boolean;
  setApplyingColumnChanges: (isApplying: boolean) => void;
}

export const useGridStore = create<GridState>()(
  devtools(
    (set) => ({
      // Initial state
      columnState: [],
      settings: {},
      filterModel: {},
      sortModel: [],
      isColumnSettingsOpen: false,
      isApplyingColumnChanges: false,
      
      // Actions
      setColumnState: (state) => set({ columnState: state }),
      setSettings: (settings) => set({ settings }),
      setFilterModel: (model) => set({ filterModel: model }),
      setSortModel: (model) => set({ sortModel: model }),
      setColumnSettingsOpen: (open) => set({ isColumnSettingsOpen: open }),
      setApplyingColumnChanges: (isApplying) => set({ isApplyingColumnChanges: isApplying }),
    }),
    {
      name: 'grid-store',
    }
  )
); 