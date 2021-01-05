import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DataTable} from "./lib/datatable/datatable";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  selectedRows;
  countries;
  emptyMsg: string = 'loading...';
  pageIndex: number = 0;
  totalRecord: number = 13;

  @ViewChild(DataTable)
  table: DataTable;
  constructor() {}

  ngOnInit() {
    setTimeout( () => {
      this.countries = [
        {'country': 'Afghanistan', 'selectable': false, 'population': 35530081, 'capital': 'Kabul', 'continent': 'Asia', 'flag': 'http://www.sciencekids.co.nz/images/pictures/flags96/Afghanistan.jpg'},
        {'country': 'India', 'population': 1339180127, 'capital': 'New Delhi', 'continent': 'Asia', 'flag': 'http://www.sciencekids.co.nz/images/pictures/flags96/India.jpg'},
        {'country': 'Iraq', 'population': 38274618, 'capital': 'Baghdad', 'continent': 'Asia', 'flag': 'http://www.sciencekids.co.nz/images/pictures/flags96/Iraq.jpg'},
        {'country': 'Bhutan', 'population': 807610, 'capital': 'Thimphu', 'continent': 'Asia', 'flag': 'http://www.sciencekids.co.nz/images/pictures/flags96/Bhutan.jpg'},
        {'country': 'Pakistan', 'population': 197015955, 'capital': 'Islamabad', 'continent': 'Asia', 'flag': 'http://www.sciencekids.co.nz/images/pictures/flags96/Pakistan.jpg'},
        {'country': 'France', 'population': 64979548, 'capital': 'Paris', 'continent': 'Europe', 'flag': 'http://www.sciencekids.co.nz/images/pictures/flags96/France.jpg'},
        {'country': 'Germany', 'population': 82114224, 'capital': 'Berlin', 'continent': 'Europe', 'flag': 'http://www.sciencekids.co.nz/images/pictures/flags96/Germany.jpg'},
        {'country': 'Ireland', 'population': 4761657, 'capital': 'Dublin', 'continent': 'Europe', 'flag': 'http://www.sciencekids.co.nz/images/pictures/flags96/Ireland.jpg'},
        {'country': 'Austria', 'selectable': true, 'population': 8735453, 'capital': 'Vienna', 'continent': 'Europe', 'flag': 'http://www.sciencekids.co.nz/images/pictures/flags96/Austria.jpg'},
        {'country': 'Bulgaria', 'population': 7084571, 'capital': 'Sofia', 'continent': 'Europe', 'flag': 'http://www.sciencekids.co.nz/images/pictures/flags96/Bulgaria.jpg'},
        {'country': 'Cuba', 'population': 11484636, 'capital': 'Havana', 'continent': 'America', 'flag': 'http://www.sciencekids.co.nz/images/pictures/flags96/Cuba.jpg'},
        {'country': 'Canada', 'population': 36624199, 'capital': 'Ottawa', 'continent': 'America', 'flag': 'http://www.sciencekids.co.nz/images/pictures/flags96/Canada.jpg'},
        {'country': 'Jamaica', 'population': 2890299, 'capital': 'Kingston', 'continent': 'America', 'flag': 'http://www.sciencekids.co.nz/images/pictures/flags96/Jamaica.jpg'}
      ];
     }, 2000);

  }

  changeSort(event) {
    // console.log('sort', event);
    // this.countries = [];
    // this.emptyMsg = 'Loading...';
    // setTimeout( () => {
    //   this.countries = [
    //     {'country': 'Afghanistan', 'population': 35530081, 'capital': 'Kabul', 'continent': 'Asia', 'flag': 'http://www.sciencekids.co.nz/images/pictures/flags96/Afghanistan.jpg'},
    //     {'country': 'India', 'population': 1339180127, 'capital': 'New Delhi', 'continent': 'Asia', 'flag': 'http://www.sciencekids.co.nz/images/pictures/flags96/India.jpg'},
    //     {'country': 'Iraq', 'population': 38274618, 'capital': 'Baghdad', 'continent': 'Asia', 'flag': 'http://www.sciencekids.co.nz/images/pictures/flags96/Iraq.jpg'},
    //   ];
    // }, 2000);
  }

  ngAfterViewInit() {
    // for fix headers
    // this.table.fixHeader(window, 0);
  }

  onColDelete(event) {
    console.log(event);
  }

  onColReset(event) {
    console.log(event);
  }

  rowClick(event) {
    console.log('click', event);
  }

  allRowTest(event) {
    console.log('@@@@@@', event);
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
    console.log('filter change', val);
    if(!val.length)
      this.emptyMsg = 'No data found';
    else
      this.emptyMsg = '';

    this.pageIndex = 0
  }

  tableReload(){
    console.log('reload logic');
  }

  onPage(val){
    console.log('pagechange', val);

    // this.countries = [];
    // this.emptyMsg = 'Loading...';
    // setTimeout( () => {
    //   this.countries = [
    //     {'country': 'France', 'population': 64979548, 'capital': 'Paris', 'continent': 'Europe', 'flag': 'http://www.sciencekids.co.nz/images/pictures/flags96/France.jpg'},
    //     {'country': 'Germany', 'population': 82114224, 'capital': 'Berlin', 'continent': 'Europe', 'flag': 'http://www.sciencekids.co.nz/images/pictures/flags96/Germany.jpg'},
    //     {'country': 'Ireland', 'population': 4761657, 'capital': 'Dublin', 'continent': 'Europe', 'flag': 'http://www.sciencekids.co.nz/images/pictures/flags96/Ireland.jpg'},
    //     {'country': 'Austria', 'population': 8735453, 'capital': 'Vienna', 'continent': 'Europe', 'flag': 'http://www.sciencekids.co.nz/images/pictures/flags96/Austria.jpg'},
    //     {'country': 'Bulgaria', 'population': 7084571, 'capital': 'Sofia', 'continent': 'Europe', 'flag': 'http://www.sciencekids.co.nz/images/pictures/flags96/Bulgaria.jpg'},
    //   ];
    // }, 2000);
  }

  // settingSearch(event, row) {
  //   console.log(row);
  //   event.stopPropagation();
  // }
}
