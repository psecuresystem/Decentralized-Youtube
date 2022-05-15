/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.0",
  networks: {
    rinkeby: {
      url: 'https://eth-rinkeby.alchemyapi.io/v2/M0Qzhx6ct4xUZG-ZNkJVCqWJHeYaYfxe',
      accounts: ['2fd6b98842ef0aabec3934cde8b54594883a7daff67f2b738cfcb474cb47947b']
    }
  },
  paths: {
    artifacts: "./src/artifacts"
  }
};
