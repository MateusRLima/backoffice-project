<template>
  <v-navigation-drawer
    v-model="drawer"
    expand-on-hover
    app
    dark
    color="#111"
  >
    <template v-slot:prepend>
      <v-row class="ml-4 mt-5 mb-10">
        <img class="ball-image" src="../assets/logo-tech.png" alt="Logo da Jogue Fácil" width="25px" height="25px"/>
      </v-row>
    </template>
    <v-list dense class="drawer-list">
      <v-list-item
        v-for="(item, i) in items"
        :key="i"
        :to="item.router"
        link
        dense
        class="mt-2 mb-2"
        active-class="active-list"
      >
        <v-list-item-icon>
          <v-icon>
            {{item.icon}}
          </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>
            <span class="text-caption">{{item.title}}</span>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-group
        prepend-icon="mdi-cog"
        active-class="active-list"
        class="mt-2 mb-2"
      >
        <template v-slot:activator>
          <v-list-item-title>
            <span class="text-caption">Suporte</span>
          </v-list-item-title>
        </template>
        <v-list-item
          v-for="(system, i) in systems"
          :key="i"
          :to="system.router"
          link
          dense
          class="mt-2 mb-2 pl-10"
          active-class="active-list"
        >
          <v-list-item-content>
            <v-list-item-title>
              <span class="text-caption ml-15">{{system.title}}</span>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>
    <template v-slot:append>
      <v-list>
        <v-list-item
          link
          @click="logout()"
        >
          <v-list-item-icon>
            <v-icon color="red">mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              <span class="text-caption red--text">Sair</span>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script>

  import { apiLogout, apiUserPermissions } from '../service'

  import { mapMutations } from "vuex";

  export default {
    name: 'Drawer',
    
    data() {
      return {
        snackbar: false,
        drawer: true,
        color: '',
        initItems: {
          'JFU-VU' : { title: 'Clientes', icon: 'mdi-account', router: '/players' },
          'JFC-VC' : { title: 'Colaboradores', icon: 'mdi-clipboard-account', router: '/user' },
          'JFF-VN' : { title: 'Financeiro', icon: 'mdi-currency-usd', router: '/financial' },
          'JFF-VT' : { title: 'Transações', icon: 'mdi-swap-horizontal-bold', router: '/transaction' },
        },
        items: [
          { title: 'Dashboard', icon: 'mdi-view-dashboard', router: '/dashboard' },
        ],
        systems: [
          { title: 'Helpdesk', router: '/helpdesk' },
          { title: 'Log', router: '/log' },
        ]
      }
    },

    mounted(){
      apiUserPermissions()
        .then(res => {
          Object.keys(res.data.permissions).forEach(element => {
            if(Object.keys(this.initItems).includes(element)){
              this.items.push(this.initItems[element])
            }
          });
        })
    },

    methods: {
      ...mapMutations(["showSnackbar", "closeSnackbar"]),

      logout(){
       apiLogout()
          .then(() => {
            this.showSnackbar({ text: "Volte sempre !", timeout: 3000 });
            this.$router.push('/')
          })
      },
    }
  }
</script>

<style>
  .drawer-list .active-list {
    color: #FFB300 !important;
    background: #1F1F1F !important;
  }

  .drawer-list .theme--dark.v-list-item--active:hover::before, .theme--dark.v-list-item--active::before {
    opacity: 0 !important;
  }

  .drawer-list .theme--dark.v-navigation-drawer:not(.v-navigation-drawer--floating) .v-navigation-drawer__border {
    background-color: rgba(31, 31, 31, 0.877) !important;
  }

</style>