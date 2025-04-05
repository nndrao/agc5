import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { InfoCircledIcon } from '@radix-ui/react-icons';

interface DataSettingsProps {
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

export function DataSettings({ settings, onChange }: DataSettingsProps) {
  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Row Model</CardTitle>
          <CardDescription>Configure how data is loaded and managed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rowModelType">Row Model Type</Label>
            <Select
              value={settings.rowModelType || 'clientSide'}
              onValueChange={(value) => onChange('data', 'rowModelType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select row model type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clientSide">Client Side</SelectItem>
                <SelectItem value="infinite">Infinite</SelectItem>
                <SelectItem value="serverSide">Server Side</SelectItem>
                <SelectItem value="viewport">Viewport</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {settings.rowModelType === 'serverSide' && (
            <div className="space-y-2">
              <Label htmlFor="serverSideStoreType">Server Side Store Type</Label>
              <Select
                value={settings.serverSideStoreType || 'partial'}
                onValueChange={(value) => onChange('data', 'serverSideStoreType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select store type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="full">Full</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <SettingWithTooltip
            label="Reset Row Data on Update"
            tooltip="When enabled, the grid will completely refresh when data changes instead of updating in-place"
          >
            <Switch
              id="resetRowDataOnUpdate"
              checked={settings.resetRowDataOnUpdate || true}
              onCheckedChange={(checked) => onChange('data', 'resetRowDataOnUpdate', checked)}
            />
          </SettingWithTooltip>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pagination</CardTitle>
          <CardDescription>Configure pagination settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SettingWithTooltip
            label="Enable Pagination"
            tooltip="When enabled, data will be displayed in pages"
          >
            <Switch
              id="pagination"
              checked={settings.pagination || false}
              onCheckedChange={(checked) => onChange('data', 'pagination', checked)}
            />
          </SettingWithTooltip>

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

          {settings.pagination && (
            <SettingWithTooltip
              label="Auto Page Size"
              tooltip="When enabled, the page size will automatically adjust to show all rows that fit in the grid's height"
            >
              <Switch
                id="paginationAutoPageSize"
                checked={settings.paginationAutoPageSize || false}
                onCheckedChange={(checked) => onChange('data', 'paginationAutoPageSize', checked)}
              />
            </SettingWithTooltip>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Selection</CardTitle>
          <CardDescription>Configure row and cell selection</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rowSelection">Row Selection</Label>
            <Select
              value={settings.rowSelection || 'none'}
              onValueChange={(value) => onChange('data', 'rowSelection', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select row selection mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="multiple">Multiple</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {settings.rowSelection && settings.rowSelection !== 'none' && (
            <SettingWithTooltip
              label="Suppress Row Click Selection"
              tooltip="When enabled, clicking a row will not select it (only checkbox clicks will select)"
            >
              <Switch
                id="suppressRowClickSelection"
                checked={settings.suppressRowClickSelection || false}
                onCheckedChange={(checked) => onChange('data', 'suppressRowClickSelection', checked)}
              />
            </SettingWithTooltip>
          )}

          <SettingWithTooltip
            label="Enable Cell Text Selection"
            tooltip="When enabled, text in cells can be selected with the mouse"
          >
            <Switch
              id="enableCellTextSelection"
              checked={settings.enableCellTextSelection || false}
              onCheckedChange={(checked) => onChange('data', 'enableCellTextSelection', checked)}
            />
          </SettingWithTooltip>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Clipboard</CardTitle>
          <CardDescription>Configure clipboard behavior</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SettingWithTooltip
            label="Enable Clipboard"
            tooltip="When enabled, selected cells can be copied to clipboard"
          >
            <Switch
              id="enableClipboard"
              checked={settings.enableClipboard !== false}
              onCheckedChange={(checked) => onChange('data', 'enableClipboard', checked)}
            />
          </SettingWithTooltip>

          {settings.enableClipboard !== false && (
            <>
              <div className="space-y-2">
                <Label htmlFor="clipboardDelimiter">Clipboard Delimiter</Label>
                <Input
                  id="clipboardDelimiter"
                  type="text"
                  value={settings.clipboardDelimiter || '\t'}
                  onChange={(e) => onChange('data', 'clipboardDelimiter', e.target.value)}
                  placeholder="\t"
                />
              </div>

              <SettingWithTooltip
                label="Suppress Copy Rows to Clipboard"
                tooltip="When enabled, only cell values will be copied, not entire rows"
              >
                <Switch
                  id="suppressCopyRowsToClipboard"
                  checked={settings.suppressCopyRowsToClipboard || false}
                  onCheckedChange={(checked) => onChange('data', 'suppressCopyRowsToClipboard', checked)}
                />
              </SettingWithTooltip>

              <SettingWithTooltip
                label="Suppress Last Empty Line on Paste"
                tooltip="When enabled, the last empty line in pasted content will be ignored"
              >
                <Switch
                  id="suppressLastEmptyLineOnPaste"
                  checked={settings.suppressLastEmptyLineOnPaste || false}
                  onCheckedChange={(checked) => onChange('data', 'suppressLastEmptyLineOnPaste', checked)}
                />
              </SettingWithTooltip>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Row Drag & Drop</CardTitle>
          <CardDescription>Configure row drag and drop behavior</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SettingWithTooltip
            label="Disable Row Drag"
            tooltip="When enabled, rows cannot be dragged"
          >
            <Switch
              id="suppressRowDrag"
              checked={settings.suppressRowDrag || false}
              onCheckedChange={(checked) => onChange('data', 'suppressRowDrag', checked)}
            />
          </SettingWithTooltip>

          <SettingWithTooltip
            label="Enable Managed Row Drag"
            tooltip="When enabled, the grid will manage row dragging (reordering rows)"
          >
            <Switch
              id="rowDragManaged"
              checked={settings.rowDragManaged || false}
              onCheckedChange={(checked) => onChange('data', 'rowDragManaged', checked)}
            />
          </SettingWithTooltip>

          <SettingWithTooltip
            label="Disable Movable Columns"
            tooltip="When enabled, columns cannot be reordered by dragging"
          >
            <Switch
              id="suppressMovableColumns"
              checked={settings.suppressMovableColumns || false}
              onCheckedChange={(checked) => onChange('data', 'suppressMovableColumns', checked)}
            />
          </SettingWithTooltip>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Performance Settings</CardTitle>
          <CardDescription>Configure settings that affect performance</CardDescription>
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

          <SettingWithTooltip
            label="Suppress Property Names Check"
            tooltip="When enabled, AG-Grid will not check if column definitions contain valid property names (improves performance)"
          >
            <Switch
              id="suppressPropertyNamesCheck"
              checked={settings.suppressPropertyNamesCheck || false}
              onCheckedChange={(checked) => onChange('data', 'suppressPropertyNamesCheck', checked)}
            />
          </SettingWithTooltip>
        </CardContent>
      </Card>
    </div>
  );
}