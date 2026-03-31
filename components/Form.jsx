'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Link from 'next/link';
import { AiOutlineUser, AiOutlineMail } from 'react-icons/ai';
import { BsTelephone } from 'react-icons/bs';
import { IoClose } from 'react-icons/io5';
import { gsap } from 'gsap';

const Form = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const formRef = useRef(null);
  const modalContentRef = useRef(null);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    watch,
  } = useForm();

  const watchedPhone = watch('Phone', '');

  // GSAP Animations
  useEffect(() => {
    if (!formRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );

      const fields = formRef.current.querySelectorAll('.form-field');
      if (fields.length) {
        gsap.fromTo(
          fields,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power2.out',
            delay: 0.2,
          }
        );
      }
    }, formRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!modalContentRef.current) return;

    if (showSuccess) {
      gsap.fromTo(
        modalContentRef.current,
        { opacity: 0, scale: 0.85, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.2)' }
      );
    }
  }, [showSuccess]);

  const onSubmit = async (values) => {
    console.log('📝 Отправка формы:', values);

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/contact', values, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000,
      });

      if (response.status === 200 && response.data.success) {
        setShowSuccess(true);
        reset();
        setTimeout(() => setShowSuccess(false), 5000);
      } else {
        throw new Error(response.data.error || 'Неизвестная ошибка');
      }
    } catch (err) {
      console.error('❌ Ошибка отправки:', err);
      if (err.code === 'ECONNABORTED') {
        setError('Превышено время ожидания ответа. Проверьте интернет-соединение.');
      } else if (err.response) {
        setError(`Ошибка: ${err.response.data?.error || 'Ошибка сервера'}`);
      } else {
        setError('Сервер не отвечает. Проверьте интернет-соединение.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => setShowSuccess(false);

  // Fixed phone input handler for 10 digits
  const handlePhoneInput = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    // Limit to 10 digits (without country code)
    if (value.length > 10) value = value.slice(0, 10);
    setValue('Phone', value, { shouldValidate: true });
    e.target.value = value;
  };

  // Format phone number as: +7 9** *** ** **
  const formatPhoneVisual = (raw) => {
    if (!raw) return '';
    // Format as: 9** *** ** **
    if (raw.length >= 1) {
      let formatted = raw.slice(0, 1);
      if (raw.length >= 2) formatted += raw.slice(1, 2);
      if (raw.length >= 3) formatted += raw.slice(2, 3);
      if (raw.length >= 4) formatted += ' ' + raw.slice(3, 4);
      if (raw.length >= 5) formatted += raw.slice(4, 5);
      if (raw.length >= 6) formatted += raw.slice(5, 6);
      if (raw.length >= 7) formatted += ' ' + raw.slice(6, 7);
      if (raw.length >= 8) formatted += raw.slice(7, 8);
      if (raw.length >= 9) formatted += ' ' + raw.slice(8, 9);
      if (raw.length >= 10) formatted += raw.slice(9, 10);
      return formatted;
    }
    return raw;
  };

  return (
    <>
      <div className=" py-10 md:py-15 bg-gradient-to-br from-zinc-50 via-white to-zinc-100 flex items-center">
        <div className="w-full max-w-lg mx-auto px-5 sm:px-6">
          <div ref={formRef} className="bg-white rounded-3xl shadow-xl shadow-black/5 px-4 md:p-10 border border-zinc-100">
            
            {/* Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-4 bg-yellow-main/10 rounded-2xl ">
              </div>
              <h1 className="text-3xl md:text-4xl font-light tracking-tight text-zinc-900">
                Напишите нам
              </h1>
              <p className="mt-3 text-zinc-500 text-[15px]">
                Мы ответим в ближайшее время
              </p>
            </div>

            <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
              {/* Name Field */}
              <div className="form-field">
                <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-1.5 font-medium">
                  Ваше имя
                </label>
                <div className="relative group">
                  <AiOutlineUser className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 text-xl transition-colors group-focus-within:text-yellow-main" />
                  <input
                    type="text"
                    placeholder="Иван Иванов"
                    {...register('Name', { required: 'Пожалуйста, укажите ваше имя', minLength: { value: 2, message: 'Имя должно содержать минимум 2 символа' } })}
                    className="w-full pl-14 pr-5 py-4 bg-zinc-50 border border-transparent focus:border-yellow-main rounded-2xl outline-none text-zinc-800 placeholder:text-zinc-400 transition-all focus:bg-white focus:shadow-sm text-[15px]"
                  />
                </div>
                {errors.Name && <p className="text-red-500 text-xs mt-1.5 pl-1">{errors.Name.message}</p>}
              </div>

              {/* Email Field */}
              <div className="form-field">
                <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-1.5 font-medium">
                  Email адрес
                </label>
                <div className="relative group">
                  <AiOutlineMail className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 text-xl transition-colors group-focus-within:text-yellow-main" />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    {...register('Email', {
                      required: 'Пожалуйста, укажите email',
                      pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Введите корректный email адрес' },
                    })}
                    className="w-full pl-14 pr-5 py-4 bg-zinc-50 border border-transparent focus:border-yellow-main rounded-2xl outline-none text-zinc-800 placeholder:text-zinc-400 transition-all focus:bg-white focus:shadow-sm text-[15px]"
                  />
                </div>
                {errors.Email && <p className="text-red-500 text-xs mt-1.5 pl-1">{errors.Email.message}</p>}
              </div>

              {/* Phone Field with proper formatting */}
              <div className="form-field">
                <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-1.5 font-medium">
                  Номер телефона
                </label>
                <div className="relative group">
                  <BsTelephone className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 text-xl transition-colors group-focus-within:text-yellow-main" />
                  <div className="absolute left-14 top-1/2 -translate-y-1/2 text-zinc-400 text-sm pointer-events-none">
                    +7
                  </div>
                  <input
                    type="tel"
                    placeholder="9__ ___ __ __"
                    {...register('Phone', { 
                      required: 'Пожалуйста, укажите номер телефона',
                      pattern: { value: /^[0-9]{10}$/, message: 'Введите корректный номер телефона (10 цифр)' } 
                    })}
                    onInput={handlePhoneInput}
                    className="w-full pl-24 pr-5 py-4 bg-zinc-50 border border-transparent focus:border-yellow-main rounded-2xl outline-none text-zinc-800 placeholder:text-zinc-400 transition-all focus:bg-white focus:shadow-sm text-[15px]"
                  />
                </div>
                {errors.Phone && <p className="text-red-500 text-xs mt-1.5 pl-1">{errors.Phone.message}</p>}
                <div className="mt-2 pl-1 flex items-center gap-2 text-[13px]">
                  {/* <span className="text-emerald-600 font-medium">+7</span> */}
                  {/* <span className="text-zinc-400">
                    {watchedPhone ? formatPhoneVisual(watchedPhone) : '9__ ___ __ __'}
                  </span> */}
                </div>
              </div>

              {/* Message Field */}
              <div className="form-field">
                <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-1.5 font-medium">
                  Сообщение
                </label>
                <textarea
                  placeholder="Расскажите подробнее о вашем запросе..."
                  rows={5}
                  {...register('Message', { required: 'Пожалуйста, напишите ваше сообщение', minLength: { value: 10, message: 'Сообщение должно содержать минимум 10 символов' } })}
                  className="w-full px-5 py-4 bg-zinc-50 border border-transparent focus:border-yellow-main rounded-3xl outline-none text-zinc-800 placeholder:text-zinc-400 transition-all focus:bg-white focus:shadow-sm resize-y min-h-[140px] text-[15px]"
                />
                {errors.Message && <p className="text-red-500 text-xs mt-1.5 pl-1">{errors.Message.message}</p>}
              </div>

              {/* Agreement */}
              <div className="form-field pt-2">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    {...register('Agreement', { required: 'Необходимо принять условия обработки персональных данных' })}
                    className="mt-1 w-5 h-5 accent-yellow-main border-2 border-zinc-300 rounded focus:ring-yellow-main cursor-pointer"
                  />
                  <span className="text-sm text-zinc-600 leading-relaxed select-none">
                    Согласен с{' '}
                    <Link href="/confidential" className="text-yellow-main hover:text-yellow-600 border-b border-yellow-main/60 hover:border-yellow-main transition-all" target="_blank">
                      условиями
                    </Link>{' '}
                    обработки персональных данных *
                  </span>
                </label>
                {errors.Agreement && <p className="text-red-500 text-xs mt-2 pl-8">{errors.Agreement.message}</p>}
              </div>

              {/* Main Submit Button - Consistent styling */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-[#fac800] border-1 border-[#fac800] hover:bg-white hover:text-[#fac800] text-white font-semibold text-base rounded-2xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-yellow-main/30 hover:shadow-xl hover:-translate-y-px flex items-center justify-center gap-3 group"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Отправка...</span>
                  </>
                ) : (
                  <>
                    Отправить сообщение
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </>
                )}
              </button>

              {/* Secondary Buttons - Consistent styling with yellow theme */}
              <div className="grid grid-cols-1 gap-4 pt-4 pb-5">
                <Link href="/sout" className="block">
                  <button
                    type="button"
                    className="group w-full py-4 border-1 border-[#fac800] bg-transparent hover:bg-[#fac800] text-[#fac800] hover:text-white font-medium rounded-2xl transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2.5"
                  >
                    СОУТ
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </button>
                </Link>

                <Link href="/confidential" className="block">
                  <button
                    type="button"
                    className="group w-full py-4 border-1 border-[#fac800] bg-transparent hover:bg-[#fac800] text-[#fac800] hover:text-white font-medium rounded-2xl transition-all duration-300 active:scale-[0.98]"
                  >
                    Политика Конфиденциальности
                  </button>
                </Link>
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-2xl text-red-700 text-sm">
                  {error}
                </div>
              )}
            </form>
          </div>

        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" onClick={closeModal} />
          <div ref={modalContentRef} className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-10 text-center">
              <div className="mx-auto mb-8 w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-11 h-11 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.75">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-zinc-900 mb-3">Спасибо за сообщение!</h3>
              <p className="text-zinc-600 leading-relaxed text-[15px]">
                Мы получили вашу заявку.<br />Скоро свяжемся с вами.
              </p>
            </div>
            <div className="border-t border-zinc-100 px-10 py-6 flex justify-center">
              <button
                onClick={closeModal}
                className="flex items-center gap-2 px-8 py-3 text-sm font-medium text-zinc-500 hover:text-black transition-colors group"
              >
                <IoClose className="text-xl group-hover:rotate-90 transition-transform" />
                Закрыть
              </button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-main to-transparent" />
          </div>
        </div>
      )}
    </>
  );
};

export default Form;