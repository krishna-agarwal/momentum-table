import {MatCardModule, MatCheckboxModule, MatIconModule} from '@angular/material';
import {NgModule} from '@angular/core';

@NgModule({
  imports: [MatCardModule, MatIconModule, MatCheckboxModule],
  exports: [MatCardModule, MatIconModule, MatCheckboxModule],
})
export class MaterialModule { }
