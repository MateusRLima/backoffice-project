<template>
  <v-dialog v-model="show" max-width="350px" persistent no-click-animation>
    <v-card dark class="card-border">
      <v-card-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="clear(true)"><v-icon small color="white">mdi-close</v-icon></v-btn>
      </v-card-title>
      <v-card-text class="pb-0 px-15">
        <v-row class="mx-auto mb-10">
          <h1
            v-if="this.register === true"
            class="font-weight-bold ml-3"
          >
            <v-icon class="mr-3" color="#BCBCBC">mdi-account-plus</v-icon>
            Criar Usuário
          </h1>
          <h1 v-else class="headline ml-3" style="color: white">
            <v-icon class="mr-3" color="white">mdi-pencil</v-icon>
            Editar Usuário
          </h1>
        </v-row>
        <v-form ref="form">
          <v-container>
            <label style="color: #8d8d8d" for="username"
              >Nome Completo</label
            >
            <v-text-field
              id="username"
              class="input-dialog text-caption"
              v-model="user.name"
              :placeholder="username"
              dark
              dense
              height="30"
              outlined
              single-line
              color="secondary"
            ></v-text-field>
            <label style="color: #8d8d8d" for="birthDate"
              >Data de Nascimento</label
            >
            <v-text-field
              color="secondary"
              id="birthDate"
              class="input-dialog text-caption"
              v-model="user.birthDate"
              :placeholder="birthdate"
              hint="DD/MM/AAAA"
              v-mask="['##/##/####']"
              dark
              dense
              height="30"
              outlined
              single-line
            ></v-text-field>
            <label style="color: #8d8d8d" for="email">E-mail</label>
            <v-text-field
              color="secondary"
              id="email"
              type="email"
              @blur="resetValidation()"
              :rules="emailRules"
              dark
              dense
              height="30"
              outlined
              class="input-dialog text-caption"
              :placeholder="email"
              v-model="user.email"
            >
            </v-text-field>
            <label style="color: #8d8d8d" for="password">Senha</label>
            <v-text-field
              id="password"
              autocomplete="new-password"
              dark
              dense
              height="30"
              hint="Mínimo 9 caracteres"
              @blur="resetValidation()"
              class="input-dialog text-caption"
              color="secondary"
              outlined
              single-line
              :type="showP ? 'text' : 'password'"
              v-model="user.password"
            >
              <template #append>
                <v-icon v-text="showP ? 'mdi-eye-off' : 'mdi-eye'" small @click="showP = !showP"></v-icon>
              </template>
            </v-text-field>
            <label style="color: #8d8d8d" for="group">Grupo</label>
            <v-select
              id="group"
              dark
              dense
              height="30"
              outlined
              class="input-dialog text-caption"
              :items="permission"
              :loading="seleLoading"
              item-text="name"
              item-value="id"
              color="secondary"
              v-model="selectedPermission"
            >
            </v-select>
            <label style="color: #8d8d8d" for="office">Escritório</label>
            <v-select
              id="office"
              dark
              dense
              height="30"
              outlined
              class="input-dialog text-caption"
              :items="office"
              item-text="office"
              item-value="office"
              color="secondary"
              v-model="officeSelected"
              hide-details=""
            >
            </v-select>
            <v-btn
              small
              outlined
              v-show="this.status === 1 && this.register === false"
              :loading="btnLoading"
              dark
              color="red"
              width="100%"
              class="mb-5 mt-10"
              @click="changeUserStatus(id)"
            >
              <template v-slot:loader>
                <v-progress-circular
                  :size="15"
                  :width="3"
                  indeterminate
                ></v-progress-circular>
              </template>
              <span>Bloquear</span>
            </v-btn>
            <v-btn
              small
              outlined
              v-show="this.status === 2 && this.register === false"
              :loading="btnLoading"
              dark
              width="100%"
              color="green"
              class="my-5"
              @click="changeUserStatus(id)"
            >
              <template v-slot:loader>
                <v-progress-circular
                  :size="15"
                  :width="3"
                  indeterminate
                ></v-progress-circular>
              </template>
              <span>Desbloquear</span>
            </v-btn>
            <v-spacer></v-spacer>
            <base-btn
              v-if="this.register === false"
              width="100%"
              class="my-5"
              name="Salvar alterações"
              color="#474747"
              @clickEvent="updateUser(id)"
              :loading="load"
            >
            </base-btn>
            <base-btn
              v-else
              width="100%"
              class="my-10"
              name="Criar"
              color="#474747"
              @clickEvent="createUser()"
              :loading="load"
            >
            </base-btn>
          </v-container>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  apiUserFind,
  apiUserUpdate,
  apiGroupList,
  apiUserStatus,
  apiUserCreate,
} from "../../../service";
import { mapMutations } from "vuex";

