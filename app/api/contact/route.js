import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  console.log('=== API Route вызван ===');
  
  try {
    const body = await request.json();
    const { Name, Email, Message, Phone, Agreement } = body;

    // Валидация
    if (!Name || !Email || !Message) {
      return NextResponse.json(
        { error: 'Заполните все обязательные поля' },
        { status: 400 }
      );
    }

    if (!process.env.YANDEX_EMAIL || !process.env.YANDEX_PASSWORD) {
      console.error('❌ Отсутствуют переменные окружения');
      return NextResponse.json(
        { error: 'Ошибка конфигурации сервера' },
        { status: 500 }
      );
    }

    // Пробуем разные конфигурации SMTP
    const smtpConfigs = [
      // Конфигурация 1: Yandex с портом 465 (SSL)
      {
        host: 'smtp.yandex.ru',
        port: 465,
        secure: true,
        auth: {
          user: process.env.YANDEX_EMAIL,
          pass: process.env.YANDEX_PASSWORD,
        },
        tls: { rejectUnauthorized: false },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 10000,
      },
      // Конфигурация 2: Yandex с портом 587 (STARTTLS)
      {
        host: 'smtp.yandex.ru',
        port: 587,
        secure: false,
        auth: {
          user: process.env.YANDEX_EMAIL,
          pass: process.env.YANDEX_PASSWORD,
        },
        tls: { rejectUnauthorized: false },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 10000,
      },
      // Конфигурация 3: Yandex.com (международный)
      {
        host: 'smtp.yandex.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.YANDEX_EMAIL,
          pass: process.env.YANDEX_PASSWORD,
        },
        tls: { rejectUnauthorized: false },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 10000,
      },
    ];

    let transporter = null;
    let lastError = null;

    // Пробуем каждую конфигурацию
    for (const config of smtpConfigs) {
      try {
        console.log(`🔌 Пробуем подключение к ${config.host}:${config.port}...`);
        
        const testTransporter = nodemailer.createTransport(config);
        await testTransporter.verify();
        
        console.log(`✅ Успешное подключение к ${config.host}:${config.port}`);
        transporter = testTransporter;
        break;
      } catch (error) {
        console.log(`❌ Не удалось подключиться к ${config.host}:${config.port} - ${error.code || error.message}`);
        lastError = error;
      }
    }

    if (!transporter) {
      console.error('❌ Не удалось подключиться ни к одному SMTP серверу');
      return NextResponse.json(
        { error: 'Не удалось подключиться к почтовому серверу. Попробуйте позже.' },
        { status: 500 }
      );
    }

    // Формируем письмо
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #ffca28; padding: 20px; text-align: center;">
          <h2>📧 Новая заявка с сайта ЭПОЛЕТ</h2>
        </div>
        <div style="padding: 20px; background: #f9f9f9;">
          <p><strong>👤 Имя:</strong> ${escapeHtml(Name)}</p>
          <p><strong>📞 Телефон:</strong> ${escapeHtml(Phone || 'Не указан')}</p>
          <p><strong>📧 Email:</strong> ${escapeHtml(Email)}</p>
          <p><strong>💬 Сообщение:</strong></p>
          <p style="background: white; padding: 10px; border-radius: 5px;">${escapeHtml(Message)}</p>
          <p><strong>✅ Согласие:</strong> ${Agreement ? 'Принято' : 'Не принято'}</p>
        </div>
      </div>
    `;

    // Отправляем письмо
    const info = await transporter.sendMail({
      from: `"${Name}" <${process.env.YANDEX_EMAIL}>`,
      replyTo: Email,
      to: 'katezi@bk.ru',
   //   to: 'partner@epolet5.ru',
      subject: `Новая заявка от ${Name}`,
      html: htmlContent,
    });

    console.log('✅ Письмо отправлено:', info.messageId);

    return NextResponse.json(
      { success: true, message: 'Сообщение отправлено' },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('❌ Ошибка:', error);
    return NextResponse.json(
      { error: 'Ошибка отправки. Попробуйте позже.' },
      { status: 500 }
    );
  }
}

function escapeHtml(text) {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}