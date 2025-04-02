import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { GridApi, ColumnState, FilterModel } from 'ag-grid-community';
import { ExtendedColumnState } from '../ColumnSettings/types';

interface GridSettings {
  [key: string]: unknown;
}

interface SortModel {
  colId: string;
  sort: 'asc' | 'desc' | null;
}

interface GridState {
  // Grid API
  gridApi: GridApi | null;
  setGridApi: (api: GridApi) => void;
  
  // Column State
  columnState: ExtendedColumnState[];
  setColumnState: (state: ExtendedColumnState[]) => void;
  isApplyingColumnChanges: boolean;
  setApplyingColumnChanges: (isApplying: boolean) => void;
  
  // Grid settings
  settings: GridSettings;
  setSettings: (settings: GridSettings) => void;
  
  // Filter and sort state
  filterModel: FilterModel;
  setFilterModel: (model: FilterModel) => void;
  sortModel: SortModel[];
  setSortModel: (model: SortModel[]) => void;
  
  // Column settings dialog state
  isColumnSettingsOpen: boolean;
  setColumnSettingsOpen: (open: boolean) => void;
  selectedColumnId: string | null;
  setSelectedColumnId: (id: string | null) => void;
}

export const useGridStore = create<GridState>()(
  devtools(
    (set) => ({
      // Grid API
      gridApi: null,
      setGridApi: (api) => set({ gridApi: api }),
      
      // Column State
      columnState: [],
      setColumnState: (state) => set({ columnState: state }),
      isApplyingColumnChanges: false,
      setApplyingColumnChanges: (isApplying) => set({ isApplyingColumnChanges: isApplying }),
      
      // Grid settings
      settings: {},
      setSettings: (settings) => set({ settings }),
      
      // Filter and sort state
      filterModel: {},
      setFilterModel: (model) => set({ filterModel: model }),
      sortModel: [],
      setSortModel: (model) => set({ sortModel: model }),
      
      // Column settings dialog state
      isColumnSettingsOpen: false,
      setColumnSettingsOpen: (open) => set({ isColumnSettingsOpen: open }),
      selectedColumnId: null,
      setSelectedColumnId: (id) => set({ selectedColumnId: id }),
    }),
    { name: 'grid-store' }
  )
); 