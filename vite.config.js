import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// Load environment variables from .env files
import dotenv from 'dotenv';
import process from 'process';
dotenv.config();

export default defineConfig({
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          '@primary-color': '#455A64',
          '@font-family': "'Poppins', sans-serif",
          '@font-size-base': '14px',
          '@border-radius-base': '5px'
        }
      }
    }
  },
  plugins: [react()],
  server: {
    host: true
  },
  define: {
    // Some libraries use the global object, even though it doesn't exist in the browser.
    global: {},
    // Inject environment variables
    'process.env': {
      VITE_APP_FIREBASE_API_KEY: JSON.stringify(process.env.VITE_APP_FIREBASE_API_KEY),
      VITE_APP_AUTH_DOMAIN: JSON.stringify(process.env.VITE_APP_AUTH_DOMAIN),
      VITE_APP_FIREBASE_PROJECT_ID: JSON.stringify(process.env.VITE_APP_FIREBASE_PROJECT_ID),
      VITE_APP_FIREBASE_STORAGE_BUCKET: JSON.stringify(process.env.VITE_APP_FIREBASE_STORAGE_BUCKET),
      VITE_APP_FIREBASE_MESSAGING_SENDER_ID: JSON.stringify(process.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID),
      VITE_APP_FIREBASE_APP_ID: JSON.stringify(process.env.VITE_APP_FIREBASE_APP_ID),
      VITE_APP_FIREBASE_MEASUREMENTID: JSON.stringify(process.env.VITE_APP_FIREBASE_MEASUREMENTID)
    }
  }
});
