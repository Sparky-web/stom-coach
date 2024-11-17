import RequisitesInterface from "../types/requisites";

export default function getRequisitesFullString ({
    company, bankAccount, bankDetails
}: RequisitesInterface) {
    return `Полное наименование: ${company.data.name.full_with_opf || ''}
Краткое наименование: ${company.value}
Организационно-правовая форма: ${company.data.opf.full || ''}
ИНН/КПП: ${company.data.inn || ''}/${company.data.kpp ||''}
ОРГН: ${company.data.ogrn ||''}
ОКПО: ${company.data.okpo ||''}
Юридический адрес: ${company.data.address?.unrestricted_value || ''}
Банк: ${bankDetails.unrestricted_value || ''}
БИК: ${bankDetails.data.bic || ''}
Расчетный счет: ${bankAccount}
ОКТМО: ${company.data.oktmo || ''}
${company.data.management?.post || ''}: ${company.data.management?.name || ''}`
}