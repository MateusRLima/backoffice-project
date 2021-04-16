<template>
  <div>
    <employees-dialog ref="eruser" @get="getUser()" v-model="showU" :user="id" :register="register"></employees-dialog>
    <v-container>
      <v-card id="table" style="border-radius: 20px; background: #111">
        <v-card-text class="pb-2">
          <v-data-table
            :headers="headers"
            :search="search"
            :items="items"
            :single-expand="singleExpand"
            :expanded.sync="expanded"
            :loading="load"
            :loading-text="loadT"
            :items-per-page="totalItems"
            :page.sync="page"
            @page-count="pageCount = $event"
            item-key="name"
            class="elevation-0"
            fixed-header
            dark
            hide-default-footer
            :height="height + 'vh'"
            style="border-radius: 0px; background-color: #111"
            no-results-text="User not found"
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
                    class="text-caption"
                    placeholder="Search"
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
            <template #item.name="{ item }">
              <span class="data-font" :style="{fontSize: fontSize + 'px'}">{{item.name}}</span>
            </template>
            <template #item.email="{ item }">
              <span class="data-font" :style="{fontSize: fontSize + 'px'}">{{item.email}}</span>
            </template>
            <template #item.birthDate="{ item }">
              <span class="data-font" :style="{fontSize: fontSize + 'px'}"> {{ item.birthdate }} </span>
            </template>
            <template #item.group.name="{ item }">
              <span class="data-font" :style="{fontSize: fontSize + 'px'}">{{item.group.name}}</span>
            </template>
            <template #item.office="{ item }">
              <span class="data-font" :style="{fontSize: fontSize + 'px'}">{{item.office}}</span>
            </template>
            <template #item.createdAt="{ item }">
              <span class="data-font" :style="{fontSize: fontSize + 'px'}">{{ item.createdAt }}</span>
            </template>
            <template #item.activated="{ item }">
              <v-tooltip color="#0C0C0C" v-if="item.status === 1  " bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon small v-bind="attrs" v-on="on" color="green">mdi-checkbox-marked-circle-outline</v-icon>
                </template>
                <p class="text-caption secondary-font ma-0">Ativado</p>
              </v-tooltip>
              <v-tooltip color="#0C0C0C" v-else bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon small v-bind="attrs" v-on="on" color="red">mdi-block-helper</v-icon>
                </template>
                <p class="text-caption secondary-font ma-0">Desativado</p>
              </v-tooltip>
            </template>
            <template #item.action="{ item }">
              <v-tooltip color="#0C0C0C" bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    color="#B5B5B5"
                    v-bind="attrs"
                    v-on="on"
                    @click="openEruser(item.id)"
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
  import EmployeesDialog from './employees/EmployeesDialog'

  export default {
    name: 'EmployeesTable',

    data () {
      return {
        email: '',
        expanded: [],
        search: '',
        singleExpand: false,
        totalItems: 10,
        page: 1,
        pageCount: 0,
        height: 55,
        fontSize: 12,
        items: [
          {
            id: 0,
            name: 'John Doe',
            email: 'johndoe@email.com',
            birthdate: '06/02/1998',
            group: 'Manager',
            office: 'New York',
            createdAt: '28/04/1998',
            status: 2,
          },
          {
            id: 1,
            name: 'John Doe',
            email: 'johndoe@email.com',
            birthdate: '06/02/1998',
            group: 'Manager',
            office: 'New York',
            createdAt: '28/04/1998',
            status: 1,
          },
          {
            id: 2,
            name: 'John Doe',
            email: 'johndoe@email.com',
            birthdate: '06/02/1998',
            group: 'Manager',
            office: 'New York',
            createdAt: '28/04/1998',
            status: 1,
          },
          {
            id: 3,
            name: 'John Doe',
            email: 'johndoe@email.com',
            birthdate: '06/02/1998',
            group: 'Manager',
            office: 'New York',
            createdAt: '28/04/1998',
            status: 1,
          },
          {
            id: 4,
            name: 'John Doe',
            email: 'johndoe@email.com',
            birthdate: '06/02/1998',
            group: 'Manager',
            office: 'New York',
            createdAt: '28/04/1998',
            status: 2,
          },
          {
            id: 5,
            name: 'John Doe',
            email: 'johndoe@email.com',
            birthdate: '06/02/1998',
            group: 'Manager',
            office: 'New York',
            createdAt: '28/04/1998',
            status: 1,
          },
          {
            id: 6,
            name: 'John Doe',
            email: 'johndoe@email.com',
            birthdate: '06/02/1998',
            group: 'Manager',
            office: 'New York',
            createdAt: '28/04/1998',
            status: 1,
          },
        ],
        full: false,
        load: false,
        loadT: '',
        showU: false,
        showG: false,
        id:[],
        value: Boolean,
        register: Boolean,
      }
    },

    components: {
      'employees-dialog' : EmployeesDialog,
    },

    computed: {
      headers(){
        return [
          { text:'ID', value: 'id', align: 'left', divider: true },
          { text:'Name', value: 'name', align: 'center', divider: true },
          { text:'Email', value: 'email', align: 'center', divider: true },
          { text:'Birthdate', value: 'birthdate', align: 'center', divider: true },
          { text:'Group', value: 'group', align: 'center', divider: true },
          { text:'Office', value: 'office', align: 'center', divider: true },
          { text:'Created at', value: 'createdAt', align: 'center', divider: true },
          { text:'Status', value: 'activated', align: 'center', divider: true },
          { text:'Actions', value: 'action', align: 'center', divider: true, width: '5%' }
        ]
      }
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

      dateConvert(date, needTime){
        date = date.split('T')
        let time = date[1].split('.')[0]
        date = date[0].split('-')

        if(needTime) {
          return `${date[2]}/${date[1]}/${date[0]} ${time}`
        } else {
          return `${date[2]}/${date[1]}/${date[0]}`
        }
      },


      openEruser(id){
        this.$refs.eruser.clear(false)
        this.register = false
        this.showU = true
        this.$refs.eruser.getUserId(id)
        this.$refs.eruser.getGroups()
      },

      openRegister(){
        this.$refs.eruser.clear(false)
        this.register = true
        this.showU = true
        this.$refs.eruser.getGroups()
      },

      openCreateGroups(){
        this.register = true
        this.showG = true
        this.$refs.ergroups.getCompanyPermission('joguefacil')
      },

      openEditGroups(){
        this.register = false
        this.showG = true
        this.$refs.ergroups.getGroupList()
      },
    }
  }
</script>