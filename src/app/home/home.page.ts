import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  morningBegin;
  morningEnd;

  afternoonBegin;
  afternoonEnd;

  morningDiff = 0;
  afternoonDiff = 0;

  totalDiff = 0;

  constructor(private storage: Storage,
              private toastCtrl: ToastController) {}

  ngOnInit() {
    this.loadTimes();
  }

  loadTimes() {
    this.storage.get('morning_begin').then((val) => {
      if (val) {
        this.morningBegin = val;
      }
    });

    this.storage.get('morning_end').then((val) => {
      if (val) {
        this.morningEnd = val;
      }
    });

    this.storage.get('afternoon_begin').then((val) => {
      if (val) {
        this.afternoonBegin = val;
      }
    });

    this.storage.get('afternoon_end').then((val) => {
      if (val) {
        this.afternoonEnd = val;
      }
    });
  }

  clearTime() {
    this.morningBegin = '';
    this.morningEnd = '';

    this.afternoonBegin = '';
    this.afternoonEnd = '';

    this.morningDiff = 0;
    this.afternoonDiff = 0;
    this.totalDiff = 0;

    this.storage.set('morning_begin', null);
    this.storage.set('morning_end', null);
    this.storage.set('afternoon_begin', null);
    this.storage.set('afternoon_end', null);
  }

  morningBeginChanged(event) {
    if (this.morningBegin) {
      this.morningBegin = this.timeNormalizer(this.morningBegin, 8);

      this.storage.set('morning_begin', this.morningBegin);

      if (!this.morningEnd) {
        this.morningEnd = this.getTimeEnd(this.morningBegin, 4);
      } else {
        this.morningDiffChanged(event);
      }
    }
  }

  afternoonBeginChanged(event) {
    if (this.afternoonBegin) {
      this.afternoonBegin = this.timeNormalizer(this.afternoonBegin, 13, 30);

      this.storage.set('afternoon_begin', this.afternoonBegin);

      if (!this.afternoonEnd) {
        this.afternoonEnd = this.getTimeEnd(this.afternoonBegin, (4.5 - (this.morningDiff / 60)));
      } else {
        this.afternoonDiffChanged(event);
      }
    }
  }

  morningDiffChanged(event) {
    if (this.morningBegin && this.morningEnd) {
      this.morningEnd = this.timeNormalizer(this.morningEnd, 12);

      this.morningDiff = this.calculateDiff(this.morningBegin, this.morningEnd, 4);

      this.storage.set('morning_end', this.morningEnd);
    }

    this.sumTotal();
  }

  afternoonDiffChanged(event) {
    if (this.afternoonBegin && this.afternoonEnd) {
      this.afternoonEnd = this.timeNormalizer(this.afternoonEnd, 18);

      this.afternoonDiff = this.calculateDiff(this.afternoonBegin, this.afternoonEnd, 4.5);

      this.storage.set('afternoon_end', this.afternoonEnd);
    }

    this.sumTotal();
  }

  sumTotal() {
    this.totalDiff = this.morningDiff + this.afternoonDiff;
  }

  getTimeEnd(dt, plusHours) {
    const dtStart = moment(dt);
    const dtEnd = dtStart.clone().add(plusHours, 'hours');

    return dtEnd.format();
  }

  calculateDiff(init, end, hoursBase) {
    if (!init && !end) {
      return 0;
    }

    const dtInit = moment(init);
    const dtEnd = moment(end);

    const diff = moment.duration(dtEnd.diff(dtInit));

    return Math.round(diff.asMinutes() - (hoursBase * 60));
  }

  timeNormalizer(time, dH, dM = 0){
    const defaultTime = moment().hour(dH).minute(dM);
    const momentTime = moment(time)
    
    const duration = moment.duration(defaultTime.diff(momentTime));
    const minutes = duration.asMinutes();

    if(minutes <= 5 && minutes >= -5){
      this.showToast();

      return defaultTime.format();
    } else {
      return time;
    }
  }

  async showToast(){
    const toast = await this.toastCtrl.create({
      message: 'Horário informando está no intervalo de 5 minutos, será considerado o horário padrão',
      duration: 3000
    });
    toast.present();
  }

}
