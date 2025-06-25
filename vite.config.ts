import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  test: {
    coverage: {
      exclude: ['**/node_modules/**', '**/generated/**', '**/dist/**'],
    },
  },
  plugins: [tsconfigPaths()],
})
