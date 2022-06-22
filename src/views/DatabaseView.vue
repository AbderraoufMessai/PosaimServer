<template>
  <v-card outlined class="rounded-xl">
    <v-tabs vertical height="200" class="my-5">
      <v-tab :disabled="isRunning">
        <h5>Backup</h5>
        <v-spacer />
        <v-icon small class="ml-6">$database</v-icon>
      </v-tab>
      <v-tab :disabled="isRunning">
        <h5>Restore</h5>
        <v-spacer />
        <v-icon small>$restore</v-icon>
      </v-tab>
      <v-tab :disabled="!isRunning">
        <h5>Import</h5>
        <v-spacer />
        <v-icon small>$data</v-icon>
      </v-tab>
      <v-tab :disabled="!isRunning">
        <h5>Clear</h5>
        <v-spacer />
        <v-icon small>$trash</v-icon>
      </v-tab>
      <v-tab-item>
        <v-card flat height="200">
          <v-card-text class="text-center">
            <p>Create a backup (copy) of the database.</p>
          </v-card-text>
          <v-btn
            right
            bottom
            absolute
            dark
            small
            rounded
            color="green"
            @click="backupDatabase"
          >
            <v-icon small left>$run</v-icon>
            create backup
          </v-btn>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat height="200">
          <v-card-text class="text-center">
            <p>Restore from the backup (copy) of the database.</p>
            <v-chip color="red" dark outlined>
              <h4>Warning, the current database will be deleted.</h4>
            </v-chip>
          </v-card-text>
          <v-btn
            right
            bottom
            absolute
            small
            dark
            rounded
            color="green"
            @click="restoreDatabase"
          >
            <v-icon small left>$database</v-icon>
            select backup file
          </v-btn>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat height="200">
          <v-card-text class="text-center">
            <p>Import new products to database.</p>
            <v-chip color="orange" dark outlined>
              <h4>
                Required barcode & name of product, doesn't accept reputation.
              </h4>
            </v-chip>
          </v-card-text>
          <v-btn
            right
            bottom
            absolute
            small
            dark
            rounded
            :loading="loading"
            color="green"
            @click="importProducts"
          >
            <v-icon small left>$file</v-icon>
            select products file
          </v-btn>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat height="200">
          <v-card-text class="text-center">
            <p>Clear all data from the database.</p>
            <v-chip color="red" dark outlined>
              <h4>Warning, no return after data is cleared.</h4>
            </v-chip>
          </v-card-text>
          <v-btn
            right
            bottom
            absolute
            small
            dark
            rounded
            color="red"
            :loading="loading"
            @click="clearDatabase"
          >
            <v-icon small left>$trash</v-icon>
            Clear all data
          </v-btn>
        </v-card>
      </v-tab-item>
    </v-tabs>
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
    loading: false,
    snackbar: {
      active: false,
      color: null,
      message: null,
    },
  }),
  computed: {
    isRunning() {
      return this.$store.getters.isRunning;
    },
  },
  methods: {
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
    importProducts() {
      const { dialog } = require("electron").remote;
      const fs = require("fs");
      this.loading = true;
      dialog
        .showOpenDialog({
          filters: [
            {
              name: "JSON Files",
              extensions: ["json"],
            },
          ],
          properties: ["openFile"],
        })
        .then((file) => {
          if (file.canceled) {
            this.loading = false;
          } else {
            fs.readFile(file.filePaths[0], (err, data) => {
              if (err) {
                this.snackbar.active = true;
                this.snackbar.color = "error";
                this.snackbar.message = err.message;
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
                      this.snackbar.message = "import data successful";
                    }
                  });
              }
            });
          }
        });
    },
    restoreDatabase() {
      const { dialog, app } = require("electron").remote;
      const fs = require("fs");
      this.loading = true;
      dialog
        .showOpenDialog({
          filters: [
            {
              name: "Database Files",
              extensions: ["sqlite"],
            },
          ],
          properties: ["openFile"],
        })
        .then((file) => {
          if (file.canceled) {
            this.loading = false;
          } else {
            fs.readFile(file.filePaths[0], (err, data) => {
              if (err) {
                this.snackbar.active = true;
                this.snackbar.color = "error";
                this.snackbar.message = err.message;
              } else {
                fs.writeFile(
                  app.getAppPath() + "/database.sqlite",
                  data,
                  () => {
                    this.snackbar.active = true;
                    this.snackbar.color = "success";
                    this.snackbar.message = "restore data successful";
                  }
                );
              }
              this.loading = false;
            });
          }
        });
    },
    backupDatabase() {
      const { dialog, app } = require("electron").remote;
      const fs = require("fs");
      this.loading = true;
      dialog
        .showOpenDialog({
          properties: ["openDirectory"],
        })
        .then((directory) => {
          if (directory.canceled) {
            this.loading = false;
          } else {
            fs.readFile(app.getAppPath() + "/database.sqlite", (err, data) => {
              if (err) {
                this.snackbar.active = true;
                this.snackbar.color = "error";
                this.snackbar.message = err.message;
              } else {
                fs.writeFile(
                  directory.filePaths[0] + "/database.sqlite",
                  data,
                  () => {
                    this.snackbar.active = true;
                    this.snackbar.color = "success";
                    this.snackbar.message = "create backup successful";
                  }
                );
              }
              this.loading = false;
            });
          }
        });
    },
  },
};
</script>

<style scoped></style>
