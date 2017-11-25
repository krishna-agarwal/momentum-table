import {
  AfterContentInit, Component, ContentChild, ContentChildren, Directive, ElementRef, EmbeddedViewRef,
  Input, NgModule,
  OnChanges,
  OnDestroy,
  OnInit,
  QueryList, SimpleChanges,
  TemplateRef, ViewContainerRef
} from '@angular/core';
import {CommonModule} from '@angular/common';

@Directive({
  selector: '[mTemplate]'
})
export class MomentumTemplate{
  @Input('mTemplate') type: string;

  constructor(public template: TemplateRef<any>) {}

  getType(): string {
    return this.type;
  }
}

@Component({
  selector: 'm-header',
  template: ``
})
export class Header {
  @Input() title: string;
  @Input() globalSearch: boolean = false;
  @Input() colSetting: boolean = true;

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
  selector: 'm-footer',
  template: ``
})
export class Footer {
  @ContentChild(TemplateRef) template: TemplateRef<any>;

  constructor() { }
}

@Component({
  selector: 'm-globalFooterTemplateLoader',
  template: ``
})
export class GlobalFooterTemplateLoader implements OnInit, OnChanges, OnDestroy {

  @Input() footer: any;

  view: EmbeddedViewRef<any>;

  constructor(public viewContainer: ViewContainerRef) {}

  ngOnInit() {
    this.view = this.viewContainer.createEmbeddedView(this.footer.template, {
      '\$implicit': this.footer
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
  selector: 'm-column',
  template: ``
})
export class ColumnComponent implements AfterContentInit{
  @Input() field: string;
  @Input() header: string;
  @Input() footer: string;
  @Input() sortable: boolean;
  @Input() editable: boolean;
  @Input() hidden: boolean;
  @Input() frozen: boolean;

  @ContentChildren(MomentumTemplate) templates: QueryList<any>;

  public headerTemplate: TemplateRef<any>;
  public bodyTemplate: TemplateRef<any>;
  public footerTemplate: TemplateRef<any>;
  public editorTemplate: TemplateRef<any>;

  constructor() {
  }

  ngAfterContentInit(){
    this.templates.forEach((item) => {
      switch(item.getType()){
        case 'header':
          this.headerTemplate = item.template;
          break;

        case 'body':
          this.bodyTemplate = item.template;
          break;

        case 'footer':
          this.footerTemplate = item.template;
          break;

        case 'editor':
          this.editorTemplate = item.template;
          break;

        default:
          this.bodyTemplate = item.template;
          break;
      }
    })
  }
}


@Component({
  selector: 'm-columnBodyTemplateLoader',
  template: ``
})
export class ColumnBodyTemplateLoader implements OnInit, OnChanges, OnDestroy {

  @Input() column: any;

  @Input() row: any;

  @Input() rowIndex: number;

  view: EmbeddedViewRef<any>;

  constructor(public viewContainer: ViewContainerRef) {}

  ngOnInit() {
    this.view = this.viewContainer.createEmbeddedView(this.column.bodyTemplate, {
      '\$implicit': this.column,
      'row': this.row,
      'rowIndex': this.rowIndex
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if(!this.view) {
      return;
    }

    if('rowIndex' in changes) {
      this.view.context.rowIndex = changes['rowIndex'].currentValue;
    }
  }

  ngOnDestroy() {
    this.view.destroy();
  }
}

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
  selector: 'm-columnFooterTemplateLoader',
  template: ``
})
export class ColumnFooterTemplateLoader implements OnInit, OnDestroy {

  @Input() column: any;

  view: EmbeddedViewRef<any>;

  constructor(public viewContainer: ViewContainerRef) {}

  ngOnInit() {
    this.view = this.viewContainer.createEmbeddedView(this.column.footerTemplate, {
      '\$implicit': this.column
    });
  }

  ngOnDestroy() {
    this.view.destroy();
  }
}

@Component({
  selector: 'm-columnEditorTemplateLoader',
  template: ``
})
export class ColumnEditorTemplateLoader implements OnInit, OnDestroy {

  @Input() column: any;

  @Input() row: any;

  @Input() rowIndex: any;

  view: EmbeddedViewRef<any>;

  constructor(public viewContainer: ViewContainerRef) {}

  ngOnInit() {
    this.view = this.viewContainer.createEmbeddedView(this.column.editorTemplate, {
      '\$implicit': this.column,
      'row': this.row,
      'rowIndex': this.rowIndex
    });
  }

  ngOnDestroy() {
    this.view.destroy();
  }
}

@NgModule({
  imports: [CommonModule],
  exports: [ColumnComponent, MomentumTemplate, GlobalHeaderTemplateLoader, GlobalFooterTemplateLoader, Header, Footer, ColumnHeaderTemplateLoader, ColumnBodyTemplateLoader, ColumnFooterTemplateLoader, ColumnEditorTemplateLoader],
  declarations: [ColumnComponent, MomentumTemplate, GlobalHeaderTemplateLoader, GlobalFooterTemplateLoader, Header, Footer, ColumnHeaderTemplateLoader, ColumnBodyTemplateLoader, ColumnFooterTemplateLoader, ColumnEditorTemplateLoader]
})
export class SharedModule { }
