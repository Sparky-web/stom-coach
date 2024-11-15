import { DaDataBank, DaDataParty, DaDataSuggestion } from "react-dadata"

export const getRequisitesString = ({
  company, bankAccount, bankDetails,
}: {
  company: DaDataSuggestion<DaDataParty>,
  bankAccount: string,
  bankDetails: DaDataSuggestion<DaDataBank>
}) => {
  return `${company.value}
Адрес: ${company.data.address.value}
ИНН: ${company.data.inn}
КПП: ${company.data.kpp}
Банк: ${bankDetails.value}
Банковский счет: ${bankAccount}`
}