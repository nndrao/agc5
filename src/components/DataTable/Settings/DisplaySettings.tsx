import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { InfoCircledIcon } from '@radix-ui/react-icons';

interface DisplaySettingsProps {
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

export function DisplaySettings({ settings, onChange }: DisplaySettingsProps) {
  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Layout Settings</CardTitle>
          <CardDescription>Configure the grid's layout and dimensions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rowHeight">Row Height</Label>
              <Input
                id="rowHeight"
                type="number"
                value={settings.rowHeight || 48}
                onChange={(e) => onChange('display', 'rowHeight', parseInt(e.target.value))}
                min={20}
                max={200}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="headerHeight">Header Height</Label>
              <Input
                id="headerHeight"
                type="number"
                value={settings.headerHeight || 45}
                onChange={(e) => onChange('display', 'headerHeight', parseInt(e.target.value))}
                min={20}
                max={200}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="domLayout">Layout Mode</Label>
            <Select
              value={settings.domLayout || 'normal'}
              onValueChange={(value) => onChange('display', 'domLayout', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select layout mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="autoHeight">Auto Height</SelectItem>
                <SelectItem value="print">Print</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Visual Settings</CardTitle>
          <CardDescription>Configure visual behavior and appearance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SettingWithTooltip
            label="Disable Row Hover Highlight"
            tooltip="When enabled, rows will not be highlighted when the mouse hovers over them"
          >
            <Switch
              id="suppressRowHoverHighlight"
              checked={settings.suppressRowHoverHighlight || false}
              onCheckedChange={(checked) => onChange('display', 'suppressRowHoverHighlight', checked)}
            />
          </SettingWithTooltip>

          <SettingWithTooltip
            label="Enable Column Hover Highlight"
            tooltip="When enabled, columns will be highlighted when the mouse hovers over them"
          >
            <Switch
              id="columnHoverHighlight"
              checked={settings.columnHoverHighlight || false}
              onCheckedChange={(checked) => onChange('display', 'columnHoverHighlight', checked)}
            />
          </SettingWithTooltip>

          <SettingWithTooltip
            label="Disable Cell Focus"
            tooltip="When enabled, cells will not receive focus when clicked"
          >
            <Switch
              id="suppressCellFocus"
              checked={settings.suppressCellFocus || false}
              onCheckedChange={(checked) => onChange('display', 'suppressCellFocus', checked)}
            />
          </SettingWithTooltip>

          <SettingWithTooltip
            label="Disable Scroll on New Data"
            tooltip="When enabled, the grid will not automatically scroll to show newly loaded data"
          >
            <Switch
              id="suppressScrollOnNewData"
              checked={settings.suppressScrollOnNewData || false}
              onCheckedChange={(checked) => onChange('display', 'suppressScrollOnNewData', checked)}
            />
          </SettingWithTooltip>

          <SettingWithTooltip
            label="Always Show Vertical Scroll"
            tooltip="When enabled, vertical scrollbar will always be visible even when not needed"
          >
            <Switch
              id="alwaysShowVerticalScroll"
              checked={settings.alwaysShowVerticalScroll || false}
              onCheckedChange={(checked) => onChange('display', 'alwaysShowVerticalScroll', checked)}
            />
          </SettingWithTooltip>

          <SettingWithTooltip
            label="Disable Column Move Animation"
            tooltip="When enabled, columns will move instantly without animation when reordered"
          >
            <Switch
              id="suppressColumnMoveAnimation"
              checked={settings.suppressColumnMoveAnimation || false}
              onCheckedChange={(checked) => onChange('display', 'suppressColumnMoveAnimation', checked)}
            />
          </SettingWithTooltip>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Accessibility Settings</CardTitle>
          <CardDescription>Configure settings that affect accessibility</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SettingWithTooltip
            label="Suppress Column Virtualization"
            tooltip="When enabled, all columns will be rendered in the DOM (better for screen readers but may impact performance)"
          >
            <Switch
              id="suppressColumnVirtualisation"
              checked={settings.suppressColumnVirtualisation || false}
              onCheckedChange={(checked) => onChange('display', 'suppressColumnVirtualisation', checked)}
            />
          </SettingWithTooltip>

          <SettingWithTooltip
            label="Suppress Row Virtualization"
            tooltip="When enabled, all rows will be rendered in the DOM (better for screen readers but may impact performance)"
          >
            <Switch
              id="suppressRowVirtualisation"
              checked={settings.suppressRowVirtualisation || false}
              onCheckedChange={(checked) => onChange('display', 'suppressRowVirtualisation', checked)}
            />
          </SettingWithTooltip>

          <SettingWithTooltip
            label="Ensure DOM Order"
            tooltip="When enabled, the DOM will match the visual order of rows and columns (better for screen readers)"
          >
            <Switch
              id="ensureDomOrder"
              checked={settings.ensureDomOrder || false}
              onCheckedChange={(checked) => onChange('display', 'ensureDomOrder', checked)}
            />
          </SettingWithTooltip>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Floating Filters</CardTitle>
          <CardDescription>Configure floating filter settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SettingWithTooltip
            label="Enable Floating Filters"
            tooltip="When enabled, filter inputs will be displayed below the column headers"
          >
            <Switch
              id="floatingFilter"
              checked={settings.floatingFilter || false}
              onCheckedChange={(checked) => onChange('display', 'floatingFilter', checked)}
            />
          </SettingWithTooltip>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Overlay Settings</CardTitle>
          <CardDescription>Configure grid overlay messages</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="overlayNoRowsTemplate">No Rows Message</Label>
            <Input
              id="overlayNoRowsTemplate"
              type="text"
              value={settings.overlayNoRowsTemplate || 'No rows to display'}
              onChange={(e) => onChange('display', 'overlayNoRowsTemplate', e.target.value)}
              placeholder="No rows to display"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="overlayLoadingTemplate">Loading Message</Label>
            <Input
              id="overlayLoadingTemplate"
              type="text"
              value={settings.overlayLoadingTemplate || 'Loading...'}
              onChange={(e) => onChange('display', 'overlayLoadingTemplate', e.target.value)}
              placeholder="Loading..."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}