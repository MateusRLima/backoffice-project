<template>
  <v-toolbar
    color="primary"
    class="px-0 py-0"
    style="border-radius: 10px"
    height="55"
  >
    <v-toolbar-title v-if="view !== 1 && view !== 2 && view !== 4 && view !== 7">
      <v-icon color="white" class="mr-2">{{ icon }}</v-icon>
      <span class="primary-font">{{ title }}</span>
    </v-toolbar-title>
    <v-toolbar-title v-else-if="view === 4 || view === 7">
      <v-row class="pa-0 mx-auto" align="center">
        <v-icon color="secondary" class="mr-2">{{ icon }}</v-icon>
        <v-select
          height="30"
          color="while"
          dense
          outlined
          hide-details
          style="max-width: 15vw;  border-radius: 7px"
          :items="pagesGroup"
          v-model="pageGroup"
          @input="setTableGroup()"
          class="text-caption d-flex align-center"
        >
        </v-select>
      </v-row>
    </v-toolbar-title>
    <v-toolbar-title v-else>
      <v-row class="pa-0 mx-auto">
        <v-icon color="white" class="mr-2">{{ icon }}</v-icon>
        <v-select
          height="30"
          color="while"
          dense
          outlined
          hide-details
          style="max-width: 10vw; border-radius: 7px"
          :items="pagesFinancial"
          v-model="pageFinancial"
          @input="setTableFinancial()"
          class="text-caption"
        >
        </v-select>
      </v-row>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <div v-show="view === 1">
      <base-btn
        class="mr-5"
        :outlined="true"
        name="Atualizar Tabela"
        color="#474747"
        iconName="mdi-reload"
        @clickEvent="updateNFSE()"
      ></base-btn>
      <base-btn
        name="Emitir NFSE"
        iconName="mdi-file-send"
        @clickEvent="emitNFSE()"
      >
      </base-btn>
    </div>
    <div v-show="view === 2">
      <base-btn
        name="Adicionar Empresa"
        iconName="mdi-briefcase-plus"
        @clickEvent="createCompany()"
      >
      </base-btn>
      <!-- <base-btn name="Emitir Boleto" iconName="mdi-barcode" @clickEvent="openEmitBillet()"></base-btn> -->
    </div>
    <div v-show="view === 3">
      <div style="display: flex; align-items: center">
        <span class="white--text mr-10" style="font-size: 0.7em"
          >Entrada:
          <span class="green--text pl-2">
            + <span class="white--text">R$ {{ this.result }}</span></span
          ></span
        >
        <span class="white--text mr-5" style="font-size: 0.7em"
          >Saída:
          <span class="red--text pl-2">
            - <span class="white--text">R$ {{ this.withdrawTotal }}</span></span
          ></span
        >
      </div>
    </div>
    <div v-show="view === 4">
      <base-btn
        name="Registrar Colaborador"
        iconName="mdi-account-plus"
        @clickEvent="registerUser()"
      >
      </base-btn>
    </div>
    <div v-show="view === 5">
      <base-btn
        v-show="!disable"
        name="Editar clientes"
        iconName="mdi-pencil-box-multiple"
        @clickEvent="openEditMass(true)"
      >
      </base-btn>
    </div>
    <div v-show="view === 6">
      <base-btn
        name="Registrar chamado"
        iconName="mdi-plus"
        @clickEvent="openRTicket(true)"
      >
      </base-btn>
    </div>
    <div v-show="view === 7">
      <base-btn
        name="Criar grupo"
        iconName="mdi-account-multiple-plus"
        @clickEvent="createGroup()"
        class="mr-4"
      >
      </base-btn>
      <v-btn
        dark
        :color="color"
        :class="{ active: btnIsActive }"
        @click="editGroup()"
        small
      >
        <v-icon small class="mr-2" :color="titleColor">mdi-pencil</v-icon>
        <span :style="{ color: titleColor }" class="text-caption" >Editar</span>
      </v-btn>
    </div>
  </v-toolbar>
</template>

<script>
import { apiTransDataL } from "../service";

export default {
  name: "Toolbar",

  props: {
    title: {
      type: String,
      required: false,
    },

    icon: {
      type: String,
      required: true,
    },

    disable: {
      type: Boolean,
      required: false,
      default: true,
    },

    view: {
      type: Number,
      required: false,
    },
  },

  data() {
    return {
      btnIsActive: false,
      titleColor: "",
      color: "",
      result: "",
      total: [],
      withdraw: "",
      withdrawTotal: "",
      register: Boolean,
      pagesGroup: ["Colaboradores", "Grupos"],
      pageGroup: "Colaboradores",
      pagesFinancial: ["NFSE", "Empresa" ],
      pageFinancial: "NFSE",
    };
  },

  mounted() {
    apiTransDataL().then((res) => {
      this.total = res.data.entries.map((elem) => {
        return elem.value;
      });
      this.result = this.total.reduce(this.getTotal);
      this.result = this.result.toFixed(2);
      this.withdraw = res.data.withdraw.map((elem) => {
        return elem.value;
      });
      this.withdrawTotal = this.withdraw.reduce(this.getTotal);
      this.withdrawTotal = this.withdrawTotal.toFixed(2);
    });
  },

  methods: {
    getTotal(total, num) {
      return total + num;
    },

    emitNFSE() {
      this.$emit("emitNfse");
    },

    editGroup() {
      this.btnIsActive = !this.btnIsActive
      this.color = !this.btnIsActive ? '#1E1E1E' : '#FFB300'
      this.titleColor = !this.btnIsActive ? 'white' : 'black'
      this.$emit("editGroup", false);
    },

    setTableFinancial() {
      this.$emit("viewTable", this.pageFinancial);
    },

    setTableGroup() {
      this.$emit("viewTable", this.pageGroup);
    },

    createGroup() {
      this.$emit("createGroup");
    },

    openEditMass() {
      this.$emit("openEditMass");
    },

    updateNFSE() {
      this.$emit("updateNfse");
    },

    createCompany() {
      this.$emit("createCompany");
    },

    openEmitBillet() {
      this.$emit("openEmitBillet");
    },

    registerUser() {
      this.$emit("registerUser");
    },

    openCGroups() {
      this.$emit("groupsCreate");
    },

    openEGroups() {
      this.$emit("groupsEdit");
    },

    openRTicket() {
      this.$emit("registerTicket");
    },

  },
};
</script>

<style>

.theme--light.v-list {
  background: #0C0C0C;
}

.v-list-item__content {
  color: #bcbcbc;
}

.theme--light.v-list-item:hover:before {
  opacity: 0.5;
  color: #bcbcbc;
}

.v-input input {
  max-height: auto !important;
}

.v-text-field--box .v-input__slot,
.v-text-field--outlined .v-input__slot {
  min-height: auto !important;
  height: 40px;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.active {
  color: red;
}

</style>

