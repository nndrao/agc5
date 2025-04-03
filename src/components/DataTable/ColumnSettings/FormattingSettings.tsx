import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  Hash, 
  Calendar, 
  Text, 
  Percent, 
  DollarSign,
  RefreshCw,
  Code
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { ExtendedColumnState } from './types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface FormattingSettingsProps {
  column: ExtendedColumnState;
  onChange: (property: keyof ExtendedColumnState, value: unknown) => void;
}

// Sample values for previewing formats
const sampleValues = {
  number: 1234.567,
  percent: 0.42,
  currency: 1234.56,
  date: new Date(),
  text: 'Sample Text'
};

// Built-in formatters
const formatters = [
  { value: 'none', label: 'None', icon: Code, category: 'general' },
  { value: 'number', label: 'Number', icon: Hash, category: 'numeric' },
  { value: 'percent', label: 'Percentage', icon: Percent, category: 'numeric' },
  { value: 'currency', label: 'Currency', icon: DollarSign, category: 'numeric' },
  { value: 'date', label: 'Date', icon: Calendar, category: 'date' },
  { value: 'dateTime', label: 'Date & Time', icon: Calendar, category: 'date' },
  { value: 'time', label: 'Time', icon: Calendar, category: 'date' },
  { value: 'text', label: 'Text', icon: Text, category: 'text' },
  { value: 'custom', label: 'Custom', icon: Code, category: 'general' },
];

// Built-in number formatter options
const numberFormatOptions = [
  { value: '0', label: 'Whole numbers (1,235)' },
  { value: '0.0', label: 'One decimal place (1,234.6)' },
  { value: '0.00', label: 'Two decimal places (1,234.57)' },
  { value: '0.000', label: 'Three decimal places (1,234.567)' },
  { value: '#,##0', label: 'Thousands separator (1,235)' },
  { value: '#,##0.00', label: 'Thousands with decimals (1,234.57)' },
];

// Built-in date formatter options
const dateFormatOptions = [
  { value: 'MM/dd/yyyy', label: 'MM/DD/YYYY (01/31/2023)' },
  { value: 'dd/MM/yyyy', label: 'DD/MM/YYYY (31/01/2023)' },
  { value: 'yyyy-MM-dd', label: 'YYYY-MM-DD (2023-01-31)' },
  { value: 'MMMM d, yyyy', label: 'Month D, YYYY (January 31, 2023)' },
  { value: 'MMM d, yyyy', label: 'Mon D, YYYY (Jan 31, 2023)' },
  { value: 'M/d/yy', label: 'M/D/YY (1/31/23)' },
];

// Built-in time formatter options
const timeFormatOptions = [
  { value: 'h:mm a', label: '12-hour (4:30 PM)' },
  { value: 'HH:mm', label: '24-hour (16:30)' },
  { value: 'h:mm:ss a', label: '12-hour with seconds (4:30:15 PM)' },
  { value: 'HH:mm:ss', label: '24-hour with seconds (16:30:15)' },
];

// Built-in date and time formatter options
const dateTimeFormatOptions = [
  { value: 'MM/dd/yyyy h:mm a', label: 'MM/DD/YYYY h:mm AM/PM (01/31/2023 4:30 PM)' },
  { value: 'dd/MM/yyyy HH:mm', label: 'DD/MM/YYYY HH:mm (31/01/2023 16:30)' },
  { value: 'yyyy-MM-dd\'T\'HH:mm:ss', label: 'ISO (2023-01-31T16:30:15)' },
];

