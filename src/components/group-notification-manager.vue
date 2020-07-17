<template>
  <div class="q-mr-md" v-if="!notifications_not_supported">
    <!-- mdi-bell mdi-bell-off -->
    <!-- {{getTopicSubscriptions}}
    {{isSubscribedForTopic}} -->
    <q-btn v-if="!browser_notifications_granted || !isSubscribedForTopic" @click="enableNotificationsAndGetToken" icon="mdi-bell" label="enable" color="primary" :loading="api_call_waiting">
      <q-tooltip content-class="bg-secondary" :delay="500">
        Enable notifications for group {{getActiveGroup}}
      </q-tooltip>
    </q-btn>
    <q-btn v-else @click="unSubscribeToTopic(getCurrentFCMToken, getActiveGroup)" icon="mdi-bell-off" label="disable" color="primary" :loading="api_call_waiting">
      <q-tooltip content-class="bg-secondary" :delay="500">
        Disable notifications for group {{getActiveGroup}}
      </q-tooltip>
    </q-btn>
    <!-- <q-btn  @click="getInstanceIdToken" label="getToken" color="primary"/> -->
  </div>
</template>

<script>
/*
export function getCurrentFCMtoken(){
  return state.currentFCMtoken;
}
export function getTopicSubscriptions(){
  return state.topicSubscriptions;
}
export function isSubscribedForTopic(){
  return (topic) =>{
    return state.topicSubscriptions.includes(topic);
  }
}
*/


import { mapGetters } from "vuex";
import {notifyError, notifySuccess} from '../imports/notifications.js';
export default {
  name: 'notificationManager',
  data () {
    return {
      browser_notifications_granted: false,
      api_call_waiting: false,
      notifications_not_supported: false
    }
  },
  computed:{
    ...mapGetters({
      getAppConfig: "app/getAppConfig",
      getActiveGroup: "group/getActiveGroup",
      getActiveGroupConfig: "group/getActiveGroupConfig",
      getCurrentFCMToken: "user/getCurrentFCMToken",
      getTopicSubscriptions: "user/getTopicSubscriptions"
    }),
    isSubscribedForTopic(){
      if(this.getTopicSubscriptions){
        return !!this.getTopicSubscriptions.find(ts => ts == this.getActiveGroup);
      }
      
    }
  },
  methods:{
    async enableNotificationsAndGetToken() {
      // Let's check if the browser supports notifications
      if (!("Notification" in window)) {
        alert("This browser does not support notifications");
      }
      else if (Notification.permission === "granted") {

        if(!this.getCurrentFCMToken){
            let token = await this.getNewInstanceIdToken();
            if(token){
              this.$store.commit("user/setCurrentFCMToken", token);
            }
        }
        await this.subscribeToTopic(this.getCurrentFCMToken, this.getActiveGroup);
        
      }
      else if (Notification.permission !== 'denied' || Notification.permission === "default") {
        Notification.requestPermission( async (permission)=> {
          if (permission === "granted") {
            setTimeout(()=>{this.browser_notifications_granted = true}, 600);
            // TODO(developer): Retrieve an Instance ID token for use with FCM.
            let token = await this.getNewInstanceIdToken();
            if(token){
              this.$store.commit("user/setCurrentFCMToken", token);
              await this.subscribeToTopic(token, this.getActiveGroup);
            }
          }
        });
      }
    },

    async getNewInstanceIdToken() {
      if(this.$messaging){
        let new_token = await this.$messaging.getToken().catch(err => {
            console.log("An error occurred while retrieving token. ", err);
            return false;
          });
        if(!new_token){alert("Error getting token"); return;}
        console.log('new token', new_token)
        return new_token;
      }

    },

    async subscribeToTopic(token, topic_name){
      this.api_call_waiting=true;
      let res = await this.$axios.post(`${this.getAppConfig.api.url}/subscribe_notifications`, {
        token: token,
        topic: `/topics/${topic_name}`
      })
      console.log(res);
      if(res.status == 200){
        notifySuccess({message:`Notifications enabled`});
        // var notification = new Notification(`Notifications enabled for group ${topic_name}`,{
        //   icon: this.getActiveGroupConfig.ui.logo
        // });
        this.$store.commit("user/addTopicSubsciption", topic_name);
      }
      this.api_call_waiting=false;
    },
    async unSubscribeToTopic(token, topic_name){
      this.api_call_waiting=true;
      let res = await this.$axios.post(`${this.getAppConfig.api.url}/unsubscribe_notifications`, {
        token: token,
        topic: `/topics/${topic_name}`
      })
      console.log(res);
      if(res.status == 200){
        notifySuccess({message:`Notifications disabled`});
        // var notification = new Notification(`Notifications disabled for group ${topic_name}`,{
        //   icon: this.getActiveGroupConfig.ui.logo
        // });
        this.$store.commit("user/removeTopicSubsciption", topic_name);
      }
      this.api_call_waiting=false;
    }

  },
  mounted(){
    if(this.$messaging){
      if(Notification.permission === "granted"){
        console.log("notifications granted");
        this.browser_notifications_granted = true;
      }
    }
    else{
      this.notifications_not_supported = true;
    }


  },
  created(){
  // navigator.serviceWorker.addEventListener('message', event => {
  //   console.log(event.data);
  // });

  }

}
</script>
