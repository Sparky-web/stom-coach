import { DaDataSuggestion, DaDataParty, DaDataBank } from "react-dadata";

export default interface RequisitesInterface {
    company: DaDataSuggestion<DaDataParty>,
    bankAccount: string,
    bankDetails: DaDataSuggestion<DaDataBank>
  }