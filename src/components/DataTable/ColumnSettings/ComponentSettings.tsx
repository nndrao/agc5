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

interface ComponentSettingsProps {
  column: any;
  onChange: (property: string, value: any) => void;
  onApplyToGroup: (property: string, value: any) => void;
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
  onChange,
  onApplyToGroup
}: ComponentSettingsProps) {
  const [activeTab, setActiveTab] = useState('renderer');
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="renderer">Cell Renderer</TabsTrigger>
          <TabsTrigger value="editor">Cell Editor</TabsTrigger>
          <TabsTrigger value="sizing">Column Sizing</TabsTrigger>
        </TabsList>
        
        {/* Cell Renderer Tab */}
        <TabsContent value="renderer" className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Cell Renderer</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onApplyToGroup('cellRenderer', column.cellRenderer)}
              >
                Apply to Group
              </Button>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              {cellRenderers.map((renderer) => (
                <div
                  key={renderer.value}
                  className={cn(
                    "flex items-start p-3 rounded-md cursor-pointer border",
                    column.cellRenderer === renderer.value ? "border-primary bg-primary/5" : "border-input"
                  )}
                  onClick={() => onChange('cellRenderer', renderer.value)}
                >
                  <renderer.icon className="h-5 w-5 mr-3 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-medium">{renderer.label}</div>
                    <div className="text-sm text-muted-foreground">{renderer.description}</div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Custom renderer settings */}
            {column.cellRenderer === 'customRenderer' && (
              <>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="customRenderer">Custom Renderer Component</Label>
                  <Input
                    id="customRenderer"
                    placeholder="e.g. MyCustomCellRenderer"
                    value={column.customRenderer || ''}
                    onChange={(e) => onChange('customRenderer', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the name of a registered custom cell renderer component
                  </p>
                </div>
              </>
            )}
          </div>
        </TabsContent>
        
        {/* Cell Editor Tab */}
        <TabsContent value="editor" className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Cell Editor</h3>
              <div className="flex items-center gap-2">
                <Switch
                  id="editable"
                  checked={column.editable === true}
                  onCheckedChange={(checked) => onChange('editable', checked)}
                />
                <Label htmlFor="editable">Editable</Label>
              </div>
            </div>
            
            <Select
              value={column.cellEditor || 'agTextCellEditor'}
              onValueChange={(value) => onChange('cellEditor', value)}
              disabled={!column.editable}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select editor type" />
              </SelectTrigger>
              <SelectContent>
                {cellEditors.map((editor) => (
                  <SelectItem key={editor.value} value={editor.value}>
                    <div className="flex flex-col">
                      <span>{editor.label}</span>
                      <span className="text-xs text-muted-foreground">{editor.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Editor-specific settings */}
            {column.cellEditor === 'agSelectCellEditor' && (
              <div className="space-y-2">
                <Label>Select Options</Label>
                <div className="p-4 border rounded">
                  <p className="text-sm text-muted-foreground mb-2">
                    Enter values, one per line:
                  </p>
                  <textarea
                    className="w-full min-h-[100px] p-2 border rounded"
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
        </TabsContent>
        
        {/* Column Sizing Tab */}
        <TabsContent value="sizing" className="space-y-6 pt-4">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Column Width</h3>
            
            <div className="grid gap-4">
              <div>
                <Label htmlFor="columnWidth">Width ({column.width || 'auto'}px)</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Slider
                    id="columnWidth"
                    value={[column.width || 200]}
                    min={50}
                    max={500}
                    step={10}
                    onValueChange={(value) => onChange('width', value[0])}
                    disabled={column.flex !== undefined && column.flex > 0}
                  />
                  <Input
                    type="number"
                    className="w-20"
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
                <Label htmlFor="useFlex">Use flex sizing</Label>
              </div>
              
              {column.flex !== undefined && column.flex > 0 && (
                <div>
                  <Label htmlFor="flexValue">Flex value ({column.flex})</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Slider
                      id="flexValue"
                      value={[column.flex]}
                      min={1}
                      max={10}
                      step={1}
                      onValueChange={(value) => onChange('flex', value[0])}
                    />
                    <Input
                      type="number"
                      className="w-20"
                      value={column.flex}
                      onChange={(e) => onChange('flex', parseInt(e.target.value) || 1)}
                      min={1}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Higher values receive more space (relative to other flex columns)
                  </p>
                </div>
              )}
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Size Constraints</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="minWidth">Min Width (px)</Label>
                  <Input
                    id="minWidth"
                    type="number"
                    value={column.minWidth || ''}
                    onChange={(e) => onChange('minWidth', parseInt(e.target.value) || undefined)}
                    min={20}
                    placeholder="Min width..."
                  />
                </div>
                <div>
                  <Label htmlFor="maxWidth">Max Width (px)</Label>
                  <Input
                    id="maxWidth"
                    type="number"
                    value={column.maxWidth || ''}
                    onChange={(e) => onChange('maxWidth', parseInt(e.target.value) || undefined)}
                    min={50}
                    placeholder="Max width..."
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Switch
                  id="resizable"
                  checked={column.resizable !== false}
                  onCheckedChange={(checked) => onChange('resizable', checked)}
                />
                <Label htmlFor="resizable">Allow manual resizing</Label>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // This would trigger the autoSizeColumn API in the actual app
                    // For this example, we'll just set a simulated width
                    onChange('width', 150);
                  }}
                >
                  <Minimize2 className="h-4 w-4 mr-2" />
                  <span>Auto-size to Content</span>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // For this example, we'll just set a simulated width
                    onChange('width', 200);
                  }}
                >
                  <Maximize2 className="h-4 w-4 mr-2" />
                  <span>Reset to Default</span>
                </Button>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Column Position</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="pinned">Pin Position</Label>
                  <Select
                    value={column.pinned || ''}
                    onValueChange={(value) => onChange('pinned', value === 'none' ? null : value)}
                  >
                    <SelectTrigger id="pinned">
                      <SelectValue placeholder="Select pin position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Not Pinned</SelectItem>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="rowGroup">Row Grouping</Label>
                  <Select
                    value={column.rowGroup ? 'true' : 'false'}
                    onValueChange={(value) => onChange('rowGroup', value === 'true')}
                  >
                    <SelectTrigger id="rowGroup">
                      <SelectValue placeholder="Select grouping" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">No Grouping</SelectItem>
                      <SelectItem value="true">Group by this column</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 