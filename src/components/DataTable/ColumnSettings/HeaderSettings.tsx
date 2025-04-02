import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Bold,
  Italic,
  Underline,
  Type
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ExtendedColumnState } from './types';

interface HeaderSettingsProps {
  column: ExtendedColumnState;
  onChange: (property: keyof ExtendedColumnState, value: unknown) => void;
  onApplyToGroup: (property: keyof ExtendedColumnState, value: unknown) => void;
}

// Font families list
const fontFamilies = [
  'Inter',
  'Arial',
  'Helvetica',
  'Verdana',
  'Tahoma',
  'Trebuchet MS',
  'Times New Roman',
  'Georgia',
  'Garamond',
  'Courier New',
  'Monaco',
];

// Font weights
const fontWeights = [
  { value: 'normal', label: 'Normal' },
  { value: 'bold', label: 'Bold' },
  { value: '100', label: 'Thin (100)' },
  { value: '200', label: 'Extra Light (200)' },
  { value: '300', label: 'Light (300)' },
  { value: '400', label: 'Regular (400)' },
  { value: '500', label: 'Medium (500)' },
  { value: '600', label: 'Semi Bold (600)' },
  { value: '700', label: 'Bold (700)' },
  { value: '800', label: 'Extra Bold (800)' },
  { value: '900', label: 'Black (900)' },
];

export function HeaderSettings({ 
  column, 
  onChange,
  onApplyToGroup
}: HeaderSettingsProps) {
  // Header preview style
  const headerPreviewStyle = {
    backgroundColor: column.headerBackgroundColor || '#f4f4f4',
    color: column.headerTextColor || '#000000',
    fontFamily: column.headerFontFamily || 'Inter',
    fontSize: `${column.headerFontSize || 14}px`,
    fontWeight: column.headerFontWeight || 'normal',
    fontStyle: column.headerFontStyle || 'normal',
    textAlign: column.headerAlignment || 'left',
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #e2e8f0',
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Header Text</Label>
        <Input
          value={column.headerName || ''}
          onChange={(e) => onChange('headerName', e.target.value)}
          placeholder="Enter header text"
        />
      </div>

      <div className="space-y-2">
        <Label>Alignment</Label>
        <Select
          value={column.headerAlignment || 'left'}
          onValueChange={(value) => onChange('headerAlignment', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select alignment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="right">Right</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Background Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={column.headerBackgroundColor || '#f4f4f4'}
            onChange={(e) => onChange('headerBackgroundColor', e.target.value)}
            className="w-12 h-8 p-1"
          />
          <Input
            value={column.headerBackgroundColor || '#f4f4f4'}
            onChange={(e) => onChange('headerBackgroundColor', e.target.value)}
            className="flex-1"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Text Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={column.headerTextColor || '#000000'}
            onChange={(e) => onChange('headerTextColor', e.target.value)}
            className="w-12 h-8 p-1"
          />
          <Input
            value={column.headerTextColor || '#000000'}
            onChange={(e) => onChange('headerTextColor', e.target.value)}
            className="flex-1"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Font Family</Label>
        <Select
          value={column.headerFontFamily || 'Inter'}
          onValueChange={(value) => onChange('headerFontFamily', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select font family" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Inter">Inter</SelectItem>
            <SelectItem value="Arial">Arial</SelectItem>
            <SelectItem value="Helvetica">Helvetica</SelectItem>
            <SelectItem value="Times New Roman">Times New Roman</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Font Size</Label>
        <Input
          type="number"
          value={column.headerFontSize || 14}
          onChange={(e) => onChange('headerFontSize', parseInt(e.target.value))}
          min={8}
          max={32}
        />
      </div>

      <div className="space-y-2">
        <Label>Font Weight</Label>
        <Select
          value={column.headerFontWeight || 'normal'}
          onValueChange={(value) => onChange('headerFontWeight', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select font weight" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="bold">Bold</SelectItem>
            <SelectItem value="lighter">Lighter</SelectItem>
            <SelectItem value="bolder">Bolder</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Font Style</Label>
        <Select
          value={column.headerFontStyle || 'normal'}
          onValueChange={(value) => onChange('headerFontStyle', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select font style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="italic">Italic</SelectItem>
            <SelectItem value="oblique">Oblique</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => onApplyToGroup('headerName', column.headerName)}
      >
        Apply to Group
      </Button>
    </div>
  );
} 