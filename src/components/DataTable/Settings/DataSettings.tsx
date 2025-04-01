import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DataSettingsProps {
  settings: any;
  onChange: (category: string, setting: string, value: any) => void;
}

export function DataSettings({ settings, onChange }: DataSettingsProps) {
  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Pagination Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="pagination">Enable Pagination</Label>
            <Switch
              id="pagination"
              checked={settings.pagination || false}
              onCheckedChange={(checked) => onChange('data', 'pagination', checked)}
            />
          </div>

          {settings.pagination && (
            <div className="space-y-2">
              <Label htmlFor="paginationPageSize">Page Size</Label>
              <Input
                id="paginationPageSize"
                type="number"
                value={settings.paginationPageSize || 100}
                onChange={(e) => onChange('data', 'paginationPageSize', parseInt(e.target.value))}
                min={10}
                max={1000}
                step={10}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="resetRowDataOnUpdate">Reset Row Data on Update</Label>
            <Switch
              id="resetRowDataOnUpdate"
              checked={settings.resetRowDataOnUpdate || true}
              onCheckedChange={(checked) => onChange('data', 'resetRowDataOnUpdate', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="rowDragManaged">Enable Row Drag Management</Label>
            <Switch
              id="rowDragManaged"
              checked={settings.rowDragManaged || false}
              onCheckedChange={(checked) => onChange('data', 'rowDragManaged', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="suppressRowDrag">Disable Row Drag</Label>
            <Switch
              id="suppressRowDrag"
              checked={settings.suppressRowDrag || false}
              onCheckedChange={(checked) => onChange('data', 'suppressRowDrag', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="suppressMovableColumns">Disable Movable Columns</Label>
            <Switch
              id="suppressMovableColumns"
              checked={settings.suppressMovableColumns || false}
              onCheckedChange={(checked) => onChange('data', 'suppressMovableColumns', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Performance Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rowBuffer">Row Buffer</Label>
            <Input
              id="rowBuffer"
              type="number"
              value={settings.rowBuffer || 10}
              onChange={(e) => onChange('data', 'rowBuffer', parseInt(e.target.value))}
              min={0}
              max={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="asyncTransactionWaitMillis">Async Transaction Wait Time (ms)</Label>
            <Input
              id="asyncTransactionWaitMillis"
              type="number"
              value={settings.asyncTransactionWaitMillis || 50}
              onChange={(e) => onChange('data', 'asyncTransactionWaitMillis', parseInt(e.target.value))}
              min={0}
              max={1000}
              step={10}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 