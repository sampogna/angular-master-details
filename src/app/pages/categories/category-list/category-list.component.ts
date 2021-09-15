import { Component, OnInit, ɵCompiler_compileModuleAndAllComponentsAsync__POST_R3__ } from '@angular/core';

import { Category } from "./../shared/category.model"
import { CategoryService } from "./../shared/category.service"

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {

  categories: Category[] = [];

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {

    this.categoryService.getAll().subscribe(
      categories => this.categories = categories,
      error => alert('Erro ao carregar lista')
    )

  }

  deleteCategory(category: any) {

    const mustDelete = confirm('Deseja realmente excluir este item?');

    if(mustDelete){
      this.categoryService.delete(category.id).subscribe(
        () => this.categories = this.categories.filter(element => element != category),
        () => alert("Erro ao tentar excluir")
      )
    }

  }

}
