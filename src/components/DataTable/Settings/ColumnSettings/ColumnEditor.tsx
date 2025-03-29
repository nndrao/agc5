import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ColumnState } from "./types";

interface ColumnEditorProps {
  columnId: string;
  state: ColumnState;
  onChange: (changes: Partial<ColumnState>) => void;
}

export function ColumnEditor({ columnId, state, onChange }: ColumnEditorProps) {
  return (
    <div className="p-4">
      <Tabs defaultValue="general">
        <TabsList className="w-full">
          <TabsTrigger value="general" className="flex-1">General</TabsTrigger>
          <TabsTrigger value="header" className="flex-1">Header</TabsTrigger>
          <TabsTrigger value="cell" className="flex-1">Cell</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 mt-4">
          {/* Basic Settings */}
          <div className="space-y-4">
            <div>
              <Label>Field Name</Label>
              <Input
                value={state.field}
                onChange={(e) => onChange({ field: e.target.value })}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label>Header Name</Label>
              <Input
                value={state.headerName}
                onChange={(e) => onChange({ headerName: e.target.value })}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label>Width</Label>
              <div className="flex items-center space-x-4 mt-1.5">
                <Slider
                  value={[state.width]}
                  onValueChange={([value]) => onChange({ width: value })}
                  min={50}
                  max={1000}
                  step={1}
                  className="flex-1"
                />
                <span className="w-16 text-sm tabular-nums text-muted-foreground">
                  {state.width}px
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Column Features */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Visible</Label>
                <p className="text-sm text-muted-foreground">
                  Show or hide this column
                </p>
              </div>
              <Switch
                checked={state.visible}
                onCheckedChange={(checked) => onChange({ visible: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Resizable</Label>
                <p className="text-sm text-muted-foreground">
                  Allow column resizing
                </p>
              </div>
              <Switch
                checked={state.resizable}
                onCheckedChange={(checked) => onChange({ resizable: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Sortable</Label>
                <p className="text-sm text-muted-foreground">
                  Allow column sorting
                </p>
              </div>
              <Switch
                checked={state.sortable}
                onCheckedChange={(checked) => onChange({ sortable: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Filterable</Label>
                <p className="text-sm text-muted-foreground">
                  Enable column filtering
                </p>
              </div>
              <Switch
                checked={state.filter !== false}
                onCheckedChange={(checked) => onChange({ filter: checked })}
              />
            </div>
          </div>

          <Separator />

          {/* Column Position */}
          <div>
            <Label>Pin Position</Label>
            <Select
              value={state.pinned || "none"}
              onValueChange={(value) => onChange({ pinned: value === "none" ? null : value })}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Unpinned</SelectItem>
                <SelectItem value="left">Pin Left</SelectItem>
                <SelectItem value="right">Pin Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>

        <TabsContent value="header" className="space-y-4 mt-4">
          {/* Header Styling */}
          <div>
            <Label>Header Alignment</Label>
            <Select
              value={state.headerAlignment}
              onValueChange={(value) => onChange({ headerAlignment: value })}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>

        <TabsContent value="cell" className="space-y-4 mt-4">
          {/* Cell Styling */}
          <div>
            <Label>Cell Alignment</Label>
            <Select
              value={state.cellAlignment}
              onValueChange={(value) => onChange({ cellAlignment: value })}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}