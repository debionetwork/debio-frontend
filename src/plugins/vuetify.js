import Vue from 'vue';
import Vuetify from 'vuetify';
import SkinIcon from '../components/icons/SkinIcon'

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    values: {
      'dgi-skin': {
        component: SkinIcon,
      }
    }
  },
  theme: {
    themes: {
      light: {
        // primary: '#F60689',
        primary: '#FE008A',
        secondary: '#3F2040',
        light_primary: '#FDC0FF',
        success: '#6edaa8',
        blue: '#63d0d5',
        green: '#6edaa8',
        yellow: '#EFC457'
      }
    }
  }
});
