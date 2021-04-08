<template>
  <div>
    <drawer-navigation/>
    <v-container>
      <toolbar-menu icon="mdi-history" title="Log"/>
      <v-card id="table" class="mt-3" style="border-radius: 20px; background: #111">
        <v-card-text class="pb-2">
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
            no-results-text="O log não foi encontrado"
          >
            <template #loading>
              <circle-loading style="margin-top: 20vh"></circle-loading>
            </template>
            <template v-slot:top >
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
            <template v-slot:expanded-item="{ headers, item }">
              <td :colspan="headers.length">
                <v-container>
                  <v-col>
                    <p style="font-size: 0.8em; color: #707070">Descrição</p>
                    <p :style="{fontSize: fontSize + 'px'}">{{item.logs}}</p>
                  </v-col>
                </v-container>
              </td>
            </template>
            <template v-slot:no-data>
              <span style="color: white">Não há logs disponíveis para visualização</span>
            </template>
            <template #item.id="{ item }">
              <span :style="{fontSize: fontSize + 'px'}">{{item.id}}</span>
            </template>
            <template #item.email="{ item }">
              <span :style="{fontSize: fontSize + 'px'}">{{item.email}}</span>
            </template>
            <template #item.logAction="{ item }">
              <span :style="{fontSize: fontSize + 'px'}">{{item.logAction}}</span>
            </template>
            <template #item.logType="{ item }">
              <span :style="{fontSize: fontSize + 'px'}">{{item.logType}}</span>
            </template>
            <template #item.createdAt="{ item }">
              <span :style="{fontSize: fontSize + 'px'}">{{parseDate(item.createdAt)}}</span>
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

import { apiLogList, apiLogout } from '../service'

export default {
  name: 'LogTable',

  data () {
    return {
      email: '',
      expanded: [],
      singleExpand: false,
      totalItems: 10,
      page: 1,
      pageCount: 0,
      height: 55,
      fontSize: 12,
      items: [],
      load: false,
      loadT: '',
      search: '',
      showU: false,
      showG: false,
      full: false,
      id:[],
      register: false
    }
  },

  computed: {
    headers(){
      return [
        { text:'ID', value: 'id', align: 'center', divider: true },
        { text:'Email', value: 'email', align: 'center', divider: true },
        { text:'Ação', value: 'logAction', align: 'left', divider: true, width: '5%' },
        { text:'Tipo', value: 'logType', align: 'left', divider: true, width: '5%' },
        { text:'Data', value: 'createdAt', align: 'center', divider: true },
      ]
    }
  },

  mounted() {
    this.getLogs()
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

    getLogs(){
      this.loadT = 'Carregando logs, aguarde ...'
      this.load = true
      apiLogList()
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