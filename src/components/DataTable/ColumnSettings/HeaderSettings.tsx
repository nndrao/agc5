import React, { useState } from 'react';
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
  Type,
  Palette,
  Maximize2,
  Square
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ExtendedColumnState, BorderStyle } from './types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface HeaderSettingsProps {
  column: ExtendedColumnState;
  onChange: (property: keyof ExtendedColumnState, value: unknown) => void;
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

// Border style options
const borderStyleOptions = [
  { value: 'none', label: 'None' },
  { value: 'solid', label: 'Solid' },
  { value: 'dashed', label: 'Dashed' },
  { value: 'dotted', label: 'Dotted' },
  { value: 'double', label: 'Double' }
];

// Border width options (in px)
const borderWidthOptions = [
  { value: '0', label: '0px' },
  { value: '1px', label: '1px' },
  { value: '2px', label: '2px' },
  { value: '3px', label: '3px' },
  { value: '4px', label: '4px' },
  { value: '5px', label: '5px' }
];

export function HeaderSettings({ 
  column, 
  onChange
}: HeaderSettingsProps) {
  const [activeBorderSide, setActiveBorderSide] = useState<'top' | 'right' | 'bottom' | 'left'>('top');

  // Header preview style with border properties
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
    borderTop: getBorderString(column.headerBorderTop),
    borderRight: getBorderString(column.headerBorderRight),
    borderBottom: getBorderString(column.headerBorderBottom),
    borderLeft: getBorderString(column.headerBorderLeft),
  };

  // Helper function to generate CSS border string from BorderStyle object
  function getBorderString(border?: BorderStyle): string {
    if (!border || border.style === 'none') return 'none';
    return `${border.width || '1px'} ${border.style || 'solid'} ${border.color || '#ddd'}`;
  }

  // Helper function to update a specific border property
  const updateBorderProperty = (
    side: 'top' | 'right' | 'bottom' | 'left',
    property: keyof BorderStyle,
    value: string
  ) => {
    const borderProperty = `headerBorder${side.charAt(0).toUpperCase() + side.slice(1)}` as keyof ExtendedColumnState;
    const currentBorder = column[borderProperty] as BorderStyle || {};
    const updatedBorder = { ...currentBorder, [property]: value };
    onChange(borderProperty, updatedBorder);
  };
  
  return (
    <div className="space-y-4">
      {/* Header preview */}
      <div style={headerPreviewStyle} className="mb-4">
        {column.headerName || column.colId}
      </div>
      
      <Accordion type="single" collapsible defaultValue="general">
        <AccordionItem value="general">
          <AccordionTrigger className="text-sm font-medium">General Appearance</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-4 pt-2">
              {/* Column 1 - Text settings */}
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">Header Text</Label>
                  <Input
                    value={column.headerName || ''}
                    onChange={(e) => onChange('headerName', e.target.value)}
                    placeholder="Enter header text"
                    className="h-8"
                  />
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">Alignment</Label>
                  <div className="flex">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={column.headerAlignment === 'left' ? 'default' : 'outline'}
                            size="sm"
                            className="flex-1 h-8 rounded-r-none"
                            onClick={() => onChange('headerAlignment', 'left')}
                          >
                            <AlignLeft className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Left align</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={column.headerAlignment === 'center' ? 'default' : 'outline'}
                            size="sm"
                            className="flex-1 h-8 rounded-none border-x-0"
                            onClick={() => onChange('headerAlignment', 'center')}
                          >
                            <AlignCenter className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Center align</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={column.headerAlignment === 'right' ? 'default' : 'outline'}
                            size="sm"
                            className="flex-1 h-8 rounded-l-none"
                            onClick={() => onChange('headerAlignment', 'right')}
                          >
                            <AlignRight className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Right align</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">Font Style</Label>
                  <div className="flex">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={column.headerFontWeight === 'bold' ? 'default' : 'outline'}
                            size="sm"
                            className="flex-1 h-8 rounded-r-none"
                            onClick={() => onChange('headerFontWeight', column.headerFontWeight === 'bold' ? 'normal' : 'bold')}
                          >
                            <Bold className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Bold</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={column.headerFontStyle === 'italic' ? 'default' : 'outline'}
                            size="sm"
                            className="flex-1 h-8 rounded-none border-x-0"
                            onClick={() => onChange('headerFontStyle', column.headerFontStyle === 'italic' ? 'normal' : 'italic')}
                          >
                            <Italic className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Italic</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
              
              {/* Column 2 - Color settings */}
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">Font Size</Label>
                  <div className="flex items-center gap-3">
                    <Slider
                      value={[column.headerFontSize || 14]}
                      onValueChange={([value]) => onChange('headerFontSize', value)}
                      min={8}
                      max={24}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-xs w-8 text-right">{column.headerFontSize || 14}px</span>
                  </div>
                </div>
                
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">Font Family</Label>
                  <Select
                    value={column.headerFontFamily || 'Inter'}
                    onValueChange={(value) => onChange('headerFontFamily', value)}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Select font family" />
                    </SelectTrigger>
                    <SelectContent>
                      {fontFamilies.map(font => (
                        <SelectItem key={font} value={font}>
                          <span style={{ fontFamily: font }}>{font}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">Text Color</Label>
                    <div className="flex flex-col gap-1">
                      <div className="relative h-8">
                        <Button 
                          variant="outline" 
                          className="h-8 w-full flex items-center justify-between"
                          style={{ 
                            backgroundColor: column.headerTextColor || '#000000',
                            borderColor: 'rgba(0,0,0,0.2)',
                            color: getContrastColor(column.headerTextColor || '#000000')
                          }}
                          onClick={() => document.getElementById('header-text-color-picker')?.click()}
                        >
                          <div className="flex items-center">
                            <Palette className="h-3.5 w-3.5 mr-2" />
                            <span>Text</span>
                          </div>
                          <span className="text-xs opacity-80">{column.headerTextColor || '#000000'}</span>
                        </Button>
                        <Input
                          id="header-text-color-picker"
                          type="color"
                          value={column.headerTextColor || '#000000'}
                          onChange={(e) => onChange('headerTextColor', e.target.value)}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">Background</Label>
                    <div className="flex flex-col gap-1">
                      <div className="relative h-8">
                        <Button 
                          variant="outline" 
                          className="h-8 w-full flex items-center justify-between"
                          style={{ 
                            backgroundColor: column.headerBackgroundColor || '#f4f4f4',
                            borderColor: 'rgba(0,0,0,0.2)',
                            color: getContrastColor(column.headerBackgroundColor || '#f4f4f4')
                          }}
                          onClick={() => document.getElementById('header-bg-color-picker')?.click()}
                        >
                          <div className="flex items-center">
                            <Palette className="h-3.5 w-3.5 mr-2" />
                            <span>BG</span>
                          </div>
                          <span className="text-xs opacity-80">{column.headerBackgroundColor || '#f4f4f4'}</span>
                        </Button>
                        <Input
                          id="header-bg-color-picker"
                          type="color"
                          value={column.headerBackgroundColor || '#f4f4f4'}
                          onChange={(e) => onChange('headerBackgroundColor', e.target.value)}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        {/* New Border Styling Section */}
        <AccordionItem value="borders">
          <AccordionTrigger className="text-sm font-medium">Border Styling</AccordionTrigger>
          <AccordionContent>
            <div className="pt-2 space-y-4">
              <div className="flex justify-between">
                <Label className="text-xs text-muted-foreground">Select Border Side</Label>
              </div>
              
              {/* Border sides selection */}
              <Tabs value={activeBorderSide} onValueChange={(v) => setActiveBorderSide(v as any)} className="w-full">
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="top" className="text-xs">Top</TabsTrigger>
                  <TabsTrigger value="right" className="text-xs">Right</TabsTrigger>
                  <TabsTrigger value="bottom" className="text-xs">Bottom</TabsTrigger>
                  <TabsTrigger value="left" className="text-xs">Left</TabsTrigger>
                </TabsList>
              </Tabs>
              
              {/* Border configuration UI */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">Border Style</Label>
                  <Select
                    value={(column[`headerBorder${activeBorderSide.charAt(0).toUpperCase() + activeBorderSide.slice(1)}` as keyof ExtendedColumnState] as BorderStyle)?.style || 'none'}
                    onValueChange={(value) => updateBorderProperty(activeBorderSide, 'style', value)}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      {borderStyleOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">Border Width</Label>
                  <Select
                    value={(column[`headerBorder${activeBorderSide.charAt(0).toUpperCase() + activeBorderSide.slice(1)}` as keyof ExtendedColumnState] as BorderStyle)?.width || '1px'}
                    onValueChange={(value) => updateBorderProperty(activeBorderSide, 'width', value)}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Select width" />
                    </SelectTrigger>
                    <SelectContent>
                      {borderWidthOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="col-span-2">
                  <Label className="text-xs text-muted-foreground mb-1 block">Border Color</Label>
                  <div className="relative h-8">
                    <Button 
                      variant="outline" 
                      className="h-8 w-full flex items-center justify-between"
                      style={{ 
                        backgroundColor: (column[`headerBorder${activeBorderSide.charAt(0).toUpperCase() + activeBorderSide.slice(1)}` as keyof ExtendedColumnState] as BorderStyle)?.color || '#dddddd',
                        borderColor: 'rgba(0,0,0,0.2)',
                        color: getContrastColor((column[`headerBorder${activeBorderSide.charAt(0).toUpperCase() + activeBorderSide.slice(1)}` as keyof ExtendedColumnState] as BorderStyle)?.color || '#dddddd')
                      }}
                      onClick={() => document.getElementById('header-border-color-picker')?.click()}
                    >
                      <div className="flex items-center">
                        <Palette className="h-3.5 w-3.5 mr-2" />
                        <span>Border Color</span>
                      </div>
                      <span className="text-xs opacity-80">
                        {(column[`headerBorder${activeBorderSide.charAt(0).toUpperCase() + activeBorderSide.slice(1)}` as keyof ExtendedColumnState] as BorderStyle)?.color || '#dddddd'}
                      </span>
                    </Button>
                    <Input
                      id="header-border-color-picker"
                      type="color"
                      value={(column[`headerBorder${activeBorderSide.charAt(0).toUpperCase() + activeBorderSide.slice(1)}` as keyof ExtendedColumnState] as BorderStyle)?.color || '#dddddd'}
                      onChange={(e) => updateBorderProperty(activeBorderSide, 'color', e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
                
                {/* Quick actions */}
                <div className="col-span-2 flex gap-2 mt-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs h-7 flex-1"
                    onClick={() => {
                      const currentStyle = column[`headerBorder${activeBorderSide.charAt(0).toUpperCase() + activeBorderSide.slice(1)}` as keyof ExtendedColumnState] as BorderStyle || {};
                      
                      // Apply this border style to all sides
                      ['top', 'right', 'bottom', 'left'].forEach(side => {
                        const property = `headerBorder${side.charAt(0).toUpperCase() + side.slice(1)}` as keyof ExtendedColumnState;
                        onChange(property, { ...currentStyle });
                      });
                    }}
                  >
                    Apply to All Sides
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs h-7 flex-1"
                    onClick={() => {
                      // Reset current side border
                      const property = `headerBorder${activeBorderSide.charAt(0).toUpperCase() + activeBorderSide.slice(1)}` as keyof ExtendedColumnState;
                      onChange(property, { style: 'none', width: '0', color: '#dddddd' });
                    }}
                  >
                    Reset Border
                  </Button>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <Separator className="my-4" />
    </div>
  );
}

// Helper function to determine text color based on background
function getContrastColor(hexColor: string): string {
  // Remove the hash if it exists
  hexColor = hexColor.replace('#', '');
  
  // Parse the color
  const r = parseInt(hexColor.substr(0, 2), 16);
  const g = parseInt(hexColor.substr(2, 2), 16);
  const b = parseInt(hexColor.substr(4, 2), 16);
  
  // Calculate luminance (perceived brightness)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black for light colors and white for dark colors
  return luminance > 0.5 ? '#000000' : '#ffffff';
} 