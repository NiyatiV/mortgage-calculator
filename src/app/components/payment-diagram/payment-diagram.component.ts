import { Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-payment-diagram',
  templateUrl: './payment-diagram.component.html',
  styleUrls: ['./payment-diagram.component.scss']
})
export class PaymentDiagramComponent implements OnInit {

  @Input() options: any;
  constructor() { }

  ngOnInit(): void {
    Highcharts.chart('container', this.options);
  }

}
