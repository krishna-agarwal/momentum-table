import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  selectedRows;
  countries;
  constructor() {

  }

  ngOnInit(){

    setTimeout(() => {
      this.countries = [
        {'country': 'Afghanistan', 'capital': 'Kabul', 'continent': 'Asia', 'flag': 'http://www.sciencekids.co.nz/images/pictures/flags96/Afghanistan.jpg'},
        {'country': 'India', 'capital': 'New Delhi', 'continent': 'Asia', 'flag': 'http://www.sciencekids.co.nz/images/pictures/flags96/India.jpg'},
        {'country': 'Iraq', 'capital': 'Baghdad', 'continent': 'Asia', 'flag': 'http://www.sciencekids.co.nz/images/pictures/flags96/Iraq.jpg'},
        {'country': 'Bhutan', 'capital': 'Thimphu', 'continent': 'Asia', 'flag': 'http://www.sciencekids.co.nz/images/pictures/flags96/Bhutan.jpg'},
        {'country': 'Pakistan', 'capital': 'Islamabad', 'continent': 'Asia', 'flag': 'http://www.sciencekids.co.nz/images/pictures/flags96/Pakistan.jpg'},
        {'country': 'France', 'capital': 'Paris', 'continent': 'Europe', 'flag': 'http://www.sciencekids.co.nz/images/pictures/flags96/France.jpg'},
        {'country': 'Germany', 'capital': 'Berlin', 'continent': 'Europe', 'flag': 'http://www.sciencekids.co.nz/images/pictures/flags96/Germany.jpg'},
        {'country': 'Ireland', 'capital': 'Dublin', 'continent': 'Europe', 'flag': 'http://www.sciencekids.co.nz/images/pictures/flags96/Ireland.jpg'},
        {'country': 'Austria', 'capital': 'Vienna', 'continent': 'Europe', 'flag': 'http://www.sciencekids.co.nz/images/pictures/flags96/Austria.jpg'},
        {'country': 'Bulgaria', 'capital': 'Sofia', 'continent': 'Europe', 'flag': 'http://www.sciencekids.co.nz/images/pictures/flags96/Bulgaria.jpg'},
        {'country': 'Cuba', 'capital': 'Havana', 'continent': 'America', 'flag': 'http://www.sciencekids.co.nz/images/pictures/flags96/Cuba.jpg'},
        {'country': 'Canada', 'capital': 'Ottawa', 'continent': 'America', 'flag': 'http://www.sciencekids.co.nz/images/pictures/flags96/Canada.jpg'},
        {'country': 'Jamaica', 'capital': 'Kingston', 'continent': 'America', 'flag': 'http://www.sciencekids.co.nz/images/pictures/flags96/Jamaica.jpg'}
      ];
    }, 2000);

    setTimeout(() => {
      this.selectedRows = [{'country': 'India', 'capital': 'New Delhi', 'continent': 'Asia', 'flag': 'http://www.sciencekids.co.nz/images/pictures/flags96/India.jpg'}];
    }, 7000);

  }

  changeSort(event) {
    console.log(event);
  };

  rowClick(event) {
    console.log('click', event);
  }

  rowSelect(event) {
    console.log('select', event);
  }

  rowUnselect(event) {
    console.log('unselect', event);
  }

  onSelectionChange(event){
    console.log('selectionChange', event);
  }

  flagHeaderClick(col){
    console.log('flagHeaderClick ==>', col);
  }

  flagClicked(event, row){
    console.log('flagClicked ==>', row);
  }

  rowExpanded(event){
    console.log('expanded', event);
  }

  rowCollapse(event){
    console.log('collapse', event);
  }

  editInit(event){
    console.log('edit Init');
    console.log(event);
  }

  editComplete(event){
    console.log('edit complete')
    console.log(event);
  }

  edit(event){
    console.log('Edit');
    console.log(event);
  }

  editCancel(event){
    console.log('edit cancel');
    console.log(event);
  }

  valueChange(event){
    console.log('valueChange', event);
  }

  onFilter(val){
    console.log('filteredValue', val);
  }
}
