import { Component } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  morningBegin;
  morningEnd;

  afternoonBegin;
  afternoonEnd;

  morningDiff = 0;
  afternoonDiff = 0;

  totalDiff = 0;

  constructor() {}

  clearTime() {
    this.morningBegin = '';
    this.morningEnd = '';

    this.afternoonBegin = '';
    this.afternoonEnd = '';

    this.morningDiff = 0;
    this.afternoonDiff = 0;
    this.totalDiff = 0;
  }

  morningBeginChanged(event) {
    if (this.morningBegin && !this.morningEnd) {
      this.morningEnd = this.getTimeEnd(this.morningBegin, 4);
    }
  }

  afternoonBeginChanged(event) {
    if (this.afternoonBegin && !this.afternoonEnd) {
      this.afternoonEnd = this.getTimeEnd(this.afternoonBegin, 4.5);
    }
  }

  morningDiffChanged(event) {
    if (this.morningBegin && this.morningEnd) {
      this.morningDiff = this.calculateDiff(this.morningBegin, this.morningEnd, 4);
    }

    this.sumTotal();
  }

  afternoonDiffChanged(event) {
    if (this.afternoonBegin && this.afternoonEnd) {
      this.afternoonDiff = this.calculateDiff(this.afternoonBegin, this.afternoonEnd, 4.5);
    }

    this.sumTotal();
  }

  sumTotal() {
    this.totalDiff = this.morningDiff + this.afternoonDiff;
  }

  getTimeEnd(dt, plusHours){
    const dtStart = moment(dt);
    const dtEnd = dtStart.clone().add(plusHours, 'hours');

    return dtEnd.format();
  }

  calculateDiff(init, end, hoursBase){
    if (!init && !end) {
      return 0;
    }

    const dtInit = moment(init);
    const dtEnd = moment(end);

    const diff = moment.duration(dtEnd.diff(dtInit));

    return Math.round(diff.asMinutes() - (hoursBase * 60));
  }

}
