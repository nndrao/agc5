export interface ColumnDefinition {
  id: string;
  field: string;
  headerName?: string;
  children: ColumnDefinition[];
  hidden?: boolean;
}

export interface ColumnState {
  visible: boolean;
  width: number;
  pinned: string | null;
  sort: string | null;
  position: number;
  headerName: string;
  field: string;
  filter: boolean;
  resizable: boolean;
  sortable: boolean;
  headerAlignment: string;
  cellAlignment: string;
}