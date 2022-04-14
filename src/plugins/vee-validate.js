import Vue from "vue";
import {
  extend,
  ValidationObserver,
  ValidationProvider,
  setInteractionMode,
} from "vee-validate";
import {
  required,
  max,
  min,
  email,
  numeric,
  oneOf,
} from "vee-validate/dist/rules";

Vue.component("ValidationObserver", ValidationObserver);
Vue.component("ValidationProvider", ValidationProvider);

setInteractionMode("eager");

extend("required", {
  ...required,
});

extend("max", {
  ...max,
});

extend("min", {
  ...min,
});

extend("email", {
  ...email,
});

extend("numeric", {
  ...numeric,
});

extend("oneOf", {
  ...oneOf,
});

extend("confirmed", {
  params: ["target"],
  message: "La confirmation du mot de passe ne correspond pas",
  validate: (value, { target }) => {
    return value === target;
  },
});

export default {};
