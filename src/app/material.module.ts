import { NgModule } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';


@NgModule({
    declarations:[],
    imports:[
        MatCardModule,
        MatListModule
    ],
    exports:[
        MatCardModule,
        MatListModule
    ]
})

export class MaterialModule {}