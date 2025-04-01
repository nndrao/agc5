import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AppearanceSettingsProps {
  settings: any;
  onChange: (category: string, setting: string, value: any) => void;
}

export function AppearanceSettings({ settings, onChange }: AppearanceSettingsProps) {
  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Animation Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="animateRows">Enable Row Animation</Label>
            <Switch
              id="animateRows"
              checked={settings.animateRows || true}
              onCheckedChange={(checked) => onChange('appearance', 'animateRows', checked)}
            />
          </div>

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
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="enableBrowserTooltips">Enable Browser Tooltips</Label>
            <Switch
              id="enableBrowserTooltips"
              checked={settings.enableBrowserTooltips || false}
              onCheckedChange={(checked) => onChange('appearance', 'enableBrowserTooltips', checked)}
            />
          </div>

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
          <CardTitle>Cell Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="enableCellTextSelection">Enable Cell Text Selection</Label>
            <Switch
              id="enableCellTextSelection"
              checked={settings.enableCellTextSelection || true}
              onCheckedChange={(checked) => onChange('appearance', 'enableCellTextSelection', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="suppressContextMenu">Disable Context Menu</Label>
            <Switch
              id="suppressContextMenu"
              checked={settings.suppressContextMenu || false}
              onCheckedChange={(checked) => onChange('appearance', 'suppressContextMenu', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 