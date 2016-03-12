import {Router, RouterConfiguration} from 'aurelia-router'

export class Permissions {
  router: Router;
  
  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'Permissions Home';
    config.map([
      { route: 'permissions', name: 'permissions', moduleId: './permissions/index', nav: true, title:'Permissions' },
      { route: 'permissions/byServer', name: 'ByServer', moduleId: './permissions/byServer', nav: true, title:'Permissions by Server' }
    ]);
    
    this.router = router;
  }
}