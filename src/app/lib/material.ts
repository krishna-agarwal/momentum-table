import {
  MatButtonModule, MatCardModule, MatCheckboxModule, MatFormFieldModule, MatIconModule,
  MatInputModule, MatListModule, MatPaginatorModule
} from '@angular/material';
import {NgModule} from '@angular/core';

@NgModule({
  imports: [MatCardModule, MatIconModule, MatCheckboxModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatListModule, MatPaginatorModule],
  exports: [MatCardModule, MatIconModule, MatCheckboxModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatListModule, MatPaginatorModule],
})
export class MaterialModule { }
