<template>
  <v-container class="pa-0">
    <v-divider dark></v-divider>
    <v-row class="align-center mt-5 mx-auto">
      <v-spacer></v-spacer>
      <v-pagination
        dark
        class="custom-pagination primary-font"
        v-model="page"
        :length="pageCount"
        total-visible="5"
        @next="nextPage()"
        @previous="previousPage()"
      >
      </v-pagination>
      <v-spacer></v-spacer>
      <div class="d-flex align-center">
        <label for="itensPerPage" class="text-caption secondary-font mr-1"
          >Itens per page</label
        >
        <v-text-field
          id="itensPerPage"
          height="30"
          single-line
          dense
          hide-details
          outlined
          v-model="totalItems"
          color="#F9F9F3"
          class="text-caption"
          style="max-width: 5vw; border-radius: 7px"
          @input="setTotalItems()"
        >
        </v-text-field>
      </div>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Pagination",

  props: {
    page: {
      type: Number,
      required: true,
      default: 1,
    },

    pageCount: {
      type: Number,
      required: true,
      default: 0,
    },

    totalItems: {
      type: Number,
      required: true,
      default: 10,
    }
  },

  methods: {
    nextPage(){
      this.$emit('nextPage', this.page)
    },

    previousPage(){
      this.$emit('previousPage', this.page)
    },

    setTotalItems(){
      this.$emit('setTotalItems', this.totalItems)
    }
  }
};
</script>

<style>
</style>