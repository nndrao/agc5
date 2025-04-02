import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ExportSettingsProps {
  settings: any;
  onChange: (category: string, setting: string, value: any) => void;
}

export function ExportSettings({ settings, onChange }: ExportSettingsProps) {
  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Export Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="enableExcelExport">Enable Excel Export</Label>
            <Switch
              id="enableExcelExport"
              checked={settings.enableExcelExport || true}
              onCheckedChange={(checked) => onChange('export', 'enableExcelExport', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="enableCsvExport">Enable CSV Export</Label>
            <Switch
              id="enableCsvExport"
              checked={settings.enableCsvExport || true}
              onCheckedChange={(checked) => onChange('export', 'enableCsvExport', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="exportSelectedRowsOnly">Export Selected Rows Only</Label>
            <Switch
              id="exportSelectedRowsOnly"
              checked={settings.exportSelectedRowsOnly || false}
              onCheckedChange={(checked) => onChange('export', 'exportSelectedRowsOnly', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="exportHiddenColumns">Include Hidden Columns</Label>
            <Switch
              id="exportHiddenColumns"
              checked={settings.exportHiddenColumns || false}
              onCheckedChange={(checked) => onChange('export', 'exportHiddenColumns', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>CSV Export Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="csvDelimiter">CSV Delimiter</Label>
            <Select
              value={settings.csvDelimiter || ','}
              onValueChange={(value) => onChange('export', 'csvDelimiter', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select CSV delimiter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=",">Comma (,)</SelectItem>
                <SelectItem value=";">Semicolon (;)</SelectItem>
                <SelectItem value="\t">Tab (\t)</SelectItem>
                <SelectItem value="|">Pipe (|)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="csvIncludeHeaders">Include Headers</Label>
            <Switch
              id="csvIncludeHeaders"
              checked={settings.csvIncludeHeaders || true}
              onCheckedChange={(checked) => onChange('export', 'csvIncludeHeaders', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="csvWrapText">Wrap Text in Quotes</Label>
            <Switch
              id="csvWrapText"
              checked={settings.csvWrapText || true}
              onCheckedChange={(checked) => onChange('export', 'csvWrapText', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Excel Export Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="excelIncludeStyles">Include Styles</Label>
            <Switch
              id="excelIncludeStyles"
              checked={settings.excelIncludeStyles || true}
              onCheckedChange={(checked) => onChange('export', 'excelIncludeStyles', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="excelIncludeImages">Include Images</Label>
            <Switch
              id="excelIncludeImages"
              checked={settings.excelIncludeImages || false}
              onCheckedChange={(checked) => onChange('export', 'excelIncludeImages', checked)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excelSheetName">Default Sheet Name</Label>
            <Select
              value={settings.excelSheetName || 'Sheet1'}
              onValueChange={(value) => onChange('export', 'excelSheetName', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select sheet name" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sheet1">Sheet1</SelectItem>
                <SelectItem value="Data">Data</SelectItem>
                <SelectItem value="Grid">Grid</SelectItem>
                <SelectItem value="Export">Export</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 