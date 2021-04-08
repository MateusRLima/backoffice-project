<script>

import { Line } from 'vue-chartjs'

export default {
  
  name: 'DashboardGraphicChart',

  extends: Line,

  props: {
    label: String,
    total: Array,
    entries: Array,
    withdraw: Array,
    options: Object
  },

  mounted () {
    const entries = this.entries.map(elem => {return elem.value})
    const withdraw = this.withdraw.map(elem => {return elem.value})
    const data = this.entries.map(elem => {return elem.data})

    this.renderChart(
      {
        labels: data,
        datasets: [
          {
            label: 'Entrada',
            data: entries,
            borderColor: '#09E660',
            pointBorderColor: 'white',
            pointBackgroundColor: '#09E660',
          },
          {
            label: 'Saque',
            data: withdraw,
            borderColor: '#E63025',
            pointBorderColor: 'white',
            pointBackgroundColor: '#E63025',
          }
        ]
      },
      this.options
    )
  }
}

</script>