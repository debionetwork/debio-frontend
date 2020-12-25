import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#F60689',
        secondary: '#3F2040',
        light_primary: '#FDC0FF',
      }
    }
  }
});
