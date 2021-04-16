<template>
  <div>
    <drawer-navigation />
    <v-container class="pb-0">
      <toolbar-menu
        :icon="icon"
        :view="view"
        @registerUser="registerUser()"
        @createGroup="createGroup()"
        @viewTable="setTable"
        @editGroup="editPermission"
      />
    </v-container>
    <employees-table ref="Euser" v-if="table"></employees-table>
    <group-list ref="Group" :disabled="disabled" v-else></group-list>
  </div>
</template>

<script>

import EmployeesTable from '../components/user/EmployeesTable'
import GroupList from '../components/user/GroupList'

export default {
  name: "User",

  data: () => ({
    table: true,
    disabled: true,
    view: 4,
    showD: false,
    icon: "mdi-clipboard-account",
  }),

  components: {
    'employees-table' : EmployeesTable,
    'group-list' : GroupList
  },

  methods: {
    
    editPermission(){
      this.disabled = !this.disabled
    },

    setTable(page) {
      if (page === "Employees") {
        this.table = true;
        this.view = 4;
        this.icon = "mdi-clipboard-account";
      } else {
        this.table = false;
        this.view = 7;
        this.icon = "mdi-account-multiple";
      }
    },

    registerUser() {
      this.$refs.Euser.openRegister();
    },

    createGroup(){
      this.$refs.Group.openCreateGroup();
    }
  },
};

</script>