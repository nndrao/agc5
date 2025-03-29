import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface SettingsSidebarProps {
  sections: {
    id: string;
    icon: any;
    label: string;
    description: string;
  }[];
  activeSection: string;
  onSectionChange: (id: string) => void;
}

export function SettingsSidebar({
  sections,
  activeSection,
  onSectionChange,
}: SettingsSidebarProps) {
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Scroll active item into view when it changes
    if (activeRef.current) {
      activeRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [activeSection]);

  return (
    <div className="w-[250px] border-r bg-gray-50 dark:bg-gray-850 flex flex-col">
      <div className="p-3 border-b bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-850 shadow-sm">
        <h3 className="font-medium text-sm">Settings Categories</h3>
      </div>
      <ScrollArea className="flex-1">
        <div className="py-2">
          {sections.map((section) => {
            const isActive = activeSection === section.id;
            const Icon = section.icon;
            
            return (
              <button
                key={section.id}
                ref={isActive ? activeRef : null}
                className={cn(
                  "flex flex-col w-full px-3 py-2 text-left transition-colors rounded-none",
                  isActive
                    ? "bg-white dark:bg-gray-900 text-primary border-l-2 border-primary"
                    : "text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
                onClick={() => onSectionChange(section.id)}
              >
                <div className="flex items-center">
                  <Icon className={cn("h-4 w-4 mr-2", isActive ? "text-primary" : "text-muted-foreground")} />
                  <span className="font-medium text-sm">{section.label}</span>
                </div>
                <p className="text-xs text-muted-foreground ml-6 mt-1">{section.description}</p>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}