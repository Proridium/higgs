import {Router, RouterConfiguration} from 'aurelia-router'

export class App {
  router: Router;
  
  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'Higgs';
    config.map([
      { route: ['','welcome'], name: 'welcome', moduleId: './pages/welcome/index', nav: true, title:'Welcome' },
      { route: 'users', name: 'users', moduleId: './pages/users/index', nav: true, title:'Users' },
      { route: 'permissions', name: 'permissions', moduleId: './pages/permissions/byServer', nav: true, title:'Permissions',
        settings: {
          subMenu: [
            { href: '#/permissions/byServer', title: 'By Server' },
            { href: '#/permissions/byApplication', title: 'By Application' }
          ]
        }
      },
      { route: 'permissions/byServer', name: 'byServer', moduleId: './pages/permissions/byServer', nav: false, title:'By Server' },
      { route: 'permissions/byApplication', name: 'byApplication', moduleId: './pages/permissions/byApplication', nav: false, title:'By Application' }
      
    ]);
    
    this.router = router;
  }
}