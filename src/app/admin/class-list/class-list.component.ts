import { Component, OnInit } from '@angular/core';
import {AccountService} from '@app/_services';
import {first} from 'rxjs/operators';
import {Account} from '@app/_models';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {environment} from '@environments/environment';
import {ConfirmationService, MessageService} from 'primeng/api';

@Component({
  selector: 'app-class-list',
  templateUrl: './class-list.component.html',
  styleUrls: ['./class-list.component.less'],
  providers:[ConfirmationService, MessageService]
})
export class ClassListComponent implements OnInit {

  classes;
  teachers;
  baseUrl = `${environment.apiUrl}`;
  className: any;
  display = false;
  teacher: any;

  constructor(
      private router: Router,
      private http: HttpClient,
      private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.getAll()
        .subscribe(res => {
          this.classes = res.body;
          this.classes.forEach( c => {
                c.teacherName = c.teacher.account.firstName + " " + c.teacher.account.lastName
              }
          )
        });

    this.getAllTeachers().subscribe(res => {
      this.teachers = res.body;
      this.teachers.forEach( t => {
        t.name = t.account.firstName + " " + t.account.lastName
      });
    })
  }

  deleteClass(id) {
    this.delete(id)
        .subscribe(() => {
          this.classes = this.classes.filter(x => x.id !== id)
        });
  }

  getAll() {
    return this.http.get<Object>(this.baseUrl + '/getAllClasses', {observe : 'response'})
  }

  getAllTeachers() {
    return this.http.get<Object>(this.baseUrl + '/getAllTeachers', {observe : 'response'})
  }


  delete(id){
    return this.http.delete<Object>(this.baseUrl + '/deleteClass/' + id, {observe : 'response'})

  }

  clickDelete(panel, cls) {
    panel.hide();
    this.confirmationService.confirm({
      message: 'Are sure want to delete this class? ',
      accept: () => {
        this.deleteClass(cls)
      }
    });

  }

  createClass(){
    let obj = {name: this.className, teacherId : this.teacher}
    return this.http.post<Object>(this.baseUrl + '/createClass', obj,{observe : 'response'})
  }

  addClass() {
    this.display = true;
  }

  modalClick(){
    this.createClass().subscribe( res => {
      this.getAll().subscribe(res => {
        this.classes = res.body;
        this.classes.forEach( c => {
              c.teacherName = c.teacher.account.firstName + " " + c.teacher.account.lastName
            }
        )
      });
      this.display = false;
    })
  }
}
