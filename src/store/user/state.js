export default {
  //
  favouriteGroups: [],
  account: false,
  resourceWarningLevels:{
    ram: 90,
    cpu: 80,
    net: 10
  },
  selectedBlockExplorer: {
    jungle:{
      base: 'https://jungle3.bloks.io/',
      trx: 'transaction/',
      account: 'account/'
    },
    mainnet:{
      base: 'https://bloks.io/',
      trx: 'transaction/',
      account: 'account/'
    }

  },

  minifyCustodians: false,
  isDark: false,
  isMember: false,
  hubDeposits: false,
  miniState: false,

  currentFCMToken:'',
  topicSubscriptions:[]
}
