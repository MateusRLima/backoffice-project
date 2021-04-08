<template>
  <v-app style="background-color: #020202">
    <v-main class="d-flex align-center justify-center">
      <router-view>
      </router-view>
      <snackbar-alet></snackbar-alet>
    </v-main>
  </v-app>
</template>

<script>

import { apiSessionVerify } from './service'
import SnackbarAlert from './components/SnackbarAlert'

export default {
  created(){
    this.$vuetify.theme.dark = true
  },

  components: {
    'snackbar-alet' : SnackbarAlert,
  },

  data(){
    return{
      snackbar: false,
      status: false,
      statusL: true,
    }
  },

  mounted(){
    apiSessionVerify()
      .then(res => {
        if(res.data.success === true){ 
          this.status = res.data.success
          this.statusL = false
        } else {
          this.status = false
        }
      })
      .catch(err => {
        if(err.response.status === 404){
          this.showSnackbar({ text: "Problema de Conexão", timeout: 3000 });
          this.$router.push('/')
        }
      })
  },
}
</script>

<style>

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active,
textarea:-webkit-autofill,
textarea:-webkit-autofill:hover,
textarea:-webkit-autofill:focus,
select:-webkit-autofill,
select:-webkit-autofill:hover,
select:-webkit-autofill:focus {
    transition: background-color 5000s ease-in-out 0s;
    -webkit-text-fill-color: #fff !important;
}

::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    background: #2E2E2E;
}

::-webkit-scrollbar-thumb {
  /* -webkit-border-bottom-right-radius: 5px;
    border-bottom-right-radius: 5px;
    -webkit-border-top-right-radius: 5px;
    border-top-right-radius: 5px; */
    background: #B5B5B5; 
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5); 
}

::-webkit-scrollbar-thumb:window-inactive {
    background: #5C5C5C; 
}

html {
  letter-spacing: 2px;
}

</style>
