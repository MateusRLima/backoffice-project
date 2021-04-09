<template>
  <v-card color="primary" class="pa-10" style="border-radius: 20px">
    <v-card-text class="pa-0">
      <v-row class="ma-auto mb-4" align="center">
        <p  class="primary-font ma-0 text-subtitle-1">Recent Transactions</p>
        <v-spacer></v-spacer>
        <router-link class="secondary-font text-caption" to="/transaction">See more</router-link>
      </v-row>
      <v-data-table
        item-key="orderId"
        :headers="headers"
        :search="search"
        :items="items" 
        :items-per-page="totalItems"
        :page.sync="page"
        @page-count="pageCount = $event"
        :loading="load"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        :item-class="itemRowBackground"
        loading-text="Carregando transações, aguarde ..."
        dark
        :height="height + 'vh'"
        class="cell-height elevation-0"
        style="background-color: #111"
        no-results-text="A transação não foi encontrada"
        hide-default-header
        hide-default-footer
      >
        <template #header>
          <tr>
            <th class="table-header" v-for="header in headers" :key="header.text">
              {{ header.text }}
            </th>
          </tr>
        </template>
        <template #loading>
          <circle-loading class="mt-7"></circle-loading>
        </template>
        <template #item="{ item }">
          <tr>
            <td class="table-row text-center pa-0">
              <v-chip x-small :style="{color: statusFont(item.status) }" :color="statusColor(item.status)" label style="min-width: 8vw; justify-content: center; color: black">
                <strong :style="{fontSize: fontSize + 'em'}">{{statusMod(item.status)}}</strong>
              </v-chip>
            </td>
            <td class="table-row text-center pa-0">
              <router-link v-if="item.email !== '---'" class="data-font" :style="{fontSize: fontSize + 'em'}" style="height: 10px; text-decoration: none" :to="{ name: 'Players', params: { id: item.email } }">{{item.email}}</router-link>
              <span v-else>---</span>
            </td>
            <td class="table-row text-center pa-0">
              <p class="ma-0 data-font" :style="{fontSize: fontSize + 'em'}" v-if="item.bankName === 'PicPay'">PicPay</p>
              <p class="ma-0 data-font" :style="{fontSize: fontSize + 'em'}" v-else-if="item.bankName === 'BRASIL CASH'">Cartão de Crédito</p>
              <p class="ma-0 data-font" :style="{fontSize: fontSize + 'em'}" v-else-if="item.bankName === 'Saque'">Saque</p>
              <p class="ma-0 data-font" :style="{fontSize: fontSize + 'em'}" v-else>{{ item.type }}</p>
            </td>
            <td class="table-row text-center pa-0">
              <p class="ma-0 data-font" v-if="item.bankName === 'Saque'" :style="{fontSize: fontSize + 'em'}">R$ {{ item.brlValue }}</p>
              <p class="ma-0 data-font" v-else :style="{fontSize: fontSize + 'em'}">R$ {{ item.brlValue }}</p>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>

import { apiTransGetL, apiLogout } from '../../service'

export default {
  name: 'DashboardRecentTransaction',

  data () {
    return {
      search: '',
      psp: '',
      items: [],
      expanded: [],
      interval: null,
      singleExpand: true,
      sortBy: 'createdAt',
      sortDesc: true,
      load: false,
      totalItems: 5,
      page: 1,
      pageCount: 0,
      height: 20,
      pagination: {},
      message: '',
      success: '',
      token: '',
      full: false,
      fontSize: 0.8,
    }
  },

  computed: {
    headers(){
      return [
        { text: 'Status', value: 'status', align: 'center', divider: true, width: '10' },
        { text: 'Email', value: 'email', align: 'center', divider: true },
        { text: 'Type', value: 'type', align: 'center', divider: true, width: '10' },
        { text: 'Value', value: 'brlValue', align: 'center', divider: true, width: '50' },
      ]
    }
  },

  mounted(){
    this.getTrades(true)
    // this.interval = setInterval(() => {
    //   this.getTrades(false)
    // }, 20000)
  },

  methods: {
    getTrades(load){
      this.load = load
      apiTransGetL()
        .then(res => {
          this.items = res.data.data
          this.load = false
        })
        .catch(err => {
          this.status = err.response.data.status
          if(err.response.status === 404){
            this.showSnackbar({ text: "Problema de Conexão", timeout: 3000 });
            this.load = false
            this.$router.push('/')
          }
          else if(this.status === 3 || this.status === 1 || this.status === 2 || this.status === 0){
            this.showSnackbar({ text: "Sessão Expirada", timeout: 3000 });
            apiLogout()
            this.load = false
            this.$router.push('/')
          }
          this.load = false
        })
      },

      statusColor(status){
        if(status === 1){
          return '#EBB30F'
        }
        else if(status === 2) {
          return '#41D622'
        }
        else if(status === 3) {
          return '#D62222'
        }
      },

      statusFont(status){
        if(status === 1){
          return '#61470A'
        }
        else if(status === 2) {
          return '#144B08'
        }
        else if(status === 3) {
          return '#430808'
        }
      },

      statusMod(status){
        if(status === 1){
          return 'EM AGUARDO'
        }
        else if(status === 2) {
          return 'APROVADO'
        }
        else if(status === 3) {
          return 'RECUSADO'
        }
      },
   }
}
</script>

<style>

.dash-card{
  border-radius: 20px !important;
}

.table-header{
  background: #1E1E1E;
  border: solid 0.5px #2C2C2C;
  font-size: 0.9em;
  padding: 2px;
  letter-spacing: 0.1em;
  font-weight: normal;
}

.table-row{
  border: solid 1px #2C2C2C;
  font-size: 0.9em;
  letter-spacing: 0.1em;
  font-weight: normal;
  height: 28px !important;
}

</style>