import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TabsetComponent } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'app-mortgage-calculator',
  templateUrl: './mortgage-calculator.component.html',
  styleUrls: ['./mortgage-calculator.component.scss']
})
export class MortgageCalculatorComponent implements OnInit {

  // City Names
  amortizationPeriod: any = [];
  paymentFrequency: any = [
    {name:'Accelerated Weekly',},
    {name:'Weekly'},
    {name:'Accelerated Bi-weekly'},
    {name:'Bi-Weekly (every 2 weeks)'},
    {name:'Semi-monthly (24x per year)'},
    {name:'Monthly (12x per year)'}
  ];
  loanTerm: any = [];
  startWithPayment: any = ['One Time', 'Each Year', 'Same as regular payment'];
  mortgageAmount: any;

  public options: any = {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Interest Payment'
    },
    xAxis: {

        categories: ['Regular Payments']
    },
    yAxis: {
        min: 0,
        tickInterval: 20,
        title: {
            text: ''
        }
    },
    tooltip: {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
        shared: true
    },
    plotOptions: {
        series: {
          pointWidth: 100
        },
        column: {
            stacking: 'percent'
        }
    },
    series: [{
        name: 'Interest Payment',
        data: []
    }, {
        name: 'Principal Payment',
        data: []
    }]
};
  paymentsTerm: any;
  paymentsAmortization: any;
  prePaymentValue: any;
  paymentTermPrincipal: any;
  paymentAmortizationPrincipal: any;
  paymentTermInterest: any;
  paymentAmortizationInterest: any;
  costTermTotal: any;
  costAmortizationTotal: any;
  paymentDiagramClick: boolean = true;
  @ViewChild('tabset') tabset!: TabsetComponent;
  

  constructor(private formBuilder: FormBuilder) { 
    this.paymentPlan = this.formBuilder.group(
      {
        mortgageAmount: [ 100000.00 , Validators.compose([Validators.required])],
        interestRate: [ 5.00, Validators.compose([Validators.required])],
        amortizationPeriod: [25 , Validators.compose([Validators.required])],
        paymentFrequency: ['Monthly (12x per year)', Validators.compose([Validators.required])],
        loanTerm: [ 1, Validators.compose([Validators.required])]
      }
    );

    this.prePaymentPlan = this.formBuilder.group(
      {
        prePaymentAmount: [ 0.00, Validators.compose([Validators.required]) ],
        prePaymentFrequency: ['One Time', Validators.compose([Validators.required])],
        startWithPayment: [1, Validators.compose([Validators.required])]
      }
    )
  }

  public paymentPlan: FormGroup;
  public prePaymentPlan: FormGroup;

  ngOnInit(): void {

    // Create the dropdown list for Amortization Period 1-25 years
    for (let index = 1; index <= 30; index++) {
      this.amortizationPeriod.push(index);
      if(index < 11){
        this.loanTerm.push(index);
      }
    }
    this.calculateMortgage();
    this.calculateGraph();
  }

  // Mortage calculation functions below
  calculateMortgage(){

    if( this.tabset){
      this.tabset.tabs[0].active = true;
    }
    
    const mortgageAmount = this.paymentPlan.get('mortgageAmount')?.value;
    const mortgageInterestRate = this.paymentPlan.get('interestRate')?.value;
    const mortgagePeriod = this.paymentPlan.get('amortizationPeriod')?.value;

    this.mortgageAmount = (mortgageAmount * (mortgageInterestRate/100/12)) *
    (Math.pow(1 + (mortgageInterestRate/100/12), (mortgagePeriod*12)))
        /
    (Math.pow(1 + (mortgageInterestRate/100/12), (mortgagePeriod*12)) - 1)

    this.mortgageAmount = this.mortgageAmount.toFixed(2);
    this.paymentsTerm = this.numberOfPaymentsTerm();
    this.paymentsAmortization = this.numberOfPaymentsAmortization();
    this.prePaymentValue = this.prePayment();
    this.paymentTermPrincipal = this.principalPaymentTerm();
    this.paymentAmortizationPrincipal = this.principalPaymentAmortization();
    this.paymentTermInterest = this.interestPaymentTerm();
    this.paymentAmortizationInterest = this.interestPaymentAmortization();
    this.costTermTotal = this.totalCostTerm();
    this.costAmortizationTotal = this.totalCostAmortization();
    this.calculateGraph();
  }

  numberOfPaymentsTerm(){
    return this.paymentPlan.controls['loanTerm'].value * 12
  }

  numberOfPaymentsAmortization(){
    return this.paymentPlan.controls['amortizationPeriod'].value * 12
  }

  prePayment(){
    return (this.prePaymentPlan.controls['prePaymentAmount'].value).toFixed(2)
  }

  principalPaymentTerm(){
    return ((this.mortgageAmount * (this.paymentPlan.controls['loanTerm'].value * 12))/3).toFixed(2)
  }

  principalPaymentAmortization(){
    return (this.paymentPlan.controls['mortgageAmount'].value).toFixed(2)
  }

  interestPaymentTerm(){
    return ((this.mortgageAmount * (this.paymentPlan.controls['loanTerm'].value * 12)) - ((this.mortgageAmount * (this.paymentPlan.controls['loanTerm'].value * 12))/3)).toFixed(2);
  }

  interestPaymentAmortization(){
    return ((this.mortgageAmount * (this.paymentPlan.controls['amortizationPeriod'].value * 12)) - this.paymentPlan.controls['mortgageAmount'].value).toFixed(2)
  }

  totalCostTerm(){
    return (this.mortgageAmount * (this.paymentPlan.controls['loanTerm'].value * 12)).toFixed(2);

  }

  totalCostAmortization(){
    return (this.mortgageAmount * (this.paymentPlan.controls['amortizationPeriod'].value * 12)).toFixed(2);
  }

  calculateGraph(){
    
  this.options.series[0].data = [this.paymentPlan.get('mortgageAmount')?.value];
  this.options.series[1].data = [Number.parseInt(this.paymentAmortizationInterest)] ;
  }




}
