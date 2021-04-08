<template>
  <v-dialog v-model="wallet" max-width="50vw" dark>
    <v-card>
      <v-card-title class="px-auto">
        <v-container>
          <v-row align="center">
            <h1 class="font-weight-bold secondary--text">
              <v-icon class="mr-3" color="secondary">mdi-wallet</v-icon>Carteiras
            </h1>
            <v-spacer></v-spacer>
            <v-btn icon @click="wallet = false"
              ><v-icon color="white" small>mdi-close</v-icon></v-btn
            >
          </v-row>
          <v-row align="center">
            <label class="text-caption mr-1">Adicionar carteira</label>
            <v-text-field
              height="30"
              @keyup.enter="createWallet(id)"
              dense
              class="mt-7 mr-5 input-dialog text-caption"
              color="secondary"
              outlined
              v-model="walletCode"
              style="max-width: 30%"
            ></v-text-field>
            <base-btn
              class="my-10"
              name="Adicionar"
              color="#474747"
              @clickEvent="createWallet(id)"
              :loading="loadB"
            >
            </base-btn>
          </v-row>
        </v-container>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="items"
          :loading="load"
          :loading-text="loadT"
          :items-per-page="totalItems"
          :page.sync="page"
          @page-count="pageCount = $event"
          item-key="id"
          hide-default-footer
        >
          <template #loading>
            <circle-loading style="margin-top: 5vh"></circle-loading>
          </template>
          <template v-slot:top>
            <!-- <v-toolbar class="d-flex align-center px-5" height="50px" style="background-color: #0f0f0f">
              <v-toolbar-title style="font-size: 1.5em">
                <span style="color: #BCBCBC">
                <v-icon class="mr-3" color="#BCBCBC">mdi-wallet-plus</v-icon>
                Cadastrar Carteira
                </span>
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-text-field height="30" @keyup.enter="createWallet(id)" dense class="mt-7 input-dialog text-caption" color="white" outlined v-model="walletCode" placeholder="Código da Carteira"></v-text-field>
              <v-spacer></v-spacer>
              <v-btn
                small
                color="#FFB300"
                @click="createWallet(id)"
                :loading="loadB"
                class="black--text"
                type="text"
              >
                Criar
              </v-btn>
            </v-toolbar> -->
          </template>
          <template v-slot:no-data>
            <span style="color: white"
              >Não há carteiras disponíveis para visualização</span
            >
          </template>
          <template #item.action="{ item }">
            <v-tooltip color="#0C0C0C" bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  color="red"
                  v-bind="attrs"
                  v-on="on"
                  @click="deleteWallet(item.id)"
                >
                  <v-icon small>mdi-delete</v-icon>
                </v-btn>
              </template>
              <p class="text-caption secondary-font ma-0">Deletar</p>
            </v-tooltip>
          </template>
          <template #footer>
            <footer-table
              :totalItems="totalItems"
              :page="page"
              :pageCount="pageCount"
              @nextPage="nextPage"
              @previousPage="previousPage"
              @setTotalItems="setTotalItems"
            ></footer-table>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-divider dark></v-divider>
  </v-dialog>
</template>

<script>
import {
  apiWalletCreate,
  apiWalletList,
  apiWalletDelete,
} from "../../../service";
import { mapMutations } from "vuex";

export default {
  name: "CompanyDialogWallet",

  props: {
    value: Boolean,
    idCompany: Array,
  },

  data() {
    return {
      load: false,
      loadB: false,
      totalItems: 5,
      page: 1,
      pageCount: 0,
      loadT: "",
      walletCode: "",
      items: [],
      id: "",
      create: false,
    };
  },

  computed: {
    wallet: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },

    headers() {
      return [
        { text: "ID", value: "id", align: "center", divider: true },
        { text: "Carteira", value: "wallet", align: "center", divider: true },
        { text: "Ação", value: "action", align: "center", divider: true },
      ];
    },
  },

  methods: {
    ...mapMutations(["showSnackbar", "closeSnackbar"]),

    inputActivation(){
      this.created = !this.created
    },

    createWallet(id) {
      id = this.id;
      this.loadT = "Criando carteira, aguarde ...";
      this.loadB = true;
      apiWalletCreate({
        wallet: this.walletCode,
        companyId: id,
      })
        .then(() => {
          this.loadB = false;
          this.getWallet(this.id);
        })
        .catch((err) => {
          this.status = err.response.data.status;
          if (err.response.status === 404) {
            this.showSnackbar({ text: "Problema de Conexão", timeout: 3000 });
            this.loadB = false;
            this.$router.push("/");
          } else if (
            this.status === 3 ||
            this.status === 1 ||
            this.status === 2 ||
            this.status === 0
          ) {
            this.showSnackbar({ text: "Sessão Expirada", timeout: 30000 });
            this.loadB = false;
            this.$router.push("/");
          } else {
            this.showSnackbar({
              text: "Dado incorreto, verifique os campos.",
              timeout: 30000,
            });
          }
          this.loadB = false;
        });
    },

    deleteWallet(id) {
      this.loadT = "Deletando carteira, aguarde ...";
      this.load = true;
      apiWalletDelete({
        id: id,
      })
        .then(() => {
          this.getWallet(this.id);
          this.showSnackbar({ text: "Carteira Deletada", timeout: 30000 });
        })
        .catch((err) => {
          this.status = err.response.data.status;
          if (err.response.status === 404) {
            this.showSnackbar({ text: "Problema de Conexão", timeout: 3000 });
            this.load = false;
            this.$router.push("/");
          } else if (
            this.status === 3 ||
            this.status === 1 ||
            this.status === 2 ||
            this.status === 0
          ) {
            this.showSnackbar({ text: "Sessão Expirada", timeout: 30000 });
            this.load = false;
            this.$router.push("/");
          }
          this.load = false;
        });
    },

    getWallet(id) {
      this.id = id;
      this.loadT = "Carregando carteiras, aguarde ...";
      this.load = true;
      apiWalletList({
        companyId: id,
      })
        .then((res) => {
          this.items = res.data.data;
          this.load = false;
        })
        .catch((err) => {
          this.status = err.response.data.status;
          if (err.response.status === 404) {
            this.showSnackbar({ text: "Problema de Conexão", timeout: 3000 });
            this.load = false;
            this.$router.push("/");
          } else if (
            this.status === 3 ||
            this.status === 1 ||
            this.status === 2 ||
            this.status === 0
          ) {
            this.showSnackbar({ text: "Sessão Expirada", timeout: 30000 });
            this.load = false;
            this.$router.push("/");
          }
          this.load = false;
        });
    },
  },
};
</script>

<style>
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}

.input-dialog {
  border-radius: 7px;
}
</style>