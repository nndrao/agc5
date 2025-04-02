import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  AlignJustify,
  Type,
  Italic,
  Square
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { ExtendedColumnState } from './types';

interface CellSettingsProps {
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

// Border styles
const borderStyles = [
  { value: 'none', label: 'None' },
  { value: 'solid', label: 'Solid' },
  { value: 'dashed', label: 'Dashed' },
  { value: 'dotted', label: 'Dotted' },
  { value: 'double', label: 'Double' },
];

export function CellSettings({ 
  column, 
  onChange,
  onApplyToGroup
}: CellSettingsProps) {
  // Cell preview style
  const cellPreviewStyle = {
    backgroundColor: column.cellBackgroundColor || '#ffffff',
    color: column.cellTextColor || '#000000',
    fontFamily: column.cellFontFamily || 'Inter',
    fontSize: `${column.cellFontSize || 14}px`,
    fontWeight: column.cellFontWeight || 'normal',
    fontStyle: column.cellFontStyle || 'normal',
    textAlign: column.cellAlignment || 'left',
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #e2e8f0',
  };
  
  return (
    <div className="space-y-6">
      {/* Cell preview */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Cell Preview</h3>
        <div style={cellPreviewStyle as React.CSSProperties} className="mt-2">
          Sample cell value
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
            onClick={() => onApplyToGroup('cellAlignment', column.cellAlignment)}
          >
            Apply to Group
          </Button>
        </div>
        
        <div className="space-y-2">
          <Label>Alignment</Label>
          <Select
            value={column.cellAlignment || 'left'}
            onValueChange={(value) => onChange('cellAlignment', value)}
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
              onClick={() => onApplyToGroup('cellBackgroundColor', column.cellBackgroundColor)}
            >
              Apply BG to Group
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onApplyToGroup('cellTextColor', column.cellTextColor)}
            >
              Apply Text to Group
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Background Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={column.cellBackgroundColor || '#ffffff'}
              onChange={(e) => onChange('cellBackgroundColor', e.target.value)}
              className="w-12 h-8 p-1"
            />
            <Input
              value={column.cellBackgroundColor || '#ffffff'}
              onChange={(e) => onChange('cellBackgroundColor', e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Text Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={column.cellTextColor || '#000000'}
              onChange={(e) => onChange('cellTextColor', e.target.value)}
              className="w-12 h-8 p-1"
            />
            <Input
              value={column.cellTextColor || '#000000'}
              onChange={(e) => onChange('cellTextColor', e.target.value)}
              className="flex-1"
            />
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
                cellFontFamily: column.cellFontFamily,
                cellFontSize: column.cellFontSize,
                cellFontWeight: column.cellFontWeight,
                cellFontStyle: column.cellFontStyle,
              };
              
              // Apply all font settings to group
              Object.entries(fontSettings).forEach(([property, value]) => {
                onApplyToGroup(property as keyof ExtendedColumnState, value);
              });
            }}
          >
            Apply All to Group
          </Button>
        </div>
        
        <div className="space-y-2">
          <Label>Font Family</Label>
          <Select
            value={column.cellFontFamily || 'Inter'}
            onValueChange={(value) => onChange('cellFontFamily', value)}
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
            value={column.cellFontSize || 14}
            onChange={(e) => onChange('cellFontSize', parseInt(e.target.value))}
            min={8}
            max={32}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Font Weight</Label>
          <Select
            value={column.cellFontWeight || 'normal'}
            onValueChange={(value) => onChange('cellFontWeight', value)}
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
            value={column.cellFontStyle || 'normal'}
            onValueChange={(value) => onChange('cellFontStyle', value)}
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
      </div>
      
      <Separator />
      
      {/* Additional settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Additional Settings</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-center gap-2">
            <Switch
              id="editable"
              checked={column.editable === true}
              onCheckedChange={(checked) => onChange('editable', checked)}
            />
            <Label htmlFor="editable">Editable</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="filter"
              checked={column.filter !== false}
              onCheckedChange={(checked) => onChange('filter', checked)}
            />
            <Label htmlFor="filter">Filterable</Label>
          </div>
        </div>
      </div>
      
      <Separator />
      
      {/* Conditional Formatting */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Conditional Formatting</h3>
          <Button 
            variant="outline" 
            size="sm"
            disabled
          >
            Add Rule
          </Button>
        </div>
        
        <div className="p-4 border rounded-md bg-muted/50 text-center text-muted-foreground">
          Conditional formatting rules will be added in a future update
        </div>
      </div>
    </div>
  );
} 