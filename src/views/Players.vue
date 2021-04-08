<template>
  <div>
    <drawer-navigation/>
    <v-container>
      <toolbar-menu :disable="disabled" icon="mdi-account" title="Clientes" :view="5" @openEditMass="openEditMass"/>
       <player-dialog
        v-model="show"
        ref="playerDialog"
      >
      </player-dialog>
      <player-mass-dialog
        v-model="showM"
        :players="selectedPlayers"
      >
      </player-mass-dialog>
      <v-card id="table" class="mt-3" style="border-radius: 20px; background: #111">
        <v-card-text class="pb-2">
          <v-data-table
            hide-default-footer
            v-model="selectedPlayers"
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
            item-key="id"
            class="elevation-0"
            fixed-header
            dark
            :height="height + 'vh'"
            style="border-radius: 0px; background-color: #111"
            no-results-text="O cliente não foi encontrado"
          >
            <template #loading>
              <circle-loading style="margin-top: 20vh"></circle-loading>
            </template>
            <template #top>
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
              <span style="color: white">Não há clientes disponíveis para visualização</span>
            </template>
            <template #item.id="{ item }">
              <span class="data-font" :style="{fontSize: fontSize + 'px'}">{{item.id}}</span>
            </template>
            <template #item.firstName="{ item }">
              <span class="data-font" :style="{fontSize: fontSize + 'px'}">{{item.firstName + ' ' + item.lastName}}</span>
            </template>
            <template #item.email="{ item }">
              <span class="data-font" :style="{fontSize: fontSize + 'px'}">{{item.email}} </span>
            </template>
            <template #item.phone="{ item }">
              <span class="data-font" :style="{fontSize: fontSize + 'px'}">{{item.phone}}</span>
            </template>
            <template #item.btag="{ item }">
              <span class="data-font" :style="{fontSize: fontSize + 'px'}">{{item.btag}}</span>
            </template>
            <template #item.balance="{ item }">
              <span class="data-font" :style="{fontSize: fontSize + 'px'}">{{item.balance}}</span>
            </template>
            <template #item.action="{ item }">
              <v-tooltip color="#0C0C0C" bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    color="#B5B5B5"
                    v-bind="attrs"
                    v-on="on"
                    @click="openEdit(item.id)"
                  >
                    <v-icon small>mdi-account-edit</v-icon>
                  </v-btn>
                </template>
                <p class="text-caption secondary-font ma-0">Editar</p>
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
  import { apiListClient, apiLogout } from '../service'
  import { mapMutations } from "vuex";

  import PlayerEditDialog from '../components/players/PlayerEditDialog'
  import PlayerMassEditDialog from '../components/players/PlayerMassEditDialog'

  export default {
    
    name: 'PlayersTable',

    data () {
      return {
        email: '',
        expanded: [],
        singleExpand: false,
        search: '',
        firstName: '',
        lastName: '',
        totalItems: 10,
        full: false,
        page: 1,
        pageCount: 0,
        height: 55,
        fontSize: 12,
        items: [],
        load: false,
        loadT: '',
        show: false,
        showM: false,
        id:[],
        value: Boolean,
        register: Boolean,
        selectedPlayers: [],
      }
    },

    components: {
      'player-dialog': PlayerEditDialog,
      'player-mass-dialog' : PlayerMassEditDialog
    },

    computed: {
      headers(){
        return [
          { text:'ID', value: 'id', align: 'left', divider: true, width: '6%' },
          { text:'Nome', value: 'firstName', align: 'left', divider: true },
          { text:'Email', value: 'email', align: 'left', divider: true },
          { text: 'Telefone', value: 'phone', align: 'center', divider: true },
          { text:'Broker', value: 'btag', align: 'center', divider: true },
          { text:'Balanço', value: 'balance', align: 'center', divider: true },
          // { text: 'Ação', value: 'action', align: 'center', divider: true, width: '5%' }
        ]
      },

      disabled: function(){
        if(this.selectedPlayers.length === 0) {
          return true
        } else {
          return false
        }
      }
    },

    created(){
      this.getClients();
    },

    mounted(){
      this.search = this.$route.params.id;
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

      openEditMass(){
        this.showM = true
      },

      openEdit(id){
        this.show = true
        this.$refs.playerDialog.getClientById(id)
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
      
      parseDate(now) {
        now = new Date(now)
        return `${now.getDate() >= 10 ? now.getDate() : `0${now.getDate()}`}/${now.getMonth() + 1 >= 10 ? now.getMonth() + 1 : `0${now.getMonth() + 1}`}/${now.getFullYear()}
        ${now.getHours() >= 10 ? now.getHours() : `0${now.getHours()}`}:${now.getMinutes() >= 10 ? now.getMinutes() : `0${now.getMinutes()}`}:${now.getSeconds() >= 10 ? now.getSeconds() : `0${now.getSeconds()}`}`
      },

      convertDate(date) {
        function pad(s) { return (s < 10) ? '0' + s : s; }
        var d = new Date(date)
        return [pad(d.getDate()+1), pad(d.getMonth()+1), d.getFullYear()].join('/')
      },
      
      getClients() {
        this.loadT = 'Carregando os clientes, aguarde ...'
        this.load = true
        apiListClient()
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
      },
    }
  }
</script>