export default {
  name: "EmployeesDialog",
  props: {
    register: Boolean,
    value: Boolean,
  },

  data() {
    return {
      load: false,
      turnSup: false,
      office: ["Recife", "João Pessoa"],
      officeSelected: "",
      user: {
        name: '',
        birthDate: '',
        email: '',
        password: '',
      },
      username: "",
      supervisor: [],
      items: [],
      rules: {
        required: (v) => !!v || "Campo obrigatório",
      },
      emailRules: [(v) => /.+@.+\..+/.test(v) || "Digite um e-mail válido"],
      email: "",
      password: "",
      permission: [],
      id: "",
      status: "",
      btnLoading: false,
      seleLoading: false,
      selectedPermission: "",
      showP: false,
      error: "",
    };
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

    resetValidation() {
      setTimeout(() => {
        this.$refs.form.resetValidation();
      }, 1000);
    },

    dateConvert(data) {
      var day = data.split("/")[0];
      var month = data.split("/")[1];
      var year = data.split("/")[2];
      return year + "-" + ("0" + month).slice(-2) + "-" + ("0" + day).slice(-2);
    },

    createUser() {
      this.load = true;
      apiUserCreate({
        userName: this.user.name,
        birthDate: this.dateConvert(this.user.birthDate),
        email: this.user.email,
        password: this.user.password,
        groupId: this.selectedPermission,
        office: this.officeSelected,
      })
        .then(() => {
          this.showSnackbar({ text: "Usuário criado", timeout: 3000 });
          this.$emit("get");
          this.load = false;
          this.clear(true);
        })
        .catch((err) => {
          this.error = err.response.data.status;
          if (err.response.status === 404) {
            this.showSnackbar({ text: "Problema de Conexão", timeout: 3000 });
            this.$router.push("/");
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

    dateConvertShort(date, needTime){
      date = date.split('T')
      let time = date[1].split('.')[0]
      date = date[0].split('-')

      if(needTime) {
        return `${date[2]}/${date[1]}/${date[0]} ${time}`
      } else {
        return `${date[2]}/${date[1]}/${date[0]}`
      }
    },

    getUserId(id) {
      apiUserFind({
        id: id,
      })
        .then((res) => {
          this.items = res.data.data;
          this.status = res.data.data.statusId;
          this.id = id;
          this.username = res.data.data.userName;
          this.email = res.data.data.email;
          this.birthdate = this.dateConvertShort(res.data.data.birthDate, false);
          this.selectedPermission = res.data.data.group.id;
        })
        .catch((err) => {
          this.error = err.response.data.status;
          if (err.response.status === 404) {
            this.showSnackbar({ text: "Problema de Conexão", timeout: 3000 });
            this.$router.push("/");
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

    changeUserStatus(id) {
      this.btnLoading = true;
      apiUserStatus({
        id: id,
      })
        .then(() => {
          this.btnLoading = false;
          this.$emit("get");
          this.clear(false);
        })
        .catch((err) => {
          this.error = err.response.data.status;
          if (err.response.status === 404) {
            this.showSnackbar({ text: "Problema de Conexão", timeout: 3000 });
            this.$router.push("/");
          } else if (err.response.data.error === "USER011") {
            this.showSnackbar({
              text: "Não é possível se bloquear",
              timeout: 3000,
            });
          } else if (
            this.error === 3 ||
            this.error === 1 ||
            this.error === 2 ||
            this.error === 0
          ) {
            this.showSnackbar({ text: "Sessão Expirada", timeout: 3000 });
            this.$router.push("/");
          }
          this.btnLoading = false;
        });
    },

    getGroups() {
      this.seleLoading = true;
      apiGroupList().then((res) => {
        this.permission = res.data.data;
        this.seleLoading = false;
      });
    },

    updateUser(id) {
      this.load = true;
      apiUserUpdate({
        id: id,
        userName: this.user.name,
        birthDate: this.dateConvert(this.user.birthDate),
        email: this.user.email,
        password: this.user.password,
        groupId: this.selectedPermission,
        office: this.officeSelected,
      })
        .then(() => {
          console.log(this.selectedPermission);
          this.showSnackbar({ text: "Usuário Atualizado", timeout: 3000 });
          this.$emit("get");
          this.load = false;
          this.clear(true);
        })
        .catch((err) => {
          this.error = err.response.data.status;
          if (err.response.data.error === "USER010") {
            this.showSnackbar({ text: "Email já existente", timeout: 3000 });
          }
          if (err.response.status === 404) {
            this.showSnackbar({ text: "Problema de Conexão", timeout: 3000 });
            this.$router.push("/");
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

    clear(close) {
      (this.username = ""),
        (this.birthdate = ""),
        (this.email = ""),
        (this.password = ""),
        (this.selectedPermission = ""),
        (this.officeSelected = "");
      if (close === true) {
        (this.show = false), this.$refs.form.resetValidation();
      }
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