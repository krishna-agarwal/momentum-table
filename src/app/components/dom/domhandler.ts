import {Injectable} from '@angular/core';

@Injectable()
export class DomHandler {

  public addClass(element: any, className: string): void {
    if (element.classList)
      element.classList.add(className);
    else
      element.className += ' ' + className;
  }

  public removeClass(element: any, className: string): void {
    if (element.classList)
      element.classList.remove(className);
    else
      element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  }

  public hasClass(element: any, className: string): boolean {
    if (element.classList)
      return element.classList.contains(className);
    else
      return new RegExp('(^| )' + className + '( |$)', 'gi').test(element.className);
  }

}
