import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // 5173 collides with another local app, so use a dedicated port.
    port: 5405,
    // Listen on all interfaces so 127.0.0.1 and localhost both work.
    host: true,
    // If 5405 is also taken, fail loudly instead of silently switching.
    strictPort: true,
    open: true,
  },
});
