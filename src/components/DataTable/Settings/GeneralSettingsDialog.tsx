import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGridStore } from '../store/gridStore';
import { DisplaySettings } from './DisplaySettings';
import { DataSettings } from './DataSettings';
import { EditingSettings } from './EditingSettings';
import { FilteringSettings } from './FilteringSettings';
import { AppearanceSettings } from './AppearanceSettings';
import { RowGroupingSettings } from './RowGroupingSettings';
import { SortingSettings } from './SortingSettings';
import { ExportSettings } from './ExportSettings';
import { ColumnControlSettings } from './ColumnControlSettings';
import { AdvancedSettings } from './AdvancedSettings';

interface GeneralSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplySettings: (settings: any, preserveColumnSizes?: boolean) => void;
  currentSettings: any;
}

export function GeneralSettingsDialog({
  open,
  onOpenChange,
  onApplySettings,
  currentSettings
}: GeneralSettingsDialogProps) {
  const [activeTab, setActiveTab] = useState('display');
  const [localSettings, setLocalSettings] = useState(currentSettings);
  const [isDirty, setIsDirty] = useState(false);

  // Update local settings when current settings change
  useEffect(() => {
    if (currentSettings) {
      setLocalSettings(currentSettings);
    }
  }, [currentSettings]);

  // Reset hasChanges and update settings when dialog opens
  useEffect(() => {
    if (open && currentSettings) {
      setLocalSettings(currentSettings);
      setIsDirty(false);
    }
  }, [open, currentSettings]);

  // Handle setting changes
  const handleSettingChange = (category: string, setting: string, value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      [setting]: value
    }));
    setIsDirty(true);
  };

  // Handle apply
  const handleApply = () => {
    onApplySettings(localSettings, true); // Preserve column sizes when applying settings
    onOpenChange(false);
  };

  // Handle cancel
  const handleCancel = () => {
    setLocalSettings(currentSettings);
    setIsDirty(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>General Settings</DialogTitle>
          <DialogDescription>
            Configure general grid settings including display, data handling, editing, and appearance.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="mb-4">
              <TabsTrigger value="display">Display</TabsTrigger>
              <TabsTrigger value="data">Data</TabsTrigger>
              <TabsTrigger value="editing">Editing</TabsTrigger>
              <TabsTrigger value="filtering">Filtering</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="rowGrouping">Row Grouping</TabsTrigger>
              <TabsTrigger value="sorting">Sorting</TabsTrigger>
              <TabsTrigger value="export">Export</TabsTrigger>
              <TabsTrigger value="columnControl">Column Control</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <ScrollArea className="flex-1">
              <TabsContent value="display" className="m-0">
                <DisplaySettings
                  settings={localSettings}
                  onChange={handleSettingChange}
                />
              </TabsContent>

              <TabsContent value="data" className="m-0">
                <DataSettings
                  settings={localSettings}
                  onChange={handleSettingChange}
                />
              </TabsContent>

              <TabsContent value="editing" className="m-0">
                <EditingSettings
                  settings={localSettings}
                  onChange={handleSettingChange}
                />
              </TabsContent>

              <TabsContent value="filtering" className="m-0">
                <FilteringSettings
                  settings={localSettings}
                  onChange={handleSettingChange}
                />
              </TabsContent>

              <TabsContent value="appearance" className="m-0">
                <AppearanceSettings
                  settings={localSettings}
                  onChange={handleSettingChange}
                />
              </TabsContent>

              <TabsContent value="rowGrouping" className="m-0">
                <RowGroupingSettings
                  settings={localSettings}
                  onChange={handleSettingChange}
                />
              </TabsContent>

              <TabsContent value="sorting" className="m-0">
                <SortingSettings
                  settings={localSettings}
                  onChange={handleSettingChange}
                />
              </TabsContent>

              <TabsContent value="export" className="m-0">
                <ExportSettings
                  settings={localSettings}
                  onChange={handleSettingChange}
                />
              </TabsContent>

              <TabsContent value="columnControl" className="m-0">
                <ColumnControlSettings
                  settings={localSettings}
                  onChange={handleSettingChange}
                />
              </TabsContent>

              <TabsContent value="advanced" className="m-0">
                <AdvancedSettings
                  settings={localSettings}
                  onChange={handleSettingChange}
                />
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleApply} disabled={!isDirty}>
            Apply Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}