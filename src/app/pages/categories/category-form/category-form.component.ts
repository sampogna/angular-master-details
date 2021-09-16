import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';

import { switchMap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Category } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string;
  categoryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[];
  submittingForm: boolean = false;
  category: Category = new Category();

  constructor(
    private toastr: ToastrService,
    private categoryService: CategoryService,
    private router: ActivatedRoute,
    private formBuilder: FormBuilder,
    private routerR: Router
  ) { }

  ngOnInit(): void {

    this.setCurrentAction();
    this.buildCategoryForm();
    this.loadCategory();

  }

  ngAfterContentChecked(){
    this.setPageTitle();
  }

  submitForm() {
    this.submittingForm = !this.submittingForm;

    if (this.currentAction == "new")
      this.createCategory();
    else
      this.updateCategory;
  }

  // PRIVATE METHODS

  private setCurrentAction() {
    console.log('route snapshot', this.router.snapshot.url[0].path)
    if (this.router.snapshot.url[0].path == "new") 
      this.currentAction = "new"
    else
      this.currentAction = "edit"
  }

  private buildCategoryForm() {
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null]
    });
  }

  private loadCategory() {
    if(this.currentAction == "edit") {
      this.router.paramMap.pipe(
        switchMap(params => this.categoryService.getById(Number(params.get("id"))))
      )
      .subscribe(
        (category) => {
          this.category = category;
          this.categoryForm.patchValue(this.category); // binds loaded category data to categoryForm
        },
        (error) => alert('Ocorreu um erro no servidor, tente mais tarde.')
      )
    }
  }

  private setPageTitle() {
    if (this.currentAction == "new")
      this.pageTitle = "Cadastro de Nova Categoria"
    else {
      const categoryName = this.category.name || "";
      this.pageTitle = "Editando Categoria: " + categoryName;
    }
      
  }

  public createCategory() {

    const category: Category = Object.assign(new Category(), this.categoryForm.value);

    this.categoryService.create(category)
      .subscribe(
        (category) => this.actionsForSuccess(category),
        (error) => this.actionsForError(error)
      );

  }

  private updateCategory() {

    const category: Category = Object.assign(new Category(), this.categoryForm.value);

    this.categoryService.update(category)
    .subscribe(
      (category) => this.actionsForSuccess(category),
      (error) => this.actionsForError(error)
    );

  }

  private actionsForSuccess(category: Category) {
    this.toastr.success('Solicitação processada com sucesso.')

    // redirect/ reload page
    this.routerR.navigateByUrl("categories", {skipLocationChange: true}).then(
      () => this.routerR.navigate(["categories", category.id, "edit"])
    )
  }

  private actionsForError(error: any) {
    this.toastr.error("Ocorreu um erro ao processar a sua solicitação");

    this.submittingForm = false;

    if (error.status === 422) {
      this.serverErrorMessages = JSON.parse(error._body);
    }
    else 
      this.serverErrorMessages = ["Falha na comunicação. Por favor, tente mais tarde."];
  }

}
