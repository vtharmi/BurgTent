import { Component, OnInit, OnDestroy} from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
 export class HeaderComponent implements OnInit, OnDestroy{
     userIsAuthenticated = false;
    private authListenerSubcription: Subscription;
    constructor(private dataStorageService: DataStorageService, private authService: AuthService) {}
    onSave() {
        this.dataStorageService.storeRecipes().subscribe(
            (response: HttpResponse<any>) => {
                console.log(response);
                console.log('data saved');
            });
        // this.dataStorageService.storeRecipes();
    }

    ngOnInit() {
        this.authListenerSubcription = this.authService.getAuthStatusListener().subscribe(
            isAuthenticated => {
                this.userIsAuthenticated = isAuthenticated;
            }
        );
    }

    ngOnDestroy() {
        this.authListenerSubcription.unsubscribe();
    }

    onLogout() {
        this.authService.logout();
    }
 }