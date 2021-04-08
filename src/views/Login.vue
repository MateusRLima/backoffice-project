<template>
  <v-container
    class="app d-flex pa-0 align-center"
  >
    <v-row class="row-login" justify="space-between" align="center">
      <v-card class="login-card" flat dark>
        <v-card-title class="pa-0 flex-column align-start">
          <h1 class="primary-font mb-2 text-h3">Jogue Fácil</h1>
          <h2 class="secondary-font mb-3 text-h6">BackOffice</h2>
        </v-card-title>
        <v-card-text class="pa-0">
          <v-form ref="form" class="login-form" v-if="!detectMobile">
            <label class="secondary-font" for="email">Email</label>
            <v-text-field
              height="30"
              id="email"
              @blur="resetValidation()"
              class="mt-1 mb-2 text-caption"
              dense
              :rules="emailRules"
              style="border-radius: 7px"
              color="#FFB300"
              outlined
              single-line
              hint="email@email.com"
              v-model="email"
            >
              <template #prepend-inner>
                <v-icon small class="mr-2">mdi-email</v-icon>
              </template>
            </v-text-field>
            <label class="secondary-font" for="password">Senha</label>
            <v-text-field
              height="30"
              for="password"
              @blur="resetValidation()"
              class="mt-1 text-caption"
              dense
              :rules="passwordRules"
              style="border-radius: 7px"
              color="#FFB300"
              outlined
              :type="show ? 'text' : 'password'"
              v-model="password"
              @keyup.enter="login()"
            >
              <template #prepend-inner>
                <v-icon small class="mr-2">mdi-key</v-icon>
              </template>
              <template #append>
                <v-icon
                  v-text="show ? 'mdi-eye-off' : 'mdi-eye'"
                  small
                  @click="show = !show"
                ></v-icon>
              </template>
            </v-text-field>
            <base-btn
              width="100%"
              class="mt-7"
              name="Entrar"
              color="#474747"
              iconName="mdi-login"
              @clickEvent="login()"
              :loading="load"
            >
            </base-btn>
          </v-form>
          <p class="login-text">
            O Backoffice da Jogue Fácil não está disponível para browser no mobile, 
            pois temos um aplicativo pronto pra isso ! Acesse ele por <a style="text-decoration: none; color: #FFB300" href="https://play.google.com/store/apps/details?id=com.logustech.back_office">aqui.</a>
          </p>
        </v-card-text>
      </v-card>
      <img
        height="60%"
        width="60%"
        src="../assets/login-img.png"
        alt="Imagem ilustrativa de uma mulher dando ideias em uma reunião de empresa."
      />
    </v-row>
  </v-container>
</template>

<script>
import { mapMutations } from "vuex";
import { apiLogin } from "../service";

export default {
  name: "Login",

  data() {
    return {
      load: false,
      snackbar: false,
      text: "",
      show: false,
      email: "",
      emailRules: [
        (v) => !!v || "E-mail obrigatório",
        (v) => /.+@.+\..+/.test(v) || "Digite um e-mail válido",
      ],
      password: "",
      passwordRules: [(v) => !!v || "" || "Senha obrigatória"],
      token: "",
      status: "",
    };
  },

  created () {
      if (
        navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/webOS/i) ||
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPod/i) ||
        navigator.userAgent.match(/BlackBerry/i) ||
        navigator.userAgent.match(/Windows Phone/i)
      ) {
        return true;
      } else {
        return false;
      }
  },

  methods: {
    ...mapMutations(["showSnackbar", "closeSnackbar"]),
    login() {
      this.load = true;
      apiLogin({
        email: this.email,
        password: this.password,
      })
        .then((res) => {
          this.$emit("logged", true);
          this.status = res.data.success;
          if (this.status === true) {
            this.load = false;
            this.$router.push("/dashboard");
          } else {
            return null;
          }
        })
        .catch((err) => {
          this.load = false;
          if (err.response.status === 404) {
            this.showSnackbar({
              text: "Desculpe, ocorreu um problema na conexão",
              timeout: 3000,
            });
            this.load = false;
          } else {
            this.showSnackbar({
              text: "Usuário ou senha inválido",
              timeout: 3000,
            });
            this.load = false;
          }
        });
    },

    resetValidation() {
      setTimeout(() => {
        this.$refs.form.resetValidation();
      }, 1000);
    },
  },
};
</script>

<style scoped>

.app {
  background-color: #111;
  border-radius: 50px;
  width: 70%;
}

.row-login {
  margin: 10%;
}

.login-card {
  background-color: transparent;
  height: 100%; 
  width: 30%;
}

.login-text {
  display: none;
}

img {
  display: block
}

@media (max-width: 896px) {
  img {
    display: none
  }

  .app {
    background-color: #111;
    border-radius: 5px;
  }

  .login-card {
    width: 100%;
  }

  .login-form{
    display: none
  }

  .login-text {
    display: contents;
  }


}

</style>