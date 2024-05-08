module.exports = {
  languageOptions: {
    globals: {
      browser: true,
      es2021: true
    },
    parserOptions: {
      ecmaFeatures: {
        jsx: true
      },
      ecmaVersion: 2020,
      sourceType: "module"
    }
  },
  plugins: {
    react: {}
  },
  // extends: ["eslint:recommended", "plugin:react/recommended"],
  rules: {},
  settings: {
    react: {
      version: "detect"
    }
  }
};
