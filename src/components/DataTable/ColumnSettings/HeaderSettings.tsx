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

interface HeaderSettingsProps {
  column: any;
  onChange: (property: string, value: any) => void;
  onApplyToGroup: (property: string, value: any) => void;
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
    <div className="space-y-6">
      {/* Header title and preview */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Header Text</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="headerName">Header Text</Label>
            <Input
              id="headerName"
              value={column.headerName || ''}
              onChange={(e) => onChange('headerName', e.target.value)}
              placeholder="Enter header text"
            />
          </div>
          <div>
            <Label>Preview</Label>
            <div style={headerPreviewStyle as React.CSSProperties} className="mt-2">
              {column.headerName || column.field || column.colId}
            </div>
          </div>
        </div>
      </div>
      
      <Separator />
      
      {/* Alignment options */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Alignment</h3>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onApplyToGroup('headerAlignment', column.headerAlignment)}
          >
            Apply to Group
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={column.headerAlignment === 'left' ? 'default' : 'outline'}
            size="icon"
            onClick={() => onChange('headerAlignment', 'left')}
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant={column.headerAlignment === 'center' ? 'default' : 'outline'}
            size="icon"
            onClick={() => onChange('headerAlignment', 'center')}
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant={column.headerAlignment === 'right' ? 'default' : 'outline'}
            size="icon"
            onClick={() => onChange('headerAlignment', 'right')}
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Separator />
      
      {/* Colors */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Colors</h3>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onApplyToGroup('headerBackgroundColor', column.headerBackgroundColor)}
            >
              Apply BG to Group
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onApplyToGroup('headerTextColor', column.headerTextColor)}
            >
              Apply Text to Group
            </Button>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="headerBackgroundColor">Background Color</Label>
            <div className="flex mt-2 gap-2">
              <div 
                className="h-10 w-10 rounded-md border"
                style={{ backgroundColor: column.headerBackgroundColor || '#f4f4f4' }}
              />
              <Input
                id="headerBackgroundColor"
                type="color"
                value={column.headerBackgroundColor || '#f4f4f4'}
                onChange={(e) => onChange('headerBackgroundColor', e.target.value)}
                className="w-full h-10"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="headerTextColor">Text Color</Label>
            <div className="flex mt-2 gap-2">
              <div 
                className="h-10 w-10 rounded-md border"
                style={{ backgroundColor: column.headerTextColor || '#000000' }}
              />
              <Input
                id="headerTextColor"
                type="color"
                value={column.headerTextColor || '#000000'}
                onChange={(e) => onChange('headerTextColor', e.target.value)}
                className="w-full h-10"
              />
            </div>
          </div>
        </div>
      </div>
      
      <Separator />
      
      {/* Font settings */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Font Settings</h3>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              const fontSettings = {
                headerFontFamily: column.headerFontFamily,
                headerFontSize: column.headerFontSize,
                headerFontWeight: column.headerFontWeight,
                headerFontStyle: column.headerFontStyle,
              };
              
              // Apply all font settings to group
              Object.entries(fontSettings).forEach(([property, value]) => {
                onApplyToGroup(property, value);
              });
            }}
          >
            Apply All to Group
          </Button>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="headerFontFamily">Font Family</Label>
            <Select
              value={column.headerFontFamily || 'Inter'}
              onValueChange={(value) => onChange('headerFontFamily', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select font family" />
              </SelectTrigger>
              <SelectContent>
                {fontFamilies.map((font) => (
                  <SelectItem key={font} value={font}>
                    <span style={{ fontFamily: font }}>{font}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="headerFontSize">Font Size ({column.headerFontSize || 14}px)</Label>
            <Slider
              id="headerFontSize"
              value={[column.headerFontSize || 14]}
              min={8}
              max={24}
              step={1}
              onValueChange={(value) => onChange('headerFontSize', value[0])}
              className="mt-2"
            />
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="headerFontWeight">Font Weight</Label>
            <Select
              value={column.headerFontWeight || 'normal'}
              onValueChange={(value) => onChange('headerFontWeight', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select font weight" />
              </SelectTrigger>
              <SelectContent>
                {fontWeights.map((weight) => (
                  <SelectItem key={weight.value} value={weight.value}>
                    <span style={{ fontWeight: weight.value }}>{weight.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="headerFontStyle">Font Style</Label>
            <div className="flex gap-2 mt-2">
              <Button
                variant={column.headerFontStyle === 'normal' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onChange('headerFontStyle', 'normal')}
                title="Normal"
              >
                <Type className="h-4 w-4 mr-2" />
                Normal
              </Button>
              <Button
                variant={column.headerFontStyle === 'italic' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onChange('headerFontStyle', 'italic')}
                title="Italic"
              >
                <Italic className="h-4 w-4 mr-2" />
                Italic
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Separator />
      
      {/* Additional settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Additional Settings</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-center gap-2">
            <Switch
              id="sortable"
              checked={column.sortable !== false}
              onCheckedChange={(checked) => onChange('sortable', checked)}
            />
            <Label htmlFor="sortable">Sortable</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="resizable"
              checked={column.resizable !== false}
              onCheckedChange={(checked) => onChange('resizable', checked)}
            />
            <Label htmlFor="resizable">Resizable</Label>
          </div>
        </div>
      </div>
    </div>
  );
} 