import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filter' })
export class FilterPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if (!value) return null;
    if (!args) return value;
    args = args.toLowerCase();

    return value.filter(function (item: any) {
      for (let key in item) {
        if (item[key] && item[key].toString().toLowerCase().includes(args)) {
          return true;
        }
      }
      return false;
    });
  }
}
