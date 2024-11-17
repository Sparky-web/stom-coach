import RequisitesInterface from "../types/requisites"

export const getRequisitesString = ({
  company, bankAccount, bankDetails,
}: RequisitesInterface) => {
  console.log(bankDetails)
  return `${company.value}
Адрес: ${company.data.address.value}
ИНН: ${company.data.inn}
КПП: ${company.data.kpp}
Банк: ${bankDetails.value}
Банковский счет: ${bankAccount}
${company.data.management?.post || ''}: ${company.data.management?.name || ''}`
}