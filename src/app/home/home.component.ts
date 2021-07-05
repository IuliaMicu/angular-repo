import {Component, OnInit} from '@angular/core';

import {AccountService, AlertService} from '@app/_services';
import { TabMenu} from 'primeng/tabmenu';
import {MenuItem} from 'primeng/api';
import {Account, Role} from '@app/_models';
import {environment} from '@environments/environment';
import {HttpClient} from '@angular/common/http';


@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit{
    account = this.accountService.accountValue;

    items: MenuItem[];
    activeItem: MenuItem;
    teacherId;
    studentId;
    students;
    studentsAct;
    classes;
    grades;
    attendances;
    baseUrl = `${environment.apiUrl}`;
    markValue = 1;
    classId;
    tab: string;
    showActions = false;
    displayMark = false;
    currentStudent: any;
    basicData;
    basicDataC;
    basicOptions: any;


    constructor(private accountService: AccountService, private http: HttpClient, private alertService: AlertService) { }

    getAllStudents(){
        return this.http.get<Object>(this.baseUrl + '/getAllStudents', {observe : 'response'})
    }

    getAllClasses() {
        return this.http.get<Object>(this.baseUrl + '/getAllClasses', {observe : 'response'})
    }

    getTeacherStudents(id) {
        return this.http.get<Object>(this.baseUrl + '/getTeacherStudents/' + id, {observe : 'response'})
    }

    getTeacherId(id) {
        return this.http.get<Object>(this.baseUrl + '/getTeacherId/' + id, {observe : 'response'})
    }

    getStudentId(id) {
        return this.http.get<Object>(this.baseUrl + '/getStudentId/' + id, {observe : 'response'})
    }

    getTeacherClasses(id) {
        return this.http.get<Object>(this.baseUrl + '/getTeacherClasses/' + id, {observe : 'response'})
    }

    getStudentGrades(id) {
        return this.http.get<Object>(this.baseUrl + '/getStudentGrades/' + id, {observe : 'response'})
    }

    getStudentAttendance(id) {
        return this.http.get<Object>(this.baseUrl + '/getStudentAttendance/' + id, {observe : 'response'})
    }

    getClassStudents(id){
        return this.http.get<Object>(this.baseUrl + '/getClassStudents/' + id, {observe : 'response'})
    }

    markStudent(){
        let obj = {studentId: this.currentStudent.id, mark : this.markValue, classId : this.classId}
        return this.http.post<Object>(this.baseUrl + '/markStudent', obj,{observe : 'response'})
    }
    studentMissed(){
        let obj = {studentId: this.currentStudent.id, classId : this.classId}
        return this.http.post<Object>(this.baseUrl + '/missStudent', obj,{observe : 'response'})
    }

    average = arr => arr.reduce((acc,v) => acc + v) / arr.length;


    ngOnInit() {

        this.basicOptions = {
            legend: {
                labels: {
                    fontColor: '#495057'
                }
            },
            scales: {
                xAxes: [{
                    ticks: {
                        fontColor: '#495057'
                    }
                }],
                yAxes: [{
                    ticks: {
                        fontColor: '#495057'
                    }
                }]
            }
        };



        if(this.account.role === Role.Admin){
            this.items = [
                {label: 'Students', command : () => {this.tab = 'Students'} },
                {label: 'Classes', command : () => {this.tab = 'Classes'} },
                {label: 'Reports', command : () => {this.tab = 'Reports'} } ,
            ];

            this.getAllStudents().subscribe(res => {
                this.students = res.body;
                this.students.forEach ( s => {
                    s.name = s.account.firstName + " " + s.account.lastName;
                    s.mark = s.grades.length > 0 ? this.average(s.grades.map(g => g.mark)) : 0;
                    s.missed = s.attendances.length;
                })
                this.basicData = {
                    labels: this.students.map( s => s.name),
                    datasets: [
                        {
                            label: 'Grades',
                            backgroundColor: '#42A5F5',
                            data: this.students.map( s => s.mark)
                        },
                        {
                            label: 'Missed',
                            backgroundColor: '#FFA726',
                            data: this.students.map( s => s.missed)
                        }
                    ]
                };
            })

            this.getAllClasses()
                .subscribe(res => {
                    this.classes = res.body;
                    this.classes.forEach( c => {
                            c.teacherName = c.teacher.account.firstName + " " + c.teacher.account.lastName
                        c.mark = c.grades.length > 0 ? this.average(c.grades.map(g => g.mark)) : 0;
                        c.missed = c.attendances.length;
                        }
                    )

                    this.basicDataC = {
                        labels: this.classes.map( s => s.name),
                        datasets: [
                            {
                                label: 'Grades',
                                backgroundColor: '#42A5F5',
                                data: this.classes.map( s => s.mark)
                            },
                            {
                                label: 'Missed',
                                backgroundColor: '#FFA726',
                                data: this.classes.map( s => s.missed)
                            }
                        ]
                    };
                });


        }
        if(this.account.role === Role.Teacher){
            this.items = [
                {label: 'Classes', command : () => {this.tab = 'Classes'} },
                {label: 'Students', command : () => {this.tab = 'Students'} }
                ];
            this.getTeacherId(this.account.id).subscribe((res) => {
                this.teacherId = res.body['id'];
                this.getTeacherStudents(this.teacherId).subscribe( students => {
                    this.students = students.body;
                    this.students.forEach( c => {
                            c.name = c.account.firstName + " " + c.account.lastName
                        }
                    )
                })
                this.getTeacherClasses(this.teacherId).subscribe( classes => {
                    this.classes = classes.body;
                })
            })
        }

        if(this.account.role === Role.Student){
            this.items = [
                {label: 'Attendances', command : () => {this.tab = 'Attendances'} },
                {label: 'Grades', command : () => {this.tab = 'Grades'} }
            ];

            this.getStudentId(this.account.id).subscribe((res) => {
                this.studentId = res.body['id'];

                this.getStudentAttendance(this.studentId).subscribe( (att) => {
                    this.attendances = att.body;
                })
                this.getStudentGrades(this.studentId).subscribe( (grades) => {
                    this.grades = grades.body;
                })
            });
        }


        this.activeItem = this.items[0];
        this.tab = this.activeItem.label;

    }

    showClassActivity(info) {
        this.showActions = true;
        this.classId = info.id;
        this.getClassStudents(info.id).subscribe( res => {
            this.studentsAct = res.body;
            this.studentsAct.forEach( s => s.name = s.account.firstName + " " + s.account.lastName)
        });
    }

    back(){
        this.showActions = false;
    }

    mark(student) {
        this.displayMark = true;
        this.markValue =  1;
        this.currentStudent = student;
    }

    missed(student){
        this.currentStudent = student;
        this.studentMissed().subscribe(res => {
            this.studentsAct = res.body;
            this.studentsAct.forEach( s => s.name = s.account.firstName + " " + s.account.lastName)
            this.alertService.success('Student missed!')
        }, (error) => {
            this.alertService.error(error)
        })
    }

    modalMarkClick() {
        this.markStudent().subscribe(res => {
            this.studentsAct = res.body;
            this.studentsAct.forEach( s => s.name = s.account.firstName + " " + s.account.lastName)
            this.alertService.success('Student marked!')
            this.displayMark = false;
        }, (error) => {
            this.alertService.error(error)
        })

    }
}
