<template>
  <v-dialog v-model="show" max-width="400px" persistent no-click-animation>
    <v-card dark>
      <v-card-title>
        <v-spacer></v-spacer>
        <v-btn class="pr-0" icon @click="close()"><v-icon small color="#F2F2F2">mdi-close</v-icon></v-btn>
      </v-card-title>
      <v-card-text class="pb-0 px-15">
        <v-row class="mx-auto mb-10">
          <v-icon class="mr-3" color="#BCBCBC">mdi-pencil-box-multiple</v-icon>
          <h1 class="font-weight-bold">Editar clientes</h1>
        </v-row>
        <v-virtual-scroll
          :items="players"
          height="200"
          item-height="60"
          style="border: 1px solid #707070; border-radius: 4px"
          class="my-10"
        >
          <template v-slot:default="{ item }">
            <v-list-item :key="index">
              <v-list-item-content>
                <v-list-item-title>
                  <v-row align="center" justify="center" class="mb-2">
                    <v-col cols="5">
                      <v-tooltip bottom color="#0C0C0C">
                        <template v-slot:activator="{ on, attrs }">
                          <span class="text-caption secondary-font ma-0" v-if="item.firstName === null"> Sem nome</span>
                          <p v-bind="attrs" v-on="on" class="ma-0">{{ item.firstName.slice(0, 10) + ' ...' }}</p>
                        </template>
                        <p class="text-caption secondary-font ma-0">{{ item.firstName + ' ' + item.lastName }}</p>
                      </v-tooltip>
                    </v-col>
                    <v-col>
                      <span class="text-caption secondary-font ma-0" v-if="item.btag === null">Sem broker</span>
                      <p class="ma-0" v-if="item.btag">{{ item.btag.slice(0, 20) }}</p>
                    </v-col>
                    <v-col cols="2" class="pa-0">
                      <v-btn small class="pr-0" icon @click="deletePlayer(index)"><v-icon small color="#F2F2F2">mdi-close</v-icon></v-btn>
                    </v-col>
                  </v-row>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-virtual-scroll>
        <label for="broker">Broker</label>
        <v-select
          height="30"
          id="broker"
          dark
          dense
          outlined
          hide-details
          :items="broker"
          v-model="selectedBroker"
          @input="transactionFilter('LOGUS')"
          class="custom-input text-caption"
          :loading="loadInput"
          color="secondary"
        >
        </v-select>
        <base-btn
          width="100%"
          class="my-10"
          name="Salvar Alteração"
          color="#474747"
          @clickEvent="createUser()"
          :loading="load"
        >
        </base-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>

import { apiUpdateBtagClient, apiGetBtag } from '../../service'

export default {
  name: 'PlayerMassEditDialog',

  props: {
    value: Boolean,
    players: {
      type: Array,
      required: true
    }
  },

  data () {
    return {
      index: '',
      broker: [],
      selectedBroker: '',
      load: false,
      loadInput: false,
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

  methods: {
    deletePlayer(index){
      this.players.splice(index, 1)
    },

    getBtag(){
      this.loadInput = true
      apiGetBtag()
        .then(res => {
          console.log(res.data.data)
        })
    },

    close(){
      this.players = []
      this.show = false
    },

    updateBroker(){
      apiUpdateBtagClient()
    }
  }

}
</script>

<style>

</style>