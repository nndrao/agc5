# AG-Grid React Project Guidelines

## Commands
- **Development**: `npm run dev` - Start development server
- **Build**: `npm run build` - Build for production (runs TypeScript compiler and Vite build)
- **Lint**: `npm run lint` - Run ESLint on codebase
- **Preview**: `npm run preview` - Preview production build locally
- **Type Check**: `tsc -b` - Validate TypeScript types 

## Code Style
- **Imports**: Use `@/` path aliases for internal imports (required for consistent imports)
- **Components**: Use functional components with hooks, prefer destructured props
- **TypeScript**: 
  - Use strict type checking and explicit return types for functions
  - Define interfaces/types in separate files or at top of component files
  - Add prop types for all components, prefer interfaces over types for components
- **Naming**:
  - Components/Interfaces: PascalCase (e.g., `DataTable.tsx`, `ProfileProps`)
  - Hooks/Utilities: camelCase with appropriate prefixes (e.g., `useTheme`, `getProfiles`)
  - Files: Match component/utility name (e.g., `Button.tsx` for `Button` component)
- **Formatting**: Follow ESLint rules in eslint.config.js, including React Hooks rules
- **Error Handling**: Use try/catch blocks in data operations with fallback UI patterns
- **CSS**: Use Tailwind with the `cn` utility for conditional classes, avoid direct CSS

## Project Structure
- UI components in `/components/ui/`
- Feature components grouped by domain (e.g., `/components/DataTable/`)
- Shared hooks in `/hooks/` and utilities in `/lib/`
- Use barrel exports (index.ts) for organizing directory exports