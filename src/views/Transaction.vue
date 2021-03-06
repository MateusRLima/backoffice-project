<template>
  <div>
    <drawer-navigation/>
    <v-container>
      <toolbar-menu icon="mdi-swap-horizontal-bold" title="Transações" :view="3"/>
      <v-card id="table" color="primary" class="mt-3" style="border-radius: 20px">
        <v-card-text class="pb-2">
          <v-data-table
            :single-expand="singleExpand"
            show-expand
            :expanded.sync="expanded"
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
            :height="height + 'vh'"
            class="elevation-0"
            style="border-radius: 10px; background-color: #111"
            fixed-header
            no-results-text="A transação não foi encontrada"
            hide-default-footer
          >
            <template #loading>
              <circle-loading style="margin-top: 20vh"></circle-loading>
            </template>
            <template #top>
              <top-table :fullScreen="full" :fontSize="fontSize" @fontPlus="changeFontPlus()" @fontMinus="changeFontMinus()" @fullScreen="openFullscreen()" @windowScreen="closeFullscreen()">
                <template #filter>
                  <v-text-field
                    dark
                    color="#F9F9F3"
                    v-model="search"
                    class="text-caption mr-5"
                    placeholder="Pesquisar"
                    dense
                    outlined
                    hide-details
                    style="max-width: 15vw; border-radius: 7px"
                    height="30"
                  >
                    <template #append>
                      <v-icon small>mdi-magnify</v-icon>
                    </template>
                  </v-text-field>
                  <label for="statusFilter" class="text-caption secondary-font mr-1">Status</label>
                  <v-select
                    id="statusFilter"
                    color="#F9F9F3"
                    height="30"
                    dark
                    dense
                    outlined
                    hide-details
                    :items="status"
                    item-value="id"
                    item-text="label"
                    v-model="selectedStatus"
                    @input="transactionFilter('LOGUS')"
                    class="mr-5 custom-input text-caption"
                    style="max-width: 12vw"
                  >
                  </v-select>
                </template>
              </top-table>
            </template>
            <template v-slot:no-data>
              Não há transações disponíveis para visualização
            </template>
            <template v-slot:expanded-item="{ headers, item }">
              <td :colspan="headers.length">
                <v-container>
                  <v-row>
                    <v-col sm="3" style="padding-right: 0px;">
                      <p class="secondary-font text-caption">Banco</p>
                      <p class="data-font text-caption">{{item.bankName}}</p>
                    </v-col>
                    <v-col sm="3" style="padding-left: 0px">
                      <p class="secondary-font text-caption">Atualizada em</p>
                      <p class="data-font text-caption">{{parseDate(item.updatedAt)}}</p>
                    </v-col>
                    <v-col sm="3" style="padding-left: 0px">
                      <p class="secondary-font text-caption">Order ID</p>
                      <p class="data-font text-caption">{{item.orderId}}</p>
                    </v-col>
                  </v-row>
                </v-container>
              </td>
            </template>
            <template #item.createdAt="{ item }">
              <span class="data-font" :style="{fontSize: fontSize + 'px'}">{{parseDate(item.createdAt)}}</span>
            </template>
            <template #item.userName="{ item }">
              <span class="data-font" :style="{fontSize: fontSize + 'px'}">{{item.userName.toUpperCase()}}</span>
            </template>
            <template #item.email="{ item }">
              <router-link v-if="item.email !== '---'" class="data-font" :style="{fontSize: fontSize + 'px'}" style="height: 10px; text-decoration: none" :to="{ name: 'Players', params: { id: item.email } }">{{item.email}}</router-link>
              <span v-else>---</span>
            </template>
            <template #item.type="{ item }">
              <span class="data-font" :style="{fontSize: fontSize + 'px'}" v-if="item.bankName === 'PicPay'">PicPay</span >
              <span class="data-font" :style="{fontSize: fontSize + 'px'}" v-else-if="item.bankName === 'BRASIL CASH'">Cartão de Crédito</span >
              <span class="data-font" :style="{fontSize: fontSize + 'px'}" v-else-if="item.bankName === 'Saque'">Saque</span >
              <span class="data-font" :style="{fontSize: fontSize + 'px'}" v-else>{{ item.type }}</span >
            </template>
            <template #item.brlValue="{ item }">
              <span class="data-font" v-if="item.bankName === 'Saque'" :style="{fontSize: fontSize + 'px'}">R${{ item.brlValue }}</span>
              <span class="data-font" v-else :style="{fontSize: fontSize + 'px'}">R${{ item.brlValue }}</span>
            </template>
            <template #item.status="{ item }">
              <v-chip small class="chip" :style="{color: statusFont(item.status) }" :color="statusColor(item.status)" label style="min-width: 10vw; justify-content: center; color: black">
                <span :style="{fontSize: fontSize + 'px'}" style="font-weight: 900">{{statusMod(item.status)}}</span>
              </v-chip>
            </template>
            <template v-slot:footer>
              <footer-table :totalItems="totalItems" :page="page" :pageCount="pageCount" @nextPage="nextPage" @previousPage="previousPage" @setTotalItems="setTotalItems"></footer-table>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios'
