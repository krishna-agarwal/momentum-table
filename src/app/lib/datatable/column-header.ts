import {
  Component,
  EmbeddedViewRef,
  forwardRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { DataTable } from './datatable';
import { ColumnComponent } from './columns';
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";

@Component({
  selector: 'm-columnHeaderTemplateLoader',
  template: ``,
})
export class ColumnHeaderTemplateLoader implements OnInit, OnDestroy {
  @Input() column: any;

  view: EmbeddedViewRef<any>;

  constructor(public viewContainer: ViewContainerRef) {}

  ngOnInit() {
    this.view = this.viewContainer.createEmbeddedView(
      this.column.headerTemplate,
      {
        $implicit: this.column,
      },
    );
  }

  ngOnDestroy() {
    this.view.destroy();
  }
}

@Component({
  selector: '[mColumnHeader]',
  template: `
    <tr cdkDropList cdkDropListOrientation="horizontal" class="example-list" (cdkDropListDropped)="drop($event)">
      <th  *ngIf="dt.selectionHandler == true" class="m-checkbox-header">
        <div class="m-header-th m-header-th--checkbox">
          <mat-checkbox [disabled]="dt.selectionMode == 'single'" [checked]="dt.allSelected" (change)="dt.toggleRowsWithCheckbox($event)"></mat-checkbox>
        </div>
      </th>
      <th  cdkDrag cdkDragLockAxis="x" [hidden]="col.hidden" class="example-box" *ngFor="let col of columns" (click)="dt.sort($event,col)"
          [ngClass]="[col.colHeadClass ? col.colHeadClass : '', col.sortable ? 'm-sortable-column': '']">
        <div class="m-header-th">
          <span *ngIf="!col.headerTemplate">{{ col.header }}</span>
          <span *ngIf="col.headerTemplate">
            <m-columnHeaderTemplateLoader [column]="col"></m-columnHeaderTemplateLoader>
          </span>
          <span class="m-sortable-column-icon material-icons" *ngIf="dt.getSortOrder(col) == -1">arrow_downward</span>
          <span class="m-sortable-column-icon material-icons" *ngIf="dt.getSortOrder(col) == 1">arrow_upward</span>
        </div>
      </th>
      <th *ngIf="dt.expandable == true" class="m-expand-header">
      </th>
    </tr>
  `,
  styles: [
    `
    tr {
      text-align: left;
      font-size: 12px;
      height: var(--table-header-height, 55px);
      color: rgba(0, 0, 0, 0.54);
    }
    tr:hover{
      background: #fff;
    }
    th:not(:first-child){
      padding: var(--column-padding, 0 28px);
    }
    th:first-child{
      padding: var(--first-column-padding, 0 0 0 24px);
    }
    th:last-child{
      padding: var(--last-column-padding, 0 24px 0 0);
    }
    th{
      top: 0;
      background: #fff;
      z-index: 2 !important;
    }
    .m-checkbox-header, .m-expand-header{
      width: 1%;
    }
    .m-sortable-column {
      cursor: pointer;
    }

    .m-sortable-column-icon {
      font-size: 12px;
      vertical-align: middle;
    }
    .example-list {
      overflow: hidden;
    }

    .example-box {
      border-right: solid 1px #ccc;
    }

    .cdk-drag-preview {
      box-sizing: border-box;
      text-align: center;
      color: rgba(0, 0, 0, 0.54);
      font-size: 12px;
      border-radius: 2px;
      box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
      0 8px 10px 1px rgba(0, 0, 0, 0.14),
      0 3px 14px 2px rgba(0, 0, 0, 0.12);
    }

    .cdk-drag-placeholder {
      opacity: 0;
    }

    .cdk-drag-animating {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }

    .example-box:last-child {
      border: none;
    }

    .example-list.cdk-drop-list-dragging .example-box:not(.cdk-drag-placeholder) {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }
  `,
  ],
})
export class ColumnHeaderComponent {
  constructor(
    @Inject(forwardRef(() => DataTable))
    public dt: DataTable,
  ) {}
  @Input('mColumnHeader') columns: ColumnComponent[];

  drop(event: CdkDragDrop<any>) {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
  }
}
