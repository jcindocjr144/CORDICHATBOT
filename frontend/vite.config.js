import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "localhost",
    port: 8080,
    open: true,
    watch: {
      usePolling: true,
      interval: 100, 
    },
  },
  clearScreen: false, 
});
