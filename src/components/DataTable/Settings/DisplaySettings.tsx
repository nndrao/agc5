import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DisplaySettingsProps {
  settings: any;
  onChange: (category: string, setting: string, value: any) => void;
}

export function DisplaySettings({ settings, onChange }: DisplaySettingsProps) {
  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Layout Settings</CardTitle>
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
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="suppressRowHoverHighlight">Disable Row Hover Highlight</Label>
            <Switch
              id="suppressRowHoverHighlight"
              checked={settings.suppressRowHoverHighlight || false}
              onCheckedChange={(checked) => onChange('display', 'suppressRowHoverHighlight', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="suppressCellFocus">Disable Cell Focus</Label>
            <Switch
              id="suppressCellFocus"
              checked={settings.suppressCellFocus || false}
              onCheckedChange={(checked) => onChange('display', 'suppressCellFocus', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="suppressScrollOnNewData">Disable Scroll on New Data</Label>
            <Switch
              id="suppressScrollOnNewData"
              checked={settings.suppressScrollOnNewData || false}
              onCheckedChange={(checked) => onChange('display', 'suppressScrollOnNewData', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="alwaysShowVerticalScroll">Always Show Vertical Scroll</Label>
            <Switch
              id="alwaysShowVerticalScroll"
              checked={settings.alwaysShowVerticalScroll || false}
              onCheckedChange={(checked) => onChange('display', 'alwaysShowVerticalScroll', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="suppressColumnMoveAnimation">Disable Column Move Animation</Label>
            <Switch
              id="suppressColumnMoveAnimation"
              checked={settings.suppressColumnMoveAnimation || false}
              onCheckedChange={(checked) => onChange('display', 'suppressColumnMoveAnimation', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Floating Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="floatingFilter">Enable Floating Filters</Label>
            <Switch
              id="floatingFilter"
              checked={settings.floatingFilter || false}
              onCheckedChange={(checked) => onChange('display', 'floatingFilter', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 