import { NgModule } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


@NgModule({
    declarations:[],
    imports:[
        MatCardModule,
        MatListModule,
        MatToolbarModule,
        MatCheckboxModule,
        MatProgressSpinnerModule
    ],
    exports:[
        MatCardModule,
        MatListModule,
        MatToolbarModule,
        MatCheckboxModule,
        MatProgressSpinnerModule
    ]
})

export class MaterialModule {}