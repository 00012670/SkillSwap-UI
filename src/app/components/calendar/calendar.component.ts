import { Component } from '@angular/core';
import { CalendarService } from '../../services/calendar.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {
  constructor(private calendarService: CalendarService) { }

  createEvent() {
    const data = {}; // Replace this with the actual data
    this.calendarService.createEvent(data).subscribe(response => {
      console.log('Google Meet link: ', response.htmlLink);
    });
  }

}
