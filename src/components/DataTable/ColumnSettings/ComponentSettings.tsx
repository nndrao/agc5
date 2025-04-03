import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  Check, 
  Calendar, 
  ListFilter, 
  Sliders, 
  LayoutGrid, 
  Link, 
  Image,
  BadgeCheck,
  Star,
  ToggleLeft,
  ArrowUpDown,
  Maximize2,
  Minimize2,
  ArrowRightLeft
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { ExtendedColumnState } from './types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface ComponentSettingsProps {
  column: ExtendedColumnState;
  onChange: (property: keyof ExtendedColumnState, value: unknown) => void;
}

// Cell renderer options
const cellRenderers = [
  { value: 'agCellRenderer', label: 'Default', icon: LayoutGrid, description: 'Standard cell renderer' },
  { value: 'agAnimateShowChangeCellRenderer', label: 'Animate Change', icon: ArrowRightLeft, description: 'Highlights changes to values' },
  { value: 'agAnimateSlideCellRenderer', label: 'Slide', icon: ArrowUpDown, description: 'Slides new values in' },
  { value: 'agGroupCellRenderer', label: 'Group', icon: ListFilter, description: 'For grouped data' },
  { value: 'checkboxRenderer', label: 'Checkbox', icon: Check, description: 'Boolean values as checkboxes' },
  { value: 'imageCellRenderer', label: 'Image', icon: Image, description: 'Displays an image' },
  { value: 'linkCellRenderer', label: 'Link', icon: Link, description: 'Clickable link' },
  { value: 'ratingRenderer', label: 'Rating', icon: Star, description: 'Star rating display' },
  { value: 'badgeCellRenderer', label: 'Badge', icon: BadgeCheck, description: 'Status badges' },
  { value: 'customRenderer', label: 'Custom', icon: Sliders, description: 'Custom component' },
];

// Cell editor options
const cellEditors = [
  { value: 'agTextCellEditor', label: 'Text', description: 'Standard text input' },
  { value: 'agLargeTextCellEditor', label: 'Large Text', description: 'For multi-line text' },
  { value: 'agSelectCellEditor', label: 'Select', description: 'Dropdown selection' },
  { value: 'agNumberCellEditor', label: 'Number', description: 'Number input' },
  { value: 'agCheckboxCellEditor', label: 'Checkbox', description: 'Toggle for boolean values' },
  { value: 'agDateCellEditor', label: 'Date', description: 'Date picker' },
  { value: 'customEditor', label: 'Custom', description: 'Custom editor component' },
];

