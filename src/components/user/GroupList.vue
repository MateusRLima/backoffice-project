<template>
  <v-container>
    <group-dialog v-model="show" @listGroup="updateGroupList"></group-dialog>
    <v-card
      dark
      id="table"
      color="#111"
      style="border-radius: 20px"
    >
      <v-card-text class="pa-10">
        <v-container>
          <v-row>
            <v-col cols="3" class="pa-0">
              <v-subheader dark style="font-size: 1em; align-items: baseline"
                >
                <span class="primary-font ma-0">
                1. Selecione o grupo
                </span>
              </v-subheader>
              <v-list :flat="!disabled" color="#111" dense class="group-list">
                <div v-if="loadList" class="d-flex justify-center align-center">
                  <circle-loading></circle-loading>
                </div>
                <v-list-item-group v-else v-model="selectedGroup" color="white" style="max-height: 50vh;">
                  <v-list-item
                    dark
                    v-for="(group, i) in groups"
                    :key="i"
                    @click="listPermission(group.id, i)"
                  >
                    <v-list-item-content>
                      <v-list-item-title>
                        <v-text-field
                          outlined
                          height="30"
                          hide-details
                          v-if="i === itemIndex && !disabled"
                          v-model="groupName"
                          :placeholder="group.name"
                          class="input-dialog text-caption"
                          dense
                        >
                        </v-text-field>
                        <p class="primary-font ma-0 text-caption" v-else >{{ group.name }}</p>
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-col>
            <v-divider vertical class="mx-10"></v-divider>
            <v-col class="pa-0">
              <v-subheader class="pl-0" dark style="font-size: 1em; align-items: baseline"
                >
                <span class="primary-font ma-0">
                2. Selecione a permissão
                </span>
              </v-subheader>
              <transition name="fade" v-if="transition">
                <v-expansion-panels multiple accordion flat>
                  <v-expansion-panel
                    style="background: #111"
                    v-for="page in pages"
                    :key="page"
                  >
                    <v-expansion-panel-header class="pa-0">
                      <p class="primary-font ma-0 text-caption" >
                        {{ page }}
                      </p>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content class="pb-8">
                      <circle-loading v-if="load" ></circle-loading>
                      <v-row
                        v-else
                        align="center"
                        v-for="permission in permissions"
                        :key="permission.name"
                      >
                        <v-checkbox
                          color="#FFB300"
                          :disabled="disabled"
                          v-if="permission.page === page"
                          dense
                          hide-details
                          v-model="permissionSelected[permission.code]"
                          :value="permission.selected"
                        >
                          <template #label>
                            <label class="text-caption">
                              {{ permission.name }}
                            </label>
                          </template>
                        </v-checkbox>
                      </v-row>
                    </v-expansion-panel-content>
                    <v-divider></v-divider>
                  </v-expansion-panel>
                </v-expansion-panels>
              </transition>
            </v-col>
          </v-row>
        </v-container>
        <div class="d-flex justify-end">
          <transition name="fade">
            <base-btn
              v-if="!disabled"
              class="my-10"
              name="Salvar Alteração"
              color="#474747"
              @clickEvent="updateGroup()"
              :loading="loadBtn"
            >
            </base-btn>
          </transition>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapMutations } from "vuex";

import { apiGroupList, apiGroupAction, apiGroupsUpdate } from "../../service";

import GroupDialog from "./group/GroupDialog";

export default {
  name: "GroupList",

  components: {
    "group-dialog": GroupDialog,
  },

  props: {
    disabled: {
      type: Boolean,
      default: true,
    },
  },

  data: () => ({
    groupName: '',
    show: false,
    transition: false,
    loadList: false,
    load: false,
    loadBtn: false,
    id: null,
    groups: [],
    permissions: [],
    selectedGroup: 1,
    itemIndex: null,
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

  mounted() {
    this.loadList = true;
    apiGroupList().then((res) => {
      this.groups = res.data.data;
      this.loadList = false;
    });
  },

  methods: {
    ...mapMutations(["showSnackbar", "closeSnackbar"]),

    listPermission(id, index) {
      this.id = id
      this.itemIndex = index
      this.transition = true
      this.load = true
      apiGroupAction({
        id: this.id,
      }).then((res) => {
        this.permissions = res.data.data;
        Object.keys(this.permissions).forEach((index) => {
          this.permissions[index].code = index;
          this.permissionSelected[index] = this.permissions[index].selected;
        });
        this.load = false
      });
    },

    updateGroupList(){
      this.loadList = true;
      apiGroupList().then((res) => {
        this.groups = res.data.data;
        this.loadList = false;
      });
    },

    updateGroup() {
      this.loadBtn = true
      this.loadList = true
      apiGroupsUpdate({
        id: this.id,
        name: this.groupName,
        actions: this.permissionSelected
      }).then(() => {
        this.disabled = true
        this.listPermission(this.id, this.itemIndex)
        apiGroupList().then((res) => {
          this.groups = res.data.data;
          this.loadList = false;
        });
        this.showSnackbar({
          text: "Grupo Atualizado",
          timeout: 3000,
        });
        this.loadBtn = false
      })
    },

    openCreateGroup() {
      this.show = true;
    },
  },
};
</script>

<style scoped>

.active {
  background: rgba(39, 39, 39, 0.219) ;
}

.group-list .active-list {
  color: #ffb300 !important;
  background: #1f1f1f !important;
}

.group-list .theme--dark.v-list-item--active:hover::before,
.theme--dark.v-list-item--active::before {
  opacity: 0.1 !important;
}

.group-list
  .theme--dark.v-navigation-drawer:not(.v-navigation-drawer--floating)
  .v-navigation-drawer__border {
  background-color: rgba(31, 31, 31, 0.877) !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active em versões anteriores a 2.1.8 */ {
  opacity: 0;
}
</style>