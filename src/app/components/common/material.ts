import {
  MatButtonModule, MatCardModule, MatCheckboxModule, MatFormFieldModule, MatIconModule,
  MatInputModule, MatListModule
} from '@angular/material';
import {NgModule} from '@angular/core';

@NgModule({
  imports: [MatCardModule, MatIconModule, MatCheckboxModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatListModule],
  exports: [MatCardModule, MatIconModule, MatCheckboxModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatListModule],
})
export class MaterialModule { }
