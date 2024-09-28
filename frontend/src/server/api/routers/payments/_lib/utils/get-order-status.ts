import axios from "axios";
import { env } from "~/env";

export default async function getOrderStatus(orderId: string) {
  const url = 'https://securepayments.sberbank.ru/payment/rest/getOrderStatusExtended.do'; // Тестовый URL для API Сбербанка
  const data = {
    orderId: orderId, // Уникальный идентификатор заказа, который вы получили при создании счета
    userName: env.SBER_LOGIN, // Ваш логин для доступа к API Сбербанка
    password: env.SBER_PASSWORD // Ваш пароль для доступа к API Сбербанка
  }

  const response = await axios.post(url, null, { params: data, httpsAgent: new https.Agent({ rejectUnauthorized: false }) });
  console.log('Ответ от API Сбербанка:', response.data)

  if (response.data.errorCode === '0') {
    return response.data.orderStatus;
  } else {
    throw new Error('Ошибка получения статуса заказа:' + response.data.errorMessage);
  }
}
