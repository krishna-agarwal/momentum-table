import {
  AfterViewInit, Component, ContentChild, ElementRef, EmbeddedViewRef, EventEmitter, forwardRef, Inject, Input,
  OnChanges,
  OnDestroy, OnInit, Output,
  Renderer2, SimpleChanges,
  TemplateRef,
  ViewChild, ViewContainerRef
} from '@angular/core';
import {DataTable} from './datatable';

@Component({
  selector: 'm-header',
  template: ``
})
export class Header {
  @Input() title: string;
  @Input() globalSearch: boolean = false;
  @Input() colSetting: boolean = true;
  @Input() export: boolean = false;
  @Input() csvSeparator: string = ',';
  @Input() exportFilename: string = 'download';
  @Input() exportSelectionOnly: boolean = false;
  @Input() reload: boolean = false;

  @ContentChild(TemplateRef) template: TemplateRef<any>;
  constructor(){ }
}

@Component({
  selector: 'm-globalHeaderTemplateLoader',
  template: ``
})
export class GlobalHeaderTemplateLoader implements OnInit, OnChanges, OnDestroy {

  @Input() header: any;

  view: EmbeddedViewRef<any>;

  constructor(public viewContainer: ViewContainerRef) {}

  ngOnInit() {
    this.view = this.viewContainer.createEmbeddedView(this.header.template, {
      '\$implicit': this.header
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if(!this.view) {
      return;
    }
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
          <mat-form-field class="m-search-form" [floatPlaceholder]="'never'" [ngClass]="[searchOpen ? 'search-open' : 'search-close']">
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
  `,
  styles: [`
    .table-header{
      height: 64px;
      border-bottom: 1px solid #e0e0e0;
      padding-left: 24px;
      padding-right: 14px;
      position: relative;
      display: flex;
    }
    .table-header-title{
      width: 40%;
      line-height: 64px;
      font-size: 22px;
    }
    .table-header-selection-count{
      width: 40%;
      line-height: 64px;
    }
    .tool-box{
      display: flex;
      justify-content: flex-end;
      width: 60%;
      right: 0px;
      color: #757575;
    }
    .search-setting-wrapper{
      width: 100%;
      position: relative;
    }
    .col-setting-btn{
      top: 12px;
    }
    .m-search-form{
      position: absolute !important;
      right: 0;
      -webkit-transition: width 0.2s ease-in-out;
      transition: width 0.2s ease-in-out;
      margin-top: 5px;
    }
    .col-setting-wrapper{
      position: absolute !important;
      top: 65px;
      right: 0px;
      padding: 0px !important;
      z-index: 3000;
      max-height: 250px;
      overflow: auto;
    }
    .search-icon{
      position: absolute !important;
      top: 12px !important;
      right: 0px !important;
    }
    .search-open{
      width: 100%;
    }
    .search-close{
      width: 0%;
    }
  `]
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
