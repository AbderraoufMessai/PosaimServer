<template>
  <v-card outlined class="rounded-xl" elevation="10">
    <v-card-title> Administration </v-card-title>
    <v-card-text>
      <v-text-field
        v-model="username"
        label="Username"
        prepend-inner-icon="mdi-account"
        outlined
        rounded
        dense
        :counter="50"
        required
      />
      <v-text-field
        v-model="password"
        label="Password"
        outlined
        dense
        rounded
        :counter="50"
        required
        prepend-inner-icon="mdi-lock"
        :type="showPassword ? 'text' : 'password'"
        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="showPassword = !showPassword"
      />
      <v-text-field
        v-model="re_password"
        label="Re Password"
        outlined
        dense
        rounded
        :counter="50"
        required
        prepend-inner-icon="mdi-lock"
        :type="showRePassword ? 'text' : 'password'"
        :append-icon="showRePassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="showRePassword = !showRePassword"
      />
    </v-card-text>
    <v-tooltip color="warning" bottom>
      <template #activator="{ on, attrs }">
        <v-btn
          absolute
          dark
          bottom
          color="warning"
          left
          v-bind="attrs"
          v-on="on"
          fab
          small
        >
          <v-icon> mdi-cog </v-icon>
        </v-btn>
      </template>
      Update
    </v-tooltip>
    <v-tooltip color="success" bottom>
      <template #activator="{ on, attrs }">
        <v-btn
          absolute
          dark
          bottom
          color="success"
          right
          v-bind="attrs"
          v-on="on"
          fab
          small
        >
          <v-icon> mdi-content-save </v-icon>
        </v-btn>
      </template>
      Save
    </v-tooltip>
  </v-card>
</template>

<script>
export default {
  name: "AdministrationView",
  data: () => ({
    username: null,
    password: null,
    re_password: null,
    showPassword: false,
    showRePassword: false,
  }),
};
</script>

<style scoped></style>
