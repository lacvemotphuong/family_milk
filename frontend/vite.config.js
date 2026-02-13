import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Disable inline/cheap-eval sourcemaps which can inject `eval`-style code
  // and trigger strict CSP policies. Production builds should not rely on
  // eval; disabling sourcemaps here avoids that class of issues.
  build: {
    sourcemap: false,
  },
});
