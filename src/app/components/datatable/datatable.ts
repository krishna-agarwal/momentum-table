import {
  AfterContentChecked,
  AfterContentInit, AfterViewInit, Component, ContentChild, ContentChildren, DoCheck, ElementRef,
  EmbeddedViewRef,
  EventEmitter,
  forwardRef,
  Inject, Input, IterableDiffers,
  NgModule, OnDestroy, OnInit,
  Output,
  QueryList, Renderer2, TemplateRef, ViewChild, ViewContainerRef
} from '@angular/core';
import {ColumnComponent, Footer, Header, MomentumTemplate, SharedModule} from '../common/shared';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from '../common/material';
import {DomHandler} from '../dom/domhandler';
import {ObjectUtils} from '../util/objectutils';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'm-rowExpansionLoader',
  template: ``
})
export class RowExpansionLoader implements OnInit, OnDestroy {

  @Input() template: TemplateRef<any>;

  @Input() rowData: any;

  @Input() rowIndex: any;

  view: EmbeddedViewRef<any>;

  constructor(public viewContainer: ViewContainerRef) {}

  ngOnInit() {
    this.view = this.viewContainer.createEmbeddedView(this.template, {
      '\$implicit': this.rowData,
      'rowIndex': this.rowIndex
    });
  }

  ngOnDestroy() {
    this.view.destroy();
  }
}

@Component({
  selector: 'm-emptyTableLoader',
  template: ``
})
export class EmptyTableLoader implements OnInit, OnDestroy {

  @Input() template: TemplateRef<any>;

  view: EmbeddedViewRef<any>;

  constructor(public viewContainer: ViewContainerRef) {}

  ngOnInit() {
    this.view = this.viewContainer.createEmbeddedView(this.template);
  }

  ngOnDestroy() {
    this.view.destroy();
  }
}

@Component({
  selector: '[mHeader]',
  template: `
    <div *ngIf="header.template" class="table-header">
      <m-globalHeaderTemplateLoader [header]="header"></m-globalHeaderTemplateLoader>
    </div>
    
    <div *ngIf="!header.template" class="table-header">
      <div *ngIf="header.title && !dt.itemsSelected()" class="table-header-title">{{header.title}}</div>
      <div *ngIf="dt.itemsSelected()" class="table-header-selection-count">{{dt.itemsSelected()}} item(s) selected</div>
      <div class="tool-box">
        <div class="search-setting-wrapper">
          <mat-form-field class="ui-search-form" [floatPlaceholder]="'never'" [ngClass]="[searchOpen ? 'search-open' : 'search-close']">
            <input matInput #globalFilterField placeholder="Search..." *ngIf="header.globalSearch">
          </mat-form-field>
          <button mat-icon-button *ngIf="!searchOpen" class="search-icon" (click)="toggleSearch(true)">
            <mat-icon class="mat-24" aria-label="Example icon-button with a heart icon">search</mat-icon>
          </button>
          <button mat-icon-button *ngIf="searchOpen" class="search-icon" (click)="toggleSearch(false)">
            <mat-icon class="mat-24" aria-label="Example icon-button with a heart icon">clear</mat-icon>
          </button>
        </div>
          
        <button mat-icon-button *ngIf="header.colSetting" class="col-setting-btn" (click)="openColSetting()">
          <mat-icon class="mat-24" aria-label="column">view_column</mat-icon>
        </button>
        <mat-card class="col-setting-wrapper" *ngIf="colSettingOpen" (click)="$event.stopPropagation()">
          <mat-selection-list>
            <mat-list-option [selected]="!col.hidden" [value]="col.header" (click)="toggleColumn(col)" checkboxPosition="'before'" *ngFor="let col of dt.columns">
              {{col.header}}
            </mat-list-option>
          </mat-selection-list>
        </mat-card>

        <button mat-icon-button *ngIf="header.export" class="col-setting-btn"  (click)="dt.exportCSV(header.csvSeparator, header.exportFilename, header.exportSelectionOnly)">
          <mat-icon class="mat-24" aria-label="download">file_download</mat-icon>
        </button>
        
        <button mat-icon-button *ngIf="header.reload" class="col-setting-btn" (click)="dt.reload()">
          <mat-icon class="mat-24" aria-label="refresh">refresh</mat-icon>
        </button>
      </div>
      
    </div>
  `
})
export class HeaderComponent implements AfterViewInit, OnDestroy{
  @Input('mHeader') header: Header;

  @Output() filterChange: EventEmitter<string> = new EventEmitter();

