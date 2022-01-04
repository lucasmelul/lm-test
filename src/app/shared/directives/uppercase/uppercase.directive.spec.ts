import { UppercaseDirective } from './uppercase.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  template: `
    <form [formGroup]="form" id="form">
      <input type="text" appUppercase formControlName="inputTest">
    </form>
  `
})
class TestUppercaseComponent {
  form: FormGroup;
  constructor(formBuilder: FormBuilder){
    this.form = formBuilder.group({
      inputTest: ['']
    })
  }
}

fdescribe('UppercaseDirective', () => {
  let component: TestUppercaseComponent;
  let fixture: ComponentFixture<TestUppercaseComponent>;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [UppercaseDirective, TestUppercaseComponent],
      imports: [FormsModule, ReactiveFormsModule],
    }).createComponent(TestUppercaseComponent);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  
  it('should create component', () => {
    expect(component).toBeDefined();
  });

  it('should exist an input', async () => {
   const inputElement = fixture.debugElement.nativeElement
    .querySelector('#form')
    .querySelector('input');

    expect(inputElement).toBeTruthy();
  });

  it('should capitalize input text when the value change', async () => {
    const dataTest = 'hola';
    const inputForm: HTMLInputElement = fixture.debugElement.nativeElement
      .querySelector('#form')
      .querySelector('input');
      
    inputForm.value = dataTest
    inputForm.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable()
    const testValueFormGroup = component.form.get('inputTest');
    
    if(testValueFormGroup) {
      expect(inputForm.value).toEqual(testValueFormGroup.value);
      expect(inputForm.value).toEqual(dataTest.toUpperCase());
    }
  });
});
