<template>
<div>
  <nfse-emit-dialog ref="emiNfse" @get="getNFSE()" v-model="showE"></nfse-emit-dialog>
  <v-container>
    <v-card color="#111" id="table" style="border-radius: 20px">
      <v-card-text class="pb-2">
        <v-data-table
          :headers="headers"
          :items="items"
          single-expand
          item-key="id"
          show-expand
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :items-per-page="totalItems"
          :page.sync="page"
          @page-count="pageCount = $event"
          :loading="load"
          :loading-text="loadT"
          :search="search"
          class="elevation-0"
          dark
          fixed-header
          hide-default-footer
          :height="height + 'vh'"
          style="border-radius: 0px; background-color: #111"
          no-results-text="A nota fiscal não foi encontrada"
        >
          <template #loading>
            <circle-loading style="margin-top: 20vh"></circle-loading>
          </template>
          <template v-slot:top>
            <top-table :fullScreen="full" :fontSize="fontSize" @fontPlus="changeFontPlus()" @fontMinus="changeFontMinus()" @fullScreen="openFullscreen()" @windowScreen="closeFullscreen()">
              <template #filter>
                <v-text-field
                  color="secondary"
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
              </template>
            </top-table>
          </template>
          <template v-slot:no-data>
            <span style="color: white">Não há notas fiscais disponíveis para visualização</span>
          </template>
          <template #item.id="{ item }">
            <span :style="{fontSize: fontSize + 'px'}">{{item.id}}</span>
          </template>
          <template #item.date="{ item }">
            <span :style="{fontSize: fontSize + 'px'}">{{parseDate(item.date)}}</span>
          </template>
          <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length">
              <v-container>
                <v-row>
                  <v-col class="py-0">
                    <p style="font-size: 0.8em; color: #707070">Descrição</p>
                    <p :style="{fontSize: fontSize + 'px'}">{{item.description}}</p>
                  </v-col>
                  <v-col>
                    <p style="font-size: 0.8em; color: #707070">Carteira</p>
                    <p :style="{fontSize: fontSize + 'px'}">{{item.wallet}}</p>
                  </v-col>
                </v-row>
              </v-container>
            </td>
          </template>
          <template #item.invoiceValue="{ item }">
            <span class="data-font" :style="{fontSize: fontSize + 'px'}">R$ {{item.invoiceValue}}</span>
          </template>
          <template #item.sellingValue="{ item }">
            <span class="data-font" :style="{fontSize: fontSize + 'px'}">R$ {{item.sellingValue}}</span>
          </template>
          <template #item.buyingValue="{ item }">
            <span class="data-font" :style="{fontSize: fontSize + 'px'}">R$ {{item.buyingValue}}</span>
          </template>
          <template #item.quantity="{ item }">
            <span class="data-font" :style="{fontSize: fontSize + 'px'}">{{item.quantity}}</span>
          </template>
          <template #item.unityValue="{ item }">
           <span class="data-font" :style="{fontSize: fontSize + 'px'}"> R$ {{item.unityValue}}</span>
          </template>
          <template #item.company="{ item }">
           <span class="data-font" :style="{fontSize: fontSize + 'px'}">{{item.company}}</span>
          </template>
          <template #item.psp="{ item }">
           <span class="data-font" :style="{fontSize: fontSize + 'px'}">{{item.psp}}</span>
          </template>
          <template #item.statusId="{ item }">
            <v-tooltip color="#0C0C0C" v-if="item.statusId === 1" bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon small v-bind="attrs" v-on="on" color="yellow">mdi-clock</v-icon>
              </template>
              <p class="text-caption secondary-font ma-0">Em aguardo</p >
            </v-tooltip>
            <v-tooltip color="#0C0C0C" v-if="item.statusId === 2" bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon small v-bind="attrs" v-on="on" color="green">mdi-checkbox-marked-circle-outline</v-icon>
              </template>
              <p class="text-caption secondary-font ma-0">Emitida</p >
            </v-tooltip>
            <v-tooltip color="#0C0C0C" v-if="item.statusId === 3" bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon small v-bind="attrs" v-on="on" color="red">mdi-close-circle-outline</v-icon>
              </template>
              <p class="text-caption secondary-font ma-0">Cancelada</p >
            </v-tooltip>
            <v-tooltip color="#0C0C0C" v-if="item.statusId === 4" bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon small v-bind="attrs" v-on="on" color="#E66800">mdi-alert-circle</v-icon>
              </template>
              <p class="text-caption secondary-font ma-0" >Erro</p >
            </v-tooltip>
          </template>
          <template #item.action="{ item }">
            <v-tooltip color="#0C0C0C" bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-if="item.statusId === 3 || item.statusId === 2"
                  icon
                  color="#00996A"
                  v-bind="attrs"
                  v-on="on"
                  @click="openNfse(item.url)"
                >
                  <v-icon small>mdi-eye</v-icon>
                </v-btn>
                <v-icon v-else color="red" small>mdi-eye-off</v-icon>
              </template>
              <p class="text-caption secondary-font ma-0">NFSE</p >
            </v-tooltip>
            <v-tooltip color="#0C0C0C" bottom v-if="item.statusId === 4">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  small
                  icon
                  color="#00996A"
                  v-bind="attrs"
                  v-on="on"
                  @click="resendNfse(item.id)"
                >
                  <v-icon small>mdi-reload</v-icon>
                </v-btn>
              </template>
              <p class="text-caption secondary-font ma-0">Re-enviar</p >
            </v-tooltip>
            <v-tooltip color="#0C0C0C" bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  small
                  v-if="item.statusId === 2 && !loadA"
                  icon
                  color="red"
                  v-bind="attrs"
                  v-on="on"
                  @click="cancelNfse(item.id)"
                >
                  <v-icon small>mdi-close</v-icon>
                </v-btn>
              </template>
              <p class="text-caption secondary-font ma-0">Cancelar</p >
            </v-tooltip>
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
  import { apiNfseList, apiNfseCancel, apiNfseUpdate, apiLogout, apiNfseResend } from '../../service'

  import NfseDialogEmit from './NFSE/NfseDialogEmit'

  import { mapMutations } from "vuex";

  export default {
    name: 'NfseTable',

    components: {
      'nfse-emit-dialog' : NfseDialogEmit,
    },

    props: {
      showE: Boolean,
    },

    data () {
      return {
        expanded: [],
        search: '',
        sortBy: 'id',
        sortDesc: true,
        fontSize: 12,
        totalItems: 50,
        page: 1,
        pageCount: 0,
        full: false,
        height: 55,
        status: '',
        singleExpand: false,
        items: [],
        load: false,
        loadA: false,
        loadT: '',
        id:[],
      }
    },

    computed: {
      headers(){
        return [ 
            { text: 'ID', value: 'id', align: 'left', divider: true, width: '4%' },
            { text: 'Data', value: 'date', align: 'left', divider: true, width: '10%' },
            { text: 'Val. NFSE', value: 'invoiceValue', align: 'center', divider: true },
            { text: 'Venda', value: 'sellingValue', align: 'center', divider: true },
            { text: 'Compra', value: 'buyingValue', align: 'center', divider: true },
            { text: 'Qtd. BTC', value: 'quantity', align: 'center', divider: true },
            { text: 'Valor de 1 BTC', value: 'unityValue', align: 'center', divider: true },
            { text: 'Empresa Cliente', value: 'company', align: 'center', divider: true, width: '15%' },
            { text: 'PSP', value: 'psp', align: 'left', divider: true, width: '10%' },
            { text: 'Status', value: 'statusId', align: 'center', divider: true, width: '10%' },
            { text: 'Ação', value: 'action', align: 'center', divider: true, width: '7%' }
          ] 
        }
    },

    mounted() {
      this.getNFSE()
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

      ...mapMutations(["showSnackbar", "closeSnackbar"]),

      emitNfse(){
        this.$refs.emiNfse.getCompany()
        this.$refs.emiNfse.getPsp()
        this.showE = true
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

      resendNfse(id){
        apiNfseResend({
          id: id
        })
          .then(() => {
            this.showSnackbar({ text: "NFSE " + id + " Re-enviada" , timeout: 3000 });
            this.load = false
            this.getNFSE()
          })
          .catch(() => {
            this.showSnackbar({ text: "Desculpe, mas ocorreu um problema", timeout: 3000 });
            this.load = false
          })
      },

      parseDate (now) {
        now = new Date(now)
        return `${now.getDate() >= 10 ? now.getDate() : `0${now.getDate()}`}/${now.getMonth() + 1 >= 10 ? now.getMonth() + 1 : `0${now.getMonth() + 1}`}/${now.getFullYear()} 
        ${now.getHours() >= 10 ? now.getHours() : `0${now.getHours()}`}:${now.getMinutes() >= 10 ? now.getMinutes() : `0${now.getMinutes()}`}:${now.getSeconds() >= 10 ? now.getSeconds() : `0${now.getSeconds()}`}`
      },

      openNfse(url){
        window.open(url,'_blank');
      },

      updateNFSE(){
        this.loadT = 'Atualizando NFSE, aguarde ...'
        this.load = true
        apiNfseUpdate()
          .then(() => {
            this.load = false
          })
          .catch(err => {
            if(err.response.status === 404){
              this.showSnackbar({ text: "Problema de Conexão", timeout: 3000 });
              this.load = false
              this.$router.push('/')
            }
            this.showSnackbar({ text: 'Erro ao atualizar', timeout: 3000 });
            this.load = false
          })
      },

      getNFSE(){
        this.loadT = 'Carregando as NFSE, aguarde ...'
        this.load = true
        apiNfseList()
          .then(res => {
            this.items = res.data.data
            this.id = res.data.data.map(elem => elem.id)
            this.updateNFSE()
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

      cancelNfse(id){
        this.load = true
        this.showSnackbar({ text: "Cancelamento solicitado, aguarde confirmação", timeout: 3000 });
        apiNfseCancel({
          id: id
        })
          .then(() => {
            this.showSnackbar({ text: "NFSE " + id + " Cancelado" , timeout: 3000 });
            this.load = false
            this.getNFSE()
          })
          .catch(() => {
            this.showSnackbar({ text: "Desculpe, mas ocorreu um problema", timeout: 3000 });
            this.load = false
          })
      }
    }
  }
</script>
