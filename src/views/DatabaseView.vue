<template>
  <v-card outlined class="rounded-xl" elevation="10">
    <v-card-title> Database </v-card-title>
    <v-card-text>
      <v-btn block outlined rounded @click="exportDatabase">
        <v-icon left> mdi-database-export </v-icon>
        export
      </v-btn>
      <v-btn block outlined rounded class="my-6">
        <v-icon left> mdi-database-import </v-icon>
        import
      </v-btn>
      <v-btn block outlined rounded>
        <v-icon left> mdi-database-remove </v-icon>
        clear
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "DatabaseView",
  methods: {
    exportDatabase() {
      this.$store.dispatch("exportDatabase");
    },
  },
};
</script>

<style scoped></style>
