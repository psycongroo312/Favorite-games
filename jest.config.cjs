// jest.config.cjs
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.test.json',  // Используем специальную конфигурацию для тестов
    }],
  },
  testMatch: [
    '**/src/**/*.test.(ts|tsx)',
    '**/src/**/*.spec.(ts|tsx)'
  ],
  moduleNameMapper: {
    // Если используете алиасы, добавьте их здесь
  },
  roots: ['<rootDir>/src'],
};
