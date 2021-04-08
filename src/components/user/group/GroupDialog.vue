<template>
  <v-dialog v-model="show" max-width="400px" no-click-animation>
    <v-card dark class="card-border">
      <v-card-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="show = false"
          ><v-icon small color="white">mdi-close</v-icon></v-btn
        >
      </v-card-title>
      <v-card-text class="pb-0 px-15">
        <v-row class="mx-auto mb-10">
          <h1 class="font-weight-bold">
            <v-icon class="mr-3" color="#BCBCBC">mdi-account-plus</v-icon>
            Criar Grupo
          </h1>
        </v-row>
        <label style="color: #8d8d8d" for="groupname">Nome do grupo</label>
        <v-text-field
          id="groupname"
          class="input-dialog text-caption"
          color="secondary"
          v-model="groupName"
          dark
          dense
          height="30"
          outlined
          single-line
        >
        </v-text-field>
        <v-expansion-panels accordion flat multiple class="group-panel">
          <v-expansion-panel v-for="page in pages" :key="page">
            <v-expansion-panel-header class="px-0">
              {{ page }}
            </v-expansion-panel-header>
            <v-expansion-panel-content class="px-0 pb-8">
              <v-row
                class="mt-0"
                align="center"
                justify="start"
                v-for="permission in permissions"
                :key="permission.name"
              >
                <v-checkbox
                  color="#FFB300"
                  v-if="permission.page === page"
                  dense
                  hide-details
                  v-model="permissionSelected[permission.code]"
                  :value="permission.selected"
                >
                  <template #label>
                    <label class="text-caption"> {{ permission.name }} </label>
                  </template>
                </v-checkbox>
              </v-row>
            </v-expansion-panel-content>
            <v-divider dark></v-divider>
          </v-expansion-panel>
        </v-expansion-panels>
        <base-btn
          width="100%"
          class="my-10"
          name="Criar grupo"
          color="#474747"
          @clickEvent="createGroup()"
          :loading="load"
        >
        </base-btn>
      </v-card-text>
    </v-card>
  </v-dialog> 
</template>

<script>
import { mapMutations } from "vuex";

import { apiActionsList, apiGroupCreate } from "../../../service";

export default {
  name: "GroupDialog",

  props: {
    value: Boolean,
  },

  data: () => ({
    load: false,
    groupName: "",
    permissions: [],
    permissionSelected: {},
    pages: [
      "Dashboard",
      "Financeiro",
      "NFSE",
      "Empresas",
      "Usuário",
      "Colaboradores",
      "Suporte",
    ],
  }),

  created() {
    apiActionsList().then((res) => {
      this.permissions = res.data.data;
    });
  },

  computed: {
    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },

  methods: {
    ...mapMutations(["showSnackbar", "closeSnackbar"]),

    createGroup() {
      this.load = true;
      apiGroupCreate({
        name: this.groupName,
        actions: this.permissionSelected,
      })
        .then(() => {
          this.showSnackbar({ text: "Grupo criado", timeout: 3000 });
          this.load = false;
          this.permissionSelected = {};
          this.show = false;
          this.$emit('listGroup')
        })
        .catch((err) => {
          this.error = err.response.data.status;
          if (err.response.status === 404) {
            this.showSnackbar({ text: "Problema de Conexão", timeout: 3000 });
          }
          if (err.response.status === 400) {
            this.showSnackbar({ text: "Dados inválidos", timeout: 3000 });
          } else if (
            this.error === 3 ||
            this.error === 1 ||
            this.error === 2 ||
            this.error === 0
          ) {
            this.showSnackbar({ text: "Sessão Expirada", timeout: 3000 });
            this.$router.push("/");
          }
          this.load = false;
        });
    },
  },
};
</script>

<style scoped>
.group-panel .v-expansion-panel-content__wrap {
  padding: 0 24px 16px;
  flex: 1 1 auto;
  max-width: 100%;
}
</style>

