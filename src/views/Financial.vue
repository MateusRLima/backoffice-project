<template>
  <div>
    <drawer-navigation />
    <v-container class="pb-0">
      <toolbar-menu
        :icon="icon"
        :view="view"
        @emitNfse="emitNfse()"
        @updateNfse="updateNFSE()"
        @createCompany="createCompany()"
        @openEmitBillet="openEmit()"
        @viewTable="setTable"
      />
    </v-container>
    <company-table :showD="showD" v-if="!table"></company-table>
    <nfse-table ref="emitNfse" v-else></nfse-table>
  </div>
</template>

<script>
import CompanyTable from "../components/financial/CompanyTable";
import NfseTable from "../components/financial/NfseTable";

export default {
  name: "FinancialView",

  data: () => ({
    table: true,
    view: 1,
    showD: false,
    icon: "mdi-file-document",
  }),

  components: {
    "company-table": CompanyTable,
    "nfse-table": NfseTable,
  },

  methods: {
    setTable(page) {
      if (page === "NFSE") {
        this.table = true;
        this.view = 1;
        this.icon = "mdi-file-document";
      } else {
        this.table = false;
        this.view = 2;
        this.icon = "mdi-briefcase";
      }
    },

    createCompany() {
      this.showD = !this.showD;
      this.showD = "";
    },

    emitNfse() {
      this.$refs.emitNfse.emitNfse();
    },

    updateNFSE() {
      this.$refs.emitNfse.updateNFSE();
    },
  },
};
</script>

<style>
</style>