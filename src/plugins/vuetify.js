import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: "#5addfc",
        secondary: "#e6e6e6",
        accent: "#181b2d",
        success: "#f2c80a",
        warning: "#051a52",
        error: "#ee0505",
      },
    },
  },
});
