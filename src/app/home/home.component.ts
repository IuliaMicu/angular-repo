import {Component, OnInit} from '@angular/core';

import { AccountService } from '@app/_services';
import { TabMenu} from 'primeng/tabmenu';
import {MenuItem} from 'primeng/api';
import {Account, Role} from '@app/_models';


@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit{
    account = this.accountService.accountValue;

    items: MenuItem[];
    activeItem: MenuItem;

    constructor(private accountService: AccountService) { }

    ngOnInit() {


        if(this.account.role === Role.Admin){
            this.items = [
                {label: 'Students'},
                {label: 'Classes'},
                {label: 'Reports'},
            ];
        }
        if(this.account.role === Role.Teacher){
            this.items = [
                {label: 'Students'},
                {label: 'Reports'},
            ];
        }

        if(this.account.role === Role.Student){
            this.items = [
                {label: 'Attendance'},
                {label: 'Grades'},
                {label: 'Assignments'},
            ];
        }


        this.activeItem = this.items[0];

    }
}
