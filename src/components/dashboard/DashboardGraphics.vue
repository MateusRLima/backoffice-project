<template>
  <v-card
    dark
    color="primary"
    style="max-height: 273px; border-radius: 20px !important"
    class="px-5"
  >
    <v-card-title class="pl-7 pt-10">
      <p class="primary-font ma-0 text-subtitle-1">Chart</p>
    </v-card-title>
    <v-card-text class="pb-0 px-5">
      <div v-if="loading" class="d-flex justify-space-around">
        <circle-loading ></circle-loading>
      </div>
      <line-chart
        v-else-if="!loading"
        :entries="entries"
        :withdraw="withdraw"
        :options="chartOptions"
        :style="style"
      />
    </v-card-text>
    <v-card-actions class="pt-3 pb-10 d-flex justify-center">
      <p class="secondary-font ma-0 text-caption">Last 7 days</p>
    </v-card-actions>
  </v-card>
</template>

<script>

import { apiTransDataL } from '../../service'
import LineChart from './DashboardGraphicChart.vue'

export default {
  name: 'DashboardGraphics',
  
  data: () => ({
    style: {
      height: '120px',
      color: 'white'
    },
    gradient: ['#42A6CA'],
    total: [],
    withdraw: [],
    entries: [],
    data: [],
    profit: '',
    chartOptions: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        fontColor: 'white'
       },
       scales: {
          yAxes: [{
            ticks: {
              fontColor: 'white',
              stepSize: 10000,
            },
            gridLines: {
              color: '#0f0f0f',
            },
          }],
          xAxes: [{
            ticks: {
              fontColor: 'white',
            },
            gridLines: {
              color: '#0f0f0f',
            },
          }],
       }
    },
    item: [],
    loading: false
  }),

  components: { LineChart },

  async mounted(){
    this.loading = true
    await apiTransDataL()
    .then(res => {
      this.profit = res.data.profit.toFixed(2)
      this.total = res.data.total.map(elem => {return elem.value})
      this.result = this.total.reduce(this.getTotal)
      this.result = this.result.toFixed(2)
      this.withdraw = res.data.withdraw
      this.entries = res.data.entries
      this.data = res.data.total
      this.loading = false
    })
  },

  methods: {
    getTotal(total, num){
      return total + num;
    }
  }

}
</script>

<style>

</style>