<template>
  <validation-observer ref="observer" v-slot="{ invalid }">
    <form @submit.prevent="submit">
      <v-card outlined class="rounded-xl">
        <v-card-title class="text-body-2">
          Update Admin of Application
        </v-card-title>
        <v-card-text>
          <validation-provider
            v-slot="{ errors }"
            name="username"
            rules="required|max:50"
          >
            <v-text-field
              v-model="username"
              label="Username"
              :error-messages="errors"
              outlined
              rounded
              dense
              :counter="50"
              required
              append-icon="$username"
            />
          </validation-provider>
          <validation-provider
            v-slot="{ errors }"
            name="password"
            rules="required|max:50"
          >
            <v-text-field
              v-model="password"
              label="Password"
              :error-messages="errors"
              outlined
              dense
              rounded
              :counter="50"
              required
              :append-icon="showPassword ? '$showPW' : '$hidePW'"
              :type="showPassword ? 'text' : 'password'"
              @click:append="showPassword = !showPassword"
            />
          </validation-provider>
          <validation-provider
            v-slot="{ errors }"
            name="re password"
            rules="required|max:50|confirmed:@password"
          >
            <v-text-field
              v-model="re_password"
              label="Re Password"
              :error-messages="errors"
              outlined
              dense
              rounded
              :counter="50"
              required
              :append-icon="showRePassword ? '$showPW' : '$hidePW'"
              :type="showRePassword ? 'text' : 'password'"
              @click:append="showRePassword = !showRePassword"
            />
          </validation-provider>
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
              <v-icon>$cancel</v-icon>
            </v-btn>
          </template>
          Reset
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
              type="submit"
              :loading="loading"
              :disabled="invalid"
            >
              <v-icon>$check</v-icon>
            </v-btn>
          </template>
          Save
        </v-tooltip>
      </v-card>
      <v-snackbar
        v-model="snackbar.active"
        :color="snackbar.color"
        rounded="pill"
        dark
      >
        {{ snackbar.message }}
        <template #action="{ attrs }">
          <v-btn icon v-bind="attrs" @click="snackbar.active = false">
            <v-icon small>$close</v-icon>
          </v-btn>
        </template>
      </v-snackbar>
    </form>
  </validation-observer>
</template>

<script>
export default {
  name: "AdministrationView",
  data: () => ({
    loading: false,
    username: null,
    password: null,
    re_password: null,
    showPassword: false,
    showRePassword: false,
    snackbar: {
      active: false,
      color: null,
      message: null,
    },
  }),
  methods: {
    reset() {
      this.username = null;
      this.password = null;
      this.re_password = null;
      this.$refs.observer.reset();
    },
    submit() {
      this.loading = true;
      this.$refs.observer.validate().then((success) => {
        if (success) {
          this.$store
            .dispatch("createAdmin", {
              username: this.username,
              password: this.password,
            })
            .then((errors) => {
              this.loading = false;
              if (errors) {
                this.snackbar.active = true;
                this.snackbar.color = "error";
                this.snackbar.message = errors.message;
              } else {
                this.snackbar.active = true;
                this.snackbar.color = "success";
                this.snackbar.message = "create admin success.";
                this.reset();
              }
            });
        }
      });
    },
  },
};
</script>

<style scoped></style>
