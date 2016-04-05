import {bindable} from 'aurelia-framework';
import {inject} from 'aurelia-framework';

export class navBar {
  // allows router to be bindable from parent... magic...
  @bindable router = null;
  
  constructor() {
    // var elMenuItems = document.querySelectorAll('nav ul li ul');
    // for (var el in elMenuItems) {
    //   elMenuItems.insertBefore('<span class=\"arrow\"></span>');
    // }
    console.debug('navbar contructor');
  }
  
  mobileToggle() {
    // makes menu bars visible
    let elToggle = document.getElementsByClassName('mobile-toggle')[0];
    
    // Toggles active on nav
    document.getElementsByTagName('nav')[0].classList.toggle('active'); 
    
    // Add Arrow for submenus
    let elSubMenus = document.querySelectorAll('nav ul li ul');
    elSubMenus.forEach((el) => {
      let elSpan:HTMLSpanElement = document.createElement('span')
      elSpan.className = 'arrow';
      el.insertBefore(elSpan, el.firstChild);
    });
    
    // Rotate arrow on click of parent
    let elMenuItems = document.querySelectorAll('nav ul li')
    elMenuItems.forEach((element) => {
      if (element.hasChildNodes()) {
        // So, first we check if the object is not empty, if the object has child nodes
        var children = element.childNodes;

        for (var i = 0; i < children.length; i++) {
          if (children[i].classList.contains('arrow')) {
            children[i].toggle('rotate');
          }
        }
      }
    });
  }
  
  toggleClass(className: string) {
    this.children('ul').classList.toggle('active');
    this.children('.arrow').classList.toggle('rotate');
  }
}