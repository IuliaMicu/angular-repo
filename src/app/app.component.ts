import { Component } from '@angular/core';

import { AccountService } from './_services';
import { Account, Role } from './_models';
import {ConfirmationService, MessageService} from 'primeng/api';

@Component({ selector: 'app', templateUrl: 'app.component.html', providers:[ConfirmationService, MessageService] })
export class AppComponent {
    Role = Role;
    account: Account;

    constructor(private accountService: AccountService) {
        this.accountService.account.subscribe(x => this.account = x);
    }

    logout() {
        this.accountService.logout();
    }
}
