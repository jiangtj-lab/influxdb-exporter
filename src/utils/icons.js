import * as icons from '@element-plus/icons';

export default {
  install(app) {
    Object.keys(icons).forEach(key => {
      app.component(key, icons[key]);
    });
  }
};
