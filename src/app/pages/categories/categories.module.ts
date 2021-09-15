import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryFormComponent } from './category-form/category-form.component';
import { RouterModule } from '@angular/router';


@NgModule({
  imports: [
    CommonModule,
    CategoriesRoutingModule,
    RouterModule
  ],
  declarations: [ CategoryListComponent, CategoryFormComponent ],
})
export class CategoriesModule { }
