module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    'no-multiple-empty-lines': [
      {
        max: 1,
        maxBOF: 0,
        maxEOF: 0,
      },
    ],
  },
};
