import { NgModule } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDialogModule} from '@angular/material/dialog';


@NgModule({
    declarations:[],
    imports:[
        MatCardModule,
        MatListModule,
        MatToolbarModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        MatDialogModule
    ],
    exports:[
        MatCardModule,
        MatListModule,
        MatToolbarModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        MatDialogModule
    ]
})

export class MaterialModule {}