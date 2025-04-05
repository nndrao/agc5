/**
 * minimal.js
 * A script to run the minimal version of the application
 */
import { spawn } from 'child_process';
import { createServer } from 'vite';

// Create a Vite server with a custom entry point
async function startMinimalApp() {
  const server = await createServer({
    configFile: './vite.config.ts',
    server: {
      port: 5174
    },
    optimizeDeps: {
      include: ['react', 'react-dom']
    },
    build: {
      rollupOptions: {
        input: {
          main: './src/main.minimal.tsx'
        }
      }
    }
  });

  await server.listen();
  
  console.log('Minimal app running at http://localhost:5174');
  
  // Open the browser
  const openCommand = process.platform === 'win32' ? 'start' : 
                      process.platform === 'darwin' ? 'open' : 'xdg-open';
  
  spawn(openCommand, ['http://localhost:5174']);
}

startMinimalApp().catch(console.error);
