<template>
  <v-card
    dark
    color="primary"
    :style="loading ? center : ''"
    style="max-height: 50vh; border-radius: 20px !important"
  >
    <v-card-title class="pl-10 pt-10">
      <p class="primary-font ma-0 text-subtitle-1">Balanço</p>
    </v-card-title>
    <v-card-text class="px-0 d-flex align-center justify-center">
      <circle-loading v-if="loading"></circle-loading>
      <div v-else>
        <img src="../../assets/balance.png" loading="lazy">
        <h2 class="primary-font font-weight-bold">R$ {{this.result}}</h2>
      </div>
    </v-card-text>
    <v-card-actions class="pt-4 pb-10 d-flex justify-center align-center">
      <p class="secondary-font mb-0 text-caption">Últimos 7 dias</p>
    </v-card-actions>
  </v-card>
</template>

<script>

import { apiTransDataL } from '../../service'

export default {
  name: 'DashboardBalance',

  data(){
    return {
      result: null,
      total: [],
      withdraw: '',
      loading: false,
      center: {
        justifyContent: 'center',
      }
    }
  },

  mounted(){
    this.loading = true
    apiTransDataL()
      .then(res => {
        this.total = res.data.total.map(elem => {return elem.value})
        this.result = this.total.reduce(this.getTotal)
        this.result = this.result.toFixed(2)
        this.data = res.data.total
        this.loading = false
      })
  },

  methods: {
    getTotal(total, num){
      return total + num;
    },
  }
}
</script>