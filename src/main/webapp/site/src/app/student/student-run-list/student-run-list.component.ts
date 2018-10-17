import { Component, OnInit } from '@angular/core';

import { StudentRun } from '../student-run';
import { StudentService } from '../student.service';

@Component({
  selector: 'app-student-run-list',
  templateUrl: './student-run-list.component.html',
  styleUrls: ['./student-run-list.component.scss']
})
export class StudentRunListComponent implements OnInit {

  runs: StudentRun[] = [];
  filteredRuns: StudentRun[] = [];
  filteredActiveTotal: number = 0;
  filteredCompletedTotal: number = 0;
  filteredScheduledTotal: number = 0;
  search: string = '';
  loaded: boolean = false;

  constructor(private studentService: StudentService) {
    studentService.newRunSource$.subscribe(run => {
      run.isHighlighted = true;
      this.runs.unshift(run);
      scrollTo(0, 0);
    });
  }

  ngOnInit() {
    this.getRuns();
  }

  getRuns() {
    this.studentService.getRuns()
      .subscribe(runs => {
        this.runs = runs;
        this.filteredRuns = runs;
        this.searchUpdated(this.search);
        this.loaded = true;
      });
  }

  runIsActive(run: StudentRun) {
    if (run.endTime) {
      return false;
    }
    const startTime = new Date(run.startTime).getTime();
    const now = new Date().getTime();
    if (startTime <= now) {
      return true;
    }
    return false;
  }

  searchUpdated(value: string) {
    this.search = value;
    this.filteredRuns = this.search ? this.performFilter(this.search) : this.runs;
    this.filteredActiveTotal = 0;
    this.filteredCompletedTotal = 0;
    this.filteredScheduledTotal = 0;
    for (let run of this.filteredRuns) {
      if (run.endTime) {
        this.filteredCompletedTotal++;
      } else if (this.runIsActive(run)) {
        this.filteredActiveTotal++;
      } else {
        this.filteredScheduledTotal++;
      }
    }
  }

  performFilter(filterValue: string) {
    filterValue = this.search.toLocaleLowerCase();
    // TODO: extract this for global use?
    return this.runs.filter((run: StudentRun) =>
      Object.keys(run).some(prop => {
        let value = run[prop];
        if (typeof value === 'undefined' || value === null) {
          return false;
        } else {
          return value.toString().toLocaleLowerCase().indexOf(filterValue) !== -1;
        }
      })
    );
  }

  reset(): void {
    this.searchUpdated('');
  }
}
