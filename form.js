
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('rentalForm');

    initSelects();
    initPhoneInput();
    initFormValidation();


    function initSelects() {
        const selects = document.querySelectorAll('.select');

        selects.forEach(function(selectElement) {
            const trigger = selectElement.querySelector('.select__trigger');
            const dropdown = selectElement.querySelector('.select__dropdown');
            const options = selectElement.querySelectorAll('.select__option');
            const hiddenInput = selectElement.querySelector('.select__input');
            const valueSpan = selectElement.querySelector('.select__value');

            trigger.addEventListener('click', function(e) {
                e.preventDefault();
                closeAllSelects(selectElement);
                selectElement.classList.toggle('select--open');
            });

            options.forEach(function(option) {
                option.addEventListener('click', function() {
                    const value = option.getAttribute('data-value');
                    const text = option.textContent;

                    hiddenInput.value = value;
                    valueSpan.textContent = text;
                    valueSpan.classList.remove('select__value--placeholder');

                    options.forEach(function(opt) {
                        opt.classList.remove('select__option--selected');
                    });
                    option.classList.add('select__option--selected');

                    selectElement.classList.remove('select--open');

                    const wrapper = selectElement.closest('.form-field__wrapper');
                    if (wrapper) {
                        wrapper.classList.remove('form-field__wrapper--error');
                    }
                });
            });
        });

        document.addEventListener('click', function(e) {
            if (!e.target.closest('.select')) {
                closeAllSelects();
            }
        });
    }

    function closeAllSelects(except) {
        const selects = document.querySelectorAll('.select');
        selects.forEach(function(select) {
            if (select !== except) {
                select.classList.remove('select--open');
            }
        });
    }

    function initPhoneInput() {
        const phoneInput = document.querySelector('input[name="phone"]');

        if (!phoneInput) return;

        let isRussianFormat = true; // По умолчанию используем российский формат

        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, ''); // Удаляет всё кроме цифр

            if (value.length === 0) {
                e.target.value = '';
                isRussianFormat = true; // Сбрасываем к российскому формату при полной очистке
                return;
            }

            // Если пользователь явно удалил 7 и вводит другой код, переключаем на международный формат
            if (!isRussianFormat || (!value.startsWith('7') && value.length > 0)) {
                // Международный формат
                let countryCode = '';
                let phoneNumber = value;

                // Автоматически определяем код страны по первым цифрам
                if (value.startsWith('1') && value.length >= 1) {
                    countryCode = '1';
                    phoneNumber = value.substring(1);
                } else if (value.startsWith('44') && value.length >= 2) {
                    countryCode = '44';
                    phoneNumber = value.substring(2);
                } else if (value.startsWith('66') && value.length >= 2) {
                    countryCode = '66';
                    phoneNumber = value.substring(2);
                } else if (value.startsWith('49') && value.length >= 2) {
                    countryCode = '49';
                    phoneNumber = value.substring(2);
                } else if (value.startsWith('33') && value.length >= 2) {
                    countryCode = '33';
                    phoneNumber = value.substring(2);
                } else if (value.startsWith('39') && value.length >= 2) {
                    countryCode = '39';
                    phoneNumber = value.substring(2);
                } else if (value.startsWith('34') && value.length >= 2) {
                    countryCode = '34';
                    phoneNumber = value.substring(2);
                } else if (value.length >= 3) {
                    countryCode = value.substring(0, 3);
                    phoneNumber = value.substring(3);
                } else if (value.length >= 2) {
                    countryCode = value.substring(0, 2);
                    phoneNumber = value.substring(2);
                } else {
                    countryCode = value;
                    phoneNumber = '';
                }

                // Форматируем международный номер
                let formatted = `+${countryCode}`;

                if (countryCode === '1') {
                    formatted += ' (';
                    if (phoneNumber.length > 0) formatted += phoneNumber.substring(0, 3);
                    if (phoneNumber.length >= 3) formatted += ') ' + phoneNumber.substring(3, 6);
                    if (phoneNumber.length >= 6) formatted += '-' + phoneNumber.substring(6, 10);
                } else if (countryCode.length === 2) {
                    // Новый формат для 2-значных кодов: +66 (XXX) XXX XXXXX
                    formatted += ' (';
                    if (phoneNumber.length > 0) formatted += phoneNumber.substring(0, 3);
                    if (phoneNumber.length >= 3) formatted += ') ' + phoneNumber.substring(3, 6);
                    if (phoneNumber.length >= 6) formatted += ' ' + phoneNumber.substring(6, 11);
                } else {
                    formatted += ' ';
                    if (phoneNumber.length > 0) formatted += phoneNumber.substring(0, 2);
                    if (phoneNumber.length >= 2) formatted += ' ' + phoneNumber.substring(2, 5);
                    if (phoneNumber.length >= 5) formatted += ' ' + phoneNumber.substring(5, 9);
                }

                e.target.value = formatted;

            } else {
                // Российский формат
                let phoneNumber = value.startsWith('7') ? value.substring(1) : value;

                let formatted = '+7 (';
                if (phoneNumber.length > 0) formatted += phoneNumber.substring(0, 3);
                if (phoneNumber.length >= 3) formatted += ') ' + phoneNumber.substring(3, 6);
                if (phoneNumber.length >= 6) formatted += '-' + phoneNumber.substring(6, 8);
                if (phoneNumber.length >= 8) formatted += '-' + phoneNumber.substring(8, 10);

                e.target.value = formatted;
            }

            // Валидация
            const wrapper = phoneInput.closest('.form-field__wrapper');
            if (wrapper) {
                const cleanValue = e.target.value.replace(/\D/g, '');
                if (cleanValue.length >= 11) {
                    wrapper.classList.remove('form-field__wrapper--error');
                }
            }
        });

        phoneInput.addEventListener('focus', function(e) {
            if (e.target.value === '' && isRussianFormat) {
                e.target.value = '+7 (';
            }
        });

        phoneInput.addEventListener('blur', function(e) {
            const value = e.target.value.replace(/\D/g, '');
            if (value === '' || value === '7') {
                e.target.value = '';
                isRussianFormat = true; // Сбрасываем к российскому формату
            }
        });

        phoneInput.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace') {
                const value = e.target.value;
                const selectionStart = e.target.selectionStart;

                // Определяем, удаляет ли пользователь цифру 7 в российском формате
                if (isRussianFormat && selectionStart === 3 && value.startsWith('+7 (')) {
                    isRussianFormat = false; // Переключаем на международный формат
                }

                // Обработка удаления цифр внутри номера
                if (selectionStart > 0 && value.length > 0) {
                    // Находим позицию цифры для удаления
                    let digitPosition = -1;

                    // Ищем цифру слева от курсора
                    for (let i = selectionStart - 1; i >= 0; i--) {
                        if (/\d/.test(value[i])) {
                            digitPosition = i;
                            break;
                        }
                    }

                    if (digitPosition !== -1 && digitPosition > 0) {
                        e.preventDefault();

                        // Создаем новое значение с удаленной цифрой
                        const beforeDigit = value.substring(0, digitPosition);
                        const afterDigit = value.substring(digitPosition + 1);
                        let newValue = beforeDigit + afterDigit;

                        // Запускаем переформатирование
                        setTimeout(() => {
                            // Создаем временное значение без форматирования
                            const tempValue = newValue.replace(/\D/g, '');
                            const inputEvent = new Event('input', { bubbles: true });

                            // Временно устанавливаем неформатированное значение для триггера события
                            e.target.value = tempValue;
                            e.target.dispatchEvent(inputEvent);

                            // Восстанавливаем курсор
                            setTimeout(() => {
                                let newCursorPos = digitPosition;
                                // Находим новую позицию курсора после форматирования
                                if (newCursorPos >= e.target.value.length) {
                                    newCursorPos = e.target.value.length;
                                }
                                e.target.setSelectionRange(newCursorPos, newCursorPos);
                            }, 0);
                        }, 0);
                    }
                }

                // Обработка полного удаления
                if (value === '+7 (' || value === '+7' || value === '+') {
                    e.preventDefault();
                    e.target.value = '';
                    isRussianFormat = true;
                }
            }
        });

        // Обработка ручного ввода других кодов стран
        phoneInput.addEventListener('keypress', function(e) {
            if (e.key.length === 1 && /\d/.test(e.key)) {
                const value = e.target.value.replace(/\D/g, '');
                // Если пользователь начинает вводить цифры, отличные от 7, переключаем на международный формат
                if (isRussianFormat && value.length === 0 && e.key !== '7') {
                    isRussianFormat = false;
                }
            }
        });
    }

    function initFormValidation() {
        const consentCheckbox = document.querySelector('input[name="consent"]');
        const consentLabel = document.getElementById('consentCheckbox');

        consentCheckbox.addEventListener('change', function() {
            if (consentCheckbox.checked) {
                consentLabel.classList.remove('checkbox--error');
            }
        });

        form.addEventListener('submit', function(e) {
            e.preventDefault(); // Отменяет стандартную отправку формы

            const isValid = validateForm();

            if (isValid) {
                const formData = collectFormData();
                console.log('Форма валидна, данные:', formData);
                alert('Заявка отправлена успешно!');
            }
        });
    }

    function validateForm() {
        let isValid = true;

        const datesInput = document.querySelector('input[name="dates"]');
        const datesWrapper = document.querySelector('[data-field="dates"]');

        if (!datesInput.value) {
            datesWrapper.classList.add('form-field__wrapper--error');
            isValid = false;
        } else {
            datesWrapper.classList.remove('form-field__wrapper--error');
        }

        const phoneInput = document.querySelector('input[name="phone"]');
        const phoneWrapper = document.querySelector('[data-field="phone"]');
        const phoneValue = phoneInput.value.replace(/\D/g, '');

        if (!phoneValue || phoneValue.length < 11) {
            phoneWrapper.classList.add('form-field__wrapper--error');
            isValid = false;
        } else {
            phoneWrapper.classList.remove('form-field__wrapper--error');
        }

        const consentCheckbox = document.querySelector('input[name="consent"]');
        const consentLabel = document.getElementById('consentCheckbox');

        if (!consentCheckbox.checked) {
            consentLabel.classList.add('checkbox--error');
            isValid = false;
        } else {
            consentLabel.classList.remove('checkbox--error');
        }

        return isValid;
    }

    // Создает объект с данными
    function collectFormData() {
        const formData = {
            vehicle: document.querySelector('input[name="vehicle"]:checked').value,
            pickup: document.querySelector('input[name="pickup"]').value,
            return: document.querySelector('input[name="return"]').value,
            dates: document.querySelector('input[name="dates"]').value,
            phone: document.querySelector('input[name="phone"]').value,
            contact: document.querySelector('input[name="contact"]:checked').value,
            consent: document.querySelector('input[name="consent"]').checked
        };

        return formData;
    }
});


