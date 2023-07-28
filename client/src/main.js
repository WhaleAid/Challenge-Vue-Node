import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import store from "./components/stores/store.js";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faUserSecret, faHandHoldingMedical, faArrowsSpin, faBan, faStar, faRightFromBracket, faUser, faUserPen, faPlus } from "@fortawesome/free-solid-svg-icons";

library.add(faUserSecret, faHandHoldingMedical, faArrowsSpin, faBan, faStar, faRightFromBracket, faUser, faUserPen, faPlus);

const app = createApp(App)
  .component("font-awesome-icon", FontAwesomeIcon)
  .use(router)
  .use(store);

app.use(Toast, {
  // Paramètres de Toastification, si nécessaire
});

app.mount("#app");
