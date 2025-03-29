import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import type { SettingsSectionProps } from "../types";

export function DataSection({ settings, onSettingChange }: SettingsSectionProps) {
  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="space-y-4">
          <Label className="text-base font-semibold">Pagination</Label>
          <p className="text-sm text-muted-foreground mb-3">
            Configure pagination settings
          </p>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Enable Pagination</Label>
              <p className="text-sm text-muted-foreground">
                Split data into pages
              </p>
            </div>
            <Switch
              checked={settings.pagination}
              onCheckedChange={(value) => onSettingChange('pagination', value)}
            />
          </div>

          <div>
            <Label className="font-medium">Page Size</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Number of rows per page
            </p>
            <Input
              type="number"
              value={settings.paginationPageSize}
              onChange={(e) => onSettingChange('paginationPageSize', parseInt(e.target.value))}
              min={1}
            />
          </div>

          <div>
            <Label className="font-medium">Cache Block Size</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Number of rows to load at once for infinite scrolling
            </p>
            <Input
              type="number"
              value={settings.cacheBlockSize}
              onChange={(e) => onSettingChange('cacheBlockSize', parseInt(e.target.value))}
              min={1}
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <Label className="text-base font-semibold">Movement Options</Label>
          <p className="text-sm text-muted-foreground mb-3">
            Configure row and column movement
          </p>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Row Drag</Label>
              <p className="text-sm text-muted-foreground">
                Allow dragging rows
              </p>
            </div>
            <Switch
              checked={!settings.suppressRowDrag}
              onCheckedChange={(value) => onSettingChange('suppressRowDrag', !value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Movable Columns</Label>
              <p className="text-sm text-muted-foreground">
                Allow reordering columns
              </p>
            </div>
            <Switch
              checked={!settings.suppressMovableColumns}
              onCheckedChange={(value) => onSettingChange('suppressMovableColumns', !value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Row Drag Managed</Label>
              <p className="text-sm text-muted-foreground">
                Enable managed row dragging
              </p>
            </div>
            <Switch
              checked={settings.rowDragManaged}
              onCheckedChange={(value) => onSettingChange('rowDragManaged', value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-semibold">Performance</Label>
          <p className="text-sm text-muted-foreground mb-3">
            Configure performance options
          </p>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Immutable Data</Label>
              <p className="text-sm text-muted-foreground">
                Optimize for immutable data updates
              </p>
            </div>
            <Switch
              checked={settings.immutableData}
              onCheckedChange={(value) => onSettingChange('immutableData', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Delta Row Mode</Label>
              <p className="text-sm text-muted-foreground">
                Only update changed rows
              </p>
            </div>
            <Switch
              checked={settings.deltaRowDataMode}
              onCheckedChange={(value) => onSettingChange('deltaRowDataMode', value)}
            />
          </div>

          <div>
            <Label className="font-medium">Row Buffer</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Extra rows to render for smoother scrolling
            </p>
            <Input
              type="number"
              value={settings.rowBuffer}
              onChange={(e) => onSettingChange('rowBuffer', parseInt(e.target.value))}
              min={1}
            />
          </div>

          <div>
            <Label className="font-medium">Batch Update Wait (ms)</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Milliseconds to wait before processing updates
            </p>
            <Input
              type="number"
              value={settings.batchUpdateWaitMillis}
              onChange={(e) => onSettingChange('batchUpdateWaitMillis', parseInt(e.target.value))}
              min={0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}