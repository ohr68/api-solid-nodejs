import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  test: {
    dir: 'src',
    coverage: {
      exclude: ['**/node_modules/**', '**/generated/**', '**/dist/**'],
    },
    workspace: [
      {
        extends: true,
        test: {
          name: 'unit',
          dir: 'src/tests/use-cases',
        },
      },
      {
        extends: true,
        test: {
          name: 'e2e',
          dir: 'src/http/controllers',
          environment:
            './prisma/vitest-environment-prisma/prisma-test-environment.ts',
        },
      },
    ],
  },
  plugins: [tsconfigPaths()],
})
