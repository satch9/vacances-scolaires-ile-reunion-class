import AbstractDataFetcher from "./abstract/AbstractDataFetcher.js";

export default class DataFetcher extends AbstractDataFetcher {
  constructor() {
    super();
    this.data = {
      vacances: [],
      jours_feries: [],
      rentree_scolaire: {
        academie: "Ile de la Réunion",
        data: [
          {
            periode: "2021-2022",
            date_de_rentree_eleve: "16/08/2021",
            date_de_rentree_enseignant: "13/08/2021",
          },
          {
            periode: "2022-2023",
            date_de_rentree_eleve: "16/08/2022",
            date_de_rentree_enseignant: "12/08/2022",
          },
          {
            periode: "2023-2024",
            date_de_rentree_eleve: "17/08/2023",
            date_de_rentree_enseignant: "16/08/2023",
          },
          {
            periode: "2024-2025",
            date_de_rentree_eleve: "19/08/2024",
            date_de_rentree_enseignant: "16/08/2024",
          },
          {
            periode: "2025-2026",
            date_de_rentree_eleve: "19/08/2025",
            date_de_rentree_enseignant: "18/08/2025",
          },
        ],
      },
    };
  }

  async calculateJoursFeries(year) {
    const JourAn = new Date(year + 1, "00", "01");
    const FeteTravail = new Date(year + 1, "04", "01");
    const Victoire1945 = new Date(year + 1, "04", "08");
    const FeteNationale = new Date(year + 1, "06", "14");
    const Assomption = new Date(year + 1, "07", "15");
    const Toussaint = new Date(year, "10", "01");
    const Armistice = new Date(year, "10", "11");
    const FeteCaf = new Date(year, "11", "20");
    const Noel = new Date(year, "11", "25");

    const G = (year + 1) % 19;
    const C = Math.floor((year + 1) / 100);
    const H =
      (C - Math.floor(C / 4) - Math.floor((8 * C + 13) / 25) + 19 * G + 15) %
      30;
    const I =
      H -
      Math.floor(H / 28) *
        (1 -
          Math.floor(H / 28) *
            Math.floor(29 / (H + 1)) *
            Math.floor((21 - G) / 11));
    const J =
      ((year + 1) * 1 +
        Math.floor((year + 1) / 4) +
        I +
        2 -
        C +
        Math.floor(C / 4)) %
      7;
    const L = I - J;
    const MoisPaques = 3 + Math.floor((L + 40) / 44);
    const JourPaques = L + 28 - 31 * Math.floor(MoisPaques / 4);
    const Paques = new Date(year + 1, MoisPaques - 1, JourPaques);
    const VendrediSaint = new Date(year + 1, MoisPaques - 1, JourPaques - 2);
    const LundiPaques = new Date(year + 1, MoisPaques - 1, JourPaques + 1);
    const Ascension = new Date(year + 1, MoisPaques - 1, JourPaques + 39);
    const Pentecote = new Date(year + 1, MoisPaques - 1, JourPaques + 49);
    const LundiPentecote = new Date(year + 1, MoisPaques - 1, JourPaques + 50);

    this.data.jours_feries.push({
      name: "Toussaint",
      dte: Toussaint,
    });
    this.data.jours_feries.push({
      name: "Armistice",
      dte: Armistice,
    });
    this.data.jours_feries.push({
      name: "Fête Caf",
      dte: FeteCaf,
    });
    this.data.jours_feries.push({
      name: "Noël",
      dte: Noel,
    });

    this.data.jours_feries.push({
      name: "Jour de l'An",
      dte: JourAn,
    });
    this.data.jours_feries.push({
      name: "Vendredi Saint",
      dte: VendrediSaint,
    });
    this.data.jours_feries.push({
      name: "Pâques",
      dte: Paques,
    });
    this.data.jours_feries.push({
      name: "Lundi de Pâques",
      dte: LundiPaques,
    });
    this.data.jours_feries.push({
      name: "Fête du travail",
      dte: FeteTravail,
    });
    this.data.jours_feries.push({
      name: "Victoire de 1945",
      dte: Victoire1945,
    });
    this.data.jours_feries.push({
      name: "Ascension",
      dte: Ascension,
    });
    this.data.jours_feries.push({
      name: "Pentecôte",
      dte: Pentecote,
    });
    this.data.jours_feries.push({
      name: "Lundi de Pentecôte",
      dte: LundiPentecote,
    });
    this.data.jours_feries.push({
      name: "Fête Nationale",
      dte: FeteNationale,
    });
    this.data.jours_feries.push({
      name: "Assomption",
      dte: Assomption,
    });
  }

  async fetchVacancesScolaires(year) {
    const url = `https://data.education.gouv.fr/api/records/1.0/search/?dataset=fr-en-calendrier-scolaire&q=annee_scolaire%3D%22${year}-${
      year + 1
    }%22&rows=30&sort=start_date&facet=description&facet=population&facet=start_date&facet=end_date&facet=zones&refine.zones=R%C3%A9union&timezone=Indian%2FReunion`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      this.processVacancesData(data);
    } catch (error) {
      console.log(error);
    }
  }

  processVacancesData(apiData) {
    for (const key in apiData) {
      if (Array.isArray(apiData[key])) {
        apiData[key].forEach((element) => {
          if (element.fields) {
            if (element.fields.description === "Vacances après 1ère période") {
              this.data.vacances[0] = element.fields;
            }
            if (element.fields.description === "Vacances d'Été austral") {
              this.data.vacances[1] = element.fields;
            }
            if (element.fields.description === "Vacances après 3ème période") {
              this.data.vacances[2] = element.fields;
            }
            if (element.fields.description === "Vacances après 4ème période") {
              this.data.vacances[3] = element.fields;
            }
            if (element.fields.description === "Vacances d'Hiver austral") {
              this.data.vacances[4] = element.fields;
            }
          }
        });
      }
    }
  }

  async fetchData(year) {
    await this.calculateJoursFeries(year);
    await this.fetchVacancesScolaires(year);

    return this.data;
  }
}
