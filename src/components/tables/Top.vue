<template>
  <v-container class="px-0 pb-5 pt-0">
    <v-row align="center" class="mx-auto">
      <slot name="filter">
      </slot>
      <v-spacer></v-spacer>
      <v-tooltip bottom color="#0C0C0C">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            small
            class="mr-4"
            v-bind="attrs"
            v-on="on"
            dark
            icon
            style="border-radius: 7px"
            @click="emitFontPlus()"
            >
              <v-icon small color="secondary">mdi-format-font-size-increase</v-icon>
            </v-btn
          >
        </template>
        <p class="text-caption secondary-font ma-0">Increase font size</p>
      </v-tooltip>
      <v-tooltip bottom color="#0C0C0C">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            small
            v-bind="attrs"
            v-on="on"
            dark
            icon
            style="border-radius: 7px"
            @click="emitFontMinus()"
            >
              <v-icon small>mdi-format-font-size-decrease</v-icon>
            </v-btn
          >
        </template>
        <p class="text-caption secondary-font ma-0">Decrease font size</p>
      </v-tooltip>
      <span
        class="mx-4"
        style="color: #707070; font-size: 0.9em"
        >Font size: {{ fontSize }}</span
      >
      <v-tooltip bottom v-if="!fullScreen" color="#0C0C0C">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            small
            v-bind="attrs"
            v-on="on"
            dark
            icon
            style="border-radius: 7px"
            @click="emitFullScreen()"
          >
            <v-icon small>mdi-fullscreen</v-icon>
          </v-btn>
        </template>
        <p class="text-caption secondary-font ma-0">Fullscreen</p>
      </v-tooltip>
      <v-tooltip bottom v-else color="#0C0C0C">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            small
            v-bind="attrs"
            v-on="on"
            dark
            icon
            style="border-radius: 7px"
            @click="emitWindowScreen()"
          >
            <v-icon small>mdi-fullscreen-exit</v-icon>
          </v-btn>
        </template>
        <p class="text-caption secondary-font ma-0">Normalscreen</p>
      </v-tooltip>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Top',

  props: {
    fontSize: {
      type: Number,
      required: true, 
      default: 10
    },

    fullScreen: {
      type: Boolean,
      required: true,
      default: false
    }
  },

  methods: {
    emitFontPlus(){
      this.$emit('fontPlus')
    },

    emitFontMinus(){
      this.$emit('fontMinus')
    },

    emitFullScreen(){
      this.$emit('fullScreen')
    },

    emitWindowScreen(){
      this.$emit('windowScreen')
    },
  }
}
</script>

<style>

</style>