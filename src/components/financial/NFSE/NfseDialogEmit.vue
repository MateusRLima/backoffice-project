<template>
  <v-dialog v-model="show" max-width="400px" persistent no-click-animation>
    <v-card dark class="card-border">
      <v-card-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="clear(false)"
          ><v-icon small color="white">mdi-close</v-icon></v-btn
        >
      </v-card-title>
      <v-card-text class="pb-0 px-15">
        <v-row class="mx-auto mb-10">
          <h1 class="font-weight-bold ml-3">
            <v-icon class="mr-3" color="#BCBCBC">mdi-file-send</v-icon>
            Emitir NFSE
          </h1>
        </v-row>
        <v-container>
          <v-form ref="form">
            <label style="color: #8D8D8D" for="buyingValue">Valor da Compra</label>
            <v-text-field
              color="secondary"
              id="buyingValue"
              dark
              :rules="[rules.required]"
              dense
              class="input-dialog text-caption"
              height="30"
              outlined
              v-model="buyingValue"
              single-line
              v-currency="{ currency: 'BRL', locale: 'pt-br' }"
              type="text"
              @input="calculateNfse('invoice')"
            >
            </v-text-field>
            <label style="color: #8D8D8D" for="sellingValue">Valor de Venda</label>
            <v-text-field
              color="secondary"
              id="sellingValue"
              dark
              :rules="[rules.required]"
              dense
              class="input-dialog text-caption"
              height="30"
              outlined
              v-model="sellingValue"
              v-currency="{ currency: 'BRL', locale: 'pt-br' }"
              type="text"
              @input="calculateNfse('both')"
            >
            </v-text-field>
            <span style="color: #8D8D8D">Valor da NFSE</span>
            <p class="mt-2 mb-5" style="color: #BCBCBC; font-size: 1em">
              R$ {{ this.invoiceCalculated }}
            </p>
            <label
              style="color: #8D8D8D"
              for="quantity"
              @input="calculateNfse('btc')"
              >Qtd. de BTC</label
            >
            <v-text-field
              color="secondary"
              id="quantity"
              dark
              :rules="[rules.required]"
              dense
              class="input-dialog text-caption"
              height="30"
              outlined
              single-line
              v-model="quantity"
              type="number"
              @input="calculateNfse('btc')"
            ></v-text-field>
            <span style="color: #8D8D8D">Valor de 1 BTC</span>
            <p class="mt-2 mb-5" style="color: #BCBCBC; font-size: 1em">
              R$ {{ this.unityValueCalculated }}
            </p>
            <label style="color: #8D8D8D" for="psp">PSP</label>
            <v-select
              id="psp"
              dark
              dense
              outlined
              :items="psp"
              item-value="id"
              v-model="selectedPSP"
              item-text="name"
              color="secondary"
              class="input-dialog text-caption"
              height="30"
              :rules="[rules.required]"
            ></v-select>
            <label style="color: #8D8D8D" for="company">Empresa Cliente</label>
            <v-select
              id="company"
              dark
              dense
              outlined
              :items="company"
              item-value="id"
              item-text="name"
              v-model="selectedCompany"
              @input="getWallet(selectedCompany)"
              color="secondary"
              class="input-dialog text-caption"
              height="30"
              :rules="[rules.required]"
            ></v-select>
            <label style="color: #8D8D8D" for="wallet">Carteira</label>
            <v-select
              id="wallet"
              dark
              dense
              outlined
              :disabled="selectedLoad"
              :loading="selectedLoad"
              :items="wallet"
              item-text="wallet"
              item-value="id"
              color="secondary"
              class="input-dialog text-caption"
              height="30"
              :rules="[rules.required]"
              v-model="selectedWallet"
            ></v-select>
            <label style="color: #8D8D8D" for="date">Data</label>
            <v-text-field
              id="date"
              @keyup.enter="createNfse()"
              dark
              dense
              hide-details=""
              class="input-dialog text-caption"
              height="30"
              placeholder="DD/MM/AAAA"
              v-mask="['##/##/####']"
              color="secondary"
              outlined
              single-line
              v-model="date"
              type="text"
            ></v-text-field>
            <base-btn
              width="100%"
              class="my-10"
              name="Emitir Nota"
              color="#474747"
              @clickEvent="createNfse()"
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
import {
  apiCompanyGet,
  apiPspGet,
  apiWalletList,
  apiNfseCreate,
  apiLogout,
} from "../../../service";
import { mapMutations } from "vuex";

