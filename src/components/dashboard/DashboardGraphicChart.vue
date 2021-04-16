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
    const entries = ['150', '584', '398', '874', '1500', '350', '98']
    const withdraw = ['25', '15', '85', '28', '15', '27', '65']
    const data = ['02/18', '02/19', '02/20', '02/21', '02/22', '02/23', '02/24']

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