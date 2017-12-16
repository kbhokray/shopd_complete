const HDWalletProvider = require('truffle-hdwallet-provider');
const fs = require('fs');

const mnemonic = 'educate library inflict deposit blind jeans banana pet space hand relax brick';

module.exports = {
  networks: {
    "development": {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    "infura_ropsten": {
      provider: new HDWalletProvider(mnemonic, 'https://ropsten.infura.io/tWKJEj5eN0zj6FzToTJe'),
      gasPrice: 100000000000,
      network_id: 3
    },
    "infura_rinkeby": {
      provider: new HDWalletProvider(mnemonic, 'https://rinkeby.infura.io/tWKJEj5eN0zj6FzToTJe'),
      gasPrice: 10000000000,
      network_id: 4
    },
    "infura_kovan": {
      provider: new HDWalletProvider(mnemonic, 'https://kovan.infura.io/tWKJEj5eN0zj6FzToTJe'),
      gasPrice: 10000000000,
      network_id: 42
    }
  }
};
