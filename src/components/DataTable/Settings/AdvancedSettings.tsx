import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AdvancedSettingsProps {
  settings: any;
  onChange: (category: string, setting: string, value: any) => void;
}

export function AdvancedSettings({ settings, onChange }: AdvancedSettingsProps) {
  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Performance Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="suppressRowVirtualisation">Disable Row Virtualization</Label>
            <Switch
              id="suppressRowVirtualisation"
              checked={settings.suppressRowVirtualisation || false}
              onCheckedChange={(checked) => onChange('advanced', 'suppressRowVirtualisation', checked)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rowBuffer">Row Buffer Size</Label>
            <Input
              id="rowBuffer"
              type="number"
              value={settings.rowBuffer || 20}
              onChange={(e) => onChange('advanced', 'rowBuffer', parseInt(e.target.value))}
              min={0}
              max={100}
              step={5}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxConcurrentDatasourceRequests">Max Concurrent Requests</Label>
            <Input
              id="maxConcurrentDatasourceRequests"
              type="number"
              value={settings.maxConcurrentDatasourceRequests || 2}
              onChange={(e) => onChange('advanced', 'maxConcurrentDatasourceRequests', parseInt(e.target.value))}
              min={1}
              max={10}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="blockLoadDebounceMillis">Block Load Debounce (ms)</Label>
            <Input
              id="blockLoadDebounceMillis"
              type="number"
              value={settings.blockLoadDebounceMillis || 100}
              onChange={(e) => onChange('advanced', 'blockLoadDebounceMillis', parseInt(e.target.value))}
              min={0}
              max={1000}
              step={50}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="suppressRowClickSelection">Disable Row Click Selection</Label>
            <Switch
              id="suppressRowClickSelection"
              checked={settings.suppressRowClickSelection || false}
              onCheckedChange={(checked) => onChange('advanced', 'suppressRowClickSelection', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="suppressRowDeselection">Disable Row Deselection</Label>
            <Switch
              id="suppressRowDeselection"
              checked={settings.suppressRowDeselection || false}
              onCheckedChange={(checked) => onChange('advanced', 'suppressRowDeselection', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="suppressRowHoverHighlight">Disable Row Hover Highlight</Label>
            <Switch
              id="suppressRowHoverHighlight"
              checked={settings.suppressRowHoverHighlight || false}
              onCheckedChange={(checked) => onChange('advanced', 'suppressRowHoverHighlight', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Advanced Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="enableCellTextSelection">Enable Cell Text Selection</Label>
            <Switch
              id="enableCellTextSelection"
              checked={settings.enableCellTextSelection || true}
              onCheckedChange={(checked) => onChange('advanced', 'enableCellTextSelection', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="suppressContextMenu">Disable Context Menu</Label>
            <Switch
              id="suppressContextMenu"
              checked={settings.suppressContextMenu || false}
              onCheckedChange={(checked) => onChange('advanced', 'suppressContextMenu', checked)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="domLayout">DOM Layout</Label>
            <Select
              value={settings.domLayout || 'normal'}
              onValueChange={(value) => onChange('advanced', 'domLayout', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select DOM layout" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="autoHeight">Auto Height</SelectItem>
                <SelectItem value="print">Print</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="suppressLoadingOverlay">Loading Overlay</Label>
            <Select
              value={settings.suppressLoadingOverlay ? 'suppressed' : 'enabled'}
              onValueChange={(value) => onChange('advanced', 'suppressLoadingOverlay', value === 'suppressed')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select loading overlay" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="enabled">Enabled</SelectItem>
                <SelectItem value="suppressed">Suppressed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 