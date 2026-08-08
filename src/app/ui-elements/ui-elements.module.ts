import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule  } from '@angular/common/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UiSwitchModule } from 'ngx-ui-switch';
import { TagInputModule } from 'ngx-chips';

import { UIElementsRoutingModule } from "./ui-elements-routing.module";

import { CardsComponent } from './cards/cards.component';
import { ButtonsComponent } from './buttons/buttons.component';
import { NavTabsComponent } from './nav-tabs/nav-tabs.component';
import { TabsetComponent } from './tabset/tabset.component';
import { AccordionComponent } from './accordion/accordion.component';
import { ModalsComponent, NgbdModalContent } from './modals/modals.component';
import { ListGroupsComponent } from './list-groups/list-groups.component';
import { BsElementsComponent } from './bs-elements/bs-elements.component';
import { TagInputComponent } from './tag-input/tag-input.component';
import { PaginationComponent } from './pagination/pagination.component';
import { AlertsComponent } from './alerts/alerts.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { ToastrComponent } from './toastr/toastr.component';
import { SweetAlertsComponent } from './sweet-alerts/sweet-alerts.component';
import { TypographyComponent } from './typography/typography.component';



@NgModule({
    imports: [
        CommonModule,
        UIElementsRoutingModule,
        NgbModule, 
        UiSwitchModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        TagInputModule
    ],
    declarations: [
        CardsComponent,
        ButtonsComponent,
        NavTabsComponent,
        TabsetComponent,
        AccordionComponent,
        ModalsComponent,
        NgbdModalContent,
        ListGroupsComponent,
        BsElementsComponent,
        TagInputComponent,
        PaginationComponent,
        AlertsComponent,
        ProgressBarComponent,
        ToastrComponent,
        SweetAlertsComponent,
        TypographyComponent,
    ],
    
    entryComponents: [NgbdModalContent]

    
})
export class UIElementsModule { }
