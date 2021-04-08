<template>
  <div>
    <helpdesk-dialog @get="getTickets()" ref="erticket" v-model="showG" :register="register" :titleEdit="title" :descriptionEdit="description" :idTicket="idTicket"></helpdesk-dialog>
    <drawer-navigation/>
    <v-container>
      <toolbar-menu icon="mdi-face-agent" title="Helpdesk" :view="6" @registerTicket="registerTicket(true)"/>
      <v-card id="table" class="mt-3" style="border-radius: 20px; background: #111">
        <v-card-text>
          <v-data-table
            hide-default-footer
            :headers="headers"
            :items="items"
            :search="search"
            :single-expand="singleExpand"
            show-expand
            :expanded.sync="expanded"
            :loading="load"
            :loading-text="loadT"
            :items-per-page="totalItems"
            :page.sync="page"
            @page-count="pageCount = $event"
            item-key="id"
            class="elevation-0"
            fixed-header
            dark
            :height="height + 'vh'"
            style="background-color: #111"
            no-results-text="O ticket não foi encontrado"
          >
            <template #loading>
              <circle-loading style="margin-top: 20vh"></circle-loading>
            </template>
            <template v-slot:top>
              <top-table :fullScreen="full" :fontSize="fontSize" @fontPlus="changeFontPlus()" @fontMinus="changeFontMinus()" @fullScreen="openFullscreen()" @windowScreen="closeFullscreen()">
                <template #filter>
                  <v-text-field
                    dark
                    v-model="search"
                    class="text-caption mr-5"
                    placeholder="Pesquisar"
                    dense
                    outlined
                    color="secondary"
                    hide-details
                    style="max-width: 15vw; border-radius: 7px"
                    height="30"
                  >
                    <template #append>
                      <v-icon small>mdi-magnify</v-icon>
                    </template>
                  </v-text-field>
                  <label for="statusFilter" class="text-caption secondary-font mr-1">Categorias</label>
                  <v-select
                    height="30"
                    dark
                    hide-details
                    dense
                    outlined
                    color="secondary"
                    :items="categories"
                    item-value="id"
                    item-text="label"
                    class="mr-5 custom-input text-caption"
                    style="max-width: 12vw"
                    v-model="selectedCategory"
                    @input="filter()"
                  >
                  </v-select>
                  <label for="statusFilter" class="text-caption secondary-font mr-1">Status</label>
                  <v-select
                    color="secondary"
                    height="30"
                    style="max-width: 12vw"
                    dark
                    hide-details
                    dense
                    outlined
                    class="mr-5 custom-input text-caption"
                    :items="status"
                    item-value="id"
                    item-text="label"
                    v-model="selectedStatus"
                    @input="filter()"
                  >
                  </v-select>
                </template>
              </top-table>
            </template>
            <template v-slot:expanded-item="{ headers, item }">
              <td :colspan="headers.length">
                <v-container>
                  <v-row>
                    <v-col class="pa-0">
                      <p style="font-size: 0.8em; color: #707070">Descrição</p>
                      <p style="font-size: 0.9em">{{item.description}}</p>
                    </v-col>
                  </v-row>
                </v-container>
              </td>
            </template>
            <template v-slot:no-data>
              <span style="color: white">Não há tickets disponíveis para visualização</span>
            </template>
            <template #item.id="{ item }">
              <span :style="{fontSize: fontSize + 'px'}">{{ item.id }}</span>
            </template>
            <template #item.status="{ item }">
              <span>
                <v-chip outlined :color="statusColor(item.status)" label style="min-width: 12vw; justify-content: center; color: white">
                  <span :style="{fontSize: fontSize + 'px'}">{{statusMod(item.status)}}</span>
                </v-chip>
              </span>
            </template>
            <template #item.title="{ item }">
              <span :style="{fontSize: fontSize + 'px'}">{{ item.title }}</span>
            </template>
            <template #item.category="{ item }">
              <span :style="{fontSize: fontSize + 'px'}" v-if="item.category === 1">Jogue Fácil</span>
              <span :style="{fontSize: fontSize + 'px'}" v-else-if="item.category === 2">BackOffice</span>
              <span :style="{fontSize: fontSize + 'px'}" v-else>Outros</span>
            </template>
            <template #item.email="{ item }">
              <span :style="{fontSize: fontSize + 'px'}">{{ item.email }}</span>
            </template>
            <template #item.createdAt="{ item }">
              <span :style="{fontSize: fontSize + 'px'}">{{parseDate(item.createdAt)}}</span>
            </template>
            <template #item.action="{ item }">
              <v-tooltip  color="#0C0C0C" bottom v-if="item.status === 1 && !permissionResponse">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    small
                    icon
                    color="#B5B5B5"
                    v-bind="attrs"
                    v-on="on"
                    @click="editTicket(item.id)"
                  >
                    <v-icon small>mdi-pencil</v-icon>
                  </v-btn>
                </template>
                <p class="text-caption secondary-font ma-0">Editar</p>
              </v-tooltip>
              <v-tooltip  color="#0C0C0C" bottom v-if="item.status === 1 && permissionResponse || item.status === 2">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    small
                    icon
                    color="#B5B5B5"
                    v-bind="attrs"
                    v-on="on"
                    @click="editTicket(item.id)"
                  >
                    <v-icon small>mdi-chat</v-icon>
                  </v-btn>
                </template>
                <p class="text-caption secondary-font ma-0">Responder</p>
              </v-tooltip>
              <v-tooltip  color="#0C0C0C" bottom v-if="item.status === 2 && permissionChangeStatus">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    small
                    icon
                    color="#B5B5B5"
                    v-bind="attrs"
                    v-on="on"
                    @click="changeStatusTicket(item.id, 3)"
                  >
                    <v-icon small>mdi-check-bold</v-icon>
                  </v-btn>
                </template>
                <p class="text-caption secondary-font ma-0">Finalizar ticket</p>
              </v-tooltip>
              <v-tooltip  color="#0C0C0C" bottom v-if="item.status === 3 && permissionChangeStatus">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    small
                    icon
                    color="#B5B5B5"
                    v-bind="attrs"
                    v-on="on"
                    @click="changeStatusTicket(item.id, 1)"
                  >
                    <v-icon small>mdi-reload</v-icon>
                  </v-btn>
                </template>
                <p class="text-caption secondary-font ma-0">Reabrir ticket</p>
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
import { apiListTicket, apiLogout, apiChangeTicketStatus, apiUserPermissions, apiFilterTicket } from '../service'