// Function to format sample values based on the formatter
const formatSampleValue = (formatter: string, pattern: string) => {
  try {
    switch (formatter) {
      case 'none':
        return String(sampleValues.number);
      case 'number':
        const num = sampleValues.number;
        if (pattern === '0') return Math.round(num).toLocaleString();
        if (pattern === '0.0') return num.toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        if (pattern === '0.00') return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        if (pattern === '0.000') return num.toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        if (pattern === '#,##0') return Math.round(num).toLocaleString();
        if (pattern === '#,##0.00') return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return num.toLocaleString();
      case 'percent':
        const pct = sampleValues.percent;
        if (pattern === '0%') return `${Math.round(pct * 100)}%`;
        if (pattern === '0.0%') return `${(pct * 100).toFixed(1)}%`;
        if (pattern === '0.00%') return `${(pct * 100).toFixed(2)}%`;
        return `${(pct * 100).toFixed(0)}%`;
      case 'currency':
        const curr = sampleValues.currency;
        if (pattern.includes('USD')) return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(curr);
        if (pattern.includes('EUR')) return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(curr);
        if (pattern.includes('GBP')) return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(curr);
        if (pattern.includes('JPY')) return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(curr);
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(curr);
      case 'date':
        const date = sampleValues.date;
        // This is a simplistic implementation. In a real app, you'd use a proper
        // date formatting library like date-fns, luxon, or dayjs
        return date.toLocaleDateString();
      case 'time':
        const time = sampleValues.date;
        return time.toLocaleTimeString();
      case 'dateTime':
        const dateTime = sampleValues.date;
        return dateTime.toLocaleString();
      case 'text':
        return pattern.replace('{value}', sampleValues.text);
      case 'custom':
        // For custom formatters, just show the sample value with the pattern
        return `${pattern} (${sampleValues.number})`;
      default:
        return String(sampleValues.number);
    }
  } catch (error) {
    return 'Invalid format';
  }
};

