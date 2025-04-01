import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EditingSettingsProps {
  settings: any;
  onChange: (category: string, setting: string, value: any) => void;
}

export function EditingSettings({ settings, onChange }: EditingSettingsProps) {
  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Editing Behavior</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="editType">Edit Type</Label>
            <Select
              value={settings.editType || 'doubleClick'}
              onValueChange={(value) => onChange('editing', 'editType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select edit type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="doubleClick">Double Click</SelectItem>
                <SelectItem value="singleClick">Single Click</SelectItem>
                <SelectItem value="fullRow">Full Row</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="singleClickEdit">Enable Single Click Editing</Label>
            <Switch
              id="singleClickEdit"
              checked={settings.singleClickEdit || false}
              onCheckedChange={(checked) => onChange('editing', 'singleClickEdit', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="suppressClickEdit">Disable Click Editing</Label>
            <Switch
              id="suppressClickEdit"
              checked={settings.suppressClickEdit || false}
              onCheckedChange={(checked) => onChange('editing', 'suppressClickEdit', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Navigation Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="enterNavigatesVertically">Enter Key Navigates Vertically</Label>
            <Switch
              id="enterNavigatesVertically"
              checked={settings.enterNavigatesVertically || true}
              onCheckedChange={(checked) => onChange('editing', 'enterNavigatesVertically', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="enterNavigatesVerticallyAfterEdit">Enter Key Navigates Vertically After Edit</Label>
            <Switch
              id="enterNavigatesVerticallyAfterEdit"
              checked={settings.enterNavigatesVerticallyAfterEdit || true}
              onCheckedChange={(checked) => onChange('editing', 'enterNavigatesVerticallyAfterEdit', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cell Selection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cellSelection">Cell Selection Mode</Label>
            <Select
              value={settings.cellSelection?.handle || 'fill'}
              onValueChange={(value) => onChange('editing', 'cellSelection', { handle: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select cell selection mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fill">Fill Handle</SelectItem>
                <SelectItem value="range">Range Selection</SelectItem>
                <SelectItem value="true">Single Cell</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 