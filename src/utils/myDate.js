export function getFirstDayOfMonth(annee, mois) {
  return new Date(annee, mois, 1).getDay();
}
