<template>
  <div class="">
    <!-- :dense="$q.screen.lt.md" -->
    <q-table
      title=""
      :dark="false"
      :data="data"
      :columns="columns"
      color="primary"
      row-key="name"
      class="bg-white"
      :grid="false"
      :fullscreen="false"
      :wrap-cells="true"
      no-data-label="Group doesn't have proposals"
      
      selection="none"
      :selected.sync="selected"
    >
      <!-- <template v-slot:header="props">
        <q-tr :props="props">
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            class="text-bold text-primary text-uppercase"
          >
            {{ col.label }}
          </q-th>
        </q-tr>
      </template> -->

      <!-- <template v-slot:body-cell-id="props">
        <q-td :props="props">
          <div>
            {{props.value}}
          </div>
        </q-td>
      </template> -->

      <!-- <template v-slot:body-cell-extra="props">
        <q-td :props="props">
          <q-btn color="primary" icon="more_vert" flat dense>
            <q-menu>
              <q-list dense style="min-width: 100px">
                <q-item clickable v-close-popup @click="cancelJob(props.row.id)">

                  <q-item-section>cancel</q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="">
                  <q-item-section>view</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-td>
      </template> -->

      <!-- <template v-slot:body-cell-contract_action="props">
        <q-td :props="props">
          <span>{{props.row.actions[0].account}} > </span>
          <span>{{props.row.actions[0].name}}</span>
        </q-td>
      </template> -->


    </q-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: 'proposalsTable',
props:{
  proposals:{
    type: Array,
    default: () => []
  }
},

data () {
    return {
      selected: [],
      columns: [

        {
          name: 'title',
          required: false,
          label: 'Title',
          align: 'left',
          field: row => row.title,
          //format: val => `${new Date(val+'.000Z')}`,
          sortable: true
        },
        {
          name: 'description',
          required: false,
          label: 'Description',
          align: 'left',
          field: row => row.description,
          //format: val => `${new Date(val+'.000Z')}`,
          sortable: false
        },
        {
          name: 'actions',
          required: false,
          label: 'action(s)',
          align: 'center',
          field: row => row.actions,
          format: val => val.map(c =>c.account).join(', '),
          sortable: false
        },
        {
          name: 'expiration',
          required: true,
          label: 'Expire',
          align: 'left',
          field: row => row.expiration,
          // format: val => `${new Date(val+'.000Z')}`,
          sortable: true
        },


        {
          name: 'proposer',
          required: false,
          label: 'Proposer',
          align: 'left',
          field: row => row.proposer,
          //format: val => `${new Date(val+'.000Z')}`,
          sortable: false
        },
        {
          name: 'approvals',
          required: false,
          label: 'Approvals',
          align: 'left',
          field: row => row.approvals,
          format: val => val.join(', '),
          sortable: false
        },
        {
          name: 'extra',
          required: false,
          label: '',
          align: 'right',
          //field: row => row.description,
          //format: val => `${new Date(val+'.000Z')}`,
          sortable: false
        },
        // { name: 'calories', align: 'center', label: 'Calories', field: 'calories', sortable: true },
        // { name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true },
        // { name: 'carbs', label: 'Carbs (g)', field: 'carbs' },
        // { name: 'protein', label: 'Protein (g)', field: 'protein' },
        // { name: 'sodium', label: 'Sodium (mg)', field: 'sodium' },
        // { name: 'calcium', label: 'Calcium (%)', field: 'calcium', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
        // { name: 'iron', label: 'Iron (%)', field: 'iron', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) }
      ],
      data: this.proposals
    }
  },
  computed: {
    ...mapGetters({
      getAccountName: "ual/getAccountName"
    })
  },
  methods:{
    async cancelJob(id){
      let actions = [
        {
          account: "piecestest12",
          name: "cancel",
          data: {
            owner: this.getAccountName,
            id: id
          }
        }
      ];
      let res = await this.$store.dispatch("ual/transact", { actions: actions });
      if(res){
        this.$emit("executed");
        this.data = this.data.filter(d => d.id != id );
        this.$store.dispatch('user/fetchDeposits', this.getAccountName);
      }
    }
  },
  watch:{
    // proposals: function(){
    //   this.data = this.proposals;
    // }
  }
}
</script>
