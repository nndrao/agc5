# AG-Grid Advanced Configuration (AGC6)

This project demonstrates a simplified, centralized configuration system for AG-Grid, focusing on maintainability, performance, and reduced complexity.

## Key Features

- **Centralized Settings Store**: All grid configuration is maintained in a single source of truth using Zustand.
- **Profile Management**: Save, load, and switch between different grid configurations.
- **Modular Settings UI**: Organized settings dialog with logical groupings.
- **AG-Grid 33+ Support**: Fully compatible with the latest AG-Grid API.
- **Performance Optimized**: Reduced re-renders and state duplication.

## Architecture

### Core Components

1. **Centralized Store (`gridConfigStore.ts`)**:
   - Single source of truth for all grid settings
   - Manages profiles, current settings, and grid state
   - Handles saving/loading from localStorage
   - Minimizes re-renders with selective state updates

2. **Data Table (`data-table.tsx`)**:
   - Main grid component that consumes settings from the store
   - Automatically applies current profile from store
   - Periodically captures grid state for auto-save

3. **Profile Management (`ProfileManager/`)**:
   - Profile selector UI
   - Create/edit/delete/save profile functionality
   - Directly interacts with the central store

4. **Settings Dialog (`Settings/`)**:
   - Modular sections for different setting categories
   - Changes are reflected in real-time preview
   - Changes are applied to the central store when saved

### State Flow

1. **Settings Initialization**:
   - Default settings provided by `defaultSettings.ts`
   - Loaded from localStorage on app initialization
   - Default profile created if none exists

2. **Settings Application**:
   - When grid is ready, current profile settings are applied
   - Settings are applied in a specific order: settings → columns → filters → sort

3. **Settings Modification**:
   - UI components update the store
   - Store notifies consumers of changes
   - Changes can be saved to current profile

4. **Profile Management**:
   - Profiles are stored in localStorage
   - Switching profiles updates the store and grid
   - The 'Default' profile is always available

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

## Project Structure

```
src/
├── components/
│   ├── DataTable/
│   │   ├── ProfileManager/      # Profile management components
│   │   ├── Settings/            # Settings UI components
│   │   │   └── sections/        # Modular settings sections
│   │   ├── store/               # Centralized store
│   │   │   ├── defaultSettings.ts
│   │   │   ├── gridConfigStore.ts
│   │   │   ├── types.ts
│   │   │   └── utils.ts
│   │   ├── columns.tsx          # Column definitions
│   │   └── data-table.tsx       # Main grid component
│   └── ui/                      # Reusable UI components
├── hooks/                       # Custom hooks
├── lib/                         # Utility functions
├── App.tsx                      # Main application
└── main.tsx                     # Entry point
```

## Improvements Over Previous Implementation

1. **Simplified State Management**:
   - Removed the need for multiple context providers
   - Eliminated parallel state tracking
   - Single source of truth for all grid configuration

2. **Improved Performance**:
   - Reduced unnecessary re-renders
   - Optimized state updates with immer
   - Selective component updates

3. **Enhanced Type Safety**:
   - Stronger typing for all configuration options
   - Explicit interfaces for grid settings
   - Better error handling with proper types

4. **Better User Experience**:
   - More intuitive UI for profile management
   - Real-time preview of setting changes
   - Automatic state capture and backup

5. **Maintainability**:
   - Clear separation of concerns
   - Modular code organization
   - Simplified data flow 

## Technologies Used

- React
- TypeScript
- AG-Grid Community/Enterprise
- Zustand (state management)
- Immer (immutable state updates)
- Tailwind CSS
- shadcn/ui components