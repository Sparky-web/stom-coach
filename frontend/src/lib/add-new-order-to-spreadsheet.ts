// Подключаем необходимые модули
// const { google } = require('googleapis');
// const fs = require('fs');
// require('dotenv').config();

import { google } from 'googleapis';
import { DateTime } from 'luxon';
import { env } from '~/env';
import { SanitizedLegalOrder, SanitizedOrder } from '~/types/entities';

// Чтение учетных данных из файла

const scopes = ['https://www.googleapis.com/auth/spreadsheets'];

// Создаем клиент авторизации
async function authorize() {
  const client_email = env.GOOGLE_API_EMAIL
  const private_key = env.GOOGLE_API_KEY
  const auth = new google.auth.JWT(client_email, null, private_key, scopes);
  return auth;
}

// Функция для добавления строки
async function appendRow(auth: any, row: string[], sheetName: string = '') {
  const sheets = google.sheets({ version: 'v4', auth });

  // Получаем ID таблицы из .env
  const spreadsheetId = env.GOOGLE_SPREADSHEET_ID;

  // Имя листа, куда нужно добавить строку
  const range = `${sheetName}!A:A`; // Диапазон для определения последней строки

  // Получаем данные о последней заполненной строке
  const getRows = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  // Определяем индекс следующей строки
  const nextRow = getRows.data.values ? getRows.data.values.length + 1 : 1;

  // Данные, которые нужно добавить
  // Добавляем строку после последней заполненной строки
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A${nextRow}`,
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: [row],
    },
  });
}


// Основная функция
export async function addOrderToSpreadsheet(order: SanitizedOrder) {
  const auth = await authorize();
  await appendRow(auth, [
    order.event_name, order.option_name, order.first_name, order.last_name, order.second_name, order.phone, order.email,
    order.price?.toString() || '', order.is_paid ? 'Да' : 'Нет', order.sberbank_order_id || '', order.sberbank_payment_url || '',
    order.workplace, order.position, order.speciality, DateTime.now().toLocaleString(DateTime.DATETIME_FULL)
  ], 'Обычные заказы');
}

export async function addLegalOrderToSpreadsheet(order: SanitizedLegalOrder) {
  const auth = await authorize();
  await appendRow(auth, [
    order.event_name, order.option_name, order.name, order.phone,
    order.company, order.email, DateTime.now().toLocaleString(DateTime.DATETIME_FULL)
  ], 'Юридические заказы');
}

// main().catch(console.error);
