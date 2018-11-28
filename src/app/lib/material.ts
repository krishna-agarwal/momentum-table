import {
  MatButtonModule, MatCardModule, MatCheckboxModule, MatFormFieldModule, MatIconModule,
  MatInputModule, MatListModule, MatPaginatorModule
} from '@angular/material';
import {NgModule} from '@angular/core';
import {DragDropModule} from "@angular/cdk/drag-drop";

@NgModule({
  imports: [MatCardModule, MatIconModule, MatCheckboxModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatListModule, MatPaginatorModule, DragDropModule],
  exports: [MatCardModule, MatIconModule, MatCheckboxModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatListModule, MatPaginatorModule, DragDropModule],
})
export class MaterialModule { }
