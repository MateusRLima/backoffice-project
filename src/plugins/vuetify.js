import Vue from 'vue';
import Vuetify from 'vuetify/lib';


Vue.use(Vuetify);

export default new Vuetify({
    theme: {
      themes: {
        dark: {
          'primary-text': '#F9F9F3',
          'secondary-text': '#7C7C7C',
          background: "#020202",
          primary: "#111",
          secondary: "#F9F9F3",
          accent: '#cc0000',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107'
        },

        light: {
          primary: "#0C0C0C",
          secondary: "#F9F9F3",
          accent: '#cc0000',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107'
        }
      }
    }
});
