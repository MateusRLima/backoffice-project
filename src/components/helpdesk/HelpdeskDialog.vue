<template>
  <v-dialog v-model="show" max-width="400px" persistent no-click-animation>
    <v-card dark class="card-border">
      <v-card-title>
        <v-spacer></v-spacer>
        <v-btn
          v-show="register === false && status === 2"
          icon
          @click="chatList(id)"
          ><v-icon color="white" small>mdi-reload</v-icon></v-btn
        >
        <v-btn icon @click="show = false"
          ><v-icon color="white" small>mdi-close</v-icon></v-btn
        >
      </v-card-title>
      <v-card-text class="pb-0 px-12">
        <v-row class="mx-auto mb-10">
          <h1
            v-if="this.register === true"
            class="font-weight-bold ml-3"
          >
            <v-icon class="mr-1" color="#BCBCBC">mdi-plus</v-icon>
            Registrar chamado
          </h1>
          <h1 v-else class="font-weight-bold ml-3">
            <v-icon class="mr-2" color="#BCBCBC">mdi-pencil</v-icon>
            Editar chamado
          </h1>
        </v-row>
        <v-form ref="form">
          <v-container>
            <div v-if="register === false">
              <p style="color: white; font-weight: bold; font-size: 1.2em">
                Título
              </p>
              <p style="color: white">{{ this.ticketEdit.title }}</p>
              <v-divider dark class="my-5"></v-divider>
              <div v-if="!permissionChangeStatus && status === 1">
                <label style="color: #8d8d8d" for="title">Título</label>
                <v-text-field
                  id="title"
                  dark
                  dense
                  class="input-dialog"
                  outlined
                  single-line
                  v-model="title"
                  color="secondary"
                >
                </v-text-field>
                <label style="color: #8d8d8d" for="category">Escolha uma categoria</label>
                <v-select
                  id="category"
                  dark
                  dense
                  class="input-dialog"
                  outlined
                  single-line
                  :items="categories"
                  item-value="id"
                  item-text="label"
                  v-model="selectedCategory"
                  color="secondary"
                >
                </v-select>
                <label style="color: #8d8d8d" for="description">Insira uma descrição</label>
                <v-textarea
                  id="description"
                  dark
                  dense
                  auto-grow
                  style="border: solid 1px"
                  class="px-1 input-dialog text-caption"
                  v-model="description"
                  @blur="verifyCreateTicket()"
                  color="secondary"
                >
                </v-textarea>
              </div>
            </div>
            <div v-else-if="register === true || status === 2">
              <label style="color: #8d8d8d" for="title">Título</label>
              <v-text-field
                height="30"
                id="title"
                dark
                dense
                class="input-dialog text-caption"
                outlined
                single-line
                v-model="title"
                color="secondary"
              >
              </v-text-field>
              <label style="color: #8d8d8d" for="category2">Escolha uma categoria</label>
              <v-select
                color="secondary"
                height="30"
                dark
                dense
                outlined
                id="category2"
                class="input-dialog text-caption"
                :items="categories"
                item-value="id"
                item-text="label"
                v-model="selectedCategory"
              >
              </v-select>
              <label style="color: #8d8d8d" for="description2">Insira uma descrição</label>
              <v-textarea
                color="secondary"
                id="description2"
                dark
                dense
                hide-details
                auto-grow
                style="border: solid 1px"
                class="px-1 input-dialog text-caption"
                v-model="description"
                @blur="verifyCreateTicket()"
              >
              </v-textarea>
            </div>
            <!-- <label style="color: #8d8d8d" for="office">Insira uma imagem</label>
            <v-file-input
              dark
              dense
              class="input-dialog"
              filled
              outlined
              single-line
              counter
              clearable
              prepend-icon="mdi-camera-image"
              :disabled="disabled"
              color="#39B54A"
              accept="image/*"
              label="Anexar Comprovante"
              v-model="image"
            >
            </v-file-input> -->
            <div
              v-if="
                (register === false &&
                  permissionChangeStatus &&
                  status === 1) ||
                status === 2
              "
            >
              <v-container class="py-0">
                <v-row
                  v-for="message in chat"
                  :key="message.id"
                  align="baseline"
                >
                  <v-col class="px-0" cols="2">
                    <v-icon
                      v-if="message.isSupport === 1"
                      class="icon-chat"
                      :color="message.isSupport === 1 ? 'white' : '#EBB30F'"
                      v-text="
                        message.isSupport === 1
                          ? 'mdi-account'
                          : 'mdi-face-agent'
                      "
                    ></v-icon>
                  </v-col>
                  <v-col class="px-0">
                    <v-card color="#292929" style="border-radius: 10px; max-width: 200px">
                      <v-card-text class="white--text pa-2">
                        <span style="font-size: 0.9em">{{
                          message.message
                        }}</span>
                      </v-card-text>
                    </v-card>
                    <span
                      v-if="message.isSupport === 0"
                      class="d-flex justify-end"
                      style="color: #9b9b9b; font-size: 0.7em"
                      >{{ parseDate(message.createdAt) }}</span
                    >
                    <span v-else style="color: #9b9b9b; font-size: 0.7em">{{
                      parseDate(message.createdAt)
                    }}</span>
                  </v-col>
                  <v-col
                    class="px-0"
                    cols="2"
                    style="display: flex; justify-content: flex-end"
                  >
                    <v-icon
                      v-if="message.isSupport === 0"
                      class="icon-chat"
                      :color="message.isSupport === 1 ? 'white' : '#EBB30F'"
                      v-text="
                        message.isSupport === 1
                          ? 'mdi-account'
                          : 'mdi-face-agent'
                      "
                    ></v-icon>
                  </v-col>
                </v-row>
              </v-container>
              <v-divider dark class="my-5"></v-divider>
              <label style="color: #8D8D8D" for="answer">Responder</label>
              <v-textarea
                hide-details
                rows="1"
                auto-grow
                dark
                dense
                single-line
                style="border: solid 1px"
                class="px-1 input-dialog text-caption"
                v-model="answer"
                placeholder="Escreva uma mensagem..."
                id="answer"
                color="secondary"
              >
              </v-textarea>
            </div>
            <!-- <div v-if="permissionChangeStatus && register === false">
                <label style="color: white; font-weight: bold">Alterar status</label>
                <v-select
                  dark
                  dense
                  class="input-dialog"
                  filled
                  outlined
                  single-line
                  :items="items"
                  item-value="id"
                  item-text="label"
                  v-model="selectedStatus"
                >
                </v-select>
              </div> -->
            <base-btn
              v-if="register === true"
              width="100%"
              class="my-10"
              name="Registrar"
              color="#474747"
              @clickEvent="createTicket()"
              :loading="load"
              :disabled="disabled"
            >
            </base-btn>
            <base-btn
              v-else-if="
                register === false &&
                permissionResponse === false &&
                status === 1
              "
              width="100%"
              class="my-10"
              name="Confirmar"
              color="#474747"
              @clickEvent="editTicket()"
              :loading="load"
            >
            </base-btn>
            <base-btn
              v-else-if="register === false"
              width="100%"
              class="my-10"
              name="Responder"
              color="#474747"
              @clickEvent="answerTicket()"
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
  apiCreateTicket,
  apiUserPermissions,
  apiFindTicket,
  apiChatAnswer,
  apiLogout,
  apiEditTicket,
  apiChatList,
} from "../../service";
import { mapMutations } from "vuex";

