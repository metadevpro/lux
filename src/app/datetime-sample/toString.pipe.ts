import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'toString' })
export class toString implements PipeTransform {
  transform(input: any): string {
    if (input === null) {
      return 'null';
    }
    if (input === undefined) {
      return 'undefined';
    }
    if (input instanceof Date) {
      return input.toISOString();
    }
    return input.toString();
  }
}
