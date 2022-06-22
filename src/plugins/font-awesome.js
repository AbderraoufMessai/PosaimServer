import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import {
  faXmark,
  faMinus,
  faWindowMaximize,
  faCheck,
  faCancel,
  faTerminal,
  faShield,
  faShieldHalved,
  faServer,
  faPowerOff,
  faNetworkWired,
  faDatabase,
  faArrowUp,
  faArrowDown,
  faTrash,
  faPhone,
  faEnvelope,
  faComputer,
  faKey,
  faGlobe,
  faLink,
  faPaperclip,
  faUserShield,
  faEye,
  faEyeSlash,
  faHome,
  faCalendarDay,
  faQuestion,
  faWrench,
  faFloppyDisk,
  faCirclePlay,
  faLock,
  faLockOpen,
  faWifi,
  faWifiStrong,
  faPlay,
  faHourglassStart,
  faHourglass,
  faTabletScreenButton,
  faArrowUpRightFromSquare,
  faPaste,
  faCirclePlus,
  faDownload,
  faArrowRotateBackward,
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faArrowRotateBackward,
  faDownload,
  faCirclePlus,
  faPaste,
  faArrowUpRightFromSquare,
  faTabletScreenButton,
  faHourglass,
  faHourglassStart,
  faPlay,
  faWifi,
  faWifiStrong,
  faLockOpen,
  faLock,
  faCirclePlay,
  faFloppyDisk,
  faWrench,
  faQuestion,
  faCalendarDay,
  faHome,
  faEye,
  faEyeSlash,
  faUserShield,
  faPaperclip,
  faLink,
  faGlobe,
  faKey,
  faComputer,
  faXmark,
  faMinus,
  faWindowMaximize,
  faCheck,
  faCancel,
  faTerminal,
  faShield,
  faShieldHalved,
  faServer,
  faPowerOff,
  faNetworkWired,
  faDatabase,
  faArrowUp,
  faArrowDown,
  faTrash,
  faPhone,
  faEnvelope
);

const fa_icons = {
  menu: {
    // used for the nav-icon by vuetify
    component: FontAwesomeIcon,
    props: {
      icon: ["fa", "shield"],
    },
  },
  restore: {
    component: FontAwesomeIcon,
    props: {
      icon: ["fa", "arrow-rotate-backward"],
    },
  },
  data: {
    component: FontAwesomeIcon,
    props: {
      icon: ["fa", "download"],
    },
  },
  add: {
    component: FontAwesomeIcon,
    props: {
      icon: ["fa", "circle-plus"],
    },
  },
  copy: {
    component: FontAwesomeIcon,
    props: {
      icon: ["fa", "paste"],
    },
  },
  open: {
    component: FontAwesomeIcon,
    props: {
      icon: ["fa", "arrow-up-right-from-square"],
    },
  },
  app: {
    component: FontAwesomeIcon,
    props: {
      icon: ["fa", "tablet-screen-button"],
    },
  },
  pending: {
    component: FontAwesomeIcon,
    props: {
      icon: ["fa", "hourglass"],
    },
  },
  duration: {
    component: FontAwesomeIcon,
    props: {
      icon: ["fa", "hourglass-start"],
    },
  },
  play: {
    component: FontAwesomeIcon,
    props: {
      icon: ["fa", "play"],
    },
  },
  run: {
    component: FontAwesomeIcon,
    props: {
      icon: ["fa", "circle-play"],
    },
  },
  online: {
    component: FontAwesomeIcon,
    props: {
      icon: ["fa", "wifi"],
    },
  },
  offline: {
    component: FontAwesomeIcon,
    props: {
      icon: ["fa", "wifi-strong"],
    },
  },
  lock: {
    component: FontAwesomeIcon,
    props: {
      icon: ["fa", "lock"],
    },
  },
  unlock: {
    component: FontAwesomeIcon,
    props: {
      icon: ["fa", "lock-open"],
    },
  },
  save: {
    component: FontAwesomeIcon,
    props: {
      icon: ["fa", "floppy-disk"],
    },
  },
  edit: {
    component: FontAwesomeIcon,
    props: {
      icon: ["fa", "wrench"],
    },
  },
  home: {
    component: FontAwesomeIcon,
    props: {
      icon: ["fa", "home"],
    },
  },
  help: {
    component: FontAwesomeIcon,
    props: {
      icon: ["fa", "question"],
    },
  },
  date: {
    component: FontAwesomeIcon,
    props: {
      icon: ["fa", "calendar-day"],
    },
  },
  username: {
    component: FontAwesomeIcon,
    props: {
      icon: ["fa", "user-shield"],
    },
  },
  showPW: {
    component: FontAwesomeIcon,
    props: {
      icon: ["fa", "eye"],
    },
  },
  hidePW: {
    component: FontAwesomeIcon,
    props: {
      icon: ["fa", "eye-slash"],
    },
  },
  file: {
    component: FontAwesomeIcon,
    props: {
      icon: ["fa", "paperclip"],
    },
  },
  link: {
    component: FontAwesomeIcon,
    props: {
      icon: ["fa", "link"],
    },
  },
  globe: {
    component: FontAwesomeIcon,
    props: {
      icon: ["fa", "globe"],
    },
  },
  machine: {
    component: FontAwesomeIcon,
    props: {
      icon: ["fa", "computer"],
    },
  },
  key: {
    component: FontAwesomeIcon,
    props: {
      icon: ["fa", "key"],
    },
  },
  close: {
    component: FontAwesomeIcon,
    props: {
      icon: ["fa", "xmark"],
    },
  },
  console: {
    component: FontAwesomeIcon,
    props: {
      icon: ["fa", "terminal"],
    },
  },
  minimize: {
    component: FontAwesomeIcon,
    props: {
      icon: ["fa", "minus"],
    },
  },
  maximize: {
    component: FontAwesomeIcon,
    props: {
      icon: ["fa", "window-maximize"],
    },
  },
  check: {
    component: FontAwesomeIcon,
    props: {
      icon: ["fa", "check"],
    },
  },
  cancel: {
    component: FontAwesomeIcon,
    props: {
      icon: ["fa", "cancel"],
    },
  },
  administration: {
    component: FontAwesomeIcon,
    props: {
      icon: ["fa", "shield-halved"],
    },
  },
  shield: {
    component: FontAwesomeIcon,
    props: {
      icon: ["fa", "shield"],
    },
  },
  server: {
    component: FontAwesomeIcon,
    props: {
      icon: ["fa", "server"],
    },
  },
  power: {
    component: FontAwesomeIcon,
    props: {
      icon: ["fa", "power-off"],
    },
  },
  network: {
    component: FontAwesomeIcon,
    props: {
      icon: ["fa", "network-wired"],
    },
  },
  database: {
    component: FontAwesomeIcon,
    props: {
      icon: ["fa", "database"],
    },
  },
  up: {
    component: FontAwesomeIcon,
    props: {
      icon: ["fa", "arrow-up"],
    },
  },
  down: {
    component: FontAwesomeIcon,
    props: {
      icon: ["fa", "arrow-down"],
    },
  },
  trash: {
    component: FontAwesomeIcon,
    props: {
      icon: ["fa", "trash"],
    },
  },
  phone: {
    component: FontAwesomeIcon,
    props: {
      icon: ["fa", "phone"],
    },
  },
  email: {
    component: FontAwesomeIcon,
    props: {
      icon: ["fa", "envelope"],
    },
  },
};

export { fa_icons };
