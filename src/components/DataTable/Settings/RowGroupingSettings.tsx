import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { InfoCircledIcon } from '@radix-ui/react-icons';

interface RowGroupingSettingsProps {
  settings: any;
  onChange: (category: string, setting: string, value: any) => void;
}

// Helper component for settings with tooltips
const SettingWithTooltip = ({ label, tooltip, children }: { label: string, tooltip: string, children: React.ReactNode }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-1">
      <Label htmlFor={label.replace(/\s+/g, '')}>{label}</Label>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <InfoCircledIcon className="h-4 w-4 text-muted-foreground cursor-help" />
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-80">
            <p className="text-sm">{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
    {children}
  </div>
);

export function RowGroupingSettings({ settings, onChange }: RowGroupingSettingsProps) {
  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Row Group Panel</CardTitle>
          <CardDescription>Configure the row group panel at the top of the grid</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rowGroupPanelShow">Row Group Panel Visibility</Label>
            <Select
              value={settings.rowGroupPanelShow || 'never'}
              onValueChange={(value) => onChange('rowGrouping', 'rowGroupPanelShow', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select when to show the row group panel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="always">Always</SelectItem>
                <SelectItem value="onlyWhenGrouping">Only When Grouping</SelectItem>
                <SelectItem value="never">Never</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <SettingWithTooltip
            label="Suppress Drag Leave Hides Columns"
            tooltip="When enabled, columns won't be hidden when dragged to the row group panel"
          >
            <Switch
              id="suppressDragLeaveHidesColumns"
              checked={settings.suppressDragLeaveHidesColumns || false}
              onCheckedChange={(checked) => onChange('rowGrouping', 'suppressDragLeaveHidesColumns', checked)}
            />
          </SettingWithTooltip>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Group Behavior</CardTitle>
          <CardDescription>Configure how row groups behave</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SettingWithTooltip
            label="Expand Groups by Default"
            tooltip="When enabled, all row groups will be expanded when the grid loads"
          >
            <Switch
              id="groupDefaultExpanded"
              checked={settings.groupDefaultExpanded || false}
              onCheckedChange={(checked) => onChange('rowGrouping', 'groupDefaultExpanded', checked)}
            />
          </SettingWithTooltip>

          <SettingWithTooltip
            label="Include Footer in Groups"
            tooltip="When enabled, each group will have a footer row showing aggregated values"
          >
            <Switch
              id="groupIncludeFooter"
              checked={settings.groupIncludeFooter || false}
              onCheckedChange={(checked) => onChange('rowGrouping', 'groupIncludeFooter', checked)}
            />
          </SettingWithTooltip>

          <SettingWithTooltip
            label="Include Total Footer"
            tooltip="When enabled, a grand total footer will be shown at the bottom of the grid"
          >
            <Switch
              id="groupIncludeTotalFooter"
              checked={settings.groupIncludeTotalFooter || false}
              onCheckedChange={(checked) => onChange('rowGrouping', 'groupIncludeTotalFooter', checked)}
            />
          </SettingWithTooltip>

          <SettingWithTooltip
            label="Disable Auto Column"
            tooltip="When enabled, the auto-generated group column will be hidden"
          >
            <Switch
              id="groupSuppressAutoColumn"
              checked={settings.groupSuppressAutoColumn || false}
              onCheckedChange={(checked) => onChange('rowGrouping', 'groupSuppressAutoColumn', checked)}
            />
          </SettingWithTooltip>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Group Display</CardTitle>
          <CardDescription>Configure how groups are displayed in the grid</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="groupDisplayType">Group Display Type</Label>
            <Select
              value={settings.groupDisplayType || 'singleColumn'}
              onValueChange={(value) => onChange('rowGrouping', 'groupDisplayType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select group display type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="singleColumn">Single Column</SelectItem>
                <SelectItem value="multipleColumns">Multiple Columns</SelectItem>
                <SelectItem value="groupRows">Group Rows</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <SettingWithTooltip
            label="Show Opened Group"
            tooltip="When enabled, the opened group will be displayed in the group column"
          >
            <Switch
              id="showOpenedGroup"
              checked={settings.showOpenedGroup || false}
              onCheckedChange={(checked) => onChange('rowGrouping', 'showOpenedGroup', checked)}
            />
          </SettingWithTooltip>

          <div className="space-y-2">
            <Label htmlFor="groupRowRenderer">Group Row Renderer</Label>
            <Select
              value={settings.groupRowRenderer || 'agGroupCellRenderer'}
              onValueChange={(value) => onChange('rowGrouping', 'groupRowRenderer', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select group row renderer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="agGroupCellRenderer">Default Group Renderer</SelectItem>
                <SelectItem value="agGroupRowRenderer">Group Row Renderer</SelectItem>
                <SelectItem value="custom">Custom Group Renderer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Group Aggregation</CardTitle>
          <CardDescription>Configure how data is aggregated in groups</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SettingWithTooltip
            label="Group Total Row"
            tooltip="When enabled, a total row will be shown for each group"
          >
            <Switch
              id="groupTotalRow"
              checked={settings.groupTotalRow || false}
              onCheckedChange={(checked) => onChange('rowGrouping', 'groupTotalRow', checked)}
            />
          </SettingWithTooltip>

          <SettingWithTooltip
            label="Grand Total Row"
            tooltip="When enabled, a grand total row will be shown at the bottom of the grid"
          >
            <Switch
              id="grandTotalRow"
              checked={settings.grandTotalRow || false}
              onCheckedChange={(checked) => onChange('rowGrouping', 'grandTotalRow', checked)}
            />
          </SettingWithTooltip>

          <div className="space-y-2">
            <Label htmlFor="defaultAggFunc">Default Aggregation Function</Label>
            <Select
              value={settings.defaultAggFunc || 'sum'}
              onValueChange={(value) => onChange('rowGrouping', 'defaultAggFunc', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select aggregation function" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sum">Sum</SelectItem>
                <SelectItem value="avg">Average</SelectItem>
                <SelectItem value="count">Count</SelectItem>
                <SelectItem value="min">Minimum</SelectItem>
                <SelectItem value="max">Maximum</SelectItem>
                <SelectItem value="first">First</SelectItem>
                <SelectItem value="last">Last</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}