import {MatCardModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule} from '@angular/material';
import {NgModule} from '@angular/core';

@NgModule({
  imports: [MatCardModule, MatIconModule, MatCheckboxModule, MatInputModule, MatFormFieldModule],
  exports: [MatCardModule, MatIconModule, MatCheckboxModule, MatInputModule, MatFormFieldModule],
})
export class MaterialModule { }
