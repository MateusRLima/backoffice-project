<template>
  <v-snackbar
    :timeout="snackbar.timeout"
    :multi-line="snackbar.multiline === true"
    bottom
    color="#111"
    v-model="snackbar.visible"
    center
    class="snackbar"
  >
    <span class="white--text">{{ snackbar.text }}</span>
    <template v-slot:action="{ attrs }">
      <v-btn icon v-bind="attrs" text @click.native="closeSnackbar"
        ><v-icon color="white">mdi-close</v-icon></v-btn
      >
    </template>
  </v-snackbar>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  name: "Snackbar",

  computed: {
    snackbar() {
      return this.$store.state.snackbar;
    },
  },
  methods: {
    ...mapMutations(["closeSnackbar"]),
  },
};
</script>

<style scoped>
v-snackbar {
background: #111;
}
</style>