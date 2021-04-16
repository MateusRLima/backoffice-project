<template>
  <div>
    <drawer-navigation/>
    <v-container>
      <toolbar-menu :disable="disabled" icon="mdi-account" title="Clients" :view="5" @openEditMass="openEditMass"/>
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
            no-results-text="Client not found"
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
        items: [
          {
            id: 0,
            name: 'John Doe',
            email: 'johndoe@email.com',
            phone: '311-647-2945',
          },
          {
            id: 1,
            name: 'John Doe',
            email: 'johndoe@email.com',
            phone: '553-390-1782',
          },
          {
            id: 2,
            name: 'John Doe',
            email: 'johndoe@email.com',
            phone: '999-477-8742',
          },
          {
            id: 3,
            name: 'John Doe',
            email: 'johndoe@email.com',
            phone: '677-469-8621',
          },
          {
            id: 4,
            name: 'John Doe',
            email: 'johndoe@email.com',
            phone: '544-381-2394',
          },
          {
            id: 5,
            name: 'John Doe',
            email: 'johndoe@email.com',
            phone: '349-463-1936',
          },
          {
            id: 6,
            name: 'John Doe',
            email: 'johndoe@email.com',
            phone: '315-275-1337',
          },
        ],
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
          { text:'ID', value: 'id', align: 'left', divider: true, width: '5px' },
          { text:'Name', value: 'name', align: 'left', divider: true, width: '5px' },
          { text:'Email', value: 'email', align: 'left', divider: true, width: '5px' },
          { text: 'Phone Number', value: 'phone', align: 'left', divider: true, width: '5px' },
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
    }
  }
</script>