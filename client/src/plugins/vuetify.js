import "@mdi/font/css/materialdesignicons.css"; // Ensure you are using css-loader
import Vue from "vue";
import Vuetify from "vuetify/lib";

import colors from "vuetify/lib/util/colors";

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: "mdi" // default - only for display purposes
  },
  theme: {
    themes: {
      light: {
        primary: colors.teal.lighten1,
        secondary: colors.teal.lighten1,
        accent: colors.red.lighten1,
        error: colors.red.accent1,
        warning: colors.amber.base,
        info: colors.blue.accents,
        success: colors.green.darken4
      }
    }
  }
});
