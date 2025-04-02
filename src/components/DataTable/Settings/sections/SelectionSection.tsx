import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SettingsSectionProps } from "../types";

export function SelectionSection({ settings, onSettingChange }: SettingsSectionProps) {
  // Helper function to handle rowSelection object updates
  const updateRowSelectionObject = (key: string, value: any) => {
    // Get current rowSelection
    const currentRowSelection = typeof settings.rowSelection === 'object' 
      ? { ...settings.rowSelection } 
      : { type: settings.rowSelection as 'singleRow' | 'multiRow' };
    
    // Always ensure there's a valid type
    if (!currentRowSelection.type || 
        (currentRowSelection.type !== 'singleRow' && 
         currentRowSelection.type !== 'multiRow')) {
      currentRowSelection.type = 'multiRow'; // Default to multiRow
    }
    
    // Update the specified property
    const updatedRowSelection = {
      ...currentRowSelection,
      [key]: value
    };
    
    // Apply the update
    onSettingChange('rowSelection', updatedRowSelection);
  };

  // Get selection type and options from rowSelection object or string
  const getSelectionType = (): string => {
    if (typeof settings.rowSelection === 'object') {
      // Ensure we return a valid type
      const type = settings.rowSelection.type;
      if (type === 'singleRow' || type === 'multiRow') {
        return type;
      }
      return 'multiRow'; // Default to multiRow
    }
    
    // For string values
    if (settings.rowSelection === 'singleRow' || settings.rowSelection === 'multiRow') {
      return settings.rowSelection as string;
    }
    
    // Default to multiRow for any invalid value
    return 'multiRow';
  };

  const getSelectionOption = (option: string, defaultValue: any = false): any => {
    if (typeof settings.rowSelection === 'object') {
      // Map from AG-Grid 33+ property names to their values in the rowSelection object
      switch (option) {
        case 'enableSelectionWithoutKeys':
          return settings.rowSelection.enableSelectionWithoutKeys ?? defaultValue;
        case 'enableClickSelection':
          return settings.rowSelection.enableClickSelection ?? !settings.suppressRowClickSelection;
        case 'groupSelects':
          return settings.rowSelection.groupSelects ?? 'descendants';
        case 'copySelectedRows':
          return settings.rowSelection.copySelectedRows ?? !settings.suppressCopyRowsToClipboard;
        default:
          return defaultValue;
      }
    }
    // Legacy fallbacks for older code
    switch (option) {
      case 'enableSelectionWithoutKeys':
        return settings.rowMultiSelectWithClick ?? defaultValue;
      case 'enableClickSelection':
        return !settings.suppressRowClickSelection;
      case 'groupSelects':
        return 'descendants';
      case 'copySelectedRows':
        return !settings.suppressCopyRowsToClipboard;
      default:
        return defaultValue;
    }
  };

  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="space-y-4">
          <Label className="text-base font-semibold">Selection Mode</Label>
          <p className="text-sm text-muted-foreground mb-3">
            Configure row selection behavior
          </p>

          <div>
            <Label className="font-medium">Selection Type</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Choose how rows can be selected
            </p>
            <Select
              value={getSelectionType()}
              onValueChange={(value) => updateRowSelectionObject('type', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="singleRow">Single Row</SelectItem>
                <SelectItem value="multiRow">Multiple Rows</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Multi-Select with Click</Label>
              <p className="text-sm text-muted-foreground">
                Select multiple rows with single click
              </p>
            </div>
            <Switch
              checked={getSelectionOption('enableSelectionWithoutKeys')}
              onCheckedChange={(value) => {
                updateRowSelectionObject('enableSelectionWithoutKeys', value);
                // Also update legacy property for backward compatibility
                onSettingChange('rowMultiSelectWithClick', value);
              }}
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-semibold">Cell Selection</Label>
          <p className="text-sm text-muted-foreground mb-3">
            Configure cell selection options
          </p>

          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Cell Selection</Label>
              <p className="text-sm text-muted-foreground">
                Allow selecting cell ranges
              </p>
            </div>
            <Switch
              checked={settings.cellSelection !== false}
              onCheckedChange={(value) => {
                const cellSelection = value 
                  ? { handle: settings.enableFillHandle ? 'fill' : 'range' }
                  : false;
                onSettingChange('cellSelection', cellSelection);
                
                // Legacy properties for backward compatibility
                onSettingChange('enableRangeSelection', value);
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Fill Handle</Label>
              <p className="text-sm text-muted-foreground">
                Enable fill handle for drag-fill
              </p>
            </div>
            <Switch
              checked={
                typeof settings.cellSelection === 'object' && 
                settings.cellSelection?.handle === 'fill'
              }
              onCheckedChange={(value) => {
                const handle = value ? 'fill' : 'range';
                const cellSelection = typeof settings.cellSelection === 'object'
                  ? { ...settings.cellSelection, handle }
                  : { handle };
                
                onSettingChange('cellSelection', cellSelection);
                
                // Legacy properties for backward compatibility
                onSettingChange('enableFillHandle', value);
                onSettingChange('enableRangeHandle', !value);
              }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <Label className="text-base font-semibold">Row Selection Options</Label>
          <p className="text-sm text-muted-foreground mb-3">
            Configure additional row selection options
          </p>

          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Enable Click Selection</Label>
              <p className="text-sm text-muted-foreground">
                Allow selecting rows when clicking
              </p>
            </div>
            <Switch
              checked={getSelectionOption('enableClickSelection')}
              onCheckedChange={(value) => {
                updateRowSelectionObject('enableClickSelection', value);
                // Also update legacy property for backward compatibility
                onSettingChange('suppressRowClickSelection', !value);
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Enable Cell Text Selection</Label>
              <p className="text-sm text-muted-foreground">
                Allow selecting text within cells
              </p>
            </div>
            <Switch
              checked={settings.enableCellTextSelection}
              onCheckedChange={(value) => onSettingChange('enableCellTextSelection', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Copy Selected Rows</Label>
              <p className="text-sm text-muted-foreground">
                Allow copying selected rows to clipboard
              </p>
            </div>
            <Switch
              checked={getSelectionOption('copySelectedRows')}
              onCheckedChange={(value) => {
                updateRowSelectionObject('copySelectedRows', value);
                // Also update legacy property for backward compatibility
                onSettingChange('suppressCopyRowsToClipboard', !value);
              }}
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-semibold">Group Selection</Label>
          <p className="text-sm text-muted-foreground mb-3">
            Configure group selection behavior
          </p>

          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Group Selection Mode</Label>
              <p className="text-sm text-muted-foreground">
                How group selection affects children
              </p>
            </div>
            <Select
              value={getSelectionOption('groupSelects', 'descendants')}
              onValueChange={(value) => {
                updateRowSelectionObject('groupSelects', value);
                // No legacy properties to update here - using only the modern format
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="children">Children Only</SelectItem>
                <SelectItem value="descendants">All Descendants</SelectItem>
                <SelectItem value="filteredDescendants">Filtered Descendants</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}