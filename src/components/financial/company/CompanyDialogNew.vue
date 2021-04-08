<template>
  <v-dialog v-model="show" max-width="400px" persistent no-click-animation>
    <v-card dark class="card-border">
      <v-card-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="clear(false)"
          ><v-icon color="white" small>mdi-close</v-icon></v-btn
        >
      </v-card-title>
      <v-card-text class="pb-0 px-12">
        <v-row class="mx-auto mb-10">
          <h1 class="font-weight-bold ml-3">
            <v-icon class="mr-3" color="#BCBCBC">mdi-briefcase-plus</v-icon
            >Adicionar Empresa
          </h1>
        </v-row>
        <v-container>
          <v-form ref="form">
            <div class="mb-5">
              <v-icon small class="mr-3" color="#8D8D8D">mdi-briefcase</v-icon>
              <span class="subtitle-1" style="color: #8d8d8d"
                >Dados da Empresa</span
              >
            </div>
            <label for="name" style="color: #8d8d8d">Razão Social</label>
            <v-text-field
              id="name"
              :rules="[rules.required]"
              dark
              dense
              class="input-dialog text-caption"
              height="30"
              color="secondary"
              outlined
              single-line
              v-model="name"
            ></v-text-field>
            <label for="cnpj" style="color: #8d8d8d">CNPJ</label>
            <v-text-field
              id="cnpj"
              :rules="[rules.required]"
              dark
              dense
              class="input-dialog text-caption"
              height="30"
              color="secondary"
              outlined
              single-line
              v-model="cnpj"
              v-mask="['##.###.###/####-##']"
            ></v-text-field>
            <v-divider dark class="mb-10 mt-5"></v-divider>
            <div class="mb-5">
              <v-icon small class="mr-3" color="#8D8D8D">mdi-map-marker</v-icon>
              <span class="subtitle-1" style="color: #8d8d8d">Endereço</span>
            </div>
            <label for="street" style="color: #8d8d8d">Logradouro</label>
            <v-text-field
              id="street"
              :rules="[rules.required]"
              dark
              dense
              class="input-dialog text-caption"
              height="30"
              color="secondary"
              outlined
              single-line
              v-model="street"
              type="text"
            ></v-text-field>
            <label for="cep" style="color: #8d8d8d">CEP</label>
            <v-text-field
              id="cep"
              :rules="[rules.required]"
              dark
              dense
              class="input-dialog text-caption"
              height="30"
              color="secondary"
              outlined
              single-line
              v-model="postalCode"
              v-mask="['#####-###']"
            ></v-text-field>
            <label for="complement" style="color: #8d8d8d">Complemento</label>
            <v-text-field
              id="complement"
              dark
              dense
              class="input-dialog text-caption"
              height="30"
              color="secondary"
              outlined
              single-line
              v-model="complement"
              type="text"
            ></v-text-field>
            <label for="number" style="color: #8d8d8d">Número</label>
            <v-text-field
              id="number"
              :rules="[rules.required]"
              dark
              dense
              class="input-dialog text-caption"
              height="30"
              color="secondary"
              outlined
              single-line
              v-model="number"
              type="number"
            ></v-text-field>
            <label for="neighborhood" style="color: #8d8d8d">Bairro</label>
            <v-text-field
              id="neighborhood"
              :rules="[rules.required]"
              hide-details=""
              dark
              dense
              class="input-dialog text-caption"
              height="30"
              color="secondary"
              outlined
              single-line
              v-model="neighborhood"
              type="text"
              @keyup.enter="createCompany()"
            ></v-text-field>
            <base-btn
              width="100%"
              class="my-10"
              name="Criar empresa"
              color="#474747"
              @clickEvent="createCompany()"
              :loading="load"
            >
            </base-btn>
          </v-form>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { apiCompanyCreate } from "../../../service";
import { mapMutations } from "vuex";

export default {
  name: "CompanyDialogNew",
  props: {
    value: Boolean,
  },

  data() {
    return {
      rules: {
        required: (v) => !!v || "Campo obrigatório",
      },
      load: false,
      name: "",
      cnpj: "",
      postalCode: "",
      street: "",
      number: "",
      neighborhood: "",
      complement: "",
      status: "",
      // municipalityCode: '',
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
    createCompany() {
      this.load = true;
      apiCompanyCreate({
        name: this.name,
        cnpj: this.cnpj,
        postalCode: this.postalCode,
        street: this.street,
        number: this.number,
        neighborhood: this.neighborhood,
        complement: this.complement,
        // municipalityCode: this.municipalityCode
      })
        .then(() => {
          this.load = false;
          this.clear(false);
          this.$emit("get");
        })
        .catch((err) => {
          this.status = err.response.data.status;
          if (
            this.status === 3 ||
            this.status === 1 ||
            this.status === 2 ||
            this.status === 0
          ) {
            this.showSnackbar({ text: "Sessão Expirada", timeout: 30000 });
            this.load = false;
            this.$router.push("/");
          } else {
            this.showSnackbar({
              text: "Dado incorreto, verifique os campos.",
              timeout: 3000,
            });
          }
          this.load = false;
        });
    },
    clear(close) {
      (this.name = ""),
        (this.cnpj = ""),
        (this.postalCode = ""),
        (this.street = ""),
        (this.number = ""),
        (this.neighborhood = ""),
        (this.complement = ""),
        (this.show = close),
        this.$refs.form.resetValidation();
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