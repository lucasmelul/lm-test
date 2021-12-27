import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @Input() data: any = [];

  displayedColumns = ['name'];

  ngOnInit() {
    if(this.data.length && this.data.some((item: any) => item.hasOwnProperty('total')))
      this.displayedColumns.push('total')
    
    if(this.data.length && this.data.some((item: any) => item.hasOwnProperty('inFight')))
      this.displayedColumns.push('inFight')
  }

}
