import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { error } from 'protractor';


@Injectable()
export class AuthService {
    private token: string;
    private isAuthenticated = false;
    private authStatusListener = new Subject<boolean>();
    private userId: string;
    constructor(private http: HttpClient, private router: Router) { }

    getToken() {
        return this.token;
    }

    getUserId() {
        return this.userId;
    }

    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }

    getIsAuth() {
        return this.isAuthenticated;
    }

    signUp(email: string, password: string) {
        const authData: AuthData = { email: email, password: password };
        this.http.post<{ token: string }>('http://127.0.0.1:3000/users/signUp', authData).subscribe(
            (response) => {
                const token = response.token;
                this.token = token;

                if (token) {
                    this.router.navigate(['recipes']);
                    this.isAuthenticated = true;
                    this.authStatusListener.next(true);
                }
            }, error => {
                this.authStatusListener.next(false);

            }
        );
    }

    login(email: string, password: string) {
        const authData: AuthData = { email: email, password: password };
        this.http.post<{ token: string, userId: string }>('http://127.0.0.1:3000/users/login', authData).subscribe(
            (response) => {
                const token = response.token;
                this.token = token;

                if (token) {
                    this.router.navigate(['/']);
                    this.isAuthenticated = true;
                    this.userId = response.userId;
                    this.authStatusListener.next(true);
                }
            }, error => {
                this.authStatusListener.next(false);
            })
    }

    logout() {
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        this.userId = null;
        this.router.navigate(['login'])
    }

}