import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { SettingsSectionProps } from "../types";

export function ExportSection({ settings, onSettingChange }: SettingsSectionProps) {
  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="space-y-4">
          <Label className="text-base font-semibold">Export Options</Label>
          <p className="text-sm text-muted-foreground mb-3">
            Configure data export settings
          </p>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">CSV Export</Label>
              <p className="text-sm text-muted-foreground">
                Allow exporting to CSV
              </p>
            </div>
            <Switch
              checked={!settings.suppressCsvExport}
              onCheckedChange={(value) => onSettingChange('suppressCsvExport', !value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Excel Export</Label>
              <p className="text-sm text-muted-foreground">
                Allow exporting to Excel
              </p>
            </div>
            <Switch
              checked={!settings.suppressExcelExport}
              onCheckedChange={(value) => onSettingChange('suppressExcelExport', !value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 