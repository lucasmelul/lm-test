import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appUppercase]'
})
export class UppercaseDirective {
  previousValue: string = '';

  constructor(public ref: ElementRef) {}

  @HostListener('input', ['$event']) onInput(event: any) {
    const newValue = event.target.value.toUpperCase();
    if (!this.previousValue || (event.target.value.length > 0 && this.previousValue !== newValue)) {
      this.previousValue = this.ref.nativeElement.value = newValue;
      const htmlEvent = document.createEvent('HTMLEvents');
      htmlEvent.initEvent('input', false, true);
      event.target.dispatchEvent(htmlEvent);
    }
  }
}
