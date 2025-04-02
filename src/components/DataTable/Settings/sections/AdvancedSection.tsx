import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { SettingsSectionProps } from "../types";

export function AdvancedSection({ settings, onSettingChange }: SettingsSectionProps) {
  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="space-y-4">
          <Label className="text-base font-semibold">Enterprise Features</Label>
          <p className="text-sm text-muted-foreground mb-3">
            Configure enterprise-only features
          </p>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Enable Charts</Label>
              <p className="text-sm text-muted-foreground">
                Allow creating charts from grid data
              </p>
            </div>
            <Switch
              checked={settings.enableCharts}
              onCheckedChange={(value) => onSettingChange('enableCharts', value)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <Label className="text-base font-semibold">Accessibility</Label>
          <p className="text-sm text-muted-foreground mb-3">
            Configure accessibility options
          </p>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Suppress ARIA Column Count</Label>
              <p className="text-sm text-muted-foreground">
                Optimize screen readers by hiding column count
              </p>
            </div>
            <Switch
              checked={settings.suppressAriaColCount}
              onCheckedChange={(value) => onSettingChange('suppressAriaColCount', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Suppress ARIA Row Count</Label>
              <p className="text-sm text-muted-foreground">
                Optimize screen readers by hiding row count
              </p>
            </div>
            <Switch
              checked={settings.suppressAriaRowCount}
              onCheckedChange={(value) => onSettingChange('suppressAriaRowCount', value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 