import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { InfoCircledIcon } from '@radix-ui/react-icons';

interface AppearanceSettingsProps {
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

export function AppearanceSettings({ settings, onChange }: AppearanceSettingsProps) {
  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Animation Settings</CardTitle>
          <CardDescription>Configure animations and transitions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SettingWithTooltip
            label="Enable Row Animation"
            tooltip="When enabled, rows will animate when added, removed, or reordered"
          >
            <Switch
              id="animateRows"
              checked={settings.animateRows || true}
              onCheckedChange={(checked) => onChange('appearance', 'animateRows', checked)}
            />
          </SettingWithTooltip>

          <div className="space-y-2">
            <Label htmlFor="cellFlashDuration">Cell Flash Duration (ms)</Label>
            <Input
              id="cellFlashDuration"
              type="number"
              value={settings.cellFlashDuration || 1000}
              onChange={(e) => onChange('appearance', 'cellFlashDuration', parseInt(e.target.value))}
              min={0}
              max={5000}
              step={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cellFadeDuration">Cell Fade Duration (ms)</Label>
            <Input
              id="cellFadeDuration"
              type="number"
              value={settings.cellFadeDuration || 500}
              onChange={(e) => onChange('appearance', 'cellFadeDuration', parseInt(e.target.value))}
              min={0}
              max={5000}
              step={100}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tooltip Settings</CardTitle>
          <CardDescription>Configure tooltip behavior</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SettingWithTooltip
            label="Enable Browser Tooltips"
            tooltip="When enabled, browser's native tooltips will be used instead of AG-Grid's tooltips"
          >
            <Switch
              id="enableBrowserTooltips"
              checked={settings.enableBrowserTooltips || false}
              onCheckedChange={(checked) => onChange('appearance', 'enableBrowserTooltips', checked)}
            />
          </SettingWithTooltip>

          <div className="space-y-2">
            <Label htmlFor="tooltipShowDelay">Tooltip Show Delay (ms)</Label>
            <Input
              id="tooltipShowDelay"
              type="number"
              value={settings.tooltipShowDelay || 1000}
              onChange={(e) => onChange('appearance', 'tooltipShowDelay', parseInt(e.target.value))}
              min={0}
              max={5000}
              step={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tooltipHideDelay">Tooltip Hide Delay (ms)</Label>
            <Input
              id="tooltipHideDelay"
              type="number"
              value={settings.tooltipHideDelay || 10000}
              onChange={(e) => onChange('appearance', 'tooltipHideDelay', parseInt(e.target.value))}
              min={0}
              max={30000}
              step={1000}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Interaction Settings</CardTitle>
          <CardDescription>Configure user interaction behavior</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SettingWithTooltip
            label="Enable Cell Text Selection"
            tooltip="When enabled, text in cells can be selected with the mouse"
          >
            <Switch
              id="enableCellTextSelection"
              checked={settings.enableCellTextSelection || true}
              onCheckedChange={(checked) => onChange('appearance', 'enableCellTextSelection', checked)}
            />
          </SettingWithTooltip>

          <SettingWithTooltip
            label="Disable Context Menu"
            tooltip="When enabled, the browser's context menu will be suppressed when right-clicking on the grid"
          >
            <Switch
              id="suppressContextMenu"
              checked={settings.suppressContextMenu || false}
              onCheckedChange={(checked) => onChange('appearance', 'suppressContextMenu', checked)}
            />
          </SettingWithTooltip>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sorting Settings</CardTitle>
          <CardDescription>Configure sorting behavior</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SettingWithTooltip
            label="Enable Accented Sort"
            tooltip="When enabled, accented characters will be sorted correctly (e.g., 'é' will be treated as 'e')"
          >
            <Switch
              id="accentedSort"
              checked={settings.accentedSort || false}
              onCheckedChange={(checked) => onChange('appearance', 'accentedSort', checked)}
            />
          </SettingWithTooltip>

          <div className="space-y-2">
            <Label htmlFor="multiSortKey">Multi-Sort Key</Label>
            <Select
              value={settings.multiSortKey || 'ctrl'}
              onValueChange={(value) => onChange('appearance', 'multiSortKey', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select multi-sort key" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ctrl">Ctrl</SelectItem>
                <SelectItem value="shift">Shift</SelectItem>
                <SelectItem value="alt">Alt</SelectItem>
                <SelectItem value="meta">Meta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <SettingWithTooltip
            label="Show Unsort Icon"
            tooltip="When enabled, an unsort icon will be shown in the column header when the column is not sorted"
          >
            <Switch
              id="unSortIcon"
              checked={settings.unSortIcon || false}
              onCheckedChange={(checked) => onChange('appearance', 'unSortIcon', checked)}
            />
          </SettingWithTooltip>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Localization</CardTitle>
          <CardDescription>Configure language settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="localeText">Locale</Label>
            <Select
              value={settings.locale || 'en'}
              onValueChange={(value) => onChange('appearance', 'locale', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select locale" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="pt">Portuguese</SelectItem>
                <SelectItem value="it">Italian</SelectItem>
                <SelectItem value="zh">Chinese</SelectItem>
                <SelectItem value="ja">Japanese</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Export Settings</CardTitle>
          <CardDescription>Configure export behavior</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SettingWithTooltip
            label="Suppress CSV Export"
            tooltip="When enabled, CSV export functionality will be disabled"
          >
            <Switch
              id="suppressCsvExport"
              checked={settings.suppressCsvExport || false}
              onCheckedChange={(checked) => onChange('appearance', 'suppressCsvExport', checked)}
            />
          </SettingWithTooltip>

          <SettingWithTooltip
            label="Suppress Excel Export"
            tooltip="When enabled, Excel export functionality will be disabled"
          >
            <Switch
              id="suppressExcelExport"
              checked={settings.suppressExcelExport || false}
              onCheckedChange={(checked) => onChange('appearance', 'suppressExcelExport', checked)}
            />
          </SettingWithTooltip>
        </CardContent>
      </Card>
    </div>
  );
}