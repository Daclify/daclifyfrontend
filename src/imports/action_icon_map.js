export const action_icon_map = {
    transfer: {
      name: "import_export",
      size: "40px",
      class: "rotate-90"
    },
    invitecust: {
      name: "mdi-account-plus",
      size: "30px"
    },
    removecust: {
        name: "mdi-account-minus",
        size: "30px"
      },
    updateurl: {
      name: "link",
      size: "30px"
    },
    updateabout: {
      name: "format_align_center",
      size: "30px"
    },
    updatelogo: {
      name: "art_track",
      size: "35px"
    },
    updatecolor: {
      name: "color_lens",
      size: "35px"
    },
    updatetags: {
      name: "mdi-tag",
      size: "30px"
    },
    manthreshold: {
      name: "mdi-chart-gantt",
      size: "30px",
      class: "rotate-270"
    },
    buyram: {
      name: "mdi-alpha-r-circle",
      size: "30px"
    },
    sellram: {
      name: "mdi-alpha-r-circle",
      size: "30px"
    },
    paymentadd: {
      name: "mdi-account-cash",
      size: "30px"
    },
    paymentrem: {
      name: "mdi-cash-remove",
      size: "30px"
    },
    payrollreg:{
      name: "mdi-cash-register",
      size: "30px"
    },
    linkmodule:{
      name: "mdi-view-module",
      size: "30px"
    },
    
    DEFAULT: {
      name: "settings",
      size: "35px"
    },
    get: function(action_name){
        let icon = action_icon_map[action_name];
        return icon ? icon : action_icon_map.DEFAULT;
    }
  };