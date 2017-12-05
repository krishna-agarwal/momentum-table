import {
  Component, EmbeddedViewRef, forwardRef, Inject, Input, OnDestroy, OnInit,
  ViewContainerRef
} from '@angular/core';
import {DataTable} from './datatable';
import {ColumnComponent} from './columns';

@Component({
  selector: 'm-columnHeaderTemplateLoader',
  template: ``
})
export class ColumnHeaderTemplateLoader implements OnInit, OnDestroy {

  @Input() column: any;

  view: EmbeddedViewRef<any>;

  constructor(public viewContainer: ViewContainerRef) {}

  ngOnInit() {
    this.view = this.viewContainer.createEmbeddedView(this.column.headerTemplate, {
      '\$implicit': this.column
    });
  }

  ngOnDestroy() {
    this.view.destroy();
  }
}

@Component({
  selector: '[mColumnHeader]',
  template: `
    <tr>
      <th *ngIf="dt.selectionHandler == true" class="m-checkbox-header">
        <mat-checkbox [disabled]="dt.selectionMode == 'single'" [checked]="dt.allSelected" (change)="dt.toggleRowsWithCheckbox($event)"></mat-checkbox>
      </th>
      <th [hidden]="col.hidden" *ngFor="let col of columns" (click)="dt.sort($event,col)"
          [ngClass]="[col.class ? col.class : '', col.sortable ? 'm-sortable-column': '']">
        <span *ngIf="!col.headerTemplate">{{ col.header }}</span>
        <span *ngIf="col.headerTemplate">
          <m-columnHeaderTemplateLoader [column]="col"></m-columnHeaderTemplateLoader>
        </span>
        <span class="m-sortable-column-icon material-icons" *ngIf="dt.getSortOrder(col) == -1">arrow_downward</span>
        <span class="m-sortable-column-icon material-icons" *ngIf="dt.getSortOrder(col) == 1">arrow_upward</span>
      </th>
      <th *ngIf="dt.expandable == true" style="padding-left: 0px;" class="m-expand-header">
      </th>
    </tr>
  `,
  styles: [`
    tr {
      border-top: none !important;
      text-align: left;
      font-size: 12px;
      height: 55px;
      font-weight: bold;
      color: rgba(0, 0, 0, 0.54);
    }
    tr:hover{
      background: #fff;
    }
    th:not(:first-child){
      padding: 0px 28px;
    }
    th:first-child{
      padding-left: 24px;
    }
    th:last-child{
      padding-right: 24px;
    }
    th{
      top: 0;
      position: sticky;
      background: #fff;
      z-index: 2000 !important;
    }
    .m-checkbox-header, .m-expand-header{
      width: 1%;
      white-space: nowrap;
    }
    .m-sortable-column {
      cursor: pointer;
    }

    .m-sortable-column-icon {
      font-size: 12px;
      vertical-align: middle;
    }
  `]
})
export class ColumnHeaderComponent {
  constructor(@Inject(forwardRef(() => DataTable)) public dt: DataTable) { };
  @Input('mColumnHeader') columns: ColumnComponent[];
}