import { apiTransGetL, apiLogout } from '../service'
import Loading from '../components/BaseLoading'

export default {
  name: 'TransactionTable',

  components: {
    'circle-loading' : Loading
  },

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
      totalItems: 10,
      page: 1,
      pageCount: 0,
      height: 55,
      pagination: {},
      message: '',
      success: '',
      token: '',
      full: false,
      fontSize: 10,
      status: [
        {
          label:'Em aguardo',
          id: '1'
        },
        {
          label:'Aprovado',
          id: '2'
        },
        {
          label:'Recusado',
          id: '3'
        },
         {
          label:'Qualquer',
          id:''
        },
      ],
      selectedStatus: '',
      categories: [
        {
          label:'Jogue Fácil',
          id:'1'
        },
        {
          label:'Backoffice',
          id:'2'
        },
        {
          label:'Outros',
          id:'3'
        },
        {
          label:'Qualquer',
          id:''
        },
      ],
    }
  },

  created() {
    this.getTrades(true)
    // this.interval = setInterval(() => {
    //   this.getTrades(false)
    // }, 20000)
  },

  computed: {
    headers(){
      return [
        {text: 'Status', value: 'status', align: 'center', divider: true },
        {text: 'Nome', value: 'userName', align: 'center', divider: true },
        {text: 'Email', value: 'email', align: 'center', divider: true },
        {text: 'Tipo', value: 'type', align: 'center', divider: true },
        {text: 'Valor', value: 'brlValue', align: 'center', divider: true },
        {text: 'Criado Em', value: 'createdAt', align: 'center', divider: true },
      ]
    }
  },

  beforeDestroy () {
    clearInterval(this.interval)
  },

  methods: {
    nextPage(page) {
      this.page = page
    },

    previousPage(page) {
      this.page = page
    },

    setTotalItems(totalItems){
      this.totalItems = totalItems
    },

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
      
      transactionFilter(psp){
        this.loadT = 'Carregando tickets, aguarde ...'
        this.load = true
        if(this.selectedStatus === ''){
           this.getTrades(false)
        } else {
          
          axios.post(`https://eefce09e6477.ngrok.io/transactions/listFilter/${psp}`, null,  
            { 
              withCredentials: true, 
              params: {
                status: this.selectedStatus 
              },
            } 
          )
          .then(res => {
            this.items = res.data.data
            this.load = false
          })
        }
      },

      openFullscreen() {
        var elem = document.querySelector('#table');

        if (elem.requestFullscreen) {
          elem.requestFullscreen();
          this.full = true
          this.totalItems = 19
          this.fontSize = 18
          this.height = 80
        } else if (elem.webkitRequestFullscreen) { /* Safari */
          elem.webkitRequestFullscreen();
          this.full = true
          this.totalItems = 19
          this.fontSize = 18
          this.height = 80
        } else if (elem.msRequestFullscreen) { /* IE11 */
          elem.msRequestFullscreen();
          this.full = true
          this.totalItems = 19
          this.fontSize = 18
          this.height = 80
        }
      },

      closeFullscreen() {
        if (document.exitFullscreen) {
          document.exitFullscreen();
          this.full = false
          this.totalItems = 10
          this.fontSize = 10
          this.height = 55
        } else if (document.webkitExitFullscreen) { /* Safari */
          document.webkitExitFullscreen();
          this.full = false
          this.totalItems = 10
          this.fontSize = 10
          this.height = 55
        } else if (document.msExitFullscreen) { /* IE11 */
          document.msExitFullscreen();
          this.full = false
          this.totalItems = 10
          this.fontSize = 10
          this.height = 55
        }
      },

      changeFontMinus(){
        if(this.fontSize > 8){
          this.fontSize--
        }
      },

      changeFontPlus(){
        if(this.fontSize < 18){
          this.fontSize++
        }
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

      parseDate (now) {
        now = new Date(now)
        return `${now.getDate() >= 10 ? now.getDate() : `0${now.getDate()}`}/${now.getMonth() + 1 >= 10 ? now.getMonth() + 1 : `0${now.getMonth() + 1}`}/${now.getFullYear()} 
        ${now.getHours() >= 10 ? now.getHours() : `0${now.getHours()}`}:${now.getMinutes() >= 10 ? now.getMinutes() : `0${now.getMinutes()}`}:${now.getSeconds() >= 10 ? now.getSeconds() : `0${now.getSeconds()}`}`
      },

      itemRowBackground: function (item) {
        return item.type === 'Saque' ? 'style-1' : ''
      },
    }
  }
</script>

<style>

  .style-1 {
    background-color: #481C16
  }

  .custom-input{
    border-radius: 7px;
  }

</style>