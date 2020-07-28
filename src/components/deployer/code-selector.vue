<template>
  <div class="column q-gutter-md">
    <q-select
      outlined
      v-model="selected_src"
      :options="src_options"  
      label="Select source"
      @input="emit_empty"
    >
        <template v-slot:option="scope">
          <q-item
            v-bind="scope.itemProps"
            v-on="scope.itemEvents"
          >
            <q-item-section>
              <q-item-label v-html="scope.opt.label" ></q-item-label>
              <q-item-label caption v-html="scope.opt.sublabel" ></q-item-label>
            </q-item-section>
          </q-item>
        </template>
        <template v-slot:prepend>
          <q-icon name="mdi-source-repository" />
        </template>
    </q-select>

    <transition
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
      mode="out-in"
    >
      <div v-if="selected_src.value=='remote'" key="remote" class="row items-center">
        <q-input label="wasm url" outlined v-model="wasm_url" class="q-mr-md">
          <template v-slot:prepend>
            <q-icon name="mdi-file-link" />
          </template>
        </q-input>
        <q-input label="abi url" outlined v-model="abi_url" class="q-mr-md">
          <template v-slot:prepend>
            <q-icon name="mdi-file-link" />
          </template>
        </q-input>
        <div class="q-mr-md">
          <q-btn label="load" color="primary" @click="load_remote" />
        </div>
      </div>

      <div v-if="selected_src.value=='local'" key="local" class="row items-center">
        <div style="width:230px; " class="q-mr-md">
          <q-file outlined clearable counter v-model="wasm_file" label="wasm file" accept=".wasm">
            <template v-slot:prepend>
              <q-icon name="mdi-file-code" />
            </template>
          </q-file>
        </div>
        <div style="width:230px;" class="q-mr-md">
          <q-file outlined clearable counter v-model="abi_file" label="abi file" accept=".abi">
            <template v-slot:prepend>
              <q-icon name="mdi-file-code" />
            </template>
          </q-file>
        </div>
        <div class="q-mr-md">
          <q-btn label="load" color="primary" @click="compile_local" />
        </div>
      </div>

      <div v-if="selected_src.value=='daclify'" key="daclify" class="row items-center no-wrap">
        <q-select
        class="q-mr-md"
        style="width:100%"
          outlined
          v-model="daclify_registry_selection"
          :options="daclify_registry_options"  
          label="Select version"
        >
            <template v-slot:option="scope">
              <q-item
                v-bind="scope.itemProps"
                v-on="scope.itemEvents"
              >
                <q-item-section>
                  <q-item-label v-html="scope.opt.label" ></q-item-label>
                  <q-item-label caption v-html="scope.opt.sublabel" ></q-item-label>
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:prepend>
              <q-icon name="mdi-expand-all" />
            </template>
        </q-select>
        <div class="q-mr-md">
          <q-btn label="load" color="primary" @click="" />
        </div>
      </div>

      
    </transition>
  </div>
</template>

<script>
import {sha256} from "../../imports/helpers.js";
export default {
  name: 'codeSelector',
  data () {
    return {
      selected_src: "",
      src_options:[
        {label:"Daclify", sublabel:"official releases from Daclify registry", value:"daclify"},
        {label:"Remote", sublabel:"github, server, ... ", value:"remote"},
        {label:"Local", sublabel:"disk", value:"local"},
      ],
      wasm_url:"",
      abi_url:"",

      wasm_file:[],
      abi_file:[],

      daclify_registry_selection:"",
      daclify_registry_options: [{label:"Todo", sublabel:"fetch code versions from register", value:"todo"}]
    }
  },
  methods:{
    emit_empty(){
      this.$emit('input', {code_hash:"", abi_hash:"", wasm:"", abi:""});
    },
    async load_remote(){
      let wasm = await this.loadRemoteWasm(this.wasm_url);
      let abi = await this.loadRemoteAbi(this.abi_url);
      let res = Object.assign(wasm, abi);
      this.$emit('input', res);

    },
    async compile_local(){
      console.log(this.wasm_file)
      let wasm = await this._readLocalFile (this.wasm_file, true);
      let abi = await this._readLocalFile (this.abi_file, false);
   
      abi = await this.parseAbi(abi);
      let res = {
        wasm: this.buf2hex(wasm),
        code_hash : sha256(new Uint8Array(wasm, 0)),
        abi: abi,
        abi_hash: sha256(new Uint8Array(abi, 0)),
      };
      this.$emit('input', res);
    },

    async loadRemoteWasm(url){
      url = url+'?t='+new Date().getTime();
      let res = await this.$axios.get(url, {
          responseType: 'arraybuffer'
      })

      let code_hash = sha256(new Uint8Array(res.data, 0));
      console.log('calculated code_hash', code_hash);
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
      let abi_hash = sha256(new Uint8Array(res.data, 0));
      console.log('calculated abi_hash', abi_hash);
      res = {
        abi: await this.parseAbi(res.data),
        abi_hash : abi_hash
      };

      return res;
    },


    async _readLocalFile (file, asbuffer = false) {

      return new Promise((resolve, reject) => {
        var fr = new FileReader()
        fr.onload = function (e) {

          return resolve(e.target.result)
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
