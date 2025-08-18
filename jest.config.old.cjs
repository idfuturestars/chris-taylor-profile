module.exports = {


  };module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/client/src/$1',
    '^shared/(.*)$': '<rootDir>/shared/$1',
  },
  testMatch: [
    '<rootDir>/client/src/**/__tests__/**/*.(js,jsx,ts,tsx)',
    '<rootDir>/client/src/**/*.(test|spec).(js,jsx,ts,tsx)',
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        ['@babel/preset-react', { runtime: 'automatic' }],
        '@babel/preset-typescript'
      ]
    }],
  },
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
  collectCoverageFrom: [
    'client/src/**/*.js',
    'client/src/**/*.jsx',
    'client/src/**/*.ts',
    'client/src/**/*.tsx',
    '!client/src/**/*.d.ts',
    '!client/src/main.tsx',
    '!client/src/vite-env.d.ts'  ],};npx test-1755473189214.jsx
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/client/src/$1',
    '^shared/(.*)$': '<rootDir>/shared/$1',
  },
  testMatch: [
    '<rootDir>/client/src/**/__tests__/**/*.(js,jsx,ts,tsx)',
    '<rootDir>/client/src/**/*.(test|spec).(js,jsx,ts,tsx)'
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        ['@babel/preset-react', { runtime: 'automatic' }],
        '@babel/preset-typescript'
      ]
    }],
  },
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
  collectCoverageFrom: [
    'client/src/**/*.{js,jsx,ts,tsx}',
    '!client/src/**/*.d.ts',
    '!client/src/main.tsx',
    '!client/src/vite-env.d.ts'
  ],
};