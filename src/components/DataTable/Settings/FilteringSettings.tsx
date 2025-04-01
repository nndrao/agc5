import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FilteringSettingsProps {
  settings: any;
  onChange: (category: string, setting: string, value: any) => void;
}

export function FilteringSettings({ settings, onChange }: FilteringSettingsProps) {
  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Filter Behavior</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="suppressMenuHide">Keep Filter Menu Open</Label>
            <Switch
              id="suppressMenuHide"
              checked={settings.suppressMenuHide || false}
              onCheckedChange={(checked) => onChange('filtering', 'suppressMenuHide', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="floatingFilter">Enable Floating Filters</Label>
            <Switch
              id="floatingFilter"
              checked={settings.floatingFilter || false}
              onCheckedChange={(checked) => onChange('filtering', 'floatingFilter', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Filter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="quickFilterText">Quick Filter Text</Label>
            <Input
              id="quickFilterText"
              value={settings.quickFilterText || ''}
              onChange={(e) => onChange('filtering', 'quickFilterText', e.target.value)}
              placeholder="Enter quick filter text..."
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="cacheQuickFilter">Cache Quick Filter</Label>
            <Switch
              id="cacheQuickFilter"
              checked={settings.cacheQuickFilter || true}
              onCheckedChange={(checked) => onChange('filtering', 'cacheQuickFilter', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Advanced Filtering</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="excludeChildrenWhenTreeDataFiltering">Exclude Children in Tree Data Filtering</Label>
            <Switch
              id="excludeChildrenWhenTreeDataFiltering"
              checked={settings.excludeChildrenWhenTreeDataFiltering || false}
              onCheckedChange={(checked) => onChange('filtering', 'excludeChildrenWhenTreeDataFiltering', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 