// Русская локализация
const russianLocale = {
    name: 'ru',
    weeks: [
        ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']
    ],
    months: [
        ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
        ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
    ],
};

// Функция для форматирования даты по-русски
function formatRussianDate(start, end) {
    const months = [
        'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
        'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ];

    const startDay = start.getDate();
    const endDay = end.getDate();
    const month = months[start.getMonth()];
    const year = start.getFullYear();

    return `${startDay}-${endDay} ${month} ${year}`;
}

// Функция для форматирования отдельной даты
function formatSingleDate(date) {
    const months = [
        'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
        'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];

    return `${day} ${month}`;
}

// Расчет продолжительности
function calculateDuration(startDate, endDate) {
    const timeDiff = endDate.getTime() - startDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
}

// Правильное склонение для дней
function getDayText(days) {
    if (days % 10 === 1 && days % 100 !== 11) {
        return 'день';
    } else if (days % 10 >= 2 && days % 10 <= 4 && (days % 100 < 10 || days % 100 >= 20)) {
        return 'дня';
    } else {
        return 'дней';
    }
}

// Обновление мобильного интерфейса дат
function updateMobileDates(start, end) {
    const startElement = document.getElementById('startDate');
    const endElement = document.getElementById('endDate');
    const durationElement = document.getElementById('durationText');

    if (startElement && start) {
        startElement.textContent = formatSingleDate(start);
    }

    if (endElement && end) {
        endElement.textContent = formatSingleDate(end);
    }

    if (durationElement && start && end) {
        const duration = calculateDuration(start, end);
        durationElement.textContent = `${duration} ${getDayText(duration)}`;
    }
}

// Создаем easepick
const picker = new easepick.create({
    element: document.getElementById('easepickDates'),
    css: [
        'https://cdn.jsdelivr.net/npm/@easepick/bundle@1.2.0/dist/index.css',
        "form.css"
    ],
    plugins: [
        'RangePlugin',
        'LockPlugin'
    ],
    RangePlugin: {
        tooltipNumber: (num) => num - 1,
        locale: {
            one: 'день',
            two: 'дня',
            few: 'дней',
            many: 'дней',
            other: 'дней'
        }
    },
    LockPlugin: {
        minDate: new Date(),
        minDays: 1,
        inseparable: true,
    },
    locale: russianLocale,
    format: 'DD.MM.YYYY',
    zIndex: 1000,
    setup(picker) {
        // Обработчик выбора дат
        picker.on('select', (e) => {
            const { start, end } = e.detail;

            // Форматируем даты для отображения
            const displayText = formatRussianDate(start, end);
            const valueForInput = `${start.format('YYYY-MM-DD')}_${end.format('YYYY-MM-DD')}`;

            // Обновляем десктопный интерфейс
            document.getElementById('datesValue').textContent = displayText;
            document.getElementById('datesValue').classList.remove('select__value--placeholder');
            document.getElementById('datesInput').value = valueForInput;

            // Обновляем мобильный интерфейс
            updateMobileDates(start, end);

            // Скрываем ошибку если есть
            const errorElement = document.querySelector('[data-field="dates"] .form-field__error');
            const errorIcon = document.querySelector('[data-field="dates"] .form-field__error-icon');
            if (errorElement) errorElement.style.display = 'none';
            if (errorIcon) errorIcon.style.display = 'none';

            const wrapper = document.querySelector('[data-field="dates"]');
            if (wrapper) wrapper.classList.remove('form-field__wrapper--error');
        });

        // Обработчик скрытия календаря
        picker.on('hide', () => {
            document.getElementById('datesSelect').classList.remove('select--active');
        });
    }
});

// Обработчики для десктопной версии
document.getElementById('datesTrigger').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('datesSelect').classList.add('select--active');
    picker.show();
});

