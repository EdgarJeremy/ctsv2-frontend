import { Dashboard } from "./views";
import Full from "./containers/Full";
import Diproses from "./views/Pendaftaran/Diproses";
import Baru from "./views/Pendaftaran/Baru";
import Masuk from "./views/Pendaftaran/Masuk";
import Selesai from "./views/Pendaftaran/Selesai";
import Pengurus from "./views/Pengaturan/Pengurus";
import Tujuan from "./views/Pengaturan/Tujuan";
import Alur from "./views/Pengaturan/Alur";

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  // Home
  { path: "/", exact: true, name: "Home", component: Full },
  { path: "/dashboard", name: "Dashboard", component: Dashboard },
  // Pendaftaran
  { path: "/pendaftaran/baru", name: "Pendaftaran Baru", component: Baru },
  { path: "/pendaftaran/proses", name: "Pendaftaran Diproses", component: Diproses },
  { path: "/pendaftaran/masuk", name: "Pendaftaran Masuk", component: Masuk },
  { path: "/pendaftaran/selesai", name: "Pendaftaran Selesai", component: Selesai },
  // Pengaturan
  { path: "/pengaturan/pengurus", name: "Pengurus", component: Pengurus },
  { path: "/pengaturan/tujuan", name: "Tujuan Pendaftaran", component: Tujuan },
  { path: "/pengaturan/alur", name: "Alur Pendaftaran", component: Alur },
];

export default routes;
