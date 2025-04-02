import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SettingsSectionProps } from "../types";

export function ColumnControlSection({ settings, onSettingChange }: SettingsSectionProps) {
  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="space-y-4">
          <Label className="text-base font-semibold">Column Settings</Label>
          <p className="text-sm text-muted-foreground mb-3">
            Configure column behavior
          </p>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Maintain Column Order</Label>
              <p className="text-sm text-muted-foreground">
                Preserve column order during updates
              </p>
            </div>
            <Switch
              checked={settings.maintainColumnOrder}
              onCheckedChange={(value) => onSettingChange('maintainColumnOrder', value)}
            />
          </div>

          <div>
            <Label className="font-medium">Auto-Size Padding</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Extra padding when auto-sizing columns
            </p>
            <Input
              type="number"
              value={settings.autoSizePadding}
              onChange={(e) => onSettingChange('autoSizePadding', parseInt(e.target.value))}
              min={0}
            />
          </div>

          <div>
            <Label className="font-medium">Column Resize Default</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Column resize behavior
            </p>
            <Select
              value={settings.colResizeDefault}
              onValueChange={(value) => onSettingChange('colResizeDefault', value as 'shift' | 'previousAndNext')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="shift">Shift</SelectItem>
                <SelectItem value="previousAndNext">Previous and Next</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
} 