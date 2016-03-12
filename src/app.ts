import {Router, RouterConfiguration} from 'aurelia-router'

export class App {
  router: Router;
  
  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'Aurelia';
    config.map([
      { route: ['','welcome'], name: 'welcome', moduleId: './welcome', nav: true, title:'Welcome' },
      { route: 'users', name: 'users/index', moduleId: './users/index', nav: true, title:'Users' },
      { route: 'permissions', name: 'permissions/index', moduleId: './permissions/index', nav: true, title:'Permissions' }
    ]);
    
    this.router = router;
  }
}