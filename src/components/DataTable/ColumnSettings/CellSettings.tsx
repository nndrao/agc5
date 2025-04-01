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

interface CellSettingsProps {
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
        
        <div className="flex gap-2">
          <Button
            variant={column.cellAlignment === 'left' ? 'default' : 'outline'}
            size="icon"
            onClick={() => onChange('cellAlignment', 'left')}
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant={column.cellAlignment === 'center' ? 'default' : 'outline'}
            size="icon"
            onClick={() => onChange('cellAlignment', 'center')}
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant={column.cellAlignment === 'right' ? 'default' : 'outline'}
            size="icon"
            onClick={() => onChange('cellAlignment', 'right')}
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
          <Button
            variant={column.cellAlignment === 'justify' ? 'default' : 'outline'}
            size="icon"
            onClick={() => onChange('cellAlignment', 'justify')}
            title="Justify"
          >
            <AlignJustify className="h-4 w-4" />
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
        
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="cellBackgroundColor">Background Color</Label>
            <div className="flex mt-2 gap-2">
              <div 
                className="h-10 w-10 rounded-md border"
                style={{ backgroundColor: column.cellBackgroundColor || '#ffffff' }}
              />
              <Input
                id="cellBackgroundColor"
                type="color"
                value={column.cellBackgroundColor || '#ffffff'}
                onChange={(e) => onChange('cellBackgroundColor', e.target.value)}
                className="w-full h-10"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="cellTextColor">Text Color</Label>
            <div className="flex mt-2 gap-2">
              <div 
                className="h-10 w-10 rounded-md border"
                style={{ backgroundColor: column.cellTextColor || '#000000' }}
              />
              <Input
                id="cellTextColor"
                type="color"
                value={column.cellTextColor || '#000000'}
                onChange={(e) => onChange('cellTextColor', e.target.value)}
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
                cellFontFamily: column.cellFontFamily,
                cellFontSize: column.cellFontSize,
                cellFontWeight: column.cellFontWeight,
                cellFontStyle: column.cellFontStyle,
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
            <Label htmlFor="cellFontFamily">Font Family</Label>
            <Select
              value={column.cellFontFamily || 'Inter'}
              onValueChange={(value) => onChange('cellFontFamily', value)}
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
            <Label htmlFor="cellFontSize">Font Size ({column.cellFontSize || 14}px)</Label>
            <Slider
              id="cellFontSize"
              value={[column.cellFontSize || 14]}
              min={8}
              max={24}
              step={1}
              onValueChange={(value) => onChange('cellFontSize', value[0])}
              className="mt-2"
            />
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="cellFontWeight">Font Weight</Label>
            <Select
              value={column.cellFontWeight || 'normal'}
              onValueChange={(value) => onChange('cellFontWeight', value)}
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
            <Label htmlFor="cellFontStyle">Font Style</Label>
            <div className="flex gap-2 mt-2">
              <Button
                variant={column.cellFontStyle === 'normal' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onChange('cellFontStyle', 'normal')}
                title="Normal"
              >
                <Type className="h-4 w-4 mr-2" />
                Normal
              </Button>
              <Button
                variant={column.cellFontStyle === 'italic' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onChange('cellFontStyle', 'italic')}
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