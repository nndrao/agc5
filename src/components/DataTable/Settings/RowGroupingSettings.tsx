import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RowGroupingSettingsProps {
  settings: any;
  onChange: (category: string, setting: string, value: any) => void;
}

export function RowGroupingSettings({ settings, onChange }: RowGroupingSettingsProps) {
  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Group Behavior</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="groupDefaultExpanded">Expand Groups by Default</Label>
            <Switch
              id="groupDefaultExpanded"
              checked={settings.groupDefaultExpanded || false}
              onCheckedChange={(checked) => onChange('rowGrouping', 'groupDefaultExpanded', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="groupIncludeFooter">Include Footer in Groups</Label>
            <Switch
              id="groupIncludeFooter"
              checked={settings.groupIncludeFooter || false}
              onCheckedChange={(checked) => onChange('rowGrouping', 'groupIncludeFooter', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="groupIncludeTotalFooter">Include Total Footer</Label>
            <Switch
              id="groupIncludeTotalFooter"
              checked={settings.groupIncludeTotalFooter || false}
              onCheckedChange={(checked) => onChange('rowGrouping', 'groupIncludeTotalFooter', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="groupSuppressAutoColumn">Disable Auto Column</Label>
            <Switch
              id="groupSuppressAutoColumn"
              checked={settings.groupSuppressAutoColumn || false}
              onCheckedChange={(checked) => onChange('rowGrouping', 'groupSuppressAutoColumn', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Group Display</CardTitle>
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
              </SelectContent>
            </Select>
          </div>

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
                <SelectItem value="agGroupCellRenderer">Custom Group Renderer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Group Aggregation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="groupIncludeFooter">Enable Group Aggregation</Label>
            <Switch
              id="groupIncludeFooter"
              checked={settings.groupIncludeFooter || false}
              onCheckedChange={(checked) => onChange('rowGrouping', 'groupIncludeFooter', checked)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="groupDefaultExpanded">Default Aggregation Function</Label>
            <Select
              value={settings.groupDefaultExpanded || 'sum'}
              onValueChange={(value) => onChange('rowGrouping', 'groupDefaultExpanded', value)}
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
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 