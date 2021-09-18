import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, of, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { AlertModalService } from 'src/app/shared/services/alert-modal.service';
import { CursosService } from '../cursos.service';
import { Curso, Cursos } from '../curso';


// import { AlertModalComponent } from 'src/app/shared/alert-modal/alert-modal.component';

@Component({
  selector: 'app-cursos-lista',
  templateUrl: './cursos-lista.component.html',
  styleUrls: ['./cursos-lista.component.scss'],
  preserveWhitespaces: true
})
export class CursosListaComponent implements OnInit {

  // bsModalRef: BsModalRef
  deleteModalRef: BsModalRef

  @ViewChild('deleteModal')
  deleteModal

  //cursos: Cursos
  cursos$: Observable<Cursos>
  error$ = new Subject<boolean>()

  private cursoSelecionado: Curso;

  constructor(
    private cursoService: CursosService,
    private alertService: AlertModalService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    // this.cursoService.listar()
    //  .subscribe(response => this.cursos = response)

    this.onRefresh()
  }

  onRefresh(): void {
    this.cursos$ = this.cursoService.listar()
      .pipe(
        catchError( error => {
          //this.error$.next(true)
          this.handleError()
          return of()
        })
      )

    // this.cursoService.listar().subscribe(
    //   cursos => console.log(cursos),
    //   error => console.error(error),
    //   () => console.log('Observable completo')
    // )
  }

  onEdit(id: number) {
    this.router.navigate(['editar', id], { relativeTo: this.activatedRoute })
  }

  onDelete(curso: Curso) {
    this.cursoSelecionado = curso
    this.deleteModalRef = this.modalService.show(this.deleteModal, { class: 'modal-sm' })
  }

  onConfirmDelete() {
    this.cursoService.remover(this.cursoSelecionado.id)
      .subscribe(
        success => this.onRefresh(),
        error => this.alertService.showAlertDanger('Não foi possivel remover o curso, tente novamente !'),
        () => console.log('Remoção do curso completa')
      )
    
    this.onDeclineDelete()
  }

  onDeclineDelete() {
    this,this.deleteModalRef.hide();
  }

  handleError() {
    this.alertService.showAlertDanger('Erro ao carregar cursos, tente novamente mais tarde !')
    
    //this.bsModalRef = this.modalService.show(AlertModalComponent)
    //this.bsModalRef.content.type = 'danger'
    //this.bsModalRef.content.message = 'Erro ao carregar cursos, tente novamente mais tarde !'
  }

}
