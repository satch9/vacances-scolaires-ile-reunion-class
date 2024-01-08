import Calendar from "../models/Calendar.js";
import { CalendarView } from "../views/CalendarView.js";

export default class CalendarController {
  constructor(calendarContainer, ephemeride, dataFetcher) {
    this.calendarView = new CalendarView(calendarContainer);
    this.ephemeride = ephemeride;
    this.dataFetcher = dataFetcher;
  }

  async handleCalendarClick(year) {
    const data = await this.dataFetcher.fetchData(year);

    this.calendarView.setConges(data);

    const calendar = new Calendar(
      this.calendarView,
      year,
      this.ephemeride,
      data
    );

    // Définir le titre principal dans la vue du calendrier
    this.calendarView.setTitle(
      data["vacances"][0].location,
      data["vacances"][0].annee_scolaire
    );

    calendar.init();
  }
}
