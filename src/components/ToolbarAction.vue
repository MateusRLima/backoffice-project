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
    <div v-show="view === 3">
      <div style="display: flex; align-items: center">
        <span class="white--text mr-10" style="font-size: 0.7em"
          >Deposits:
          <span class="green--text pl-2">
            + <span class="white--text">R$ 5822,50</span></span
          ></span
        >
        <span class="white--text mr-5" style="font-size: 0.7em"
          >Withdrawals:
          <span class="red--text pl-2">
            - <span class="white--text">R$ 1852,50</span></span
          ></span
        >
      </div>
    </div>
    <div v-show="view === 4">
      <base-btn
        name="Register Employee"
        iconName="mdi-account-plus"
        @clickEvent="registerUser()"
      >
      </base-btn>
    </div>
    <div v-show="view === 5">
      <base-btn
        v-show="!disable"
        name="Edit Client"
        iconName="mdi-pencil-box-multiple"
        @clickEvent="openEditMass(true)"
      >
      </base-btn>
    </div>
    <div v-show="view === 6">
      <base-btn
        name="Register ticket"
        iconName="mdi-plus"
        @clickEvent="openRTicket(true)"
      >
      </base-btn>
    </div>
    <div v-show="view === 7">
      <base-btn
        name="Create Group"
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
        <span :style="{ color: titleColor }" class="text-caption" >Edit</span>
      </v-btn>
    </div>
  </v-toolbar>
</template>

<script>

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
      pagesGroup: ["Employees", "Groups"],
      pageGroup: "Employees",
    };
  },

  methods: {

    editGroup() {
      this.btnIsActive = !this.btnIsActive
      this.color = !this.btnIsActive ? '#1E1E1E' : '#FFB300'
      this.titleColor = !this.btnIsActive ? 'white' : 'black'
      this.$emit("editGroup", false);
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

