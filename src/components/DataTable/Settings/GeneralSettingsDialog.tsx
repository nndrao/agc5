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
      <DialogContent 
        className="max-w-6xl h-[85vh] flex flex-col bg-white dark:bg-gray-900 backdrop-blur-sm border-gray-300 dark:border-gray-700"
        overlayClassName="bg-black/40 backdrop-blur-sm"
      >
        <DialogHeader className="pb-4 border-b border-gray-200 dark:border-gray-800">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            General Settings
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground/90 mt-1">
            Configure general grid settings including display, data handling, editing, and appearance.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden pt-4">
          {/* Two-column layout */}
          <div className="flex flex-1">
            {/* Left column - Categories */}
            <div className="w-64 pr-5 border-r border-gray-200 dark:border-gray-800">
              <div className="bg-muted/20 rounded-lg p-3 mb-3">
                <h3 className="text-sm font-medium mb-1">Settings Categories</h3>
                <p className="text-xs text-muted-foreground">Select a category to configure grid settings</p>
              </div>
              
              <div className="space-y-0.5">
                <Button 
                  variant={activeTab === 'display' ? 'default' : 'ghost'} 
                  className={`w-full justify-start text-sm h-10 ${activeTab === 'display' ? 'bg-primary text-primary-foreground' : ''}`}
                  onClick={() => setActiveTab('display')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><line x1="3" x2="21" y1="9" y2="9"></line></svg>
                  Display
                </Button>
                
                <Button 
                  variant={activeTab === 'data' ? 'default' : 'ghost'} 
                  className={`w-full justify-start text-sm h-10 ${activeTab === 'data' ? 'bg-primary text-primary-foreground' : ''}`}
                  onClick={() => setActiveTab('data')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                  Data
                </Button>
                
                <Button 
                  variant={activeTab === 'editing' ? 'default' : 'ghost'} 
                  className={`w-full justify-start text-sm h-10 ${activeTab === 'editing' ? 'bg-primary text-primary-foreground' : ''}`}
                  onClick={() => setActiveTab('editing')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                  Editing
                </Button>
                
                <Button 
                  variant={activeTab === 'filtering' ? 'default' : 'ghost'} 
                  className={`w-full justify-start text-sm h-10 ${activeTab === 'filtering' ? 'bg-primary text-primary-foreground' : ''}`}
                  onClick={() => setActiveTab('filtering')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                  Filtering
                </Button>
                
                <Button 
                  variant={activeTab === 'appearance' ? 'default' : 'ghost'} 
                  className={`w-full justify-start text-sm h-10 ${activeTab === 'appearance' ? 'bg-primary text-primary-foreground' : ''}`}
                  onClick={() => setActiveTab('appearance')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle></svg>
                  Appearance
                </Button>
                
                <Button 
                  variant={activeTab === 'rowGrouping' ? 'default' : 'ghost'} 
                  className={`w-full justify-start text-sm h-10 ${activeTab === 'rowGrouping' ? 'bg-primary text-primary-foreground' : ''}`}
                  onClick={() => setActiveTab('rowGrouping')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" x2="21" y1="6" y2="6"></line><line x1="8" x2="21" y1="12" y2="12"></line><line x1="8" x2="21" y1="18" y2="18"></line><line x1="3" x2="3.01" y1="6" y2="6"></line><line x1="3" x2="3.01" y1="12" y2="12"></line><line x1="3" x2="3.01" y1="18" y2="18"></line></svg>
                  Grouping
                </Button>
                
                <Button 
                  variant={activeTab === 'sorting' ? 'default' : 'ghost'} 
                  className={`w-full justify-start text-sm h-10 ${activeTab === 'sorting' ? 'bg-primary text-primary-foreground' : ''}`}
                  onClick={() => setActiveTab('sorting')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l4-4 4 4m-4-4v14"></path><path d="M21 15l-4 4-4-4m4 4V5"></path></svg>
                  Sorting
                </Button>
                
                <Button 
                  variant={activeTab === 'export' ? 'default' : 'ghost'} 
                  className={`w-full justify-start text-sm h-10 ${activeTab === 'export' ? 'bg-primary text-primary-foreground' : ''}`}
                  onClick={() => setActiveTab('export')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg>
                  Export
                </Button>
                
                <Button 
                  variant={activeTab === 'columnControl' ? 'default' : 'ghost'} 
                  className={`w-full justify-start text-sm h-10 ${activeTab === 'columnControl' ? 'bg-primary text-primary-foreground' : ''}`}
                  onClick={() => setActiveTab('columnControl')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="6" height="16" x="4" y="4" rx="1"></rect><rect width="6" height="16" x="14" y="4" rx="1"></rect></svg>
                  Columns
                </Button>
                
                <Button 
                  variant={activeTab === 'advanced' ? 'default' : 'ghost'} 
                  className={`w-full justify-start text-sm h-10 ${activeTab === 'advanced' ? 'bg-primary text-primary-foreground' : ''}`}
                  onClick={() => setActiveTab('advanced')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  Advanced
                </Button>
              </div>
            </div>
            
            {/* Right column - Content */}
            <div className="flex-1 pl-5">
              <ScrollArea className="h-[calc(85vh-180px)]">
                <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
                  <div className="p-5">
                    {activeTab === 'display' && (
                      <>
                        <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200 dark:border-gray-800 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><line x1="3" x2="21" y1="9" y2="9"></line></svg>
                          Display Settings
                        </h3>
                        <DisplaySettings
                          settings={localSettings}
                          onChange={handleSettingChange}
                        />
                      </>
                    )}

                    {activeTab === 'data' && (
                      <>
                        <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200 dark:border-gray-800 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                          Data Settings
                        </h3>
                        <DataSettings
                          settings={localSettings}
                          onChange={handleSettingChange}
                        />
                      </>
                    )}

                    {activeTab === 'editing' && (
                      <>
                        <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200 dark:border-gray-800 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                          Editing Settings
                        </h3>
                        <EditingSettings
                          settings={localSettings}
                          onChange={handleSettingChange}
                        />
                      </>
                    )}

                    {activeTab === 'filtering' && (
                      <>
                        <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200 dark:border-gray-800 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                          Filtering Settings
                        </h3>
                        <FilteringSettings
                          settings={localSettings}
                          onChange={handleSettingChange}
                        />
                      </>
                    )}

                    {activeTab === 'appearance' && (
                      <>
                        <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200 dark:border-gray-800 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle></svg>
                          Appearance Settings
                        </h3>
                        <AppearanceSettings
                          settings={localSettings}
                          onChange={handleSettingChange}
                        />
                      </>
                    )}

                    {activeTab === 'rowGrouping' && (
                      <>
                        <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200 dark:border-gray-800 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" x2="21" y1="6" y2="6"></line><line x1="8" x2="21" y1="12" y2="12"></line><line x1="8" x2="21" y1="18" y2="18"></line><line x1="3" x2="3.01" y1="6" y2="6"></line><line x1="3" x2="3.01" y1="12" y2="12"></line><line x1="3" x2="3.01" y1="18" y2="18"></line></svg>
                          Row Grouping Settings
                        </h3>
                        <RowGroupingSettings
                          settings={localSettings}
                          onChange={handleSettingChange}
                        />
                      </>
                    )}

                    {activeTab === 'sorting' && (
                      <>
                        <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200 dark:border-gray-800 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l4-4 4 4m-4-4v14"></path><path d="M21 15l-4 4-4-4m4 4V5"></path></svg>
                          Sorting Settings
                        </h3>
                        <SortingSettings
                          settings={localSettings}
                          onChange={handleSettingChange}
                        />
                      </>
                    )}

                    {activeTab === 'export' && (
                      <>
                        <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200 dark:border-gray-800 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg>
                          Export Settings
                        </h3>
                        <ExportSettings
                          settings={localSettings}
                          onChange={handleSettingChange}
                        />
                      </>
                    )}

                    {activeTab === 'columnControl' && (
                      <>
                        <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200 dark:border-gray-800 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="6" height="16" x="4" y="4" rx="1"></rect><rect width="6" height="16" x="14" y="4" rx="1"></rect></svg>
                          Column Control Settings
                        </h3>
                        <ColumnControlSettings
                          settings={localSettings}
                          onChange={handleSettingChange}
                        />
                      </>
                    )}

                    {activeTab === 'advanced' && (
                      <>
                        <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200 dark:border-gray-800 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                          Advanced Settings
                        </h3>
                        <AdvancedSettings
                          settings={localSettings}
                          onChange={handleSettingChange}
                        />
                      </>
                    )}
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t border-gray-200 dark:border-gray-800 pt-4 mt-2">
          <div className="text-xs text-muted-foreground mr-auto">
            {isDirty ? 'Unsaved changes' : 'No changes made'}
          </div>
          <Button variant="outline" onClick={handleCancel} className="border-gray-300 dark:border-gray-700">
            Cancel
          </Button>
          <Button onClick={handleApply} disabled={!isDirty} className={`${isDirty ? 'shadow-md hover:shadow-lg' : ''} transition-all`}>
            Apply Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}