import { ColumnState, ColDef } from 'ag-grid-community';

// Border style properties
export interface BorderStyle {
  width?: string;
  style?: 'none' | 'solid' | 'dashed' | 'dotted' | 'double';
  color?: string;
}

// Border sides properties
export interface BorderSides {
  top?: BorderStyle;
  right?: BorderStyle;
  bottom?: BorderStyle;
  left?: BorderStyle;
}

// Cell style properties
export interface CellStyleProperties {
  backgroundColor?: string;
  color?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  fontStyle?: string;
  textAlign?: 'left' | 'center' | 'right';
  padding?: string;
  borderRadius?: string;
  border?: string;
  borderTop?: string;
  borderRight?: string;
  borderBottom?: string;
  borderLeft?: string;
}

// Extended column state that includes additional styling and formatting properties
export interface ExtendedColumnState extends ColumnState {
  // Header styling
  headerName?: string;
  headerAlignment?: 'left' | 'center' | 'right';
  headerBackgroundColor?: string;
  headerTextColor?: string;
  headerFontFamily?: string;
  headerFontSize?: number;
  headerFontWeight?: string;
  headerFontStyle?: string;
  headerBorderTop?: BorderStyle;
  headerBorderRight?: BorderStyle;
  headerBorderBottom?: BorderStyle;
  headerBorderLeft?: BorderStyle;

  // Cell styling
  cellAlignment?: 'left' | 'center' | 'right';
  cellBackgroundColor?: string;
  cellTextColor?: string;
  cellFontFamily?: string;
  cellFontSize?: number;
  cellFontWeight?: string;
  cellFontStyle?: string;
  cellBorderTop?: BorderStyle;
  cellBorderRight?: BorderStyle;
  cellBorderBottom?: BorderStyle;
  cellBorderLeft?: BorderStyle;

  // Formatting
  numberFormat?: 'none' | 'currency' | 'percentage' | 'decimal' | 'integer';
  decimalPlaces?: number;
  currencySymbol?: string;
  dateFormat?: 'none' | 'short' | 'medium' | 'long' | 'iso';
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';

  // Component settings
  cellRenderer?: string;
  cellEditor?: string;
  customRenderer?: string;
  editorOptions?: string;
  customComponent?: string;
  componentProps?: string;

  // Additional properties
  editable?: boolean;
  filter?: boolean | string;
  sortable?: boolean;
  resizable?: boolean;
  pinned?: 'left' | 'right' | null;
  rowGroup?: boolean;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  flex?: number;
  hide?: boolean;
  valueFormatter?: string;
  valueFormatterPattern?: string;
  cellEditorParams?: {
    values?: string[];
    [key: string]: unknown;
  };
}

// Type for column definition updates
export type ColumnDefinitionUpdate = Partial<ColDef>;

// Type for column state updates
export type ColumnStateUpdate = Partial<ExtendedColumnState>;

// Type for column group updates
export type ColumnGroupUpdate = {
  groupId: string;
  updates: ColumnStateUpdate;
}; 