export default {
  name: "NfseDialogEmit",

  props: {
    value: Boolean,
  },

  data() {
    return {
      rules: {
        required: (v) => !!v || "Campo obrigatório",
      },
      load: false,
      selectedLoad: false,
      invoiceValue: "",
      invoiceCalculated: "",
      sellingValue: "",
      buyingValue: "",
      quantity: "",
      unityValue: "",
      unityValueCalculated: "",
      company: "",
      psp: "",
      wallet: "",
      date: "",
      id: "",
      selectedCompany: "",
      selectedWallet: "",
      selectedPSP: "",
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
    getCompany() {
      apiCompanyGet()
        .then((res) => {
          this.company = res.data.data;
          this.id = res.data.data.id;
        })
        .catch((err) => {
          this.status = err.response.data.status;
          if (
            this.status === 3 ||
            this.status === 1 ||
            this.status === 2 ||
            this.status === 0
          ) {
            this.showSnackbar({ text: "Sessão Expirada", timeout: 3000 });
            this.$router.push("/");
          }
        });
    },

    getWallet(id) {
      this.selectedLoad = true;
      apiWalletList({
        companyId: id,
      }).then((res) => {
        this.wallet = res.data.data;
        this.selectedLoad = false;
      });
    },

    convertDate(date) {
      let day = date.split("/")[0];
      let month = date.split("/")[1];
      let year = date.split("/")[2];
      return year + "-" + ("0" + month).slice(-2) + "-" + ("0" + day).slice(-2);
    },

    calculateNfse(type) {
      if (type === "invoice") {
        this.invoiceCalculated =
          Number(this.sellingValue.replace(/[^0-9,]*/g, "").replace(",", ".")) -
          Number(this.buyingValue.replace(/[^0-9,]*/g, "").replace(",", "."));
      } else if (type === "btc") {
        this.unityValueCalculated =
          Number(this.sellingValue.replace(/[^0-9,]*/g, "").replace(",", ".")) /
          Number(this.quantity.replace(/[^0-9,]*/g, "").replace(",", "."));
      } else if (type === "both") {
        this.invoiceCalculated =
          Number(this.sellingValue.replace(/[^0-9,]*/g, "").replace(",", ".")) -
          Number(this.buyingValue.replace(/[^0-9,]*/g, "").replace(",", "."));
        this.unityValueCalculated =
          Number(this.sellingValue.replace(/[^0-9,]*/g, "").replace(",", ".")) /
          Number(this.quantity.replace(/[^0-9,]*/g, "").replace(",", "."));
      }
    },

    getPsp() {
      apiPspGet().then((res) => {
        this.psp = res.data.data;
      });
    },

    createNfse() {
      this.load = true;
      apiNfseCreate({
        invoiceValue: this.invoiceCalculated.toString(),
        sellingValue: this.sellingValue
          .replace(/[^0-9,]*/g, "")
          .replace(",", "."),
        buyingValue: this.buyingValue
          .replace(/[^0-9,]*/g, "")
          .replace(",", "."),
        quantity: this.quantity.replace(",", "."),
        unityValue: this.unityValueCalculated.toString(),
        company: this.selectedCompany,
        psp: this.selectedPSP,
        wallet: this.selectedWallet,
        date: this.convertDate(this.date),
      })
        .then(() => {
          this.load = false;
          this.showSnackbar({
            text: "Solicitação de emissão efetuada",
            timeout: 3000,
          });
          this.$emit("get");
          this.clear(false);
        })
        .catch((err) => {
          this.status = err.response.data.status;
          if (
            this.status === 3 ||
            this.status === 1 ||
            this.status === 2 ||
            this.status === 0
          ) {
            this.showSnackbar({ text: "Sessão Expirada", timeout: 3000 });
            apiLogout();
            this.$emit("get");
            this.load = false;
            this.$router.push("/");
          } else {
            this.showSnackbar({
              text: "Dado incorreto, verifique os campos.",
              timeout: 3000,
            });
            this.$emit("get");
            this.getPsp();
            this.getCompany();
          }
          this.load = false;
        });
    },

    clear(close) {
      (this.invoiceValue = ""),
      (this.invoiceCalculated = ""),
      (this.sellingValue = ""),
      (this.buyingValue = ""),
      (this.quantity = ""),
      (this.unityValue = ""),
      (this.unityValueCalculated = ""),
      (this.company = ""),
      (this.psp = ""),
      (this.wallet = ""),
      (this.date = ""),
      (this.id = ""),
      (this.show = close),
      this.$refs.form.resetValidation();
    },
  },
};
</script>

<style>

.input-dialog {
  border-radius: 7px;
}

</style>