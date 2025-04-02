# AG-Grid React Project Guidelines

## Commands
- **Development**: `npm run dev` - Start development server
- **Build**: `npm run build` - Build for production 
- **Lint**: `npm run lint` - Run ESLint
- **Type Check**: `tsc --noEmit` - TypeScript type checking
- **Format Check**: `prettier --check .` - Check formatting
- **Preview**: `npm run preview` - Preview production build

## Code Style Guidelines
- **Imports**: Use `@/` prefix for internal imports (e.g., `@/components/ui/button`)
- **TypeScript**: Use strict typing, avoid `any`, provide explicit return types
- **Naming**: Components: PascalCase; Hooks: usePrefix; Interfaces: IPrefix; Utilities: camelCase
- **State Management**: React hooks for local state, context for shared state, Zustand for global state
- **Error Handling**: Use try/catch with toast notifications for user feedback
- **CSS**: Tailwind utility classes with the `cn` helper for conditional classes
- **Formatting**: 2-space indentation, single quotes, semicolons required

## AG-Grid 33+ Requirements
- Use `gridApi` for all operations (columnApi merged into gridApi)
- Use parameters-based theming with light/dark mode support
- Use `rowSelection` object with `type: 'singleRow'/'multiRow'`
- Handle theme switching properly with `data-ag-theme-mode` attribute
- Move `sortingOrder` and `unSortIcon` from grid-level to `defaultColDef`
- Use `cellFlashDuration`/`cellFadeDuration` instead of `enableCellChangeFlash`
- Use `groupTotalRow` instead of deprecated `groupIncludeFooter`
- Use `enterNavigatesVertically` instead of deprecated `enterMovesDown`

## Project Structure
- UI components: `/components/ui/`
- Feature components: `/components/DataTable/` 
- Utilities: `/lib/utils.ts`
- Use barrel exports (index.ts) for component organization

## Key Patterns
- Profile Management: Use `loadProfileById()` and handle errors properly
- Settings Dialogs: Pass current settings via props to initialize dialog state
- Grid State: Use dedicated services for managing grid state and profiles
- Error handling: Format errors consistently and provide user feedback with toast