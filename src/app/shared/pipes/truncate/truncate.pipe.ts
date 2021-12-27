import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
  transform(input:string, limit: number): string {
    return input && input.length > limit ? `${input.slice(0, limit)}...` : input
  }
}
