import {
  AfterContentInit, Component, ContentChildren, EventEmitter, forwardRef, HostListener, Inject, Input, NgModule, OnInit,
  Output,
  QueryList, ViewChild
} from '@angular/core';
import {ColumnComponent, SharedModule} from '../common/shared';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from '../common/material';
import {DomHandler} from '../dom/domhandler';
import {ObjectUtils} from "../util/objectutils";

@Component({
  selector: '[mColumnHeader]',
  template: `
    <tr>
      <th *ngIf="dt.selectionHandler == true" class="ui-checkbox-header">
        <mat-checkbox [disabled]="dt.selectionMode == 'single'" [checked]="dt.allSelected" (change)="dt.toggleRowsWithCheckbox($event)"></mat-checkbox>
      </th>
      <th *ngFor="let col of columns" (click)="dt.sort($event,col)" 
          [ngClass]="{'ui-sortable-column': col.sortable}">
        <span *ngIf="!col.headerTemplate">{{ col.header }}</span>
        <span *ngIf="col.headerTemplate">
          <m-columnHeaderTemplateLoader [column]="col"></m-columnHeaderTemplateLoader>
        </span>
        <span class="ui-sortable-column-icon material-icons" *ngIf="dt.getSortOrder(col) == -1">arrow_downward</span>
        <span class="ui-sortable-column-icon material-icons" *ngIf="dt.getSortOrder(col) == 1">arrow_upward</span>
      </th>
    </tr>
  `
})
export class ColumnHeaderComponent {
  constructor(@Inject(forwardRef(() => DataTable)) public dt: DataTable) { };
  @Input('mColumnHeader') columns: ColumnComponent[];
}

@Component({
  selector: '[mColumnFooter]',
  template: `
    <tr>
      <td *ngIf="dt.selectionHandler == true">
      </td>
      <td *ngFor="let col of columns">
        <span *ngIf="!col.footerTemplate">{{ col.footer }}</span>
        <span *ngIf="col.footerTemplate">
          <m-columnFooterTemplateLoader [column]="col"></m-columnFooterTemplateLoader>
        </span>
      </td>
    </tr>
  `
})
export class ColumnFooterComponent {
  constructor(@Inject(forwardRef(() => DataTable)) public dt: DataTable) { };
  @Input('mColumnFooter') columns: ColumnComponent[];
}

@Component({
  selector: '[mTableBody]',
  template: `
      <tr *ngFor="let row of value; let rowIndex = index;" (click)="dt.handleRowClick($event, row, rowIndex)" [ngClass]="[dt.isSelected(row)? 'ui-row-selected': '']">
        <td *ngIf="dt.selectionHandler == true">
          <mat-checkbox (click)="dt.selectCheckboxClick($event)" (change)="dt.toggleRowWithCheckbox($event, row)" [checked]="dt.isSelected(row)"></mat-checkbox>
        </td>
        <td *ngFor="let col of columns">
          <span *ngIf="!col.bodyTemplate">{{row[col.field]}}</span>
          <span *ngIf="col.bodyTemplate">
            <m-columnBodyTemplateLoader [column]="col" [row]="row" [rowIndex]="rowIndex"></m-columnBodyTemplateLoader>
          </span>
        </td>
      </tr>
  `
})
export class TableBodyComponent {
  constructor(@Inject(forwardRef(() => DataTable)) public dt: DataTable) { };
  @Input('mTableBody') columns: ColumnComponent[];
  @Input() value;
}

@Component({
  selector: 'm-table',
  templateUrl: './table.component.html'
})
export class DataTable implements OnInit, AfterContentInit {
  @Input() value;

  @Input() width: string = 'min-content';

  @Input() height: string = 'auto';

  @Input() defaultSortOrder: number = 1;

  @Output() onSort: EventEmitter<any> = new EventEmitter();

  @Input() selectable: boolean;

  @Input() selectionMode: string = 'single';

  @Input() selectionHandler: boolean = true;

  @Output() selectionChange: EventEmitter<any> = new EventEmitter();

  @Output() onRowClick: EventEmitter<any> = new EventEmitter();

  @Output() onRowSelect: EventEmitter<any> = new EventEmitter();

  @Output() onRowUnselect: EventEmitter<any> = new EventEmitter();

  @ContentChildren(ColumnComponent) cols: QueryList<ColumnComponent>;

  public columns: ColumnComponent[];

  public sortColumn: ColumnComponent;

  public preventRowClickPropagation: boolean;

  _sortField: string;

  _sortOrder: number = 1;

  _selection: any;

  constructor(public domHandler: DomHandler, public objectUtils: ObjectUtils) { }

  ngOnInit() {
  }

  ngAfterContentInit() {
    this.initColumns();
  }

  @Input() get sortField(): string{
    return this._sortField;
  }

  set sortField(val: string){
    this._sortField = val;
    this.sortSingle();
  }

  @Input() get sortOrder(): number {
    return this._sortOrder;
  }
  set sortOrder(val: number) {
    this._sortOrder = val;
    this.sortSingle();
  }

  @Input() get selection(): any{
    return this._selection;
  }

  set selection(val: any){
    this._selection = val;
  }

  initColumns(): void{
    this.columns = this.cols.toArray();
  };

  resolveFieldData(data: any, field: string): any {
    if(data && field) {
      if(field.indexOf('.') === -1) {
        return data[field];
      }else {
        let fields: string[] = field.split('.');
        let value = data;
        for(let i = 0, len = fields.length; i < len; ++i) {
          if (value == null) {
            return null;
          }
          value = value[fields[i]];
        }
        return value;
      }
    }
    else {
      return null;
    }
  }

