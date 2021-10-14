<template>
  <div>
    <q-markup-table :dark="false"  separator="horizontal" class="comparison-table bg-transparent no-shadow ">
      <thead>
        <tr  style="height:80px">
          <th class="text-left "></th>
          <th class="text-center ">
              <q-img
                style="width: 20vw; max-width:135px; min-width:100px; filter: brightness(0) invert(1);"
                contain
                src="~assets/animus-logo-small.png"
              />
          </th>
          <th class="text-center bg-grey-9">
              <q-img
                style="width: 20vw; max-width:100px; min-width:100px"
                contain
                src="~assets/other.svg"
              />
          </th>
        </tr>
      </thead>
      <tbody class="bg-white text-weight-bold">
        <tr>
          <td class="text-left bg-grey-9">Pricing</td>
          <td class="text-center">Free*</td>
          <td class="text-center">Setup and monthly fees</td>
        </tr>
        <tr>
          <td class="text-left bg-grey-9">Modular</td>
          <td class="text-center"><q-icon name="check" color="positive" size="24px"/></td>
          <td class="text-center"><q-icon name="close" color="negative" size="24px"/></td>
        </tr>
        <tr>
          <td class="text-left bg-grey-9">100% on chain</td>
          <td class="text-center"><q-icon name="check" color="positive" size="24px"/></td>
          <td class="text-center"><q-icon name="close" color="negative" size="24px"/></td>
        </tr>
        <tr>
          <td class="text-left bg-grey-9">Centralized API</td>
          <td class="text-center"><q-icon name="close" color="negative" size="24px"/></td>
          <td class="text-center"><q-icon name="check" color="positive" size="24px"/></td>
        </tr>
        <tr>
          <td class="text-left bg-grey-9">Trustless & Permissionless</td>
          <td class="text-center"><q-icon name="check" color="positive" size="24px"/></td>
          <td class="text-center"><q-icon name="close" color="negative" size="24px"/></td>
        </tr>
        <tr>
          <td class="text-left bg-grey-9">Censorship Resistance</td>
          <td class="text-center"><q-icon name="check" color="positive" size="24px"/></td>
          <td class="text-center"><q-icon name="close" color="negative" size="24px"/></td>
        </tr>

      </tbody>
    </q-markup-table>
    <div class="text-caption text-grey">*The creator pays for the RAM associated with the deployment. RAM costs can be recovered when the group/DAC is destroyed.</div>
  </div>
</template>

<script>
export default {
  // name: 'ComponentName',
  data () {
    return {}
  }
}
</script>
<style >

.comparison-table th:first-child{
  background-color: transparent !important;
}

.comparison-table th{
  background-color:var(--q-color-primary);
}

.comparison-table td:first-child{
  background-color:var(--q-color-primary);
  color: white;
}
.comparison-table thead th:first-child, .comparison-table tbody td:first-child{
  position: sticky;
  left: 0;
  z-index: 1;
}

</style>
