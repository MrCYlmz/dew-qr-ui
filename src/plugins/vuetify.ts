import { createVuetify} from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { mdi } from 'vuetify/iconsets/mdi';
import '@mdi/font/css/materialdesignicons.css';

export default () =>
  createVuetify({
    theme: {
      defaultTheme: 'dark'
    },
    components,
    directives,
    icons: {
      defaultSet: 'mdi',
      sets: {
        mdi,    
    },
    },
  });
