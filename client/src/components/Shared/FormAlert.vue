<template lang="html">
  <v-alert type="error" :value="true" dismissible transition="scale-transition">
    <h3>{{ message }}</h3>
  </v-alert>
</template>

<script>
export default {
  props: ["message"]
};
</script>

<style lang="css" scoped></style>
