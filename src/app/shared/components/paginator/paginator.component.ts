import { Component, Input, Output, EventEmitter, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit, OnDestroy {
  @Input() limit: number = 5;
  @Input() total: number | null = 0;
  @Input() resetPage: Observable<void>;

  @Output() changePage: EventEmitter<any> = new EventEmitter();

  @ViewChild('paginator') paginator: any;

  private resetPageSubscription: Subscription;

  constructor() {}

  ngOnInit() {
    this.resetPageSubscription = this.resetPage.subscribe(() => this.reset());
  }

  pageClicked = ($event: any) => {
    this.changePage.emit($event);
  }

  reset = () => {
    this.paginator.firstPage();
  }

  ngOnDestroy() {
    this.resetPageSubscription.unsubscribe();
  }

}
