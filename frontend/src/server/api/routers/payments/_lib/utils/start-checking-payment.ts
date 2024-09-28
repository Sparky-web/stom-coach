import strapi from "~/server/strapi";
import getOrderStatus from "./get-order-status";
import onPaymentSuccess from "./on-payment-success";
import { checkPaymentStatus } from "./yookassa";

export default async function startCheckingPayment(orderId: string, count: number = 0) {
  const maxCountCheck = (1000 * 60 * 20 / 30000) // 20 минут

  if (count > maxCountCheck) {
    const { data: [order] } = await strapi.get('orders', { filters: { sberbank_order_id: orderId } });
    await strapi.update('orders', order.id, {
      expired: true
    })

    return
  }

  try {
    console.log(`Проверка статуса заказа ${orderId}, попытка ${count}`)
    // const status = await getOrderStatus(orderId)
    const status = await checkPaymentStatus(orderId)


    if (status === 'succeeded') {
      await onPaymentSuccess(orderId)
      return
    }
    if (status === 'canceled') {
      // throw new Error('Платеж отменен')
      console.error(`Платеж ${orderId} отменен`)
      return
    } 
  } catch (e) {
    console.error(`Ошибка проверки статуса заказа ${orderId}, попытка ${count}`, e)
  }

  setTimeout(() => {
    startCheckingPayment(orderId, count + 1)
  }, 30000)
}
