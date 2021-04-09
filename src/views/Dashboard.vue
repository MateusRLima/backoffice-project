<template>
  <div>
    <drawer-navigation/>
    <v-container class="mr-0 pr-0" style="max-width: 85%">
      <h1 class="secondary--text mb-5">Welcome !</h1>
      <v-row dense style="margin-bottom: 1vw">
        <v-col style="max-width: 15vw; margin-right: 1vw">
          <dashboard-balance></dashboard-balance>
        </v-col>
        <v-col style="max-width: 50vw">
          <dashboard-graphic></dashboard-graphic>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col style="max-width: 66vw">
         <dashboard-recent-trans></dashboard-recent-trans>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>

import DashboardGraphics from '../components/dashboard/DashboardGraphics'
import DashboardBalance from '../components/dashboard/DashboardBalance'
import DashboardRecentTransaction from '../components/dashboard/DashboardRecentTransaction'

export default {
  name: 'Dashboard',

  data(){
    return{
      status: '',
      right: null,
      table: 0,
      refresh: false,
      search: '',
    }
  },

  components: {
    'dashboard-graphic' : DashboardGraphics,
    'dashboard-balance' : DashboardBalance,
    'dashboard-recent-trans' : DashboardRecentTransaction
  },

  methods: {
    getTotal(total, num){
      return total + num;
    },
  },
}

</script>

<style>

</style>