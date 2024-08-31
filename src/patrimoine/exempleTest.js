import Personne from "./models/Personne";
import BienMateriel from "./models/possessions/BienMateriel";

const personne = new Personne("Jimmy");
const possession1 = new BienMateriel(personne,"Mac book",800000,new Date("2013-10-5"),new Date("2024-08-08"),5);
