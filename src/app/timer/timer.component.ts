import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Rx';

interface Interval {
  start: number;
  stop?: number;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit {

  intervals: Interval[] = [];
  totalTime = 0;
  paused = null;

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit() {
    Observable.interval(10).subscribe(this.updateTime.bind(this));
  }

  start() {
    this.reset();
    this.paused = false;
    this.intervals.push({
      start: Date.now(),
    });
  }

  reset() {
    this.paused = null;
    this.totalTime = 0;
    this.intervals = [];
    this.cd.markForCheck();
  }

  pauseAndResume() {
    if (this.intervals[this.intervals.length - 1].stop) {
      this.startNewInterval();
      this.paused = false;
    } else {
      this.intervals[this.intervals.length - 1].stop = Date.now();
      this.paused = true;
    }
  }

  private startNewInterval() {
    this.intervals.push({
      start: Date.now(),
    });
  }

  private updateTime() {
    this.totalTime = this.intervals.reduce((total, interval: Interval) => {
      const stopTime = interval.stop ? interval.stop : Date.now();
      total += stopTime - interval.start;
      return total;
    }, 0);
    this.cd.markForCheck();
  }
}
