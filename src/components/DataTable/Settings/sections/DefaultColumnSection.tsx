import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import type { SettingsSectionProps } from "../types";

export function DefaultColumnSection({ settings, onSettingChange }: SettingsSectionProps) {
  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="space-y-4">
          <Label className="text-base font-semibold">Column Behavior</Label>
          <p className="text-sm text-muted-foreground mb-3">
            Configure default behavior for all columns
          </p>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Editable</Label>
              <p className="text-sm text-muted-foreground">
                Allow cell editing by default
              </p>
            </div>
            <Switch
              checked={settings.defaultColEditable}
              onCheckedChange={(value) => onSettingChange('defaultColEditable', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Resizable</Label>
              <p className="text-sm text-muted-foreground">
                Allow column resizing
              </p>
            </div>
            <Switch
              checked={settings.defaultColResizable}
              onCheckedChange={(value) => onSettingChange('defaultColResizable', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Sortable</Label>
              <p className="text-sm text-muted-foreground">
                Allow column sorting
              </p>
            </div>
            <Switch
              checked={settings.defaultColSortable}
              onCheckedChange={(value) => onSettingChange('defaultColSortable', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Filter</Label>
              <p className="text-sm text-muted-foreground">
                Enable column filtering
              </p>
            </div>
            <Switch
              checked={settings.defaultColFilter}
              onCheckedChange={(value) => onSettingChange('defaultColFilter', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Floating Filter</Label>
              <p className="text-sm text-muted-foreground">
                Show filter inputs below column headers
              </p>
            </div>
            <Switch
              checked={settings.floatingFilter}
              onCheckedChange={(value) => onSettingChange('floatingFilter', value)}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <Label className="text-base font-semibold">Cell Display</Label>
          <p className="text-sm text-muted-foreground mb-3">
            Configure column cell display options
          </p>

          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Auto Height</Label>
              <p className="text-sm text-muted-foreground">
                Auto-adjust height based on content
              </p>
            </div>
            <Switch
              checked={settings.defaultColAutoHeight}
              onCheckedChange={(value) => onSettingChange('defaultColAutoHeight', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Wrap Text</Label>
              <p className="text-sm text-muted-foreground">
                Wrap text in cells
              </p>
            </div>
            <Switch
              checked={settings.defaultColWrapText}
              onCheckedChange={(value) => onSettingChange('defaultColWrapText', value)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <Label className="text-base font-semibold">Column Sizing</Label>
          <p className="text-sm text-muted-foreground mb-3">
            Configure default column sizing
          </p>

          <div>
            <Label className="font-medium">Flex</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Flex grow factor (0 = fixed width)
            </p>
            <Input
              type="number"
              value={settings.defaultColFlex}
              onChange={(e) => onSettingChange('defaultColFlex', parseFloat(e.target.value) || 0)}
              min={0}
              step={0.1}
            />
          </div>

          <div>
            <Label className="font-medium">Min Width (px)</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Minimum column width
            </p>
            <Input
              type="number"
              value={settings.defaultColMinWidth}
              onChange={(e) => onSettingChange('defaultColMinWidth', parseInt(e.target.value) || 50)}
              min={20}
            />
          </div>

          <div>
            <Label className="font-medium">Max Width (px)</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Maximum column width (0 = no limit)
            </p>
            <Input
              type="number"
              value={settings.defaultColMaxWidth === null ? 0 : settings.defaultColMaxWidth}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 0;
                onSettingChange('defaultColMaxWidth', value === 0 ? null : value);
              }}
              min={0}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 