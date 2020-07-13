<template>
  <div>
    <q-input
      :value="newImage"
      outlined
      
      class="q-mb-md"
      bottom-slots
      hint=""
      @input ="setNewImage"
      placeholder="new image url"
    >
      <template v-slot:prepend>
        <div>
          <q-img
            v-if="isValidUrlMutated"
            :src="newImage"
            contain
            style="width: 40px; max-height: 25px;"
            @load="image_loaded = true"
            @error="image_loaded = false"
          >
            <template v-slot:error>
              <div class="absolute-full flex flex-center bg-negative text-white">
                x
              </div>
            </template>
          </q-img>
          <div v-else style="width: 37px; height: 25px;" class="row items-center justify-center border-primary text-caption">
            <q-icon name="mdi-plus" />
          </div>
        </div>
        
      </template>
      <template v-slot:after>
        <q-btn  icon="mdi-plus" @click="$emit('newImage', newImage); image_loaded=false;newImage=''" color="primary" round :disabled="!image_loaded" />
      </template>
    </q-input>
  </div>
</template>

<script>
import { isValidUrl } from "../../imports/validators.js";
export default {
  name: "newImage",
  data() {
    return {
      newImage: "",
      image_loaded: false
    };
  },
  computed:{
    isValidUrlMutated(){
      return isValidUrl(this.newImage)===true;
    }
  },
  methods:{
    isValidUrl,
    setNewImage(v){
      if(!v) this.image_loaded = false;
      this.newImage = v.trim();
    }

  }
};
</script>
