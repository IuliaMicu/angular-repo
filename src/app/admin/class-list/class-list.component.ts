import { Component, OnInit } from '@angular/core';
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
  displayU = false;
  displayA = false;
  teacher: any;
  id: any;
  students: any;
  selectedStudents = [];
  selectedStudentsTemp;
  classId: any;

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

    this.getAllStudents().subscribe(res => {
      this.students = res.body;
      this.students.forEach ( s => {
        s.name = s.account.firstName + " " + s.account.lastName;
      })
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

  getAllStudents(){
    return this.http.get<Object>(this.baseUrl + '/getAllStudents', {observe : 'response'})
  }

  getClassStudents(){
    return this.http.get<Object>(this.baseUrl + '/getClassStudents/' + this.classId, {observe : 'response'})
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

  editClass(){
    let obj = {id: this.id, name: this.className, teacherId : this.teacher}
    return this.http.put<Object>(this.baseUrl + '/updateClass', obj,{observe : 'response'})

  }

  assignStudents(){
    let obj = {id: this.id, classId: this.classId, students : this.selectedStudents}
    return this.http.put<Object>(this.baseUrl + '/assignStudents' , obj, {observe: 'response'})
  }

  addClass() {
    this.teacher = null;
    this.className = null;
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

  modalUClick(){
    this.editClass().subscribe( res =>{
      this.getAll().subscribe(res => {
        this.classes = res.body;
        this.classes.forEach( c => {
              c.teacherName = c.teacher.account.firstName + " " + c.teacher.account.lastName
            }
        )
      });
      this.displayU = false;
    })
  }

  modalAClick(){
    this.assignStudents().subscribe( res =>{
    })
    this.displayA = false;
  }


  clickEdit(panel , c: any) {
    panel.hide();
    this.displayU = true;
    this.teacher = c.teacherId;
    this.className = c.name;
    this.id = c.id;

  }
  clickAdd(panel, c){
    panel.hide();
    this.classId = c.id;
    this.className = c.name;

    this.getClassStudents().subscribe( res => {

      this.selectedStudents = [];
      this.displayA = true;
      this.selectedStudentsTemp = res.body;
      this.selectedStudentsTemp.forEach( ss => {
        this.students.forEach( s => {
          if(ss.id == s.id){
            this.selectedStudents = [...this.selectedStudents, s]
          }
        })
      })
    })
  }

}
