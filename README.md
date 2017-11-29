# MomentumTable

MomentumTable is material based rich DataTable component for Angular. It is based on [material DataTable guidline](https://material.io/guidelines/components/data-tables.html#data-tables-structure).

[Demo](https://momentum-table-demo.stackblitz.io/)
## Features
* Searching
* Sorting
* Row Selection (Single, Multi, Checkbox)
* Expandable Row
* Pagination
* Cell Templates(header, body, footer)
* Editing(inline/template)
* Empty Row templating
* Column Toggling
* Export CSV
* Card Header and Footer(with template support)

## Installation
Install MomemtumTable via [npm](https://www.npmjs.com/package/momentum-table)
```javascript
npm install momentum-table --save
```
### Dependency

MomentumTable is dependent on [angular material](https://material.angular.io/). 

If you don't have
material please refer [getting started](https://material.angular.io/guide/getting-started) guide of angular material.


## Usage

After installing from npm, include `MomentumTableModule` in your application Module.
```javascript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MomentumTableModule} from 'momentum-table';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MomentumTableModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```
**Note** : `BrowserAnimationsModule` or `NoopAnimationModule` is required.

Basic use of table in component : 
```javascript
import { Component } from '@angular/core';

@Component({
  selector: 'app',
  template: `
    <m-table [value]=countries>
    	<m-column field="country" header="Country"></m-column>
  		<m-column field="population" header="Population"></m-column>
  		<m-column field="capital" header="Capital"></m-column>
  		<m-column field="continent" header="Continent"></m-column>
    </m-table>
  `
})
export class AppComponent {
  countries = [
        {'country': 'Afghanistan', 'population': 35530081, 'capital': 'Kabul', 'continent': 'Asia'},
        {'country': 'India', 'population': 1339180127, 'capital': 'New Delhi', 'continent': 'Asia'},
        {'country': 'France', 'population': 64979548, 'capital': 'Paris', 'continent': 'Europe'},
        {'country': 'Germany', 'population': 82114224, 'capital': 'Berlin', 'continent': 'Europe'},
        {'country': 'Austria', 'population': 8735453, 'capital': 'Vienna', 'continent': 'Europe'}
      ];
}
```

For all features please follow [documentation](https://github.com/krishna-agarwal/momentum-table/wiki/Documentation)


## Documentation and Demo
[Demo](https://momentum-table-demo.stackblitz.io/)

[documentation](https://github.com/krishna-agarwal/momentum-table/wiki/Documentation)