export function ComponentSettings({ 
  column, 
  onChange
}: ComponentSettingsProps) {
  // Create a preview style for the sample cell
  const cellPreviewStyle = {
    backgroundColor: column.cellBackgroundColor || '#ffffff',
    color: column.cellTextColor || '#000000',
    fontFamily: column.cellFontFamily || 'Inter',
    fontSize: `${column.cellFontSize || 14}px`,
    fontWeight: column.cellFontWeight || 'normal',
    fontStyle: column.cellFontStyle || 'normal',
    textAlign: column.cellAlignment || 'left' as 'left' | 'center' | 'right',
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #e2e8f0',
    width: '100%',
  };

  // Get a sample value based on the column's data type
  const getSampleValue = () => {
    if (column.cellRenderer === 'checkboxRenderer') return '✓';
    if (column.cellRenderer === 'ratingRenderer') return '★★★☆☆';
    if (column.cellRenderer === 'badgeCellRenderer') return <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Active</span>;
    return column.headerName || column.colId || 'Sample Value';
  };
  
  return (
    <div className="space-y-4">
      {/* Sample cell preview */}
      <div className="mb-4">
        <Label className="text-xs text-muted-foreground mb-1 block">Component Preview</Label>
        <div style={cellPreviewStyle}>
          {getSampleValue()}
        </div>
      </div>
    
      <Accordion type="single" collapsible defaultValue="renderer">
        <AccordionItem value="renderer">
          <AccordionTrigger className="text-sm font-medium">Cell Renderer</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">Cell Renderer Type</Label>
                <div className="flex items-center gap-2">
                  <Switch
                    id="editable"
                    checked={column.editable === true}
                    onCheckedChange={(checked) => onChange('editable', checked)}
                  />
                  <Label htmlFor="editable" className="text-xs">Editable</Label>
                </div>
              </div>
            
              <Select
                value={column.cellRenderer || 'none'}
                onValueChange={(value) => onChange('cellRenderer', value)}
              >
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Select cell renderer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="button">Button</SelectItem>
                  <SelectItem value="checkbox">Checkbox</SelectItem>
                  <SelectItem value="progress">Progress Bar</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="status">Status Badge</SelectItem>
                </SelectContent>
              </Select>
            
              <div className="grid gap-3 md:grid-cols-2">
                {cellRenderers.map((renderer) => (
                  <div
                    key={renderer.value}
                    className={cn(
                      "flex items-start p-3 rounded-md cursor-pointer border",
                      column.cellRenderer === renderer.value ? "border-primary bg-primary/5" : "border-input"
                    )}
                    onClick={() => onChange('cellRenderer', renderer.value)}
                  >
                    <renderer.icon className="h-4 w-4 mr-2 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-medium text-sm">{renderer.label}</div>
                      <div className="text-xs text-muted-foreground">{renderer.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            
              {/* Custom renderer settings */}
              {column.cellRenderer === 'customRenderer' && (
                <>
                  <Separator className="my-2" />
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground mb-1 block">Custom Component Name</Label>
                    <Input
                      id="customRenderer"
                      placeholder="e.g. MyCustomCellRenderer"
                      value={column.customRenderer || ''}
                      onChange={(e) => onChange('customRenderer', e.target.value)}
                      className="h-8"
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter the name of a registered custom component
                    </p>
                  </div>
                </>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      
        <AccordionItem value="editor">
          <AccordionTrigger className="text-sm font-medium">Cell Editor</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">Editor Type</Label>
                <div className="flex items-center gap-2">
                  <Switch
                    id="cell-editable"
                    checked={column.editable === true}
                    onCheckedChange={(checked) => onChange('editable', checked)}
                  />
                  <Label htmlFor="cell-editable" className="text-xs">Editable</Label>
                </div>
              </div>
            
              <Select
                value={column.cellEditor || 'none'}
                onValueChange={(value) => onChange('cellEditor', value)}
                disabled={!column.editable}
              >
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Select cell editor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="text">Text Input</SelectItem>
                  <SelectItem value="number">Number Input</SelectItem>
                  <SelectItem value="date">Date Picker</SelectItem>
                  <SelectItem value="select">Select Dropdown</SelectItem>
                  <SelectItem value="checkbox">Checkbox</SelectItem>
                </SelectContent>
              </Select>
            
              {/* Editor-specific settings */}
              {column.cellEditor === 'agSelectCellEditor' && column.editable && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground mb-1 block">Select Options</Label>
                  <div className="p-3 border rounded">
                    <p className="text-xs text-muted-foreground mb-2">
                      Enter values, one per line:
                    </p>
                    <textarea
                      className="w-full min-h-[100px] p-2 border rounded text-sm"
                      placeholder="Option 1&#10;Option 2&#10;Option 3"
                      value={column.cellEditorParams?.values?.join('\n') || ''}
                      onChange={(e) => {
                        const values = e.target.value.split('\n').filter(v => v.trim());
                        onChange('cellEditorParams', { ...column.cellEditorParams, values });
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      
        <AccordionItem value="sizing">
          <AccordionTrigger className="text-sm font-medium">Column Sizing</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground mb-1 block">Width ({column.width || 'auto'}px)</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    id="columnWidth"
                    value={[column.width || 200]}
                    min={50}
                    max={500}
                    step={10}
                    onValueChange={(value) => onChange('width', value[0])}
                    disabled={column.flex !== undefined && column.flex > 0}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    className="w-16 h-8"
                    value={column.width || ''}
                    onChange={(e) => onChange('width', parseInt(e.target.value) || undefined)}
                    min={50}
                    disabled={column.flex !== undefined && column.flex > 0}
                  />
                </div>
              </div>
            
              <div className="flex items-center gap-2">
                <Checkbox
                  id="useFlex"
                  checked={column.flex !== undefined && column.flex > 0}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onChange('flex', 1);
                      onChange('width', undefined);
                    } else {
                      onChange('flex', undefined);
                      onChange('width', 200);
                    }
                  }}
                />
                <Label htmlFor="useFlex" className="text-sm">Use flex sizing</Label>
              </div>
            
              {column.flex !== undefined && column.flex > 0 && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground mb-1 block">Flex value ({column.flex})</Label>
                  <div className="flex items-center gap-2">
                    <Slider
                      id="flexValue"
                      value={[column.flex]}
                      min={1}
                      max={10}
                      step={1}
                      onValueChange={(value) => onChange('flex', value[0])}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      className="w-16 h-8"
                      value={column.flex}
                      onChange={(e) => onChange('flex', parseInt(e.target.value) || 1)}
                      min={1}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Higher values receive more space (relative to other flex columns)
                  </p>
                </div>
              )}
            
              <Separator className="my-2" />
            
              <div className="grid gap-4 grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground mb-1 block">Min Width (px)</Label>
                  <Input
                    id="minWidth"
                    type="number"
                    value={column.minWidth || ''}
                    onChange={(e) => onChange('minWidth', parseInt(e.target.value) || undefined)}
                    min={20}
                    placeholder="Min width..."
                    className="h-8"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground mb-1 block">Max Width (px)</Label>
                  <Input
                    id="maxWidth"
                    type="number"
                    value={column.maxWidth || ''}
                    onChange={(e) => onChange('maxWidth', parseInt(e.target.value) || undefined)}
                    min={50}
                    placeholder="Max width..."
                    className="h-8"
                  />
                </div>
              </div>
            
              <div className="flex items-center gap-2">
                <Switch
                  id="resizable"
                  checked={column.resizable !== false}
                  onCheckedChange={(checked) => onChange('resizable', checked)}
                />
                <Label htmlFor="resizable" className="text-sm">Allow manual resizing</Label>
              </div>
            
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto text-xs h-8"
                  onClick={() => {
                    // This would trigger the autoSizeColumn API in the actual app
                    onChange('width', 150);
                  }}
                >
                  <Minimize2 className="h-3.5 w-3.5 mr-2" />
                  <span>Auto-size to Content</span>
                </Button>
              
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto text-xs h-8"
                  onClick={() => {
                    onChange('width', 200);
                  }}
                >
                  <Maximize2 className="h-3.5 w-3.5 mr-2" />
                  <span>Reset to Default</span>
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      
        <AccordionItem value="position">
          <AccordionTrigger className="text-sm font-medium">Column Position</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <div className="grid gap-4 grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground mb-1 block">Pin Position</Label>
                  <Select
                    value={column.pinned || ''}
                    onValueChange={(value) => onChange('pinned', value === 'none' ? null : value)}
                  >
                    <SelectTrigger id="pinned" className="h-8">
                      <SelectValue placeholder="Pin position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Not Pinned</SelectItem>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground mb-1 block">Row Grouping</Label>
                  <Select
                    value={column.rowGroup ? 'true' : 'false'}
                    onValueChange={(value) => onChange('rowGroup', value === 'true')}
                  >
                    <SelectTrigger id="rowGroup" className="h-8">
                      <SelectValue placeholder="Grouping" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">No Grouping</SelectItem>
                      <SelectItem value="true">Group by this column</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            
              <div className="flex items-center gap-2">
                <Switch
                  id="sortable"
                  checked={column.sortable !== false}
                  onCheckedChange={(checked) => onChange('sortable', checked)}
                />
                <Label htmlFor="sortable" className="text-sm">Allow sorting</Label>
              </div>
            
              <div className="flex items-center gap-2">
                <Switch
                  id="filter"
                  checked={column.filter !== false}
                  onCheckedChange={(checked) => onChange('filter', checked)}
                />
                <Label htmlFor="filter" className="text-sm">Allow filtering</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    
      <Separator className="my-4" />
    </div>
  );
} 