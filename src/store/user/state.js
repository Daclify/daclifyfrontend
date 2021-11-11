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
    },
    wax:{
      base: 'https://wax.bloks.io/',
      trx: 'transaction/',
      account: 'account/'
    },
    telosTest:{
      base: 'https://telos-test.bloks.io/',
      trx: 'transaction/',
      account: 'account/'
    },
    telos:{
      base: 'https://telos.bloks.io/',
      trx: 'transaction/',
      account: 'account/'
    }

  },

  minifyGuardians: false,
  isDark: false,
  isMember: false,
  hubDeposits: false,
  miniState: false,

  currentFCMToken:'',
  topicSubscriptions:[]
}
