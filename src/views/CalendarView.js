import { openPopup } from "../utils/popup.js";

export class CalendarView {
  constructor(container) {
    this.container = container;
    this.titlePrincipal = document.querySelector("#title_principal");
  }

  setConges(conges) {
    this.conges = conges; // Définir les données de congés ici
  }

  setTitle(location, schoolYear) {
    const str = "à l'île de la";
    this.titlePrincipal.textContent = `${str[0].toUpperCase()}${str.slice(
      1
    )} ${location} pour l'année scolaire ${schoolYear}`;
  }

  addElement(element) {
    this.container.appendChild(element);
  }

  clearCalendar() {
    this.container.innerHTML = "";
  }

  createHtmlElement(tag, classes, text = "") {
    const element = document.createElement(tag);
    element.className = classes;
    element.textContent = text;
    return element;
  }

  createMonthDiv(mois, anneeMois) {
    const moisDiv = this.createHtmlElement(
      "div",
      "bg-white shadow overflow-hidden rounded-lg mb-6"
    );
    const moisHeader = this.createHtmlElement(
      "div",
      "px-4 py-5 sm:px-6 border-b border-gray-200 text-lg font-medium text-gray-900",
      mois + " " + anneeMois
    );
    moisDiv.appendChild(moisHeader);
    moisDiv.appendChild(this.createDaysOfWeek());
    return moisDiv;
  }

  createGridDiv(firstDayOfMonth) {
    const gridDiv = this.createHtmlElement(
      "div",
      "grid grid-cols-7 gap-4 p-4 sm:grid-cols-7 md:grid-cols-7 lg:grid-cols-7"
    );
    if (firstDayOfMonth !== 1) {
      this.addPaddingDays(gridDiv, firstDayOfMonth);
    }
    return gridDiv;
  }

  addPaddingDays(gridDiv, firstDayOfMonth) {
    const daysToAdd = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    for (let i = 0; i < daysToAdd; i++) {
      gridDiv.appendChild(document.createElement("div"));
    }
  }

  createDayDiv(jour, index, moisIndex, anneeMois) {
    const jourNum = index + 1;
    const jourDivClass =
      "flex justify-center items-center w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-white border rounded-lg text-center cursor-pointer hover:bg-gray-100";
    const jourDiv = this.createHtmlElement(
      "div",
      jourDivClass,
      jourNum.toString()
    );
    this.decorateDayDiv(jourDiv, jourNum, moisIndex, anneeMois, jour);
    return jourDiv;
  }

  decorateDayDiv(jourDiv, jourNum, moisIndex, anneeMois, jour) {
    const jourDate = new Date(anneeMois, moisIndex, jourNum);
    const { isFerie, name } = this.isJourFerie(jourNum, moisIndex);
    const rentreeInfo = this.checkRentree(jourDate);
    console.log(isFerie, name);
    if (isFerie) {
      jourDiv.classList.add("bg-red-100", "text-red-800");
    } else if (rentreeInfo) {
      jourDiv.classList.add("bg-blue-100", "text-blue-800");
    }

    if (this.isVacationDay(jourDate)) {
      jourDiv.classList.add("border-2", "border-green-500");
    }
    //console.log("jour", jour);
    jourDiv.onclick = () => this.showDayInfo(jourNum, jour, rentreeInfo, name);
  }

  isJourFerie(jourNum, moisIndex) {
    const jourFerie = this.conges.jours_feries.find(
      (j) => j.dte.getDate() === jourNum && j.dte.getMonth() === moisIndex
    );

    return jourFerie
      ? { isFerie: true, name: jourFerie.name }
      : { isFerie: false };
  }

  isVacationDay(jourDate) {
    return this.conges.vacances.some((v) => {
      const startDate = new Date(v.start_date);
      const endDate = new Date(v.end_date);
      endDate.setDate(endDate.getDate() - 1); // Les vacances s'arrêtent à date de fin -1
      return jourDate >= startDate && jourDate <= endDate;
    });
  }
  showDayInfo(jourNum, jour, rentreeInfo, name) {
    let popupText;
    /* if (name) {
      popupText = `${jourNum}: ${jour[1]} ${jour[0]} / Jour férié : ${name}`;
    } else {
      popupText = `${jourNum}: ${jour[1]} ${jour[0]}`;
    } */

    popupText = `${jourNum}: ${jour[1]} ${jour[0]}`;

    if (rentreeInfo) {
      popupText += ` / Rentrée scolaire: ${rentreeInfo.type}`;
    }
    openPopup(popupText);
  }

  checkRentree(jourDate) {
    const jourDateFormat = `${String(jourDate.getDate()).padStart(
      2,
      "0"
    )}/${String(jourDate.getMonth() + 1).padStart(
      2,
      "0"
    )}/${jourDate.getFullYear()}`;

    const rentreeEleve = this.conges.rentree_scolaire.data.some(
      (e) => e.date_de_rentree_eleve === jourDateFormat
    );
    const rentreeEnseignant = this.conges.rentree_scolaire.data.some(
      (e) => e.date_de_rentree_enseignant === jourDateFormat
    );

    if (rentreeEleve) {
      return {
        date: rentreeEleve.date_de_rentree_eleve,
        type: "Élèves",
      };
    }
    if (rentreeEnseignant) {
      return {
        date: rentreeEnseignant.date_de_rentree_enseignant,
        type: "Enseignants",
      };
    }

    return null;
  }

  createDaysOfWeek() {
    const jours = ["L", "M", "M", "J", "V", "S", "D"];
    const daysOfWeekDiv = document.createElement("div");
    daysOfWeekDiv.className = "grid grid-cols-7 text-center font-bold";

    jours.forEach((jour) => {
      const dayDiv = document.createElement("div");
      dayDiv.textContent = jour;
      daysOfWeekDiv.appendChild(dayDiv);
    });

    return daysOfWeekDiv;
  }
}
