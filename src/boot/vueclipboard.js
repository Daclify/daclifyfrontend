import VueClipboard from 'vue-clipboard3';
import { boot } from 'quasar/wrappers'

export default boot(({ app }) => {
  app.use(VueClipboard)
});
