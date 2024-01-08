import CalendarController from "./src/controllers/CalendarController.js";
import DataFetcher from "./src/services/DataFetcher.js";
import { ephemeride } from "./src/models/Ephemeride.js";
import { isYearValid } from "./src/utils/validators.js";

const form = document.querySelector("#form");
const calendarContainer = document.querySelector("#visibility_calendar");

const dataFetcher = new DataFetcher();
const calendarController = new CalendarController(
  calendarContainer,
  ephemeride,
  dataFetcher
);

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const year = e.target.annee.value;

  if (isYearValid(year)) {
    await calendarController.handleCalendarClick(parseInt(year));
  } else {
    alert("Merci d'entrer une année valide (un nombre à quatre chiffres)");
    return;
  }
});