// Обработчики для мобильной версии
document.getElementById('mobileDates').addEventListener('click', function(e) {
    e.preventDefault();
    picker.show();
});

// Закрываем календарь при клике вне области
document.addEventListener('click', function(e) {
    const select = document.getElementById('datesSelect');
    const mobileDates = document.getElementById('mobileDates');
    const pickerElement = document.querySelector('.easepick-wrapper');

    if (!select.contains(e.target) && !mobileDates.contains(e.target) && (!pickerElement || !pickerElement.contains(e.target))) {
        select.classList.remove('select--active');
    }
});

// Установка дат по умолчанию
function setDefaultDates() {
    const defaultStart = new Date();
    const defaultEnd = new Date();
    defaultEnd.setDate(defaultEnd.getDate() + 14);

    // Устанавливаем даты в календаре
    picker.setDateRange(defaultStart, defaultEnd);

    // Обновляем отображение как плейсхолдер
    const displayText = formatRussianDate(defaultStart, defaultEnd);
    document.getElementById('datesValue').textContent = displayText;
    document.getElementById('datesValue').classList.add('select__value--placeholder');

    // Сохраняем даты по умолчанию в data-атрибут, а не в value
    document.getElementById('datesInput').setAttribute('data-placeholder-dates', `${defaultStart.toISOString().split('T')[0]}_${defaultEnd.toISOString().split('T')[0]}`);

    // Оставляем value ПУСТЫМ
    document.getElementById('datesInput').value = "";

    updateMobileDates(defaultStart, defaultEnd);
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    setDefaultDates();
});

//
// // Если нужна предзаполненная дата по умолчанию
// // Установка дат по умолчанию (например, на 3 дня вперед)
// const defaultStart = new Date();
// const defaultEnd = new Date();
// defaultEnd.setDate(defaultEnd.getDate() + 3);
//
// picker.setDateRange(defaultStart, defaultEnd);
//
// // Инициализация текста по умолчанию
// const displayText = formatRussianDate(defaultStart, defaultEnd);
// document.getElementById('datesValue').textContent = displayText;
// document.getElementById('datesValue').classList.remove('select__value--placeholder');
// document.getElementById('datesInput').value = `${defaultStart.toISOString().split('T')[0]}_${defaultEnd.toISOString().split('T')[0]}`;
