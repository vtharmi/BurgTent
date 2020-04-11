import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-server',
    templateUrl: './server.component.html',

})

export class ServerComponent implements OnInit{
    allowNewServer = false;
    serverId: number = 10;
    serverStatus: string = 'offline';
    serverName='testsercer';
    serverCreation = "server was not created";
    serverCreated = false;
    servers = ['test1', 'test2'];

    getServerStatus() {
        return this.serverStatus = Math.random() >   0.5 ? 'online': 'offline';
    }
    constructor () {
        setTimeout(() => {
            this.allowNewServer = true;
        }, 2000);
    }
    ngOnInit() {

    }

    onCreateServer() {
        this.servers.push(this.serverName);
        this.serverCreated = true;
        this.serverCreation = "server was created with" + this.serverName;
        // return this.serverCreation;
    }

    onUpdateServerName(event: any) {
        this.serverName = event.target.value;
    }

    getColor() {
        return this.serverStatus === 'online' ? 'green': 'red';
    }
}