  hasFooter() {
    if(this.columns) {
      for(let i = 0; i  < this.columns.length; i++) {
        if(this.columns[i].footer || this.columns[i].footerTemplate) {
          return true;
        }
      }
    }
    return false;
  };

  sort(event, column: ColumnComponent) {
    if(!column.sortable) {
      return;
    }
    const targetNode = event.target.nodeName;
    if(targetNode === 'TH' && this.domHandler.hasClass(event.target, 'ui-sortable-column') || ((targetNode === 'SPAN' || targetNode === 'DIV') && !this.domHandler.hasClass(event.target, 'ui-clickable'))){
      this.sortColumn = column;
      // todo sort logic

      const columnSortField = column.field;
      this._sortOrder = (this.sortField === columnSortField)  ? this.sortOrder * -1 : this.defaultSortOrder;
      this._sortField = columnSortField;
      this.sortColumn = column;

      this.sortSingle();

      this.onSort.emit({
        field: this.sortField,
        order: this.sortOrder
      });

    }
  };

  sortSingle(){
    if(this.value){
      this.value.sort((data1, data2) => {
        let value1 = this.resolveFieldData(data1, this.sortField);
        let value2 = this.resolveFieldData(data2, this.sortField);
        let result = null;

        if (value1 == null && value2 != null)
          result = -1;
        else if (value1 != null && value2 == null)
          result = 1;
        else if (value1 == null && value2 == null)
          result = 0;
        else if (typeof value1 === 'string' && typeof value2 === 'string')
          result = value1.localeCompare(value2);
        else
          result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

        return (this.sortOrder * result);
      });
    }
  }

  getSortOrder(column: ColumnComponent) {
    let order = 0;
    const columnSortField = column.field;
    if(this.sortField && columnSortField === this.sortField) {
      order = this.sortOrder;
    }
    return order;
  }

  handleRowClick(event: MouseEvent, rowData: any, index: number) {

    this.onRowClick.emit({originalEvent: event, data: rowData});

    const targetNode = (<HTMLElement> event.target).nodeName;

    if(targetNode === 'INPUT' || targetNode === 'BUTTON' || targetNode === 'A' || this.selectionHandler === true) {
      return;
    }

    if(this.selectable) {
      const selected = this.isSelected(rowData);
      if(this.selectionMode === 'single'){
        if(selected) {
          this._selection = null;
          this.onRowUnselect.emit({originalEvent: event, data: rowData, type: 'row'});
        }else{
          this._selection = rowData;
          this.onRowSelect.emit({originalEvent: event, data: rowData, type: 'row'});
        }
      }else if(this.selectionMode === 'multiple'){
        if(selected) {
          const selectionIndex = this.findIndexInSelection(rowData);
          this._selection = this.selection.filter((val, i) => i !== selectionIndex);
          this.onRowUnselect.emit({originalEvent: event, data: rowData, type: 'row'});
        }else {
          this._selection = [...this.selection || [], rowData];
          this.onRowSelect.emit({originalEvent: event, data: rowData, type: 'row'});
        }
      }

      this.selectionChange.emit(this.selection);
    }

  }

  toggleRowsWithCheckbox(event) {
    if(event.checked)
      this.selection = this.value.slice();
    else
      this.selection = [];

    this.selectionChange.emit(this.selection);

    // this.onHeaderCheckboxToggle.emit({originalEvent: event, checked: event.checked});
  }

  selectCheckboxClick(event) {
    event.stopPropagation();
  }

  toggleRowWithCheckbox(event, rowData: any) {
    if(this.selectionMode === 'single'){
      if(!this.objectUtils.equalsByValue(this.selection, rowData)){
        this._selection = rowData;
        this.onRowSelect.emit({originalEvent: event, data: rowData, type: 'checkbox'});
      }else {
        this._selection = null;
        this.onRowUnselect.emit({originalEvent: event, data: rowData, type: 'checkbox'});
      }
    }else if(this.selectionMode === 'multiple'){
      const selectionIndex = this.findIndexInSelection(rowData);
      this.selection = this.selection || [];

      if(selectionIndex !== -1) {
        this._selection = this.selection.filter((val, i) => i !== selectionIndex);
        this.onRowUnselect.emit({originalEvent: event, data: rowData, type: 'checkbox'});
      }else {
        this._selection = [...this.selection, rowData];
        this.onRowSelect.emit({originalEvent: event, data: rowData, type: 'checkbox'});
      }
    }

    this.selectionChange.emit(this.selection);
    // this.preventRowClickPropagation = true;
  }

  findIndexInSelection(rowData: any) {
    let index: number = -1;
    if(this.selection) {
      for(let i = 0; i  < this.selection.length; i++) {
        if(this.equals(rowData, this.selection[i])) {
          index = i;
          break;
        }
      }
    }
    return index;
  }

  equals(data1, data2) {
    return JSON.stringify(data1) === JSON.stringify(data2);
  }

  isSelected(rowData) {
    if(rowData && this.selection) {
      if(this.selection instanceof Array)
        return this.findIndexInSelection(rowData) > -1;
      else{
        return this.objectUtils.equalsByValue(rowData, this.selection);
      }
    }
    return false;
  }

  get allSelected() {
    let val = true;
    if(this.selection) {
      for(const data of this.value) {
        if(!this.isSelected(data)) {
          val = false;
          break;
        }
      }
    }else {
      val = false;
    }
    return val;
  }

}

@NgModule({
  imports: [CommonModule, MaterialModule, BrowserAnimationsModule, SharedModule],
  exports: [DataTable, ColumnHeaderComponent, ColumnFooterComponent, TableBodyComponent, SharedModule],
  providers: [DomHandler, ObjectUtils],
  declarations: [DataTable, ColumnHeaderComponent, ColumnFooterComponent,  TableBodyComponent]
})
export class TableModule { }
