export default {
  //
  showLoginModal: false,
  isTransacting: false,
  signingOverlay: {
    show: false,
    status: "", //0=wait for sig, 1=success, 2=error
    msg: "",
  },
  activeAuthenticator: null,
  UAL: null,
  accountName: null,
  SESSION: {
    accountName: null,
    authenticatorName: null,
    timestamp: null,
    network: null,
  },

  activeNetwork: "telos",

  networks: {
    telos: {
      config: {
        chainId:
          "4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11",
        rpcEndpoints: [
          {
            protocol: "https",
            host: "telos.api.animus.is",
            port: 443,
          },
        ],
      },
    },
  },
};
