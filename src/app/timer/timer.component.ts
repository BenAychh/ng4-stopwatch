import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';

interface Interval {
  start: number;
  stop?: number;
}

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit {

  intervals: Interval[] = [];
  totalTime = 0;
  paused = null;
  updateSubscription: Subscription;

  constructor() { }

  ngOnInit() {

  }

  startObservable() {
    this.updateSubscription = Observable.interval(10).subscribe(this.updateTime.bind(this));
  }

  stopObservable() {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }

  start() {
    this.reset();
    this.paused = false;
    this.intervals.push({
      start: Date.now(),
    });
    this.startObservable();
  }

  reset() {
    this.paused = null;
    this.totalTime = 0;
    this.intervals = [];
  }

  pauseAndResume() {
    if (this.intervals[this.intervals.length - 1].stop) {
      this.startNewInterval();
      this.paused = false;
      this.startObservable();
    } else {
      this.intervals[this.intervals.length - 1].stop = Date.now();
      this.paused = true;
      this.stopObservable();
    }
  }

  getIntervalTime(interval: Interval) {
    const stopTime = interval.stop ? interval.stop : Date.now();
    return stopTime - interval.start;
  }

  private startNewInterval() {
    this.intervals.push({
      start: Date.now(),
    });
  }

  private updateTime() {
    this.totalTime = this.intervals.reduce((total, interval: Interval) => {
      const stopTime = interval.stop ? interval.stop : Date.now();
      total += this.getIntervalTime(interval);
      return total;
    }, 0);
  }
}
