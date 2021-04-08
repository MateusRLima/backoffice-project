<template>
  <v-dialog v-model="show" max-width="450px" persistent no-click-animation>
    <v-card style="background-color: #0f0f0f">
      <v-card-title>
        <h1 class="headline ml-3" style="color: white"><v-icon class="mr-3" color="white">mdi-barcode</v-icon>Emissão do Boleto</h1>
        <v-spacer></v-spacer>
        <v-btn icon @click="clear(false)"><v-icon color="white">mdi-close</v-icon></v-btn>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form ref="form">
            <div class="mb-5">
              <v-icon small class="mr-3" color="#8D8D8D">mdi-briefcase</v-icon>
              <span class="subtitle-1" style="color: #8D8D8D">Dados da Empresa</span>
            </div>
            <label for="companies" style="color: #8D8D8D">Selecionar Empresa</label>
            <v-select
              id="companies"
              dark
              dense
              outlined
              :items="companies"
              item-value="id"
              :load="load"
              v-model="selectedPSP"
              item-text="name"
              color="white"
            >
            </v-select>
            <label for="name" style="color: #8D8D8D">Razão Social</label>
            <v-text-field id="name" :rules="[rules.required]" dark dense class="input-dialog" color="white" outlined single-line v-model="name"></v-text-field>
            <label for="cnpj" style="color: #8D8D8D">CNPJ</label>
            <v-text-field id="cnpj" :rules="[rules.required]" dark dense class="input-dialog" color="white" outlined single-line v-model="cnpj" v-mask="['##.###.###/####-##']"></v-text-field>
            <v-divider dark class="mb-10 mt-5"></v-divider>
            <div class="mb-5">
              <v-icon small class="mr-3" color="#8D8D8D">mdi-map-marker</v-icon>
              <span class="subtitle-1" style="color: #8D8D8D">Endereço</span>
            </div>
            <label for="street" style="color: #8D8D8D">Logradouro</label>
            <v-text-field id="street" :rules="[rules.required]" dark dense class="input-dialog" color="white" outlined single-line v-model="street" type="text"></v-text-field>
            <label for="cep" style="color: #8D8D8D">CEP</label>
            <v-text-field id="cep" :rules="[rules.required]" dark dense class="input-dialog" color="white" outlined single-line v-model="postalCode" v-mask="['#####-###']"></v-text-field>
            <label for="complement" style="color: #8D8D8D">Complemento</label>
            <v-text-field id="complement" dark dense class="input-dialog"  color="white" outlined single-line v-model="complement" type="text"></v-text-field>
            <label for="number" style="color: #8D8D8D">Número</label>
            <v-text-field id="number" :rules="[rules.required]" dark dense class="input-dialog" color="white" outlined single-line v-model="number" type="number"></v-text-field>
            <label for="neighborhood" style="color: #8D8D8D">Bairro</label>
            <v-text-field id="neighborhood" :rules="[rules.required]" dark dense class="input-dialog" color="white" outlined single-line v-model="neighborhood" type="text"></v-text-field>
            <label for="value" style="color: #8D8D8D">Valor</label>
            <v-text-field id="value" :rules="[rules.required]" dark dense class="input-dialog" color="white" outlined single-line v-model="billetValue" type="text" @keyup.enter="createCompany()"></v-text-field>
            <v-btn dark :loading="load" color="#FFB300" @click="createCompany()">
              <template v-slot:loader>
                <v-progress-circular
                  :size="15"
                  :width="3"
                  indeterminate
                  color="black"
                ></v-progress-circular>
              </template>
              <span class="black--text">Salvar</span>
            </v-btn>
          </v-form>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>

import { apiCompanyCreate, apiCompanyGet, apiLogout } from '../../../service'
import { mapMutations } from "vuex";

export default {

    name: 'CompanyDialogBillet',
    
    props: {
        value: Boolean
    },

    data (){
        return {
          rules: {
            required: v => !!v || 'Campo obrigatório',
          },
          load: false,
          name: '',
          cnpj: '',
          postalCode: '',
          street: '',
          number: '',
          neighborhood: '',
          complement: '',
          status: '',
          billetValue: '',
          companies: '',
          selectedCompany: ''
        }
    },

    computed: {
        show: {
            get(){
                return this.value
            },
            set(value){
                this.$emit('input', value)
            }
        },
    },

    mounted(){
      this.getCompany()
    },

    methods: {
      ...mapMutations(["showSnackbar", "closeSnackbar"]),
      getCompany(){
        apiCompanyGet()
          .then(res => {
            this.companies = res.data.data
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
      createCompany(){
        this.load=true
        apiCompanyCreate({
          name: this.name,
          cnpj: this.cnpj,
          postalCode: this.postalCode,
          street: this.street,
          number: this.number,
          neighborhood: this.neighborhood,
          complement: this.complement,
        })
          .then(() => {
            this.load = false
            this.clear(false)
            this.$emit('get')
          })
          .catch(err => {
            this.status = err.response.data.status
            if(this.status === 3 || this.status === 1 || this.status === 2 || this.status === 0){
              this.showSnackbar({ text: "Sessão Expirada", timeout: 30000 });
              this.load = false
              this.$router.push('/')
            }
            this.load = false
          })
      },
      clear(close){
        this.name = '',
        this.cnpj = '',
        this.postalCode = '',
        this.street = '',
        this.number = '',
        this.neighborhood = '',
        this.complement = '',
        this.show = close,
        this.$refs.form.resetValidation()
      },
    }
}
</script>

<style>
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
</style>