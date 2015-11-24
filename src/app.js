//import { Users } from './view-models/users';

export class App {
  configureRouter(config, router) {
    config.title = "Higgs";
    config.map([
      { route: ['', 'home'], name: 'home',  moduleId: './pages/home/index',  nav: true, title:'Home' },
      { route: 'users',      name: 'users', moduleId: './pages/users/index', nav: true, title:'Users' },
      { route: 'about',      name: 'about', moduleId: './pages/about/index', nav: true, title:'About' }
    ]);

    this.router = router;
  }
}
