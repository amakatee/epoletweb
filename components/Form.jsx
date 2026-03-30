'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Link from 'next/link';
import { AiOutlineUser, AiOutlineMail } from 'react-icons/ai';
import { BsTelephone } from 'react-icons/bs';

const Form = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const onSubmit = async (values) => {
    console.log('📝 Отправка формы:', values);
    
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/contact', values, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 секунд таймаут
      });
      
      console.log('✅ Ответ сервера:', response.data);
      
      if (response.status === 200 && response.data.success) {
        setShowSuccess(true);
        reset();
        
        // Автоматически скрыть сообщение через 5 секунд
        setTimeout(() => {
          setShowSuccess(false);
        }, 5000);
      } else {
        throw new Error(response.data.error || 'Неизвестная ошибка');
      }
    } catch (err) {
      console.error('❌ Ошибка отправки:', err);
      
      // Обработка разных типов ошибок
      if (err.code === 'ECONNABORTED') {
        setError('Превышено время ожидания ответа. Проверьте интернет-соединение.');
      } else if (err.response) {
        // Сервер ответил с ошибкой
        const serverError = err.response.data?.error || 'Ошибка сервера';
        setError(`Ошибка: ${serverError}`);
        
        // Детальное логирование
        console.error('Детали ошибки:', {
          status: err.response.status,
          data: err.response.data,
          headers: err.response.headers
        });
      } else if (err.request) {
        // Запрос был отправлен, но ответа нет
        setError('Сервер не отвечает. Проверьте интернет-соединение.');
      } else {
        // Ошибка на стороне клиента
        setError(err.message || 'Произошла ошибка при отправке');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setShowSuccess(false);
  };

  // Форматирование номера телефона (только цифры)
  const handlePhoneInput = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) {
      value = value.slice(0, 11);
    }
    e.target.value = value;
  };

  return (
    <>
      <div className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-md mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-light text-center text-gray-800 mb-10">
            Напишите нам
          </h1>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Поле Имя */}
            <div>
              <div className="relative">
                <AiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="text"
                  placeholder="Имя *"
                  {...register('Name', {
                    required: 'Пожалуйста, укажите ваше имя',
                    minLength: {
                      value: 2,
                      message: 'Имя должно содержать минимум 2 символа',
                    },
                  })}
                  className="w-full pl-10 pr-4 py-3 border-b-2 border-gray-300 focus:border-yellow-main bg-transparent outline-none transition-colors text-gray-700 placeholder:text-gray-400"
                />
              </div>
              {errors.Name && (
                <p className="text-red-500 text-sm mt-1 ml-1">
                  {errors.Name.message}
                </p>
              )}
            </div>

            {/* Поле Email */}
            <div>
              <div className="relative">
                <AiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="email"
                  placeholder="Email *"
                  {...register('Email', {
                    required: 'Пожалуйста, укажите email',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Введите корректный email адрес',
                    },
                  })}
                  className="w-full pl-10 pr-4 py-3 border-b-2 border-gray-300 focus:border-yellow-main bg-transparent outline-none transition-colors text-gray-700 placeholder:text-gray-400"
                />
              </div>
              {errors.Email && (
                <p className="text-red-500 text-sm mt-1 ml-1">
                  {errors.Email.message}
                </p>
              )}
            </div>

            {/* Поле Телефон */}
            <div>
              <div className="relative">
                <BsTelephone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="tel"
                  placeholder="Номер телефона"
                  {...register('Phone', {
                    pattern: {
                      value: /^[0-9]{10,11}$/,
                      message: 'Введите корректный номер телефона (10-11 цифр)',
                    },
                  })}
                  onInput={handlePhoneInput}
                  className="w-full pl-10 pr-4 py-3 border-b-2 border-gray-300 focus:border-yellow-main bg-transparent outline-none transition-colors text-gray-700 placeholder:text-gray-400"
                />
              </div>
              {errors.Phone && (
                <p className="text-red-500 text-sm mt-1 ml-1">
                  {errors.Phone.message}
                </p>
              )}
              <p className="text-gray-400 text-xs mt-1 ml-1">
                Формат: 9xx xxx xx xx (только цифры)
              </p>
            </div>

            {/* Поле Сообщение */}
            <div>
              <textarea
                placeholder="Сообщение *"
                rows={5}
                {...register('Message', {
                  required: 'Пожалуйста, напишите ваше сообщение',
                  minLength: {
                    value: 10,
                    message: 'Сообщение должно содержать минимум 10 символов',
                  },
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-yellow-main focus:ring-1 focus:ring-yellow-main bg-white outline-none transition-colors text-gray-700 placeholder:text-gray-400 resize-none"
              />
              {errors.Message && (
                <p className="text-red-500 text-sm mt-1 ml-1">
                  {errors.Message.message}
                </p>
              )}
            </div>

            {/* Чекбокс согласия */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  {...register('Agreement', {
                    required: 'Необходимо принять условия обработки персональных данных',
                  })}
                  className="mt-1 w-5 h-5 accent-yellow-main cursor-pointer"
                />
                <span className="text-sm text-gray-600 leading-relaxed">
                  Согласен с{' '}
                  <Link
                    href="/confidential"
                    className="text-yellow-main border-b border-yellow-main hover:opacity-80 transition-opacity"
                    target="_blank"
                  >
                    условиями
                  </Link>{' '}
                  обработки персональных данных *
                </span>
              </label>
              {errors.Agreement && (
                <p className="text-red-500 text-sm mt-2 ml-8">
                  {errors.Agreement.message}
                </p>
              )}
            </div>

            {/* Кнопка отправки */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-6 bg-yellow-main hover:bg-yellow-600 text-white font-medium rounded-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Отправка...
                </span>
              ) : (
                'Отправить сообщение'
              )}
            </button>

            {/* Дополнительные кнопки */}
            <div className="space-y-3">
              <Link href="/sout">
                <button
                  type="button"
                  className="w-full py-3 px-6 border-2 border-yellow-main text-yellow-main hover:bg-yellow-main hover:text-white font-medium rounded-lg transition-all"
                >
                  СОУТ
                </button>
              </Link>

              <Link href="/confidential">
                <button
                  type="button"
                  className="w-full py-3 px-6 border-2 border-gray-300 text-gray-600 hover:border-yellow-main hover:text-yellow-main font-medium rounded-lg transition-all"
                >
                  Политика Конфиденциальности
                </button>
              </Link>
            </div>

            {/* Сообщение об ошибке */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Модальное окно успеха */}
      {showSuccess && (
        <>
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 animate-fadeIn"
            onClick={closeModal}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-gradient-to-br from-green-500 to-green-600 rounded-2xl z-50 p-8 text-center shadow-2xl animate-slideUp">
            <div className="mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-white text-xl font-semibold mb-2">Спасибо!</h3>
              <p className="text-white/90">
                Ваше сообщение отправлено. <br />
                Мы свяжемся с вами в ближайшее время.
              </p>
            </div>
            <button
              onClick={closeModal}
              className="mt-4 px-6 py-2 bg-white text-green-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Закрыть
            </button>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translate(-50%, -40%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default Form;