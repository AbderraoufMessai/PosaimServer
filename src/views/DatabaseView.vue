<template>
  <v-card outlined class="rounded-xl">
    <v-card-text>
      <v-chip color="red" dark>
        <h4>
          Attention : Any of these operations there is no return from them !!
        </h4>
      </v-chip>
    </v-card-text>
    <v-card-text>
      <v-row dense>
        <v-col cols="8">
          <v-file-input
            v-model="data"
            label="Data"
            background-color="#cec8e4"
            placeholder="Select data to import"
            accept="application/JSON"
            outlined
            dense
            rounded
            prepend-icon="$file"
            hide-details
            clearable
          />
        </v-col>
        <v-col cols="4">
          <v-btn
            elevation="0"
            fab
            rounded
            block
            height="40"
            color="#cec8e4"
            @click="importDatabase"
            :loading="loading"
            :disabled="!data"
          >
            <v-icon small left>$down</v-icon>
            import data
          </v-btn>
        </v-col>
        <v-col cols="12">
          <v-btn
            elevation="0"
            block
            fab
            rounded
            height="40"
            color="#caf1de"
            :loading="loading"
            @click="exportDatabase"
          >
            <v-icon small left>$up</v-icon>
            export data
          </v-btn>
        </v-col>
        <v-col cols="12">
          <v-btn
            elevation="0"
            block
            fab
            rounded
            height="40"
            color="#ff928b"
            :loading="loading"
            @click="clearDatabase"
          >
            <v-icon small left>$trash</v-icon>
            destroy data
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
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
  </v-card>
</template>

<script>
export default {
  name: "DatabaseView",
  data: () => ({
    data: null,
    loading: false,
    snackbar: {
      active: false,
      color: null,
      message: null,
    },
  }),
  computed: {
    database() {
      return this.$store.getters.data;
    },
  },
  methods: {
    exportDatabase() {
      const dialog = require("electron").remote.dialog;
      const fs = require("fs");
      const path = require("path");

      this.loading = true;
      this.$store.dispatch("exportDatabase").then((errors) => {
        if (errors) {
          this.loading = false;
          this.snackbar.active = true;
          this.snackbar.color = "error";
          this.snackbar.message = errors.message;
        } else {
          dialog
            .showSaveDialog({
              defaultPath: path.join(
                __dirname,
                `data_${this.database.createdAt}.json`
              ),
              filters: [
                {
                  name: "Json Files",
                  extensions: ["json"],
                },
              ],
              properties: [],
            })
            .then((file) => {
              if (!file.canceled) {
                fs.writeFile(
                  file.filePath.toString(),
                  JSON.stringify(this.database),
                  (err) => {
                    if (err) {
                      this.snackbar.active = true;
                      this.snackbar.color = "error";
                      this.snackbar.message = err;
                    } else {
                      this.snackbar.active = true;
                      this.snackbar.color = "success";
                      this.snackbar.message = "data export success.";
                    }
                  }
                );
              }
            })
            .catch((err) => {
              this.snackbar.active = true;
              this.snackbar.color = "error";
              this.snackbar.message = err;
            })
            .finally(() => {
              this.loading = false;
            });
        }
      });
    },
    importDatabase() {
      this.loading = true;
      const fs = require("fs");
      fs.readFile(this.data.path, (err, data) => {
        if (err) {
          this.snackbar.active = true;
          this.snackbar.color = "error";
          this.snackbar.message = err;
        } else {
          this.$store
            .dispatch("importDatabase", JSON.parse(data.toString()))
            .then((errors) => {
              this.loading = false;
              if (errors) {
                this.snackbar.active = true;
                this.snackbar.color = "error";
                this.snackbar.message = errors.message;
              } else {
                this.snackbar.active = true;
                this.snackbar.color = "success";
                this.snackbar.message = "import data success.";
                this.data = null;
              }
            });
        }
      });
    },
    clearDatabase() {
      this.loading = true;
      this.$store.dispatch("clearDatabase").then((errors) => {
        this.loading = false;
        if (errors) {
          this.snackbar.active = true;
          this.snackbar.color = "error";
          this.snackbar.message = errors.message;
        } else {
          this.snackbar.active = true;
          this.snackbar.color = "success";
          this.snackbar.message = "clear data success.";
        }
      });
    },
  },
};
</script>

<style scoped></style>
