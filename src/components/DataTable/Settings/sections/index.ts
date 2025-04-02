export { AppearanceSection } from './AppearanceSection';
export { DataSection } from './DataSection';
export { DisplaySection } from './DisplaySection';
export { EditingSection } from './EditingSection';
export { FilteringSection } from './FilteringSection';
export { GroupingSection } from './GroupingSection';
export { SelectionSection } from './SelectionSection';
export { SortingSection } from './SortingSection';
export { ExportSection } from './ExportSection';
export { ColumnControlSection } from './ColumnControlSection';
export { AdvancedSection } from './AdvancedSection';
export { DefaultColumnSection } from './DefaultColumnSection';

// Common style class for better dark mode support in all sections
export const sectionStyles = {
  container: "space-y-6 dark:text-gray-200",
  heading: "text-[14px] font-medium dark:text-gray-100",
  paragraph: "text-[12px] text-muted-foreground dark:text-gray-400",
  icon: "flex items-center justify-center w-6 h-6 rounded-md bg-primary/10 dark:bg-primary/20"
};