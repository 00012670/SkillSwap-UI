import { Component } from '@angular/core';
import { CalendarService } from '../../services/calendar.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {
  constructor(private calendarService: CalendarService, public activeModal: NgbActiveModal) { }


}
