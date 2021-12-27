import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'join'
})
export class JoinPipe implements PipeTransform {
  transform(input:Array<any>, field: string, sep = ' - '): string {
    return input && input.length ? 
      input.map(item => item[field]).join(sep) : '';
  }
}
