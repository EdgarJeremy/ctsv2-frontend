function navigation(userdata) {
  let navs = {
    items: []
  };
  switch (userdata.level) {
    case "Front Office":
      navs.items = [
        {
          name: 'Dashboard',
          url: '/dashboard',
          icon: 'icon-speedometer',
          badge: {
            variant: 'info',
            // text: 'NEW',
          },
        },
        {
          title: true,
          name: 'Pendaftaran',
          wrapper: {            // optional wrapper object
            element: '',        // required valid HTML5 element tag
            attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
          },
          class: ''             // optional class names space delimited list for title item ex: "text-center"
        },
        {
          name: 'Baru',
          url: '/pendaftaran/baru',
          icon: 'icon-pencil',
        },
        {
          name: 'Diproses',
          url: '/pendaftaran/proses',
          icon: 'icon-refresh',
        },
        {
          name: 'Selesai',
          url: '/pendaftaran/selesai',
          icon: 'icon-folder-alt',
        },
      ];
      break;
    case "Loket":
      navs.items = [
        {
          name: 'Dashboard',
          url: '/dashboard',
          icon: 'icon-speedometer',
          badge: {
            variant: 'info',
            // text: 'NEW',
          },
        },
        {
          title: true,
          name: 'Pendaftaran',
          wrapper: {            // optional wrapper object
            element: '',        // required valid HTML5 element tag
            attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
          },
          class: ''             // optional class names space delimited list for title item ex: "text-center"
        },
        {
          name: 'Daftar Masuk',
          url: '/pendaftaran/masuk',
          icon: 'icon-list',
        },
      ];
      break;
    case "Administrator":
      navs.items = [
        {
          name: 'Dashboard',
          url: '/dashboard',
          icon: 'icon-speedometer',
          badge: {
            variant: 'info',
            // text: 'NEW',
          },
        },
        {
          title: true,
          name: 'Pendaftaran',
          wrapper: {            // optional wrapper object
            element: '',        // required valid HTML5 element tag
            attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
          },
          class: ''             // optional class names space delimited list for title item ex: "text-center"
        },
        {
          name: 'Diproses',
          url: '/pendaftaran/proses',
          icon: 'icon-refresh',
        },
        {
          name: 'Selesai',
          url: '/pendaftaran/selesai',
          icon: 'icon-folder-alt',
        },
        {
          title: true,
          name: 'Pengaturan',
          wrapper: {
            element: '',
            attributes: {},
          },
        },
        {
          name: 'Pengurus',
          url: '/pengaturan/pengurus',
          icon: 'icon-user',
        },
        {
          name: 'Tujuan Pendaftaran',
          url: '/pengaturan/tujuan',
          icon: 'icon-paper-plane',
        },
        {
          name: 'Alur Pendaftaran',
          url: '/pengaturan/alur',
          icon: 'icon-link',
        },
        {
          name: 'Sumber Eksternal',
          url: '/pengaturan/api',
          icon: 'icon-refresh',
        },
        {
          name: 'Info Aplikasi',
          url: '/pengaturan/info',
          icon: 'icon-folder-alt',
        }
      ];
      break;
    case "Kepala Dinas":
      navs.items = [
        {
          name: 'Dashboard',
          url: '/dashboard',
          icon: 'icon-speedometer',
          badge: {
            variant: 'info',
            // text: 'NEW',
          },
        },
        {
          title: true,
          name: 'Pendaftaran',
          wrapper: {            // optional wrapper object
            element: '',        // required valid HTML5 element tag
            attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
          },
          class: ''             // optional class names space delimited list for title item ex: "text-center"
        },
        {
          name: 'Daftar Masuk',
          url: '/pendaftaran/masuk',
          icon: 'icon-list',
        },
        {
          name: 'Diproses',
          url: '/pendaftaran/proses',
          icon: 'icon-refresh',
        },
        {
          name: 'Selesai',
          url: '/pendaftaran/selesai',
          icon: 'icon-folder-alt',
        },
      ];
      break;
    case "Kepala Bidang":
      navs.items = [
        {
          name: 'Dashboard',
          url: '/dashboard',
          icon: 'icon-speedometer',
          badge: {
            variant: 'info',
            // text: 'NEW',
          },
        },
        {
          title: true,
          name: 'Pendaftaran',
          wrapper: {            // optional wrapper object
            element: '',        // required valid HTML5 element tag
            attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
          },
          class: ''             // optional class names space delimited list for title item ex: "text-center"
        },
        {
          name: 'Daftar Masuk',
          url: '/pendaftaran/masuk',
          icon: 'icon-list',
        },
        {
          name: 'Diproses',
          url: '/pendaftaran/proses',
          icon: 'icon-refresh',
        },
        {
          name: 'Selesai',
          url: '/pendaftaran/selesai',
          icon: 'icon-folder-alt',
        },
      ];
      break;
    case 'Sekretaris Dinas':
      navs.items = [
        {
          name: 'Dashboard',
          url: '/dashboard',
          icon: 'icon-speedometer',
          badge: {
            variant: 'info',
            // text: 'NEW',
          },
        },
        {
          title: true,
          name: 'Pendaftaran',
          wrapper: {            // optional wrapper object
            element: '',        // required valid HTML5 element tag
            attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
          },
          class: ''             // optional class names space delimited list for title item ex: "text-center"
        },
        {
          name: 'Daftar Masuk',
          url: '/pendaftaran/masuk',
          icon: 'icon-list',
        },
        {
          name: 'Diproses',
          url: '/pendaftaran/proses',
          icon: 'icon-refresh',
        },
        {
          name: 'Selesai',
          url: '/pendaftaran/selesai',
          icon: 'icon-folder-alt',
        },
      ];
      break;
    case "Kepala Sub Bagian":
      navs.items = [
        {
          name: 'Dashboard',
          url: '/dashboard',
          icon: 'icon-speedometer',
          badge: {
            variant: 'info',
            // text: 'NEW',
          },
        },
        {
          title: true,
          name: 'Pendaftaran',
          wrapper: {            // optional wrapper object
            element: '',        // required valid HTML5 element tag
            attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
          },
          class: ''             // optional class names space delimited list for title item ex: "text-center"
        },
        {
          name: 'Daftar Masuk',
          url: '/pendaftaran/masuk',
          icon: 'icon-list',
        },
        {
          name: 'Diproses',
          url: '/pendaftaran/proses',
          icon: 'icon-refresh',
        },
        {
          name: 'Selesai',
          url: '/pendaftaran/selesai',
          icon: 'icon-folder-alt',
        },
      ];
      break;
    default:
      break;
  }
  return navs;
}

export default navigation;
