<template>
  <v-btn
    small
    :icon="icon"
    class="custom-button"
    :color="color"
    @click="clickEvent()"
    :outlined="outlined"
    :fab="fab"
    :loading="loading"
    :width="width"
    :disabled="disabled"
  >
  <template #loader>
    <circle-loading :small="true"></circle-loading>
  </template>
    <v-icon
      small
      :left="left = icon === true ? false : true"
      v-if="iconName"
    >
      {{ iconName }}
    </v-icon>
    <span v-if="name" class="text-caption">
      {{ name }}
    </span>
  </v-btn>
</template>

<script>

export default {

  name: 'BaseButton',

  props: {
    width: {
      type: String,
      required: false,
    },

    color: {
      type: String,
      default: '#1E1E1E'
    },

    small: {
      type: Boolean,
      default: false,
      required: false
    },

    name: {
      type: String,
      required: false
    },

    icon: {
      type: Boolean,
      required: false,
      default: false
    },

    outlined: {
      type: Boolean,
      required: false,
      default: false
    },

    fab: {
      type: Boolean,
      required: false,
      default: false
    },

    disabled: {
      type: Boolean,
      required: false,
      default: false
    },

    loading: {
      type: Boolean,
      required: false,
      default: false
    },

    iconName: {
      type: String,
      required: false
    },
  },

  data: () => ({
    left: false
  }),

  methods: {
    clickEvent(){
      this.$emit('clickEvent')
    },
  }
}
</script>

<style scoped>

.custom-button{
  color: #F1F1F1;
}

.custom-button::before {
  background-color: transparent;
}

.custom-button:hover {
  color: black !important;
}

.custom-button:hover:before {

  background-color: #FFB300;
  opacity: 1 !important;
}

</style>