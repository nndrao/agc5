# AG Grid React Documentation Resources

## Core Documentation
- [Main React Documentation](https://www.ag-grid.com/react-data-grid/)
- [Getting Started with React](https://www.ag-grid.com/react-data-grid/getting-started/)
- [React Hooks API](https://www.ag-grid.com/react-data-grid/hooks/)

## Grid Features
- [Column Definitions](https://www.ag-grid.com/react-data-grid/column-definitions/)
- [Row Data](https://www.ag-grid.com/react-data-grid/row-data/)
- [Grid API](https://www.ag-grid.com/react-data-grid/grid-api/)
- [Column API](https://www.ag-grid.com/react-data-grid/column-api/)

## Component Customization
- [Cell Rendering](https://www.ag-grid.com/react-data-grid/component-cell-renderer/)
- [Cell Editing](https://www.ag-grid.com/react-data-grid/component-cell-editor/)
- [Filter Components](https://www.ag-grid.com/react-data-grid/component-filter/)
- [Header Components](https://www.ag-grid.com/react-data-grid/component-header/)

## Data Operations
- [Sorting](https://www.ag-grid.com/react-data-grid/row-sorting/)
- [Filtering](https://www.ag-grid.com/react-data-grid/filtering/)
- [Pagination](https://www.ag-grid.com/react-data-grid/server-side-model-pagination/)
- [Row Selection](https://www.ag-grid.com/react-data-grid/row-selection/)

## Enterprise Features
- [Enterprise Overview](https://www.ag-grid.com/react-data-grid/licensing/)
- [Row Grouping](https://www.ag-grid.com/react-data-grid/grouping/)
- [Aggregation](https://www.ag-grid.com/react-data-grid/aggregation/)
- [Tree Data](https://www.ag-grid.com/react-data-grid/tree-data/)
- [Master Detail](https://www.ag-grid.com/react-data-grid/master-detail/)
- [Excel Export](https://www.ag-grid.com/react-data-grid/excel-export/)
- [Clipboard](https://www.ag-grid.com/react-data-grid/clipboard/)

## Performance
- [Row Models](https://www.ag-grid.com/react-data-grid/row-models/)
- [Server-Side Model](https://www.ag-grid.com/react-data-grid/server-side-model/)
- [Infinite Scrolling](https://www.ag-grid.com/react-data-grid/infinite-scrolling/)
- [Change Detection](https://www.ag-grid.com/react-data-grid/change-detection/)

## Theming & Styling

### Core Theming
- [Main Theming Documentation](https://www.ag-grid.com/react-data-grid/themes/)
- [Provided Themes](https://www.ag-grid.com/react-data-grid/themes-provided/)
- [Theme Designer](https://www.ag-grid.com/react-data-grid/themes-customising/)

### CSS Customization
- [Global Styling](https://www.ag-grid.com/react-data-grid/global-style-customisation/)
- [SASS Variables](https://www.ag-grid.com/react-data-grid/sass-variables/)
- [CSS Variables](https://www.ag-grid.com/react-data-grid/css-variables/)

### Component-Specific Styling
- [Cell Styling](https://www.ag-grid.com/react-data-grid/cell-styles/)
- [Row Styling](https://www.ag-grid.com/react-data-grid/row-styles/)
- [Header Styling](https://www.ag-grid.com/react-data-grid/header-rendering/)
- [Column Groups Styling](https://www.ag-grid.com/react-data-grid/column-groups/)

### Dynamic Styling
- [Cell Class Rules](https://www.ag-grid.com/react-data-grid/cell-styles/#cell-class-rules)
- [Row Class Rules](https://www.ag-grid.com/react-data-grid/row-styles/#row-class-rules)
- [Cell Style Callback](https://www.ag-grid.com/react-data-grid/cell-styles/#cell-style-cell-class)

### Enterprise Components Styling
- [Sidebar Styling](https://www.ag-grid.com/react-data-grid/side-bar/)
- [Status Bar Styling](https://www.ag-grid.com/react-data-grid/status-bar/)
- [Column Menu Styling](https://www.ag-grid.com/react-data-grid/column-menu/)
- [Context Menu Styling](https://www.ag-grid.com/react-data-grid/context-menu/)

### Advanced Theming
- [Custom Theme Creation](https://www.ag-grid.com/react-data-grid/themes-customising/#creating-a-custom-theme)
- [Tailwind CSS Integration](https://www.ag-grid.com/react-data-grid/themes-customising/#tailwind-css-integration)
- [Dark Mode Support](https://www.ag-grid.com/react-data-grid/themes-customising/#dark-mode-support)

## Integration
- [TypeScript](https://www.ag-grid.com/react-data-grid/typescript-interface-definitions/)
- [Module Loading](https://www.ag-grid.com/react-data-grid/modules/)
- [React State Management](https://www.ag-grid.com/react-data-grid/redux-integration/)

## Examples & API Reference
- [Example Gallery](https://www.ag-grid.com/example-runner/)
- [Grid Properties](https://www.ag-grid.com/react-data-grid/grid-options/)
- [Column Properties](https://www.ag-grid.com/react-data-grid/column-properties/)
- [Grid API Reference](https://www.ag-grid.com/react-data-grid/grid-api-reference/)

## Support & Community
- [Support Portal](https://www.ag-grid.com/forum/)
- [Release Notes](https://www.ag-grid.com/changelog/)


## Starter code to implement ag-grid v33+ with parameters based theming
"use client";
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { ModuleRegistry, themeQuartz } from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";

ModuleRegistry.registerModules([AllEnterpriseModule]);

const theme = themeQuartz
  .withParams(
    {
      accentColor: "#8AAAA7",
      backgroundColor: "#F7F7F7",
      borderColor: "#23202029",
      browserColorScheme: "light",
      buttonBorderRadius: 2,
      cellTextColor: "#000000",
      checkboxBorderRadius: 2,
      columnBorder: true,
      fontFamily: {
        googleFont: "Inter",
      },
      fontSize: 14,
      headerBackgroundColor: "#EFEFEFD6",
      headerFontFamily: {
        googleFont: "Inter",
      },
      headerFontSize: 14,
      headerFontWeight: 500,
      iconButtonBorderRadius: 1,
      iconSize: 12,
      inputBorderRadius: 2,
      oddRowBackgroundColor: "#EEF1F1E8",
      spacing: 6,
      wrapperBorderRadius: 2,
    },
    "light"
  )
  .withParams(
    {
      accentColor: "#8AAAA7",
      backgroundColor: "#1f2836",
      borderRadius: 2,
      checkboxBorderRadius: 2,
      columnBorder: true,
      fontFamily: {
        googleFont: "Inter",
      },
      browserColorScheme: "dark",
      chromeBackgroundColor: {
        ref: "foregroundColor",
        mix: 0.07,
        onto: "backgroundColor",
      },
      columnBorder: true,
      fontSize: 14,
      foregroundColor: "#FFF",
      headerFontFamily: {
        googleFont: "Inter",
      },
      headerFontSize: 14,
      iconSize: 12,
      inputBorderRadius: 2,
      oddRowBackgroundColor: "#2A2E35",
      spacing: 6,
      wrapperBorderRadius: 2,
    },
    "dark"
  );

const GridExample = () => {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <p style={{ flex: 0 }}>
        <label>
          Dark mode:{" "}
          <input
            type="checkbox"
            onChange={(e) => setDarkMode(e.target.checked)}
          />
        </label>
      </p>
      <div style={{ flex: 1 }}>
        <AgGridReact
          theme={theme}
          columnDefs={columnDefs}
          rowData={rowData}
          defaultColDef={defaultColDef}
          sideBar
        />
      </div>
    </div>
  );
};

function setDarkMode(enabled: boolean) {
  document.body.dataset.agThemeMode = enabled ? "dark" : "light";
}
setDarkMode(false);

const rowData: any[] = (() => {
  const rowData: any[] = [];
  for (let i = 0; i < 10; i++) {
    rowData.push({ make: "Toyota", model: "Celica", price: 35000 + i * 1000 });
    rowData.push({ make: "Ford", model: "Mondeo", price: 32000 + i * 1000 });
    rowData.push({
      make: "Porsche",
      model: "Boxster",
      price: 72000 + i * 1000,
    });
  }
  return rowData;
})();

const columnDefs = [{ field: "make" }, { field: "model" }, { field: "price" }];

const defaultColDef = {
  flex: 1,
  minWidth: 100,
  filter: true,
  enableValue: true,
  enableRowGroup: true,
  enablePivot: true,
};

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>
);