export default {
  name: "ERTicket",

  props: {
    register: Boolean,
    value: Boolean,
    titleEdit: String,
    descriptionEdit: String,
    idTicket: Number,
  },

  data() {
    return {
      load: false,
      title: "",
      description: "",
      items: [
        {
          label: "Aguardando Suporte",
          id: "1",
        },
        {
          label: "Em progresso",
          id: "2",
        },
        {
          label: "Finalizado",
          id: "3",
        },
      ],
      categories: [
        {
          label: "Jogue Fácil",
          id: "1",
        },
        {
          label: "Backoffice",
          id: "2",
        },
        {
          label: "Outros",
          id: "3",
        },
      ],
      selectedCategory: "",
      id: "",
      status: "",
      selectedStatus: "",
      permissionChangeStatus: false,
      permissionResponse: false,
      btnLoading: false,
      seleLoading: false,
      messageSuport: [],
      messageClient: [],
      active: "",
      ticketEdit: "",
      disabled: true,
      answer: "",
      chat: [],
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

  mounted() {
    apiUserPermissions().then((res) => {
      if (Object.keys(res.data.permissions).includes("JFS-ALS")) {
        this.permissionChangeStatus = true;
      }
      if (Object.keys(res.data.permissions).includes("JFS-RTK")) {
        this.permissionResponse = true;
      } else {
        this.permissionChangeStatus = false;
        this.permissionResponse = false;
      }
    });
    this.chatList();
  },

  methods: {
    ...mapMutations(["showSnackbar", "closeSnackbar"]),

    verifyCreateTicket() {
      if (this.title === "" || this.description === "") {
        this.disabled = true;
      } else {
        this.disabled = false;
      }
    },

    createTicket() {
      this.load = true;
      apiCreateTicket({
        title: this.title,
        description: this.description,
        category: this.selectedCategory,
      })
        .then(() => {
          this.showSnackbar({ text: "Ticket criado", timeout: 3000 });
          this.$emit("get");
          this.load = false;
          this.show = false;
        })
        .catch((err) => {
          this.status = err.response.data.status;
          if (err.response.status === 404) {
            this.showSnackbar({ text: "Problema de Conexão", timeout: 3000 });
            this.load = false;
          } else if (
            this.status === 3 ||
            this.status === 1 ||
            this.status === 2 ||
            this.status === 0
          ) {
            this.showSnackbar({ text: "Sessão Expirada", timeout: 3000 });
            apiLogout();
            this.load = false;
            this.$router.push("/");
          }
          this.load = false;
        });
    },

    answerTicket() {
      this.load = true;
      apiChatAnswer({
        id: this.id,
        answer: this.answer,
      })
        .then(() => {
          this.$emit("get");
          this.load = false;
          this.chatList(this.id);
          this.answer = ''
        })
        .catch((err) => {
          this.status = err.response.data.status;
          if (err.response.status === 404) {
            this.showSnackbar({ text: "Problema de Conexão", timeout: 3000 });
            this.load = false;
          } else if (
            this.status === 3 ||
            this.status === 1 ||
            this.status === 2 ||
            this.status === 0
          ) {
            this.showSnackbar({ text: "Sessão Expirada", timeout: 3000 });
            apiLogout();
            this.load = false;
            this.$router.push("/");
          }
          this.load = false;
        });
    },

    parseDate(now) {
      now = new Date(now);
      return `${now.getDate() >= 10 ? now.getDate() : `0${now.getDate()}`}/${
        now.getMonth() + 1 >= 10 ? now.getMonth() + 1 : `0${now.getMonth() + 1}`
      }/${now.getFullYear()} 
        ${now.getHours() >= 10 ? now.getHours() : `0${now.getHours()}`}:${
        now.getMinutes() >= 10 ? now.getMinutes() : `0${now.getMinutes()}`
      }`;
    },

    editTicket() {
      this.load = true;
      apiEditTicket({
        id: this.id,
        status: 1,
        title: this.title,
        description: this.description,
      })
        .then(() => {
          this.showSnackbar({ text: "Edição efetuada", timeout: 3000 });
          this.$emit("get");
          this.load = false;
          this.show = false;
        })
        .catch((err) => {
          this.status = err.response.data.status;
          if (err.response.status === 404) {
            this.showSnackbar({ text: "Problema de Conexão", timeout: 3000 });
            this.load = false;
          } else if (
            this.status === 3 ||
            this.status === 1 ||
            this.status === 2 ||
            this.status === 0
          ) {
            this.showSnackbar({ text: "Sessão Expirada", timeout: 3000 });
            apiLogout();
            this.load = false;
            this.$router.push("/");
          }
          this.load = false;
        });
    },

    getOneTicket(id) {
      apiFindTicket({
        id: id,
      }).then((res) => {
        this.id = id;
        this.ticketEdit = res.data.data;
        this.status = this.ticketEdit.status;
      });
    },

    chatList(id) {
      console.log(id);
      apiChatList({
        id: id,
      }).then((res) => {
        this.id = id;
        console.log(this.id);
        this.chat = res.data.data;
        console.log(this.chat);
        console.log(id);
      });
    },
  },
};
</script>

<style scoped>
.permission-row {
  display: flex;
  align-items: center;
}

.icon-chat {
  border-radius: 100px;
  padding: 5px;
  height: 50%;
  background-color: #292929;
}

.permission-sub-row {
  display: flex;
  align-items: center;
  margin: -15px 0px;
}

.btn-active {
  background: #ffb300 !important;
  color: white !important;
}

.v-btn::before {
  background-color: transparent;
}

.input-dialog {
  border-radius: 7px;
}

.text-area{
  max-height: auto !important;
  min-height: auto !important;
  height: auto !important;
}
</style>