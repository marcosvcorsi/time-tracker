import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'dayOfTheWeek'})
export class DayOfTheWeekPipe implements PipeTransform {

  weekDay = [
    'Segunda-feira', 
    'Terça-feira', 
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
    'Domingo',
  ];

 transform(value: any): any {
    const dateVal = new Date(value);

    return this.weekDay[dateVal.getDay() - 1];
  }
}