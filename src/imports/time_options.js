export const time_options = {
    options: [
        {label: "hourly", value: 60*60},
        {label: "daily", value: 60*60*24},
        {label: "weekly", value: 60*60*24*7},
        {label: "monthly", value: 60*60*24*30}
    ],

    get: function(sec){
        let o = time_options.options.find(o=> o.value == sec);
        return o ? o.label : sec;
    }
}