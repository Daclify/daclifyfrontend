export default {
  //
  showLoginModal: false,
  isTransacting: false,
  signingOverlay: {
    show: false,
    status: "", //0=wait for sig, 1=success, 2=error
    msg: ""
  },
  activeAuthenticator: null,
  UAL: null,
  accountName: null,
  SESSION: {
    accountName: null,
    authenticatorName: null,
    timestamp: null,
    network: null
  },

  activeNetwork: "mainnet",

  networks: {
    mainnet: {
      config: {
        chainId:
          "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
        rpcEndpoints: [ //https://eosbp.atticlab.net", "https://eos.greymass.com", "https://api.eossweden.se
          {
            protocol: "https",
            host: "eos.api.animus.is",
            port: "443"
          },
          {
            protocol: "https",
            host: "api.eosn.io",
            port: "443"
          },
          {
            protocol: "https",
            host: "eosbp.atticlab.net",
            port: "443"
          },
          {
            protocol: "https",
            host: "api.eostitan.com",
            port: "443"
          }
        ]
      }
    },
    jungle: {
      config: {
        chainId:
          "2a02a0053e5a8cf73a56ba0fda11e4d92e0238a4a2aa74fccf46d5a910746840",
        rpcEndpoints: [
          {
            protocol: "https",
            host: "jungle3.cryptolions.io",
            port: 443
          }
        ]
      }
    },
    wax: {
      config: {
        chainId:
          "1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4",
        rpcEndpoints: [
          {
            protocol: "https",
            host: "wax.eosn.io",
            port: 443
          },
          {
            protocol: "https",
            host: "wax.cryptolions.io",
            port: 443
          }
        ]
      }
    },
    // wax: {
    //   config: {
    //     chainId:
    //       "1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4",
    //     rpcEndpoints: [
    //       {
    //         protocol: "https",
    //         host: "wax.greymass.com",
    //         port: 443
    //       }
    //     ]
    //   }
    // },
    telos: {
      config: {
        chainId:
          "4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11",
        rpcEndpoints: [
          {
            protocol: "https",
            host: "telos.api.animus.is",
            port: 443
          }
        ]
      }
    },
    telosTest: {
      config: {
        chainId:
          "1eaa0824707c8c16bd25145493bf062aecddfeb56c736f6ba6397f3195f33c9f",
        rpcEndpoints: [
          {
            protocol: "https",
            host: "api.testnet.telosunlimited.io",
            port: 443
          },
          {
            protocol: "https",
            host: "testnet-api.telosuk.io",
            port: 443
          }
        ]
      }
    },
  }
};
