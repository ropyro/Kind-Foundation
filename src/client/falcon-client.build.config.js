const config = require('config');

module.exports = {
  devServerPort: (config.port || 3000) + 1,
  CI: process.env.CI && (typeof process.env.CI !== 'string' || process.env.CI.toLowerCase() !== 'false'),
  clearConsole: false,
  useWebmanifest: true,
  serviceWorker: {
    precache: process.env.NODE_ENV === 'production'
  },
  i18n: {
    resourcePackages: ['@deity/falcon-i18n']
  },
  moduleOverride: {
    '@deity/falcon-ecommerce-uikit/dist/Header/Header': './src/components/Header'
  }
};
