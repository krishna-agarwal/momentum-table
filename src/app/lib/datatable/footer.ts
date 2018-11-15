import {
  Component,
  ContentChild,
  EmbeddedViewRef,
  forwardRef,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { DataTable } from './datatable';

@Component({
  selector: 'm-footer',
  template: ``,
})
export class Footer {
  @Input() paginator: boolean = false;
  @Input() pageSize: number = 10;
  @Input() pageSizeOptions: number[] = [5, 10, 25];
  @Input() length: number;
  @Input() pageIndex: number;
  @ContentChild(TemplateRef) template: TemplateRef<any>;

  constructor() {}
}

@Component({
  selector: 'm-globalFooterTemplateLoader',
  template: `<ng-content></ng-content>`,
})
export class GlobalFooterTemplateLoader
  implements OnInit, OnChanges, OnDestroy {
  @Input() footer: any;

  view: EmbeddedViewRef<any>;

  constructor(public viewContainer: ViewContainerRef) {}

  ngOnInit() {
    this.view = this.viewContainer.createEmbeddedView(this.footer.template, {
      $implicit: this.footer,
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.view) {
      return;
    }
  }

  ngOnDestroy() {
    this.view.destroy();
  }
}

@Component({
  selector: '[mFooter]',
  template: `
    <div *ngIf="footer.template" class="card-footer">
      <m-globalFooterTemplateLoader [footer]="footer">
        <div *ngIf="footer.paginator" class="paginator-wrapper">
          <mat-paginator (page)="dt.pageChange($event)" [length]="(footer.length != undefined) ? footer.length : dt.totalRecords" [pageIndex]="(footer.pageIndex != undefined) ? footer.pageIndex : dt.pageIndex" [pageSize]="footer.pageSize" [pageSizeOptions]="footer.pageSizeOptions"></mat-paginator>
        </div>
      </m-globalFooterTemplateLoader>
    </div>

    <div *ngIf="!footer.template" class="card-footer">
      <div *ngIf="footer.paginator" class="paginator-wrapper">
        <mat-paginator (page)="dt.pageChange($event)" [length]="(footer.length != undefined) ? footer.length : dt.totalRecords" [pageIndex]="(footer.pageIndex != undefined) ? footer.pageIndex : dt.pageIndex" [pageSize]="footer.pageSize" [pageSizeOptions]="footer.pageSizeOptions"></mat-paginator>
      </div>
    </div>
  `,
  styles: [
    `
    .card-footer{
      height: var(--card-footer-height, 56px);
      padding: var(--card-footer-padding, 0 14px 0 24px);
      border-top: 1px solid #e0e0e0;
    }
    .paginator-wrapper{
      display: inline-block;
      float: right;
    }
  `,
  ],
})
export class FooterComponent {
  @Input('mFooter') footer: Footer;
  constructor(
    @Inject(forwardRef(() => DataTable))
    public dt: DataTable,
  ) {}
}
