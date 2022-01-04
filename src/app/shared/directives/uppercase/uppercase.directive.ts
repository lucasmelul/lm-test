import { Directive, ElementRef, HostListener, Renderer2, Self, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[appUppercase]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UppercaseDirective),
      multi: true,
    },
  ],
})
export class UppercaseDirective  implements ControlValueAccessor {
  _onChange: (_: any) => void;
  _touched: () => void ;

  constructor(@Self() private ref: ElementRef, private _renderer: Renderer2) {}

  @HostListener('input', ['$event']) onInput(event: any) {
    const value = this.ref.nativeElement.value.toUpperCase();
    this._renderer.setProperty(this.ref.nativeElement, 'value', value);
    this._onChange(value);
    event.preventDefault();
  }

  writeValue(value: any): void {
    this._renderer.setProperty(this.ref.nativeElement, 'value', value);
  }

  registerOnChange(fn: (_: any) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._touched = fn;
  }
}
