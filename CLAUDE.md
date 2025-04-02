# AG-Grid React Project Guidelines

## Commands
- **Development**: `npm run dev` - Start development server
- **Build**: `npm run build` - Build for production 
- **Lint**: `npm run lint` - Run ESLint
- **Type Check**: `tsc --noEmit` - TypeScript type checking
- **Format Check**: `prettier --check .` - Check formatting

## Code Style Guidelines
- **Imports**: Use `@/` prefix for internal imports (e.g., `@/components/ui/button`)
- **TypeScript**: Use strict typing, avoid `any`, explicit return types
- **Naming**: Components: PascalCase; Hooks: usePrefix; Interfaces: IPrefix; Utilities: camelCase
- **State Management**: React hooks for local state, context for component trees
- **Error Handling**: Use try/catch with console logging and toast notifications
- **CSS**: Tailwind utility classes with the `cn` helper for conditional classes
- **Formatting**: 2-space indentation, single quotes, semicolons required

## AG-Grid 33+ Requirements
- Use `gridApi` for all operations (columnApi merged into gridApi)
- Use `rowSelection` object with `type: 'singleRow'/'multiRow'` 
- Use valid properties (see deprecation warnings section)
- Follow the error handling pattern for async operations

## Project Structure
- UI components: `/components/ui/`
- Feature components: `/components/DataTable/` 
- Utilities: `/lib/`
- Use barrel exports (index.ts)

## Key Patterns
- Profile Management: Use `loadProfileById()` and handle errors properly
- Settings Dialogs: Pass current settings via props to initialize dialog state
- Error handling: Format errors consistently and provide user feedback with toast

For detailed AG-Grid API changes and migration guidance, refer to the AG-Grid documentation.