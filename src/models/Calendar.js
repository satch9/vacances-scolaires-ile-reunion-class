import ICalendar from "./interfaces/ICalendar.js";
import { getFirstDayOfMonth } from "../utils/myDate.js";

export default class Calendar extends ICalendar {
  constructor(calendarView, year, ephemeride, conges) {
    super();
    this.calendarView = calendarView;
    this.year = year;
    this.ephemeride = ephemeride;
    this.conges = conges;
    this.moisIndices = this.initMoisIndices();
    this.monthOrder = this.initMonthOrder();
  }

  // Méthode pour initialiser le calendrier
  init() {
    this.calendarView.setConges(this.conges);
    this.calendarView.clearCalendar();
    this.monthOrder.forEach((mois, moisOrdreIndex) => {
      this.addMonthToCalendar(mois, moisOrdreIndex);
    });
    console.log("this.conges", this.conges);
  }

  initMoisIndices() {
    return {
      Janvier: 0,
      Février: 1,
      Mars: 2,
      Avril: 3,
      Mai: 4,
      Juin: 5,
      Juillet: 6,
      Août: 7,
      Septembre: 8,
      Octobre: 9,
      Novembre: 10,
      Décembre: 11,
    };
  }

  initMonthOrder() {
    return [
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
    ];
  }

  // Méthode pour ajouter un mois au calendrier
  addMonthToCalendar(mois, moisOrdreIndex) {
    const moisIndex = this.moisIndices[mois];

    let anneeMois;
    if (moisOrdreIndex === 12) {
      anneeMois = parseInt(this.year) + 1;
    } else {
      anneeMois = moisIndex >= 7 ? this.year : parseInt(this.year) + 1;
    }

    const moisDiv = this.calendarView.createMonthDiv(mois, anneeMois);

    // Déterminer le premier jour du mois
    const firstDayOfMonth = getFirstDayOfMonth(anneeMois, moisIndex);
    const gridDiv = this.calendarView.createGridDiv(firstDayOfMonth);

    this.ephemeride[mois].forEach((jour, index) => {
      const jourDiv = this.calendarView.createDayDiv(
        jour,
        index,
        moisIndex,
        anneeMois
      );
      gridDiv.appendChild(jourDiv);
    });

    moisDiv.appendChild(gridDiv);
    this.calendarView.container.appendChild(moisDiv);
  }
}
