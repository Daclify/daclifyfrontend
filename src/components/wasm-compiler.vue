<template>
  <div v-if="false" class="row items-center q-mb-md" ref="wasm_compiler">
    <div class="fileContainer ">
      <span v-if="filename != ''" class="animate-fade row "
        ><q-icon
          name="check"
          color="positive"
          class="q-mr-xs"
        />{{ filename }}</span
      >
      <span v-else class="animate-fade">
        <q-icon name="add" style="margin-right:5px;margin-top:-3px" />{{
          label
        }}
      </span>
      <input type="file" ref="myfileinput" @input="handleInput()" />
    </div>

    <div v-if="filesize" class="animate-fade on-right q-caption">
      {{ filesize }}
    </div>
    <q-btn @click="loadRemoteAbi()" />
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import {sha256} from "../imports/helpers.js";
export default {
  name: 'wasmCompiler',
  props: {
    asbuffer: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: 'Select File'
    }
  },
  data () {
    return {
      filename: '',
      filesize: ''
    }
  },
  computed: {
    ...mapGetters({
      getDacApi: 'global/getDacApi'
    })
  },
  methods: {
    async loadRemoteWasm(url){
      url = url+'?t='+new Date().getTime();
      let res = await this.$axios.get(url, {
          responseType: 'arraybuffer'
      })

      let code_hash = sha256(new Uint8Array(res.data, 0));
      console.log('calculated code_hash', code_hash)
      res = {
        wasm: this.buf2hex(res.data),
        code_hash : code_hash
      };
      return res;
    },
    async loadRemoteAbi(url){
      url = url+'?t='+new Date().getTime();
      let res = await this.$axios.get(url, {
          responseType: 'text',
          transformResponse: [data => data]
      });
 
      res = await this.parseAbi(res.data);
    
      return res;
    },

    async handleInput () {
      let f = await this._readLocalFile(this.asbuffer)
      if (this.asbuffer) {
        f = this.buf2hex(f) // convert the wasm buf to hex
      } else {
        f = await this.parseAbi(f) // convert abi text to hex
      }
      console.log(f)
      this.$emit('input', f)
    },
    async _readLocalFile (asbuffer = false) {
      var file = this.$refs.myfileinput.files[0]
      // console.log(file)
      this.filename = file.name
      this.filesize = `${(file.size / 1024).toFixed(2)}KB`
      return new Promise((resolve, reject) => {
        var fr = new FileReader()
        fr.onload = function (result) {
          return resolve(fr.result)
        }
        if (asbuffer) {
          // for wasm
          fr.readAsArrayBuffer(file)
        } else {
          // for abi
          fr.readAsText(file, `utf8`)
        }
      })
    },
    async parseAbi (abifile) {
      const Serialize = this.$eos.Serialize;
      const buffer = new Serialize.SerialBuffer({
        textEncoder: new TextEncoder(),
        textDecoder: new TextDecoder()
      })
      let abi = JSON.parse(abifile)
      const abiDefinition = await this.$eos.api.abiTypes.get(`abi_def`)
      abi = abiDefinition.fields.reduce(
        (acc, { name: fieldName }) =>
          Object.assign(acc, { [fieldName]: acc[fieldName] || [] }),
        abi
      )
      abiDefinition.serialize(buffer, abi)
      return Buffer.from(buffer.asUint8Array()).toString(`hex`)
    },
    buf2hex (buffer) {
      return Array.prototype.map
        .call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2))
        .join('')
    }
  }
}
</script>