  @ViewChild('globalFilterField') globalFilterField: ElementRef;

  searchOpen = false;
  colSettingOpen = false;

  globalFilterFunction: any;

  documentEditListener: Function;

  colToggleClick: boolean = false;

  constructor(@Inject(forwardRef(() => DataTable)) public dt: DataTable, public renderer: Renderer2) { };

  ngAfterViewInit(){
    if(this.globalFilterField){
      this.globalFilterFunction = this.renderer.listen(this.globalFilterField.nativeElement, 'keyup', () => {
        this.filterChange.emit(this.globalFilterField.nativeElement.value);
      });
    }
  }

  toggleSearch(state: boolean){
    if(!state){
      this.globalFilterField.nativeElement.value = '';
      this.filterChange.emit('');
    }else {
      this.globalFilterField.nativeElement.focus();
    }
    this.searchOpen = state;
  }

  openColSetting() {
    this.colSettingOpen = true;
    this.colToggleClick = true;
    this.bindDocumentEditListener();
  }

  closeColSetting() {
    this.colSettingOpen = false;
    if(!this.colToggleClick)
      this.unbindDocumentEditListener();
  }

  toggleColumn(col) {
    col.hidden = !col.hidden;
  }

  bindDocumentEditListener() {
    if(!this.documentEditListener) {
      this.documentEditListener = this.renderer.listen('document', 'click', (event) => {
        this.closeColSetting();
      });
    }
    setTimeout(() => {
      this.colSettingOpen = true;
      this.colToggleClick = false;
    }, 0);
  }

  unbindDocumentEditListener() {
    if(this.documentEditListener) {
      this.documentEditListener();
      this.documentEditListener = null;
    }
  }

  ngOnDestroy(){
    if(this.globalFilterFunction) {
      this.globalFilterFunction();
    }

    this.unbindDocumentEditListener();
  }

}

@Component({
  selector: '[mFooter]',
  template: `
    <div *ngIf="footer.template" class="table-footer">
      <m-globalFooterTemplateLoader [footer]="footer"></m-globalFooterTemplateLoader>
    </div>
    
    <div *ngIf="!footer.template" class="table-footer">
      <div *ngIf="footer.paginator">
        <mat-paginator (page)="dt.pageChange($event)" [length]="dt.totalRecords" [pageIndex]="dt.pageIndex" [pageSize]="footer.pageSize" [pageSizeOptions]="footer.pageSizeOptions"></mat-paginator>
      </div>
    </div>
  `
})
export class FooterComponent {
  @Input('mFooter') footer: Footer;
  constructor(@Inject(forwardRef(() => DataTable)) public dt: DataTable) { };
}

