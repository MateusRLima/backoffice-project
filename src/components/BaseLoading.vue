<template>
  <div :class="small ? 'small-lds-dual-ring' : 'lds-dual-ring'"></div>
</template>

<script>

export default {
  name: 'Loading',

  props:{
    small: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}

</script>

<style>

  .small-lds-dual-ring {
    display: inline-block;
    width: 36px;
    height: 36px;
  }

  .small-lds-dual-ring:after {
    content: " ";
    display: block;
    width: 20px;
    height: 20px;
    margin: 8px;
    border-radius: 50%;
    border: 3px solid #fff;
    border-color: #fff transparent #fff transparent;
    animation: lds-dual-ring 1.2s linear infinite;
  }

  .lds-dual-ring {
    display: inline-block;
    width: 80px;
    height: 80px;
  }

  .lds-dual-ring:after {
    content: " ";
    display: block;
    width: 64px;
    height: 64px;
    margin: 8px;
    border-radius: 50%;
    border: 6px solid #ffb300;
    border-color: #ffb300 transparent #ffb300 transparent;
    animation: lds-dual-ring 1.2s linear infinite;
  }

  @keyframes lds-dual-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

</style>