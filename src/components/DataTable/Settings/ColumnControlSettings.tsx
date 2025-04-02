import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ColumnControlSettingsProps {
  settings: any;
  onChange: (category: string, setting: string, value: any) => void;
}

export function ColumnControlSettings({ settings, onChange }: ColumnControlSettingsProps) {
  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Column Visibility</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="suppressColumnVirtualisation">Disable Column Virtualization</Label>
            <Switch
              id="suppressColumnVirtualisation"
              checked={settings.suppressColumnVirtualisation || false}
              onCheckedChange={(checked) => onChange('columnControl', 'suppressColumnVirtualisation', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="suppressColumnMoveAnimation">Disable Column Move Animation</Label>
            <Switch
              id="suppressColumnMoveAnimation"
              checked={settings.suppressColumnMoveAnimation || false}
              onCheckedChange={(checked) => onChange('columnControl', 'suppressColumnMoveAnimation', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="suppressColumnVirtualisation">Remember Column State</Label>
            <Switch
              id="suppressColumnVirtualisation"
              checked={settings.suppressColumnVirtualisation || true}
              onCheckedChange={(checked) => onChange('columnControl', 'suppressColumnVirtualisation', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Column Resizing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="resizable">Enable Column Resizing</Label>
            <Switch
              id="resizable"
              checked={settings.resizable || true}
              onCheckedChange={(checked) => onChange('columnControl', 'resizable', checked)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="columnResizeMode">Resize Mode</Label>
            <Select
              value={settings.columnResizeMode || 'onDrag'}
              onValueChange={(value) => onChange('columnControl', 'columnResizeMode', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select resize mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="onDrag">On Drag</SelectItem>
                <SelectItem value="onChange">On Change</SelectItem>
                <SelectItem value="onNextMouseUp">On Next Mouse Up</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="suppressColumnVirtualisation">Auto-Size Columns</Label>
            <Switch
              id="suppressColumnVirtualisation"
              checked={settings.suppressColumnVirtualisation || false}
              onCheckedChange={(checked) => onChange('columnControl', 'suppressColumnVirtualisation', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Column Movement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="suppressColumnMoveAnimation">Enable Column Reordering</Label>
            <Switch
              id="suppressColumnMoveAnimation"
              checked={settings.suppressColumnMoveAnimation || true}
              onCheckedChange={(checked) => onChange('columnControl', 'suppressColumnMoveAnimation', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="suppressColumnMoveAnimation">Lock Pinned Columns</Label>
            <Switch
              id="suppressColumnMoveAnimation"
              checked={settings.suppressColumnMoveAnimation || true}
              onCheckedChange={(checked) => onChange('columnControl', 'suppressColumnMoveAnimation', checked)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="columnMoveMode">Move Mode</Label>
            <Select
              value={settings.columnMoveMode || 'drag'}
              onValueChange={(value) => onChange('columnControl', 'columnMoveMode', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select move mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="drag">Drag</SelectItem>
                <SelectItem value="click">Click</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Column Menu</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="suppressColumnMoveAnimation">Enable Column Menu</Label>
            <Switch
              id="suppressColumnMoveAnimation"
              checked={settings.suppressColumnMoveAnimation || true}
              onCheckedChange={(checked) => onChange('columnControl', 'suppressColumnMoveAnimation', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="suppressColumnMoveAnimation">Show Column Menu Button</Label>
            <Switch
              id="suppressColumnMoveAnimation"
              checked={settings.suppressColumnMoveAnimation || true}
              onCheckedChange={(checked) => onChange('columnControl', 'suppressColumnMoveAnimation', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="suppressColumnMoveAnimation">Show Column Menu on Right Click</Label>
            <Switch
              id="suppressColumnMoveAnimation"
              checked={settings.suppressColumnMoveAnimation || false}
              onCheckedChange={(checked) => onChange('columnControl', 'suppressColumnMoveAnimation', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 