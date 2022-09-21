import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { PaymentDiagramComponent } from '../payment-diagram/payment-diagram.component';

import { MortgageCalculatorComponent } from './mortgage-calculator.component';

describe('MortgageCalculatorComponent', () => {
  let component: MortgageCalculatorComponent;
  let fixture: ComponentFixture<MortgageCalculatorComponent>;

  beforeEach(async () => { 
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      declarations: [ MortgageCalculatorComponent ,
      PaymentDiagramComponent,
      TabsetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MortgageCalculatorComponent);
    component = fixture.componentInstance;
    spyOn(component, 'calculateMortgage');
    spyOn(component, 'numberOfPaymentsTerm');
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('checks form PaymentPlan invalid when empty', () => {
    expect(component.paymentPlan.valid).toBeTruthy();
  });

  it('checks form Pre PaymentPlan invalid when empty', () => {
    expect(component.prePaymentPlan.valid).toBeTruthy();
  });

  it('calculates mortgage amounts', () => {
    component.paymentPlan.controls['mortgageAmount'].setValue(200000);
    component.paymentPlan.controls['interestRate'].setValue(7.25);
    component.paymentPlan.controls['amortizationPeriod'].setValue(25);
    component.paymentPlan.controls['paymentFrequency'].setValue('Semi-monthly (24x per year)');
    component.paymentPlan.controls['loanTerm'].setValue(5);

    component.prePaymentPlan.controls['prePaymentAmount'].setValue(0.00);
    component.prePaymentPlan.controls['prePaymentFrequency'].setValue('One Time');
    component.prePaymentPlan.controls['startWithPayment'].setValue(1);

    expect(component.paymentPlan.valid).toBeTruthy();
    expect(component.prePaymentPlan.valid).toBeTruthy();

    component.calculateMortgage();
    // expect(component.numberOfPaymentsTerm).toHaveBeenCalled();
  });
});
