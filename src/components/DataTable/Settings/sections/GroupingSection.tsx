import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SettingsSectionProps } from "../types";

export function GroupingSection({ settings, onSettingChange }: SettingsSectionProps) {
  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="space-y-4">
          <Label className="text-base font-semibold">Group Display</Label>
          <p className="text-sm text-muted-foreground mb-3">
            Configure group display options
          </p>

          <div>
            <Label className="font-medium">Display Type</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Choose how groups are displayed
            </p>
            <Select
              value={settings.groupDisplayType}
              onValueChange={(value) => onSettingChange('groupDisplayType', value as 'singleColumn' | 'multipleColumns' | 'groupRows' | 'custom')}
              defaultValue="groupRows"
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="singleColumn">Single Column</SelectItem>
                <SelectItem value="multipleColumns">Multiple Columns</SelectItem>
                <SelectItem value="groupRows">Group Rows</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="font-medium">Row Group Panel</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Control when to show the row group panel
            </p>
            <Select
              value={settings.rowGroupPanelShow}
              onValueChange={(value) => onSettingChange('rowGroupPanelShow', value as 'always' | 'onlyWhenGrouping' | 'never')}
              defaultValue="always"
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="always">Always</SelectItem>
                <SelectItem value="onlyWhenGrouping">Only When Grouping</SelectItem>
                <SelectItem value="never">Never</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="font-medium">Default Expanded Level</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Number of group levels to expand by default. Use -1 to expand all levels.
            </p>
            <Input
              type="number"
              value={settings.groupDefaultExpanded}
              onChange={(e) => onSettingChange('groupDefaultExpanded', parseInt(e.target.value))}
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <Label className="text-base font-semibold">Group Features</Label>
          <p className="text-sm text-muted-foreground mb-3">
            Configure group behavior
          </p>

          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Group Total Row</Label>
              <p className="text-sm text-muted-foreground">
                Show footer for each group
              </p>
            </div>
            <Switch
              checked={settings.groupTotalRow}
              onCheckedChange={(value) => {
                onSettingChange('groupTotalRow', value);
                // Keep legacy property for backward compatibility
                onSettingChange('groupIncludeFooter', value);
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Grand Total Row</Label>
              <p className="text-sm text-muted-foreground">
                Show total footer for all groups
              </p>
            </div>
            <Switch
              checked={settings.grandTotalRow}
              onCheckedChange={(value) => {
                onSettingChange('grandTotalRow', value);
                // Keep legacy property for backward compatibility
                onSettingChange('groupIncludeTotalFooter', value);
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Show Opened Group</Label>
              <p className="text-sm text-muted-foreground">
                Display opened group indicator
              </p>
            </div>
            <Switch
              checked={settings.showOpenedGroup}
              onCheckedChange={(value) => onSettingChange('showOpenedGroup', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Enable Row Group</Label>
              <p className="text-sm text-muted-foreground">
                Allow row grouping (for defaultColDef)
              </p>
              <p className="text-sm text-yellow-600 mt-1">
                Note: In AG-Grid 33+, this is only used in defaultColDef, not at grid level
              </p>
            </div>
            <Switch
              checked={settings.enableRowGroup}
              onCheckedChange={(value) => onSettingChange('enableRowGroup', value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}