export function FormattingSettings({ 
  column, 
  onChange
}: FormattingSettingsProps) {
  // Get the current formatter and pattern
  const formatter = column.valueFormatter || 'none';
  const pattern = column.valueFormatterPattern || '';
  
  // Format the sample value based on the current formatter and pattern
  const formattedValue = formatSampleValue(formatter, pattern);
  
  // Create a sample preview styles
  const samplePreviewStyle = {
    padding: '8px 12px',
    borderRadius: '4px',
    backgroundColor: '#f9f9f9',
    border: '1px solid #e2e8f0',
    fontFamily: column.cellFontFamily || 'Inter',
    fontSize: `${column.cellFontSize || 14}px`,
    fontWeight: column.cellFontWeight || 'normal',
    fontStyle: column.cellFontStyle || 'normal',
    textAlign: column.cellAlignment || 'left' as 'left' | 'center' | 'right',
  };
  
  return (
    <div className="space-y-4">
      {/* Sample output preview */}
      <div className="mb-4">
        <Label className="text-xs text-muted-foreground mb-1 block">Format Preview</Label>
        <div style={samplePreviewStyle}>
          {formattedValue}
        </div>
      </div>
      
      <Accordion type="single" collapsible defaultValue="number">
        <AccordionItem value="number">
          <AccordionTrigger className="text-sm font-medium">Number Formatting</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground mb-1 block">Number Format</Label>
                <Select
                  value={column.numberFormat || 'none'}
                  onValueChange={(value) => {
                    onChange('numberFormat', value);
                    // If none is selected, make sure we don't have a valueFormatter
                    if (value === 'none') {
                      onChange('valueFormatter', null);
                    }
                  }}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Select number format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="currency">Currency</SelectItem>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="decimal">Decimal</SelectItem>
                    <SelectItem value="integer">Integer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {column.numberFormat !== 'none' && (
                <>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground mb-1 block">Decimal Places</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={column.decimalPlaces || 2}
                        onChange={(e) => onChange('decimalPlaces', parseInt(e.target.value))}
                        min={0}
                        max={10}
                        className="h-8"
                      />
                      <span className="text-xs text-muted-foreground">places</span>
                    </div>
                  </div>

                  {column.numberFormat === 'currency' && (
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground mb-1 block">Currency Symbol</Label>
                      <Select
                        value={column.currencySymbol || '$'}
                        onValueChange={(value) => onChange('currencySymbol', value)}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="$">USD ($)</SelectItem>
                          <SelectItem value="€">EUR (€)</SelectItem>
                          <SelectItem value="£">GBP (£)</SelectItem>
                          <SelectItem value="¥">JPY (¥)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="date">
          <AccordionTrigger className="text-sm font-medium">Date Formatting</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground mb-1 block">Date Format</Label>
                <Select
                  value={column.dateFormat || 'none'}
                  onValueChange={(value) => {
                    onChange('dateFormat', value);
                    // If none is selected, clear the valueFormatter
                    if (value === 'none') {
                      onChange('valueFormatter', null);
                    }
                  }}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="short">Short (MM/DD/YYYY)</SelectItem>
                    <SelectItem value="medium">Medium (MMM DD, YYYY)</SelectItem>
                    <SelectItem value="long">Long (MMMM DD, YYYY)</SelectItem>
                    <SelectItem value="iso">ISO (YYYY-MM-DD)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="text">
          <AccordionTrigger className="text-sm font-medium">Text Formatting</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground mb-1 block">Text Transform</Label>
                <Select
                  value={column.textTransform || 'none'}
                  onValueChange={(value) => {
                    onChange('textTransform', value);
                    // If none is selected, clear the valueFormatter
                    if (value === 'none') {
                      onChange('valueFormatter', null);
                    }
                  }}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Select text transform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="uppercase">Uppercase</SelectItem>
                    <SelectItem value="lowercase">Lowercase</SelectItem>
                    <SelectItem value="capitalize">Capitalize</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="advanced">
          <AccordionTrigger className="text-sm font-medium">Advanced Formatting</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground mb-1 block">Format Type</Label>
                <Select
                  value={formatter}
                  onValueChange={(value) => {
                    onChange('valueFormatter', value === 'none' ? null : value);
                    // Set a default pattern based on the formatter type
                    switch (value) {
                      case 'number':
                        onChange('valueFormatterPattern', '#,##0.00');
                        break;
                      case 'percent':
                        onChange('valueFormatterPattern', '0.0%');
                        break;
                      case 'currency':
                        onChange('valueFormatterPattern', 'USD');
                        break;
                      case 'date':
                        onChange('valueFormatterPattern', 'MM/dd/yyyy');
                        break;
                      case 'time':
                        onChange('valueFormatterPattern', 'h:mm a');
                        break;
                      case 'dateTime':
                        onChange('valueFormatterPattern', 'MM/dd/yyyy h:mm a');
                        break;
                      case 'text':
                        onChange('valueFormatterPattern', '{value}');
                        break;
                      case 'custom':
                        onChange('valueFormatterPattern', 'custom');
                        break;
                      default:
                        onChange('valueFormatterPattern', '');
                    }
                  }}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Select formatter" />
                  </SelectTrigger>
                  <SelectContent>
                    {formatters.map(formatter => (
                      <SelectItem key={formatter.value} value={formatter.value}>
                        {formatter.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {formatter !== 'none' && formatter !== 'custom' && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground mb-1 block">Format Pattern</Label>
                  <Select
                    value={pattern}
                    onValueChange={(value) => onChange('valueFormatterPattern', value)}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Select pattern" />
                    </SelectTrigger>
                    <SelectContent>
                      {(() => {
                        switch (formatter) {
                          case 'number':
                            return numberFormatOptions.map(opt => (
                              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ));
                          case 'date':
                            return dateFormatOptions.map(opt => (
                              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ));
                          case 'time':
                            return timeFormatOptions.map(opt => (
                              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ));
                          case 'dateTime':
                            return dateTimeFormatOptions.map(opt => (
                              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ));
                          default:
                            return <SelectItem value="default">Default</SelectItem>;
                        }
                      })()}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {formatter === 'custom' && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground mb-1 block">Custom Format Pattern</Label>
                  <Input
                    value={pattern}
                    onChange={(e) => onChange('valueFormatterPattern', e.target.value)}
                    placeholder="Enter custom pattern"
                    className="h-8"
                  />
                  <p className="text-xs text-muted-foreground">
                    Use {'{value}'} to refer to the cell value in your pattern
                  </p>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <Separator className="my-4" />
    </div>
  );
} 