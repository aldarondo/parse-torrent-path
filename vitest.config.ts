import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        include: ['test/**/*.test.ts'],
        coverage: {
            include: ['src/**/*.ts'],
            exclude: ['src/types.ts'],
            thresholds: {
                statements: 90,
                branches: 80,
                functions: 100,
                lines: 90,
            },
        },
    },
});
