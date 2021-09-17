import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';

import { switchMap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { Entry } from '../shared/entry.model';
import { EntryService } from '../shared/entry.service';
import { Category } from '../../categories/shared/category.model';
import { CategoryService } from '../../categories/shared/category.service';

import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

import ptBR from '../../../ptBR.json'


@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.scss']
})
export class EntryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string;
  entryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[];
  submittingForm: boolean = false;
  entry: Entry = new Entry();
  categories: Array<Category>;

  imaskConfig = {
    mask: Number,
    scale: 2,
    thousandsSeparator: '',
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: ','
  }

  constructor(
    private toastr: ToastrService,
    private entryService: EntryService,
    private categoryService: CategoryService,
    private router: ActivatedRoute,
    private formBuilder: FormBuilder,
    private routerR: Router,
    private config: PrimeNGConfig,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {

    
    this.setCurrentAction();
    this.buildEntryForm();
    this.loadEntry();
    this.loadCategories();
    this.translateService.setDefaultLang(String('ptBR'));
  }

  translate(lang:string) {
    this.translateService.use(lang);
    this.translateService.get('primeng').subscribe(res => this.config.setTranslation(res));
  }

  ngAfterContentChecked(){
    this.setPageTitle();
  }

  submitForm() {
    this.submittingForm = !this.submittingForm;

    if (this.currentAction == "new")
      this.createEntry();
    else
      this.updateEntry;
  }

  get typeOptions(): Array<any> {
    return Object.entries(Entry.types).map(
      ([value, text]) => {
        return {
          text: text,
          value: value
        }
      }
    )
  }

  // PRIVATE METHODS

  private setCurrentAction() {
    console.log('route snapshot', this.router.snapshot.url[0].path)
    if (this.router.snapshot.url[0].path == "new") 
      this.currentAction = "new"
    else
      this.currentAction = "edit"
  }

  private buildEntryForm() {
    this.entryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: ['expense', [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [true, [Validators.required]],
      categoryId: [null, [Validators.required]],
    });
  }

  private loadEntry() {
    if(this.currentAction == "edit") {
      this.router.paramMap.pipe(
        switchMap(params => this.entryService.getById(Number(params.get("id"))))
      )
      .subscribe(
        (entry) => {
          this.entry = entry;
          this.entryForm.patchValue(this.entry); // binds loaded entry data to entryForm
        },
        (error) => alert('Ocorreu um erro no servidor, tente mais tarde.')
      )
    }
  }

  private loadCategories() {
    this.categoryService.getAll().subscribe(
      categories => this.categories = categories
    )
  }

  private setPageTitle() {
    if (this.currentAction == "new")
      this.pageTitle = "Cadastro de Novo Lançamento"
    else {
      const entryName = this.entry.name || "";
      this.pageTitle = "Editando Lançamento: " + entryName;
    }
      
  }

  public createEntry() {

    const entry: Entry = Object.assign(new Entry(), this.entryForm.value);

    this.entryService.create(entry)
      .subscribe(
        (entry) => this.actionsForSuccess(entry),
        (error) => this.actionsForError(error)
      );

  }

  private updateEntry() {

    const entry: Entry = Object.assign(new Entry(), this.entryForm.value);

    this.entryService.update(entry)
    .subscribe(
      (entry) => this.actionsForSuccess(entry),
      (error) => this.actionsForError(error)
    );

  }

  private actionsForSuccess(entry: Entry) {
    this.toastr.success('Solicitação processada com sucesso.')

    // redirect/ reload page
    this.routerR.navigateByUrl("entries", {skipLocationChange: true}).then(
      () => this.routerR.navigate(["entries", entry.id, "edit"])
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
