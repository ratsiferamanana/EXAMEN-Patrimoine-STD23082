export default class Possession {
  constructor(possesseur, libelle, valeur, dateDebut, dateFin, tauxAmortissement) {
    this.possesseur = possesseur;
    this.libelle = libelle;
    this.valeur = valeur;
    this.dateDebut = dateDebut;
    this.dateFin = dateFin;
    this.tauxAmortissement = tauxAmortissement;
  }

  getValeur(currentDate) {
    let dateDebut = this.dateDebut;
    let dateFin = this.dateFin ? this.dateFin : currentDate;

    let yearsElapsed = (dateFin - dateDebut) / (1000 * 60 * 60 * 24 * 365); // Différence en années

    let depreciation = this.valeur * (this.tauxAmortissement / 100) * yearsElapsed;
    let valeurActuelle = this.valeur - depreciation;

    return Math.max(valeurActuelle, 0); // Assurer que la valeur actuelle ne soit pas négative
  }
}
