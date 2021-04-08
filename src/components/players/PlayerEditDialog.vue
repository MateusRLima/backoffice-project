<template>
  <v-dialog v-model="show" max-width="350px" persistent no-click-animation>
    <v-card dark class="card-border">
      <v-card-title>
        <v-spacer></v-spacer>
        <v-btn class="pr-0" icon @click="close()"><v-icon small color="#F2F2F2">mdi-close</v-icon></v-btn>
      </v-card-title>
      <v-card-text class="pb-0 px-15 ">
        <v-container class="px-0">
          <v-row class="mx-auto mb-10">
            <v-icon class="mr-3" color="#BCBCBC">mdi-account-edit</v-icon>
            <h1 class="font-weight-bold">Editar cliente</h1>
          </v-row>
          <div class="mb-5">
            <v-icon small class="mr-3" color="#8D8D8D">mdi-account</v-icon>
            <span class="subtitle-1" style="color: #8D8D8D">Dados pessoais</span>
          </div>
          <v-form>
            <label for="name">Nome</label>
            <v-text-field
              color="secondary"
              height="30"
              :loading="loadInput"
              v-model="name"
              id="name"
              dark
              outlined
              dense
              class="input-dialog text-caption"
            >
              <template #append>
                <v-icon small>mdi-pencil</v-icon>
              </template>
            </v-text-field>
            <label for="docNumber">Documento</label>
            <v-text-field
              color="secondary"
              height="30"
              :loading="loadInput"
              v-model="docNumber"
              id="docNumber"
              dark
              outlined
              dense
              class="input-dialog text-caption"
            >
              <template #append>
                <v-icon small>mdi-pencil</v-icon>
              </template>
            </v-text-field>
            <label for="gender">Gênero</label>
            <v-text-field
              color="secondary"
              height="30"
              :loading="loadInput"
              v-model="gender"
              dark
              outlined
              dense
              class="input-dialog text-caption"
              disabled
            >
            </v-text-field>
            <label for="email">Email</label>
            <v-text-field
              color="secondary"
              height="30"
              :loading="loadInput"
              v-model="email"
              id="email"
              dark
              outlined
              dense
              class="input-dialog text-caption"
            >
              <template #append>
                <v-icon small>mdi-pencil</v-icon>
              </template>
            </v-text-field>
            <label for="phone">Telefone</label>
            <v-text-field
              color="secondary"
              height="30"
              :loading="loadInput"
              v-model="phone"
              id="phone"
              dark
              outlined
              dense
              class="input-dialog text-caption"
            >
              <template #append>
                <v-icon small>mdi-pencil</v-icon>
              </template>
            </v-text-field>
            <label for="birthDate">Data de Nascimento</label>
            <v-text-field
              color="secondary"
              height="30"
              :loading="loadInput"
              v-model="birthDate"
              id="birthDate"
              dark
              outlined
              dense
              class="input-dialog text-caption"
            >
              <template #append>
                <v-icon small>mdi-pencil</v-icon>
              </template>
            </v-text-field>
            <label for="address">Endereço</label>
            <v-text-field
              color="secondary"
              height="30"
              :loading="loadInput"
              v-model="address"
              id="address"
              dark
              outlined
              dense
              class="input-dialog text-caption"
              hide-details
              disabled
            >
            </v-text-field>
            <v-divider dark class="my-10"></v-divider>
            <div class="mb-5">
              <v-icon small class="mr-3" color="#8D8D8D">mdi-account-cog</v-icon>
              <span class="subtitle-1" style="color: #8D8D8D">Dados da plataforma</span>
            </div>
            <label for="bTag">Broker</label>
            <v-text-field
              color="secondary"
              height="30"
              :loading="loadInput"
              v-model="broker"
              id="bTag"
              dark
              outlined
              dense
              class="input-dialog text-caption"
            >
              <template #append>
                <v-icon small>mdi-pencil</v-icon>
              </template>
            </v-text-field>
            <label for="balance">Balanço</label>
            <v-text-field
              color="secondary"
              height="30"
              :loading="loadInput"
              v-model="balance"
              id="balance"
              dark
              outlined
              dense
              class="input-dialog text-caption"
              disabled
            >
            </v-text-field>
          </v-form>
          <base-btn
            width="100%"
            class="my-10"
            name="Salvar alterações"
            color="#474747"
            @clickEvent="updatePlayer()"
            :loading="load"
          >
          </base-btn>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>

import { apiGetClientById } from '../../service'

export default {
  name: 'PlayerEditDialog',

  data () {
    return{
      name: '',
      docNumber: '',
      gender: '',
      email: '',
      phone: '',
      birthDate: '',
      address: '',
      broker: '',
      balance: '',
      load: false,
      loadInput: false
    }
  },

  props: {
    value: Boolean,
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

  methods: {
    getClientById(id){
      this.loadInput = true
      apiGetClientById({
        id: id
      })
        .then(res => {
          this.name = res.data.data.firstName + ' ' + res.data.data.lastName,
          this.docNumber = res.data.data.docNumber,
          this.gender = res.data.data.gender === '1' ? 'Masculino' : 'Feminino',
          this.email = res.data.data.email,
          this.phone = res.data.data.phone,
          this.birthDate = res.data.data.birthDate,
          this.address = res.data.data.address,
          this.broker = res.data.data.btag,
          this.balance = res.data.data.balance
          this.loadInput = false
        })
    },

    close(){
      this.name = ''
      this.docNumber = '' 
      this.gender = '' 
      this.email = ''
      this.phone = '' 
      this.birthDate = '' 
      this.address = '' 
      this.broker = '' 
      this.balance = '' 
      this.loadInput = false
      this.show = false
    }
  }
}

</script>

<style>

.input-dialog{
  border-radius: 7px
}

.card-border {
  border-bottom-left-radius: 10px !important;
  border-top-left-radius: 10px !important;
  border-top-right-radius: 0px !important;
  border-bottom-right-radius: 0px !important;
}

</style>