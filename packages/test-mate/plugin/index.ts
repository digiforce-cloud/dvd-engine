module.exports = ({ onGetJestConfig, onGetWebpackConfig }) => {
  onGetJestConfig((jestConfig) => {
    return jestConfig;
  });
};