@Component({
  selector: '[mColumnHeader]',
  template: `
    <tr>
      <th *ngIf="dt.selectionHandler == true" class="ui-checkbox-header">
        <mat-checkbox [disabled]="dt.selectionMode == 'single'" [checked]="dt.allSelected" (change)="dt.toggleRowsWithCheckbox($event)"></mat-checkbox>
      </th>
      <th [hidden]="col.hidden" *ngFor="let col of columns" (click)="dt.sort($event,col)" 
          [ngClass]="{'ui-sortable-column': col.sortable}">
        <span *ngIf="!col.headerTemplate">{{ col.header }}</span>
        <span *ngIf="col.headerTemplate">
          <m-columnHeaderTemplateLoader [column]="col"></m-columnHeaderTemplateLoader>
        </span>
        <span class="ui-sortable-column-icon material-icons" *ngIf="dt.getSortOrder(col) == -1">arrow_downward</span>
        <span class="ui-sortable-column-icon material-icons" *ngIf="dt.getSortOrder(col) == 1">arrow_upward</span>
      </th>
      <th *ngIf="dt.expandable == true" style="padding-left: 0px;" class="ui-expand-header">
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
      <td [hidden]="col.hidden" *ngFor="let col of columns">
        <span *ngIf="!col.footerTemplate">{{ col.footer }}</span>
        <span *ngIf="col.footerTemplate">
          <m-columnFooterTemplateLoader [column]="col"></m-columnFooterTemplateLoader>
        </span>
      </td>
      <td *ngIf="dt.expandable == true" style="padding-left: 0px;">
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
    <ng-template ngFor let-row [ngForOf]="value" let-even="even" let-odd="odd" let-rowIndex="index">
      <tr (click)="dt.handleRowClick($event, row, rowIndex)" [ngClass]="[dt.isSelected(row)? 'ui-row-selected': '']">
        <td *ngIf="dt.selectionHandler == true">
          <mat-checkbox (click)="dt.selectCheckboxClick($event)" (change)="dt.toggleRowWithCheckbox($event, row)" [checked]="dt.isSelected(row)"></mat-checkbox>
        </td>
        <td #cell [hidden]="col.hidden" *ngFor="let col of columns" [ngClass]="{'ui-editable-column':col.editable, 'ui-clickable':col.editable}" (click)="dt.switchCellToEditMode(cell,col,row)">
          <span class="ui-cell-data" *ngIf="!col.bodyTemplate" [ngClass]="{'ui-clickable':col.editable}">{{row[col.field]}}</span>
          <span class="ui-cell-data" *ngIf="col.bodyTemplate">
            <m-columnBodyTemplateLoader [column]="col" [row]="row" [rowIndex]="rowIndex"></m-columnBodyTemplateLoader>
          </span>
          <div class="ui-cell-editor" (click)="$event.stopPropagation()" *ngIf="col.editable">
            <mat-card matInput class="ui-input-card" *ngIf="!col.editorTemplate">
              <mat-form-field [floatPlaceholder]="'never'" class="ui-input-form">
                <input matInput placeholder="{{col.header}}" [(ngModel)]="row[col.field]" (change)="dt.onCellEditorChange($event, col, row, rowIndex)" 
                       (keydown)="dt.onCellEditorKeydown($event, col, row, rowIndex)" (blur)="dt.onCellEditorBlur($event, col, row, rowIndex)"
                       (input)="dt.onCellEditorInput($event, col, row, rowIndex)">
              </mat-form-field>
            </mat-card>
            <m-columnEditorTemplateLoader *ngIf="col.editorTemplate" (click)="$event.stopPropagation()" [column]="col" [row]="row" [rowIndex]="rowIndex"></m-columnEditorTemplateLoader>
          </div>
        </td>
        <td *ngIf="dt.expandable == true" style="padding-left: 0px;">
          <span class="ui-expand-icon material-icons" (click)="dt.toggleRow(row, $event)">
            <i class="material-icons ui-clickable" *ngIf="!dt.isRowExpanded(row)">keyboard_arrow_right</i>
            <i class="material-icons ui-clickable" *ngIf="dt.isRowExpanded(row)">keyboard_arrow_down</i>
          </span>
        </td>
      </tr>
      <tr *ngIf="dt.expandable && dt.isRowExpanded(row)" class="ui-expanded-row-content">
        <td [attr.colspan]="dt.totalColumns()">
          <m-rowExpansionLoader [rowData]="row" [rowIndex]="rowIndex" [template]="dt.expansionTemplate"></m-rowExpansionLoader>
        </td>
      </tr>
    </ng-template>
    
    <tr *ngIf="dt.isEmpty()" class="ui-empty-row">
      <td [attr.colspan]="dt.totalColumns()">
        <m-emptyTableLoader [template]="dt.emptyTableTemplate"></m-emptyTableLoader>
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
  template: `
    <mat-card [ngClass]="{'ui-datatable ui-widget':true}" [ngStyle]="{'width': width, 'height': height}" class="card-wrapper">
      <div *ngIf="header" [mHeader]="header" (filterChange)="filterChange($event)"></div>
      <div class="table-container">
        <table>
          <thead [mColumnHeader]="columns"></thead>
          <tfoot [mColumnFooter]="columns" *ngIf="hasFooter()"></tfoot>
          <tbody [mTableBody]="columns" [value]="dataToRender"></tbody>
        </table>
      </div>
      <div *ngIf="footer" [mFooter]="footer"></div>
    </mat-card>
  `,
  providers: [DomHandler, ObjectUtils]
})
export class DataTable implements OnInit, AfterContentInit, AfterViewInit, OnDestroy, DoCheck, AfterContentChecked {

  @Input() width: string = '100%';

  @Input() height: string = 'auto';

  @Input() defaultSortOrder: number = 1;

  @Output() onSort: EventEmitter<any> = new EventEmitter();

  @Input() selectable: boolean;

  @Input() selectionMode: string = 'multiple';

  @Input() selectionHandler: boolean = true;

  @Output() selectionChange: EventEmitter<any> = new EventEmitter();

  @Output() onRowClick: EventEmitter<any> = new EventEmitter();

  @Output() onRowSelect: EventEmitter<any> = new EventEmitter();

  @Output() onRowUnselect: EventEmitter<any> = new EventEmitter();

  @Input() expandable: boolean = false;

  @Input() expandedRows: any[];

  @Input() expandMultiple: boolean = true;

  @Output() onRowExpand: EventEmitter<any> = new EventEmitter();

  @Output() onRowCollapse: EventEmitter<any> = new EventEmitter();

  @Output() onEditInit: EventEmitter<any> = new EventEmitter();

  @Output() onEditComplete: EventEmitter<any> = new EventEmitter();

  @Output() onEdit: EventEmitter<any> = new EventEmitter();

  @Output() onEditCancel: EventEmitter<any> = new EventEmitter();

  @Output() valueChange: EventEmitter<any[]> = new EventEmitter<any[]>();

  @Output() onFilter: EventEmitter<any> = new EventEmitter();

  @Output() onReload: EventEmitter<string> = new EventEmitter();

  @Output() onPage: EventEmitter<any> = new EventEmitter();

  @ContentChildren(ColumnComponent) cols: QueryList<ColumnComponent>;

  @ContentChildren(MomentumTemplate) templates: QueryList<MomentumTemplate>;

  @ContentChild(Header) header;

  @ContentChild(Footer) footer;

  public _value: any[];

  public totalRecords: number = 0;

  public pageIndex: number = 0;

  public filteredValue: any[];

  public dataToRender: any[];

  public columns: ColumnComponent[];

  public sortColumn: ColumnComponent;

  public preventRowClickPropagation: boolean;

  public expansionTemplate: TemplateRef<any>;

  public emptyTableTemplate: TemplateRef<any>;

  public editorClick: boolean;

  public editingCell: any;

  public documentEditListener: Function;

  _sortField: string;

  _sortOrder: number = 1;

  _selection: any;

  editChanged: boolean;

  globalFilterString: string;

  filterTimeout: any;

  differ: any;

  constructor(public domHandler: DomHandler, public objectUtils: ObjectUtils, public renderer: Renderer2, public differs: IterableDiffers) {
    this.differ = differs.find([]).create(null);
  }

  ngOnInit() {
  }

  ngAfterContentInit() {
    this.initColumns();

    this.templates.forEach((item) => {
      switch(item.getType()) {
        case 'expansion':
          this.expansionTemplate = item.template;
          break;
        case 'emptyTable':
          this.emptyTableTemplate = item.template;
          break;
      }
    });
  }

  ngAfterViewInit() {

  }

  filterChange(val: string){
    this.globalFilterString = val;
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }
    this.filterTimeout = setTimeout(() => {
      this._filter();
      this.filterTimeout = null;
    }, 300);
  }

  @Input() get value(): any[] {
    return this._value;
  }

  set value(val:any[]) {
    this._value = val;

    this.valueChange.emit(this.value);
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

  ngDoCheck() {

  }

  ngAfterContentChecked() {
    let changes = this.differ.diff(this.value);
    if(changes) {
      this.handleDataChange();
    }
  }

  handleDataChange() {
    if(this.hasFilter()) {
      this._filter();
    }

    if(this.sortField) {
      if(!this.sortColumn && this.columns) {
        this.sortColumn = this.columns.find(col => col.field === this.sortField);
      }
      this.sortSingle();
    }

    this.updateDataToRender(this.filteredValue || this.value);
  }

  pageChange(pageData){
    this.footer.pageSize = pageData.pageSize;
    this.updateDataToRender(this.filteredValue || this.value, pageData.pageIndex, pageData.pageSize);
    this.onPage.emit(pageData);
  }

  updateDataToRender(dataSource, pageIndex: number = 0, pageSize: number = this.footer ? this.footer.pageSize : 0) {
    this.totalRecords = dataSource.length;
    this.pageIndex = pageIndex;

    if(this.footer && this.footer.paginator){
      this.dataToRender = [];
      const startIndex: number = pageIndex * pageSize;
      const endIndex: number = startIndex + pageSize;

      for(let i = startIndex; i < endIndex; i++) {
        if(i >= dataSource.length) {
          break;
        }
        this.dataToRender.push(dataSource[i]);
      }
    }else{
      this.dataToRender = dataSource;
    }
  }

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

  visibleColumns() {
    return this.columns ? this.columns.filter(c => !c.hidden): [];
  }

  totalColumns() {
    return this.visibleColumns().length + (this.expandable ? 1: 0) + (this.selectionHandler ? 1 : 0);
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

  isEmpty() {
    return !this.dataToRender||(this.dataToRender.length == 0);
  }

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

      // if(this.hasFilter()) {
      //   this._filter();
      // }
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

    const targetNode = (<HTMLElement> event.target).nodeName;

    if(targetNode === 'INPUT' || targetNode === 'BUTTON' || targetNode === 'A' || (this.domHandler.hasClass(event.target, 'ui-clickable'))) {
      return;
    }

    this.onRowClick.emit({originalEvent: event, data: rowData});

    if(this.selectionHandler === true)
      return;

    if(this.selectable) {
      const selected = this.isSelected(rowData);
      if(this.selectionMode === 'single'){
        if(selected) {
          this._selection = [];
          this.onRowUnselect.emit({originalEvent: event, data: rowData, type: 'row'});
        }else{
          this._selection = [rowData];
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
      if(!this.objectUtils.equalsByValue(this.selection, [rowData])){
        this._selection = [rowData];
        this.onRowSelect.emit({originalEvent: event, data: rowData, type: 'checkbox'});
      }else {
        this._selection = [];
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
    }
    return false;
  }

  itemsSelected(){
    if(this.selection instanceof Array)
      return this.selection.length;
    else{
      return 0;
    }
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

  toggleRow(row: any, event?: Event) {
    if(!this.expandedRows) {
      this.expandedRows = [];
    }

    let expandedRowIndex = this.findExpandedRowIndex(row);

    if(expandedRowIndex != -1) {
      this.expandedRows.splice(expandedRowIndex, 1);
      this.onRowCollapse.emit({
        originalEvent: event,
        data: row
      });
    }else {
      if(!this.expandMultiple) {
        this.expandedRows = [];
      }

      this.expandedRows.push(row);
      this.onRowExpand.emit({
        originalEvent: event,
        data: row
      });
    }

    if(event) {
      event.preventDefault();
    }
  }

  findExpandedRowIndex(row: any): number {
    let index = -1;
    if(this.expandedRows) {
      for(let i = 0; i < this.expandedRows.length; i++) {
        if(this.expandedRows[i] == row) {
          index = i;
          break;
        }
      }
    }
    return index;
  }

  isRowExpanded(row: any): boolean {
    return this.findExpandedRowIndex(row) != -1;
  }

  findCell(element) {
    if(element) {
      let cell = element;
      while(cell && cell.tagName != 'TD') {
        cell = cell.parentElement;
      }

      return cell;
    }
    else {
      return null;
    }
  }

  switchCellToEditMode(cell: any, column: ColumnComponent, rowData: any) {
    if(column.editable && !this.editorClick){
      this.editorClick = true;
      this.bindDocumentEditListener();

      if(cell != this.editingCell) {
        if(this.editingCell && this.domHandler.find(this.editingCell, '.ng-invalid.ng-dirty').length == 0) {
          this.domHandler.removeClass(this.editingCell, 'ui-cell-editing');
        }

        this.editingCell = cell;
        this.onEditInit.emit({column: column, data: rowData});
        this.domHandler.addClass(cell, 'ui-cell-editing');
        let focusable = this.domHandler.findSingle(cell, '.ui-cell-editor input');
        if(focusable) {
          setTimeout(() => this.domHandler.invokeElementMethod(focusable, 'focus'), 50);
        }
      }

    }
  }

  switchCellToViewMode(element: any) {
    this.editingCell = null;
    let cell = this.findCell(element);
    this.domHandler.removeClass(cell, 'ui-cell-editing');
    this.unbindDocumentEditListener();
  }

  closeCell() {
    if(this.editingCell) {
      this.domHandler.removeClass(this.editingCell, 'ui-cell-editing');
      this.editingCell = null;
      this.unbindDocumentEditListener();
    }
  }

  bindDocumentEditListener() {
    if(!this.documentEditListener) {
      this.documentEditListener = this.renderer.listen('document', 'click', (event) => {
        if(!this.editorClick) {
          this.closeCell();
        }
        this.editorClick = false;
      });
    }
  }

  unbindDocumentEditListener() {
    if(this.documentEditListener) {
      this.documentEditListener();
      this.documentEditListener = null;
    }
  }

  onCellEditorKeydown(event, column: ColumnComponent, rowData: any, rowIndex: number) {
    if(column.editable) {
      //enter
      if(event.keyCode == 13) {
        if(this.domHandler.find(this.editingCell, '.ng-invalid.ng-dirty').length == 0) {
          this.switchCellToViewMode(event.target);
          event.preventDefault();
        }
      }

      //escape
      else if(event.keyCode == 27) {
        this.switchCellToViewMode(event.target);
        event.preventDefault();
      }

    }
  }

  onCellEditorInput(event, column: ColumnComponent, rowData: any, rowIndex: number) {
    if(column.editable) {
      this.onEdit.emit({originalEvent: event, column: column, data: rowData, index: rowIndex});
    }
  }

  onCellEditorChange(event, column: ColumnComponent, rowData: any, rowIndex: number) {
    if(column.editable) {
      this.editChanged = true;

      this.onEditComplete.emit({column: column, data: rowData, index: rowIndex});
    }
  }

  onCellEditorBlur(event, column: ColumnComponent, rowData: any, rowIndex: number) {
    if(column.editable) {
      if(this.editChanged)
        this.editChanged = false;
      else
        this.onEditCancel.emit({column: column, data: rowData, index: rowIndex});

      // this.closeCell();
    }
  }

  _filter() {
    if(!this.value || !this.columns) {
      return;
    }

    this.filteredValue = [];

    for(let i = 0; i < this.value.length; i++) {
      let globalMatch = false;

      for(let j = 0; j < this.columns.length; j++) {
        let col = this.columns[j];

        if(this.header.globalSearch && !globalMatch) {
          globalMatch = this.filterContains(this.resolveFieldData(this.value[i], col.field), this.globalFilterString);
        }
      }

      if(globalMatch) {
        this.filteredValue.push(this.value[i]);
      }
    }

    if(this.filteredValue.length === this.value.length) {
      this.filteredValue = null;
    }

    this.updateDataToRender(this.filteredValue || this.value);

    this.onFilter.emit({
        filterQuery: this.globalFilterString,
        filteredValue: this.filteredValue || this.value
    });
  }

  filterContains(value, filter): boolean {
    if(filter === undefined || filter === null || (typeof filter === 'string' && filter.trim() === '')) {
      return true;
    }

    if(value === undefined || value === null) {
      return false;
    }

    return value.toString().toLowerCase().indexOf(filter.toLowerCase()) !== -1;
  }

  hasFilter() {
    return (this.globalFilterString && this.globalFilterString.trim().length);
  }

  public reload(){
    this.onReload.emit();
  }

  public exportCSV(csvSeparator: string, exportFilename: string, selectionOnly: boolean) {
    let data = this.filteredValue||this.value;
    let csv = '\ufeff';

    if(selectionOnly) {
      data = [];
      if(this.filteredValue){
        if(this.selection && this.selection instanceof Array)
          this.selection.forEach((selectedRow) => {
            if(this.filteredValue.indexOf(selectedRow) !== -1)
              data.push(selectedRow);
          });
      }else{
        if(this.selection && this.selection instanceof Array)
          data = this.selection;
      }
    }

    //headers
    for(let i = 0; i < this.columns.length; i++) {
      if(this.columns[i].field) {
        csv += '"' + (this.columns[i].header || this.columns[i].field) + '"';

        if(i < (this.columns.length - 1)) {
          csv += csvSeparator;
        }
      }
    }

    //body
    data.forEach((record, i) => {
      csv += '\n';
      for(let i = 0; i < this.columns.length; i++) {
        if(this.columns[i].field) {
          csv += '"' + this.resolveFieldData(record, this.columns[i].field) + '"';

          if(i < (this.columns.length - 1)) {
            csv += csvSeparator;
          }
        }
      }
    });

    let blob = new Blob([csv],{
      type: 'text/csv;charset=utf-8;'
    });

    if(window.navigator.msSaveOrOpenBlob) {
      navigator.msSaveOrOpenBlob(blob, exportFilename + '.csv');
    }
    else {
      let link = document.createElement('a');
      link.style.display = 'none';
      document.body.appendChild(link);
      if(link.download !== undefined) {
        link.setAttribute('href', URL.createObjectURL(blob));
        link.setAttribute('download', exportFilename + '.csv');
        link.click();
      }
      else {
        csv = 'data:text/csv;charset=utf-8,' + csv;
        window.open(encodeURI(csv));
      }
      document.body.removeChild(link);
    }
  }

  ngOnDestroy(){

  }

}

@NgModule({
  imports: [CommonModule, MaterialModule, BrowserAnimationsModule, SharedModule, FormsModule],
  exports: [DataTable, SharedModule],
  declarations: [DataTable, HeaderComponent, FooterComponent, ColumnHeaderComponent, ColumnFooterComponent,  TableBodyComponent, EmptyTableLoader, RowExpansionLoader]
})
export class TableModule { }
