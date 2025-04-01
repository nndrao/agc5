import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SortingSettingsProps {
  settings: any;
  onChange: (category: string, setting: string, value: any) => void;
}

export function SortingSettings({ settings, onChange }: SortingSettingsProps) {
  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Sort Behavior</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="multiSortKey">Enable Multi-Column Sort</Label>
            <Switch
              id="multiSortKey"
              checked={settings.multiSortKey || 'ctrl'}
              onCheckedChange={(checked) => onChange('sorting', 'multiSortKey', checked ? 'ctrl' : null)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="unSortIcon">Show Unsort Icon</Label>
            <Switch
              id="unSortIcon"
              checked={settings.unSortIcon || false}
              onCheckedChange={(checked) => onChange('sorting', 'unSortIcon', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="suppressMultiSortUnSort">Disable Unsort in Multi-Sort</Label>
            <Switch
              id="suppressMultiSortUnSort"
              checked={settings.suppressMultiSortUnSort || false}
              onCheckedChange={(checked) => onChange('sorting', 'suppressMultiSortUnSort', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="suppressMaintainUnsortedOrder">Maintain Unsorted Order</Label>
            <Switch
              id="suppressMaintainUnsortedOrder"
              checked={settings.suppressMaintainUnsortedOrder || false}
              onCheckedChange={(checked) => onChange('sorting', 'suppressMaintainUnsortedOrder', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sort Animation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="animateRows">Enable Row Animation</Label>
            <Switch
              id="animateRows"
              checked={settings.animateRows || true}
              onCheckedChange={(checked) => onChange('sorting', 'animateRows', checked)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sortingOrder">Default Sorting Order</Label>
            <Select
              value={settings.sortingOrder || 'asc'}
              onValueChange={(value) => onChange('sorting', 'sortingOrder', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select sorting order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
                <SelectItem value="null">Unsorted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Advanced Sorting</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="enableMultiRowSorting">Enable Multi-Row Sorting</Label>
            <Switch
              id="enableMultiRowSorting"
              checked={settings.enableMultiRowSorting || false}
              onCheckedChange={(checked) => onChange('sorting', 'enableMultiRowSorting', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="enableServerSideSorting">Enable Server-Side Sorting</Label>
            <Switch
              id="enableServerSideSorting"
              checked={settings.enableServerSideSorting || false}
              onCheckedChange={(checked) => onChange('sorting', 'enableServerSideSorting', checked)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comparator">Custom Comparator</Label>
            <Select
              value={settings.comparator || 'default'}
              onValueChange={(value) => onChange('sorting', 'comparator', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select comparator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="alphanumeric">Alphanumeric</SelectItem>
                <SelectItem value="numeric">Numeric</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 