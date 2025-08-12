import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { VehicleFormComponent } from './vehicle-form.component';
import { DebugElement } from '@angular/core';

describe('VehicleFormComponent', () => {
  let component: VehicleFormComponent;
  let fixture: ComponentFixture<VehicleFormComponent>;
  let el: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VehicleFormComponent],
      imports: [ReactiveFormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.debugElement;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render modal header with correct title', () => {
    component.isEditMode = false;
    fixture.detectChanges();
    const header = el.query(By.css('.modal-header h2')).nativeElement;
    expect(header.textContent).toContain('Nuevo Vehículo');

    component.isEditMode = true;
    fixture.detectChanges();
    expect(header.textContent).toContain('Editar Vehículo');
  });

  it('should have a visible close button', () => {
    const closeButton = el.query(By.css('.close-button'));
    expect(closeButton).toBeTruthy();
  });

  it('should disable submit button if form is invalid', () => {
    component.form.controls['placa'].setValue('');
    component.form.controls['color'].setValue('');
    fixture.detectChanges();
    const submitBtn = el.query(By.css('button[type="submit"]')).nativeElement;
    expect(submitBtn.disabled).toBeTrue();
  });

  it('should enable submit button if form is valid', () => {
    component.form.controls['placa'].setValue('ABC1234');
    component.form.controls['color'].setValue('Red');
    component.form.controls['marca'].setValue('Toyota');
    component.form.controls['tipo_vehiculo'].setValue('particular');
    component.form.controls['conductor_id'].setValue(1);
    component.form.controls['propietario_id'].setValue(1);
    component.form.controls['estado'].setValue('activo');
    fixture.detectChanges();
    const submitBtn = el.query(By.css('button[type="submit"]')).nativeElement;
    expect(submitBtn.disabled).toBeFalse();
  });

  it('should call onCancel when cancel button is clicked', () => {
    spyOn(component, 'onCancel');
    const cancelBtn = el.query(By.css('button.btn-cancel')).nativeElement;
    cancelBtn.click();
    expect(component.onCancel).toHaveBeenCalled();
  });

  it('should call onSubmit when form is submitted', fakeAsync(() => {
    spyOn(component, 'onSubmit');
    component.form.controls['placa'].setValue('ABC1234');
    component.form.controls['color'].setValue('Red');
    component.form.controls['marca'].setValue('Toyota');
    component.form.controls['tipo_vehiculo'].setValue('particular');
    component.form.controls['conductor_id'].setValue(1);
    component.form.controls['propietario_id'].setValue(1);
    component.form.controls['estado'].setValue('activo');
    fixture.detectChanges();

    const form = el.query(By.css('form')).nativeElement;
    form.dispatchEvent(new Event('submit'));
    tick();
    expect(component.onSubmit).toHaveBeenCalled();
  }));
});
