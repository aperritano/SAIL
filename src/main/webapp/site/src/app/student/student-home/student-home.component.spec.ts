import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { defer, Observable } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { StudentRun } from '../student-run';
import { StudentService } from '../student.service';
import { User } from "../../domain/user";
import { UserService } from "../../services/user.service";
import { StudentModule } from "../student.module";
import { StudentHomeComponent } from "./student-home.component";
import { RouterTestingModule } from "@angular/router/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ConfigService } from "../../services/config.service";
import { Config } from "../../domain/config";

export function fakeAsyncResponse<T>(data: T) {
  return defer(() => Promise.resolve(data));
}

describe('StudentHomeComponent', () => {
  let component: StudentHomeComponent;
  let fixture: ComponentFixture<StudentHomeComponent>;

  beforeEach(async(() => {
    const studentServiceStub = {
      isLoggedIn: true,
      getRuns(): Observable<StudentRun[]> {
        let runs : any[] = [
          {id: 1, name: "Photosynthesis"}, {id: 2, name: "Plate Tectonics"}
        ];
        return Observable.create( observer => {
            observer.next(runs);
            observer.complete();
        });
      },
      newRunSource$: fakeAsyncResponse({
        id: 12345,
        name: "Test Project",
        runCode: "Panda123",
        periodName: "1",
        startTime: "2018-08-22 00:00:00.0",
        teacherDisplayName: "Spongebob Squarepants",
        teacherFirstName: "Spongebob",
        teacherLastName: "Squarepants",
        projectThumb: "/wise/curriculum/360/assets/project_thumb.png"
      })
    };

    const userServiceStub = {
      getUser(): Observable<User[]> {
        const user: User = new User();
        user.firstName = 'Demo';
        user.lastName = 'User';
        user.role = 'student';
        user.userName = 'DemoUser0101';
        user.id = 123456;
        return Observable.create( observer => {
          observer.next(user);
          observer.complete();
        });
      }
    };

    const configServiceStub = {
      getConfig(): Observable<Config> {
        const config : Config = {"context":"vle","logOutURL":"/logout","currentTime":20180730};
        return Observable.create( observer => {
          observer.next(config);
          observer.complete();
        });
      }
    };

    TestBed.configureTestingModule({
      declarations: [],
      providers: [
        { provide: StudentService, useValue: studentServiceStub },
        { provide: UserService, useValue: userServiceStub },
        { provide: MatDialog, useValue: {} },
        { provide: ConfigService, useValue: configServiceStub }
      ],
      imports: [ BrowserAnimationsModule, StudentModule, RouterTestingModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show student home page', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('#studentName').textContent)
      .toContain('Demo User');
  });
});