# AG-Grid React Project Guidelines

## Commands
- **Development**: `npm run dev` - Start development server
- **Build**: `npm run build` - Build for production (runs TypeScript compiler and Vite build)
- **Lint**: `npm run lint` - Run ESLint on codebase
- **Preview**: `npm run preview` - Preview production build locally

## Code Style
- **Imports**: Use aliases with `@/` prefix for internal imports (e.g., `@/components/ui/button`)
- **Components**: Use functional components with hooks, prefer destructured props
- **TypeScript**: 
  - Use strict type checking
  - Define interfaces/types in separate files or at top of component files
  - Use explicit return types for functions
- **Naming**:
  - Components: PascalCase (e.g., `DataTable.tsx`)
  - Hooks: camelCase with `use` prefix (e.g., `useTheme`)
  - Utilities: camelCase (e.g., `getProfiles`)
- **UI Components**: Use shadcn/ui component patterns with Radix UI primitives
- **State Management**: Use React hooks for local state, avoid global state when possible
- **Error Handling**: Use try/catch blocks in data operations, provide fallback UI
- **CSS**: Use Tailwind utility classes with the `cn` helper for conditional classes

## Project Structure
- UI components in `/components/ui/`
- Feature components in directories by feature (e.g., `/components/DataTable/`)
- Utilities in `/lib/` directory
- Use barrel exports (index.ts) for organizing exports from directories