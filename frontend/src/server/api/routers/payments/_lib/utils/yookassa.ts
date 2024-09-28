import axios from "axios";
import { env } from "~/env";

const shopId = env.YOOKASSA_SHOP_ID; // Ваш shopId
const secretKey = env.YOOKASSA_SECRET_KEY; // Ваш секретный ключ
const paymentUrl = 'https://api.yookassa.ru/v3/payments';

type PaymentInfo = {
  amount: number;
  email: string;
  description: string;
  orderId: number;
  returnUrl: string;
}

// Функция создания платежа
export async function createPayment(paymentInfo: PaymentInfo) {
  const { amount, email, description, orderId, returnUrl } = paymentInfo;
  try {
    const response = await axios.post(
      paymentUrl,
      {
        amount: {
          value: amount,
          currency: 'RUB',
        },
        confirmation: {
          type: 'redirect',
          return_url: returnUrl,
        },
        capture: true, // Автоматическое списание
        description,
        receipt: {
          customer: {
            email, // E-mail покупателя
          },
          items: [
            {
              description: description, // Описание товара/услуги
              quantity: '1.00', // Количество
              amount: {
                value: amount, // Стоимость товара/услуги
                currency: 'RUB',
              },
              vat_code: 4, // Ставка НДС (1 - 20%, 2 - 10%, 3 - 0%, 4 - без НДС и т.д.)
            },
          ],
        },
      },
      {
        auth: {
          username: shopId,
          password: secretKey,
        },
        headers: {
          'Idempotence-Key': orderId.toString()
        }
      }
    );

    const payment = response.data;
    console.log('Платеж создан:', payment.id);
    console.log('Ссылка для оплаты:', payment.confirmation.confirmation_url);

    return {
      id: payment.id,
      paymentUrl: payment.confirmation.confirmation_url
    }; // Возвращаем идентификатор платежа для дальнейшей проверки
  } catch (error) {
    console.error(error)
    console.error('Ошибка при создании платежа:', error.response ? error.response.data : error.message);
    throw error;
  }
}


export async function checkPaymentStatus(paymentId: string) {
  try {
    const response = await axios.get(`${paymentUrl}/${paymentId}`, {
      auth: {
        username: shopId,
        password: secretKey,
      },
    });

    const payment = response.data;
    console.log('Статус платежа:', payment.status);

    return payment.status;
  } catch (error) {
    console.error('Ошибка при проверке статуса платежа:', error.response ? error.response.data : error.message);
    throw error;
  }
}
