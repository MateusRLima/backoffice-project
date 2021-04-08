<template>
  <div>
    <new-company-dialog  @get="getCompany()" v-model="showD"></new-company-dialog>
    <wallet-table-dialog v-model="showW" :idCompany="id" ref="wallet"></wallet-table-dialog>
    <emmit-billet-dialog v-model="showE" :idCompany="id" ref="emit"></emmit-billet-dialog>
    <v-container>
      <v-card color="#111" id="table" style="border-radius: 20px">
        <v-card-text class="pb-2">
          <v-data-table
            hide-default-footer
            :headers="headers"
            :items="items"
            :single-expand="singleExpand"
            :expanded.sync="expanded"
            :loading="load"
            :loading-text="loadT"
            :items-per-page="totalItems"
            :page.sync="page"
            @page-count="pageCount = $event"
            :search="search"
            item-key="name"
            class="elevation-0"
            fixed-header
            dark
            style="background-color: #111"
            :height="height + 'vh'"
            no-results-text="A empresa não foi encontrada"
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
            <template #no-data>
              <span style="color: white">Não há empresas disponíveis para visualização</span>
            </template>
            <template #item.id="{ item }">
              <span :style="{fontSize: fontSize + 'px'}">{{item.id}}</span>
            </template>
            <template #item.cnpj="{ item }">
              <span :style="{fontSize: fontSize + 'px'}">{{item.cnpj}}</span>
            </template>
            <template #item.name="{ item }">
              <span :style="{fontSize: fontSize + 'px'}">{{item.name}}</span>
            </template>
            <template #item.postalCode="{ item }">
              <span :style="{fontSize: fontSize + 'px'}">{{item.postalCode}}</span>
            </template>
            <template #item.street="{ item }">
              <span :style="{fontSize: fontSize + 'px'}">{{item.street}}</span>
            </template>
            <template #item.number="{ item }">
              <span :style="{fontSize: fontSize + 'px'}">{{item.number}}</span>
            </template>
            <template #item.neighborhood="{ item }">
              <span :style="{fontSize: fontSize + 'px'}">{{item.neighborhood}}</span>
            </template>
            <template #item.complement="{ item }">
              <span :style="{fontSize: fontSize + 'px'}">{{item.complement}}</span>
            </template>
            <template #item.action="{ item }">
              <v-tooltip bottom color="#0C0C0C">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    color="secondary"
                    v-bind="attrs"
                    v-on="on"
                    @click="openWallet(item.id)"
                  >
                    <v-icon small>mdi-wallet</v-icon>
                  </v-btn>
                </template>
                <p class="text-caption secondary-font ma-0">Carteiras</p>
              </v-tooltip>
            </template>
            <template #footer>
              <footer-table :totalItems="totalItems" :page="page" :pageCount="pageCount" @nextPage="nextPage" @previousPage="previousPage" @setTotalItems="setTotalItems"></footer-table>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>

  import { apiCompanyGet, apiLogout } from '../../service'

  import CompanyDialogNew from './company/CompanyDialogNew'
  import CompanyDialogWallet from './company/CompanyDialogWallet'
  import CompanyDialogBillet from './company/CompanyDialogBillet'

  import { mapMutations } from "vuex";

  export default {
    name: 'CompanyTable',

    props: {
      showD: Boolean,
      showW: Boolean,
      showE: Boolean,
    },

    data () {
      return {
        expanded: [],
        singleExpand: false,
        search: '',
        fontSize: 12,
        totalItems: 50,
        page: 1,
        pageCount: 0,
        height: 55,
        items: [],
        load: false,
        loadT: '',
        full: false,
        id:[],
      }
    },

    components: {
      'new-company-dialog' : CompanyDialogNew,
      'wallet-table-dialog' : CompanyDialogWallet,
      'emmit-billet-dialog' : CompanyDialogBillet
    },

    computed: {
      headers(){
        return [ 
            { text:'ID', value: 'id', align: 'left', divider: true },
            { text:'CNPJ', value: 'cnpj', align: 'center', divider: true },
            { text:'Razão Social', value: 'name', align: 'center', divider: true },
            { text:'CEP', value: 'postalCode', align: 'center', divider: true },
            { text:'Logradouro', value: 'street', align: 'center', divider: true },
            { text:'Número', value: 'number', align: 'center', divider: true },
            { text:'Bairro', value: 'neighborhood', align: 'center', divider: true },
            { text:'Complemento', value: 'complement', align: 'center', divider: true },
            { text: 'Carteiras', value: 'action', align: 'center',  divider: true}
          ]
        }
    },

    mounted() {
      this.getCompany()
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

      ...mapMutations(["showSnackbar", "closeSnackbar"]),

      createCompany(){
        this.showD = true
      },

      openWallet(id){
        this.showW = true
        this.$refs.wallet.getWallet(id)
      },

      openEmit(){
        this.showE = true
        this.$refs.emit.clear(true)
      },

      getCompany(){
        this.loadT = 'Carregando empresas, aguarde ...'
        this.load = true
        apiCompanyGet()
          .then(res => {
            this.items = res.data.data
            this.id = res.data.data.map(elem => elem.id)
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
      }
    }
  }
</script>

<style>

  

</style>
