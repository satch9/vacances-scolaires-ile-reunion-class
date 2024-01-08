export function isYearValid(year) {
  if (!year) return false;

  const anneeNumerique = parseInt(year, 10);
  return (
    !isNaN(anneeNumerique) &&
    year.length === 4 &&
    anneeNumerique > 1900 &&
    anneeNumerique <= new Date().getFullYear() + 1
  );
}
