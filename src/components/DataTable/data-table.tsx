import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  Download,
  Upload,
  Filter,
  Type,
  Check,
  ChevronsUpDown,
  Settings,
  Save,
  Copy,
  FileInput,
  FileOutput,
  Keyboard,
  Monitor,
  Moon,
  Sun,
  Laptop,
  Sliders,
  Columns,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { GeneralSettingsDialog } from "./Settings/GeneralSettingsDialog";
import { ColumnSettingsDialog } from "./Settings/ColumnSettings/ColumnSettingsDialog";

import { ModuleRegistry, themeQuartz } from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";

ModuleRegistry.registerModules([AllEnterpriseModule]);

const monospacefonts = [
  { name: "JetBrains Mono", value: "'JetBrains Mono', monospace" },
  { name: "Fira Code", value: "'Fira Code', monospace" },
  { name: "Source Code Pro", value: "'Source Code Pro', monospace" },
  { name: "IBM Plex Mono", value: "'IBM Plex Mono', monospace" },
  { name: "Roboto Mono", value: "'Roboto Mono', monospace" },
];

interface DataTableProps<TData, TValue> {
  columns: any[];
  data: TData[];
}

export function DataTable<TData, TValue>({ data }: DataTableProps<TData, TValue>) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { theme: currentTheme, setTheme } = useTheme();
  const [selectedFont, setSelectedFont] = useState(monospacefonts[0]);
  const [gridTheme, setGridTheme] = useState(themeQuartz);
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [columnSettingsOpen, setColumnSettingsOpen] = useState(false);
  const gridRef = useRef<AgGridReact>(null);
  const [gridReady, setGridReady] = useState(false);

  useEffect(() => {
    setDarkMode(currentTheme === "dark");
    updateGridTheme(selectedFont.value);
  }, [currentTheme, selectedFont]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  function setDarkMode(enabled: boolean) {
    document.body.dataset.agThemeMode = enabled ? "dark" : "light";
  }

  function updateGridTheme(fontFamily: string) {
    const newTheme = themeQuartz
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
          fontFamily: fontFamily,
          fontSize: 14,
          headerBackgroundColor: "#EFEFEFD6",
          headerFontFamily: fontFamily,
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
          fontFamily: fontFamily,
          browserColorScheme: "dark",
          chromeBackgroundColor: {
            ref: "foregroundColor",
            mix: 0.07,
            onto: "backgroundColor",
          },
          columnBorder: true,
          fontSize: 14,
          foregroundColor: "#FFF",
          headerFontFamily: fontFamily,
          headerFontSize: 14,
          iconSize: 12,
          inputBorderRadius: 2,
          oddRowBackgroundColor: "#2A2E35",
          spacing: 6,
          wrapperBorderRadius: 2,
        },
        "dark"
      );
    setGridTheme(newTheme);
  }

  const rowData = (() => {
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

  const columnDefs = [
    { 
      field: "make",
      headerName: "Make",
      filter: true,
      sortable: true,
      resizable: true,
    }, 
    { 
      field: "model",
      headerName: "Model",
      filter: true,
      sortable: true,
      resizable: true,
    }, 
    { 
      field: "price",
      headerName: "Price",
      filter: true,
      sortable: true,
      resizable: true,
      valueFormatter: (params: any) => {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(params.value);
      },
    }
  ];

  const defaultColDef = {
    flex: 1,
    minWidth: 100,
    filter: true,
    enableValue: true,
    enableRowGroup: true,
    enablePivot: true,
  };

  const onGridReady = () => {
    setGridReady(true);
  };

  return (
    <div className="flex h-full flex-col rounded-md border bg-card">
      {/* Main Toolbar */}
      <div className="flex flex-col border-b bg-gray-50/50 dark:bg-gray-800/50">
        {/* Upper Toolbar */}
        <div className="flex h-[60px] items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Filter records..."
                className="w-[200px] pl-8 lg:w-[250px]"
              />
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Advanced filters</TooltipContent>
            </Tooltip>
          </div>

          <div className="flex items-center space-x-2">
            {/* Font Selector */}
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[200px] justify-between"
                >
                  <Type className="mr-2 h-4 w-4" />
                  {selectedFont.name}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command value={selectedFont.value} shouldFilter={false}>
                  <CommandInput placeholder="Search font..." />
                  <CommandEmpty>No font found.</CommandEmpty>
                  <CommandGroup>
                    {monospacefonts.map((font) => (
                      <CommandItem
                        key={font.value}
                        value={font.name.toLowerCase()}
                        onSelect={() => {
                          setSelectedFont(font);
                          document.documentElement.style.setProperty('--ag-font-family', font.value);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedFont.value === font.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        <span style={{ fontFamily: font.value }}>{font.name}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>

            <Separator orientation="vertical" className="h-8" />

            {/* Settings Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Settings</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setSettingsOpen(true)}>
                    <Sliders className="mr-2 h-4 w-4" />
                    <span>General Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setColumnSettingsOpen(true)}>
                    <Columns className="mr-2 h-4 w-4" />
                    <span>Column Settings</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />
                
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Save className="mr-2 h-4 w-4" />
                    <span>Save Layout</span>
                    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Copy className="mr-2 h-4 w-4" />
                    <span>Copy Layout</span>
                    <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <FileInput className="mr-2 h-4 w-4" />
                    <span>Import Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileOutput className="mr-2 h-4 w-4" />
                    <span>Export Settings</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuGroup>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <Monitor className="mr-2 h-4 w-4" />
                      <span>Theme</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem onClick={() => setTheme("light")}>
                          <Sun className="mr-2 h-4 w-4" />
                          <span>Light</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")}>
                          <Moon className="mr-2 h-4 w-4" />
                          <span>Dark</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("system")}>
                          <Laptop className="mr-2 h-4 w-4" />
                          <span>System</span>
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuItem>
                    <Keyboard className="mr-2 h-4 w-4" />
                    <span>Keyboard Shortcuts</span>
                    <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <Separator orientation="vertical" className="h-8" />

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Add new</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Edit selected</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete selected</TooltipContent>
              </Tooltip>

              <Separator orientation="vertical" className="h-8" />

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${
                        isRefreshing ? "animate-spin" : ""
                      }`}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Refresh data</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Export data</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Upload className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Import data</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>

      {/* AG Grid */}
      <div className="ag-theme-quartz flex-1">
        <AgGridReact
          ref={gridRef}
          theme={gridTheme}
          columnDefs={columnDefs}
          rowData={rowData}
          defaultColDef={defaultColDef}
          sideBar={true}
          domLayout="normal"
          className="h-full w-full"
          onGridReady={onGridReady}
        />
      </div>

      <GeneralSettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
      />

      {gridReady && (
        <ColumnSettingsDialog
          open={columnSettingsOpen}
          onOpenChange={setColumnSettingsOpen}
          gridRef={gridRef}
        />
      )}
    </div>
  );
}