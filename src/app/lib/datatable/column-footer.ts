import {
  Component, EmbeddedViewRef, forwardRef, Inject, Input, OnDestroy, OnInit,
  ViewContainerRef
} from '@angular/core';
import {DataTable} from './datatable';
import {ColumnComponent} from './columns';
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
  `,
  styles: [`
    td{
      position: relative;
    }
    tr {
      text-align: left;
      font-size: 12px;
      height: 51px;
      color: rgba(0, 0, 0, 0.54);
      border-top: 1px solid #e0e0e0;
    }
    tr:hover{
      background: #fff;
    }
    td:not(:first-child){
      padding: 0px 28px;
    }
    td:first-child{
      padding-left: 24px;
    }
    td:last-child{
      padding-right: 24px;
    }
  `]
})
export class ColumnFooterComponent {
  constructor(@Inject(forwardRef(() => DataTable)) public dt: DataTable) { };
  @Input('mColumnFooter') columns: ColumnComponent[];
}