import HelpdeskDialog from '../components/helpdesk/HelpdeskDialog'

export default {
  name: 'HelpDesk',

  data () {
    return {
      email: '',
      permissionChangeStatus: false,
      fontSize: 12,
      permissionResponse: false,
      expanded: [],
      items: [],
      singleExpand: false,
      totalItems: 10,
      page: 1,
      pageCount: 0,
      height: 55,
      load: false,
      description: '',
      loadT: false,
      search: '',
      status: [
        {
          label:'Aguardando Suporte',
          id:'1'
        },
        {
          label:'Em progresso',
          id:'2'
        },
        {
          label:'Finalizado',
          id:'3'
        },
         {
          label:'Qualquer',
          id:''
        },
      ],
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
      selectedCategory: '',
      selectedStatus: '',
      showU: false,
      showG: false,
      idTicket: Number,
      full: false,
      title: '',
      id:[],
      register: false
    }
  },

  components: {
    'helpdesk-dialog' : HelpdeskDialog
  },

  computed: {
    headers(){
      return [
        { text:'ID', value: 'id', align: 'left', divider: true },
        { text:'Status', value: 'status', align: 'center', divider: true },
        { text:'Título', value: 'title', align: 'center', divider: true },
        { text:'Categoria', value: 'category', align: 'center', divider: true },
        { text:'Criado por', value: 'email', align: 'center', divider: true },
        { text:'Criado Em', value: 'createdAt', align: 'center', divider: true },
        { text:'Ação', value: 'action', align: 'center', divider: true },
      ]
    }
  },

  mounted() {
    this.getTickets()
    apiUserPermissions()
      .then(res => {
        if(Object.keys(res.data.permissions).includes('JFS-ALS')){
          this.permissionChangeStatus = true
        }
        if (Object.keys(res.data.permissions).includes('JFS-RTK')){
          this.permissionResponse = true
        } else {
          this.permissionChangeStatus = false
          this.permissionResponse = false
        }
      })
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

    statusColor(status){
      if(status === 1) {
        return '#EBB30F'
      }
      else if(status === 2) {
        return '#41D622'
      }
      else if(status === 3) {
        return '#B5B5B5'
      }
    },

    statusMod(status){
      if(status === 1){
        return 'Aguardando suporte'
      }
      else if(status === 2) {
        return 'Em progresso'
      }
      else if(status === 3) {
        return 'Finalizado'
      }
    },

    filter(){
      this.loadT = 'Carregando tickets, aguarde ...'
      this.load = true
      apiFilterTicket({
        status: this.selectedStatus,
        category: this.selectedCategory
      })
      .then(res => {
        this.items = res.data.data
        this.load = false
      })
    },

    getTickets(){
      this.loadT = 'Carregando tickets, aguarde ...'
      this.load = true
      apiListTicket()
        .then(res => {
          this.selectedCategory = '',
          this.selectedStatus = '',
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
              .then(() => {
                this.load = false
                this.$router.push('/')
              })
          }
          this.load = false
        })
    },

    editTicket(id){
      this.register = false
      this.showG = true
      this.$refs.erticket.getOneTicket(id)
      this.$refs.erticket.chatList(id)
    },

    registerTicket(){
      this.register = true
      this.showG = true
    },

    changeStatusTicket(id, status){
      apiChangeTicketStatus({
        status: status,
        id: id
      })
        .then(() => {
          this.getTickets()
        })
    },

    parseDate(now){
      now = new Date(now)
      return `${now.getDate() >= 10 ? now.getDate() : `0${now.getDate()}`}/${now.getMonth() + 1 >= 10 ? now.getMonth() + 1 : `0${now.getMonth() + 1}`}/${now.getFullYear()} 
      ${now.getHours() >= 10 ? now.getHours() : `0${now.getHours()}`}:${now.getMinutes() >= 10 ? now.getMinutes() : `0${now.getMinutes()}`}:${now.getSeconds() >= 10 ? now.getSeconds() : `0${now.getSeconds()}`}`
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
  }
}

</script>

<style>
  .custom-input{
    border-radius: 7px;
  }
</style>