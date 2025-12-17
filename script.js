document.addEventListener('DOMContentLoaded', function() {
    console.log('MedCalc - учебный проект медицинских калькуляторов загружен');

    // ====================
    // 1. НАВИГАЦИЯ ПО САЙТУ
    // ====================
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navList = document.querySelector('.nav-list');

    // Функция переключения страниц
    function switchPage(pageId) {
        console.log('Переключение на страницу:', pageId);

        // Скрыть все страницы
        pages.forEach(page => {
            page.classList.remove('active');
        });

        // Показать выбранную страницу
        const activePage = document.getElementById(pageId);
        if (activePage) {
            activePage.classList.add('active');
        }

        // Обновить активную ссылку в меню
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${pageId}`) {
                link.classList.add('active');
            }
        });

        // Если мы на мобильном устройстве, закрыть меню
        if (window.innerWidth <= 768 && navList.classList.contains('active')) {
            navList.classList.remove('active');
        }

        // Если перешли на страницу калькуляторов, показать список калькуляторов
        if (pageId === 'calculators') {
            hideAllCalculators();
        }

        // Прокрутить страницу вверх
        window.scrollTo(0, 0);

        // Сохранить текущую страницу в localStorage
        localStorage.setItem('lastPage', pageId);
    }

    // Обработчики кликов по ссылкам меню
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('href').substring(1);
            switchPage(pageId);
        });
    });

    // Мобильное меню
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navList.classList.toggle('active');
        });
    }

    // Закрытие мобильного меню при клике на ссылку
    document.querySelectorAll('.nav-list a').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navList.classList.remove('active');
            }
        });
    });

    // ====================
    // 2. КАЛЬКУЛЯТОР ИМТ
    // ====================
    const bmiHeight = document.getElementById('height');
    const bmiHeightRange = document.getElementById('height-range');
    const bmiWeight = document.getElementById('weight');
    const bmiWeightRange = document.getElementById('weight-range');
    const calculateBmiBtn = document.getElementById('calculate-bmi');

    // Синхронизация полей ввода и ползунков для роста
    if (bmiHeight && bmiHeightRange) {
        bmiHeight.addEventListener('input', function() {
            bmiHeightRange.value = this.value;
            calculateBMI();
        });

        bmiHeightRange.addEventListener('input', function() {
            bmiHeight.value = this.value;
            calculateBMI();
        });
    }

    // Синхронизация полей ввода и ползунков для веса
    if (bmiWeight && bmiWeightRange) {
        bmiWeight.addEventListener('input', function() {
            bmiWeightRange.value = this.value;
            calculateBMI();
        });

        bmiWeightRange.addEventListener('input', function() {
            bmiWeight.value = this.value;
            calculateBMI();
        });
    }

    // Функция расчета ИМТ
    function calculateBMI() {
        const height = parseFloat(bmiHeight.value) / 100; // Переводим см в метры
        const weight = parseFloat(bmiWeight.value);

        if (!height || !weight || height <= 0 || weight <= 0) {
            updateBMIResult('Введите корректные данные', 'Введите данные', '#b0b0b0');
            return;
        }

        const bmi = weight / (height * height);
        const roundedBmi = Math.round(bmi * 10) / 10;

        let category = '';
        let color = '';

        if (bmi < 18.5) {
            category = 'Дефицит массы тела';
            color = '#2196f3'; // Синий
        } else if (bmi < 25) {
            category = 'Нормальная масса тела';
            color = '#4caf50'; // Зеленый
        } else if (bmi < 30) {
            category = 'Избыточная масса тела';
            color = '#ff9800'; // Оранжевый
        } else {
            category = 'Ожирение';
            color = '#f44336'; // Красный
        }

        updateBMIResult(roundedBmi, category, color);

        // Сохраняем данные в localStorage
        localStorage.setItem('bmiHeight', bmiHeight.value);
        localStorage.setItem('bmiWeight', bmiWeight.value);
    }

    // Функция обновления результатов ИМТ
    function updateBMIResult(value, category, color) {
        const bmiValue = document.getElementById('bmi-value');
        const bmiCategory = document.getElementById('bmi-category');
        const bmiIndicator = document.getElementById('bmi-indicator');

        if (bmiValue) bmiValue.textContent = value;
        if (bmiCategory) bmiCategory.textContent = category;
        if (bmiIndicator) {
            // Рассчитываем ширину индикатора (от 15 до 40 ИМТ)
            let indicatorWidth = 0;
            if (typeof value === 'number') {
                if (value < 15) indicatorWidth = 0;
                else if (value > 40) indicatorWidth = 100;
                else indicatorWidth = ((value - 15) / 25) * 100;
            }
            bmiIndicator.style.width = `${indicatorWidth}%`;
            bmiIndicator.style.backgroundColor = color;
        }
    }

    // Кнопка расчета ИМТ
    if (calculateBmiBtn) {
        calculateBmiBtn.addEventListener('click', calculateBMI);
    }

    // ====================
    // 3. КАЛЬКУЛЯТОР ОБЩЕГО ЗДОРОВЬЯ
    // ====================
    const calculateHealthBtn = document.getElementById('calculate-health');

    // Функция расчета оценки здоровья
    function calculateHealth() {
        const age = parseInt(document.getElementById('age').value) || 30;
        const systolic = parseInt(document.getElementById('pressure-systolic').value) || 120;
        const diastolic = parseInt(document.getElementById('pressure-diastolic').value) || 80;
        const cholesterol = parseFloat(document.getElementById('cholesterol').value) || 5.0;
        const glucose = parseFloat(document.getElementById('glucose').value) || 5.5;
        const smoking = document.getElementById('smoking').checked;
        const active = document.getElementById('active').checked;

        // Балльная система оценки (максимум 100 баллов)
        let score = 50; // Базовый балл

        // Возраст
        if (age < 30) score += 20;
        else if (age < 40) score += 15;
        else if (age < 50) score += 10;
        else if (age < 60) score += 5;
        else if (age < 70) score -= 5;
        else score -= 10;

        // Давление
        if (systolic < 120 && diastolic < 80) score += 20; // Нормальное
        else if (systolic < 130 && diastolic < 85) score += 10; // Нормальное повышенное
        else if (systolic < 140 && diastolic < 90) score += 5; // Высокое нормальное
        else if (systolic < 160 && diastolic < 100) score -= 5; // Гипертония 1 степени
        else if (systolic < 180 && diastolic < 110) score -= 15; // Гипертония 2 степени
        else score -= 25; // Гипертония 3 степени

        // Холестерин
        if (cholesterol < 5.2) score += 10; // Норма
        else if (cholesterol < 6.2) score -= 5; // Погранично высокий
        else score -= 15; // Высокий

        // Глюкоза
        if (glucose < 6.1) score += 10; // Норма
        else if (glucose < 7.0) score -= 10; // Нарушенная гликемия
        else score -= 20; // Диабет

        // Курение
        if (smoking) score -= 15;

        // Активный образ жизни
        if (active) score += 15;

        // Ограничиваем от 0 до 100
        score = Math.max(0, Math.min(100, Math.round(score)));

        // Определяем категорию
        let category = '';
        let color = '';
        let recommendations = '';

        if (score >= 80) {
            category = 'Отличное здоровье';
            color = '#4caf50';
            recommendations = 'Продолжайте вести здоровый образ жизни. Регулярно проходите профилактические осмотры.';
        } else if (score >= 60) {
            category = 'Хорошее здоровье';
            color = '#8bc34a';
            recommendations = 'Ваше здоровье в хорошем состоянии. Обратите внимание на показатели, которые снизили оценку.';
        } else if (score >= 40) {
            category = 'Удовлетворительное';
            color = '#ff9800';
            recommendations = 'Есть области для улучшения. Рекомендуется проконсультироваться с врачом, особенно по показателям с низкими баллами.';
        } else {
            category = 'Требует внимания';
            color = '#f44336';
            recommendations = 'Рекомендуется обратиться к врачу для комплексного обследования. Обратите внимание на образ жизни и факторы риска.';
        }

        updateHealthResult(score, category, color, recommendations);

        // Сохраняем данные в localStorage
        localStorage.setItem('healthData', JSON.stringify({
            age, systolic, diastolic, cholesterol, glucose, smoking, active
        }));
    }

    // Функция обновления результатов оценки здоровья
    function updateHealthResult(score, category, color, recommendations) {
        const healthValue = document.getElementById('health-value');
        const healthCategory = document.getElementById('health-category');
        const healthIndicator = document.getElementById('health-indicator');
        const healthRecommendations = document.getElementById('health-recommendations');

        if (healthValue) healthValue.textContent = score;
        if (healthCategory) healthCategory.textContent = category;
        if (healthIndicator) {
            healthIndicator.style.width = `${score}%`;
            healthIndicator.style.backgroundColor = color;
        }
        if (healthRecommendations) healthRecommendations.textContent = recommendations;
    }

    // Кнопка расчета здоровья
    if (calculateHealthBtn) {
        calculateHealthBtn.addEventListener('click', calculateHealth);
    }

    // ====================
    // 4. УПРАВЛЕНИЕ КАЛЬКУЛЯТОРАМИ
    // ====================
    const calculatorContainers = document.querySelectorAll('.calculator-container');
    const calcSelectBtns = document.querySelectorAll('.calc-select-btn');

    // Функция скрытия всех калькуляторов
    function hideAllCalculators() {
        calculatorContainers.forEach(calc => {
            calc.classList.remove('active');
        });
    }

    // Функция показа конкретного калькулятора
    function showCalculator(calcId) {
        hideAllCalculators();

        const targetCalc = document.getElementById(`${calcId}-calculator`);
        if (targetCalc) {
            targetCalc.classList.add('active');

            // Прокручиваем к калькулятору
            targetCalc.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // Если это калькулятор ИМТ, загружаем сохраненные данные
            if (calcId === 'bmi') {
                loadSavedBMIData();
                // Автоматически рассчитываем ИМТ при открытии
                setTimeout(calculateBMI, 100);
            }

            // Если это калькулятор здоровья, загружаем сохраненные данные
            if (calcId === 'health') {
                loadSavedHealthData();
            }
        }
    }

    // Обработчики для кнопок выбора калькулятора
    calcSelectBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const calcItem = this.closest('.calc-item');
            const calcId = calcItem.getAttribute('data-calc');
            showCalculator(calcId);
        });
    });

    // Обработчики для ссылок на калькуляторы с главной страницы
    document.querySelectorAll('[data-calc]').forEach(link => {
        if (!link.classList.contains('calc-select-btn')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const calcId = this.getAttribute('data-calc');

                // Переключаемся на страницу калькуляторов
                switchPage('calculators');

                // Показываем нужный калькулятор с небольшой задержкой
                setTimeout(() => {
                    showCalculator(calcId);
                }, 100);
            });
        }
    });

    // ====================
    // 5. ФОРМА ОБРАТНОЙ СВЯЗИ
    // ====================
    const feedbackForm = document.getElementById('feedback-form');
    const savedMessagesList = document.getElementById('saved-messages-list');
    const clearMessagesBtn = document.getElementById('clear-messages');
    const formResult = document.getElementById('form-result');

    // Загрузка сохраненных сообщений
    function loadSavedMessages() {
        const messages = JSON.parse(localStorage.getItem('feedbackMessages') || '[]');

        if (!savedMessagesList) return;

        savedMessagesList.innerHTML = '';

        if (messages.length === 0) {
            savedMessagesList.innerHTML = '<p class="no-messages">Нет сохранённых сообщений</p>';
            return;
        }

        // Отображаем сообщения в обратном порядке (новые сверху)
        messages.reverse().forEach((msg, index) => {
            const messageElement = document.createElement('div');
            messageElement.className = 'message-item';
            messageElement.innerHTML = `
                <h5>${msg.name} (${msg.email})</h5>
                <p>${msg.message}</p>
                <small>${msg.date}</small>
            `;
            savedMessagesList.appendChild(messageElement);
        });
    }

    // Сохранение сообщения
    function saveMessage(name, email, message) {
        const messages = JSON.parse(localStorage.getItem('feedbackMessages') || '[]');

        const newMessage = {
            name,
            email,
            message,
            date: new Date().toLocaleString('ru-RU')
        };

        messages.push(newMessage);
        localStorage.setItem('feedbackMessages', JSON.stringify(messages));

        return newMessage;
    }

    // Отображение результата отправки формы
    function showFormResult(message, isSuccess = true) {
        if (!formResult) return;

        formResult.textContent = message;
        formResult.className = `form-result ${isSuccess ? 'success' : 'error'}`;
        formResult.style.display = 'block';

        // Автоматическое скрытие через 5 секунд
        setTimeout(() => {
            formResult.style.opacity = '0';
            setTimeout(() => {
                formResult.style.display = 'none';
                formResult.style.opacity = '1';
            }, 300);
        }, 5000);
    }

    // Обработка отправки формы
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            // Простая валидация
            if (!name || !email || !message) {
                showFormResult('Пожалуйста, заполните все поля', false);
                return;
            }

            if (!email.includes('@') || !email.includes('.')) {
                showFormResult('Пожалуйста, введите корректный email', false);
                return;
            }

            // Сохраняем сообщение
            saveMessage(name, email, message);

            // Показываем успешное сообщение
            showFormResult('Сообщение сохранено локально в вашем браузере!', true);

            // Обновляем список сообщений
            loadSavedMessages();

            // Очищаем форму
            feedbackForm.reset();
        });
    }

    // Очистка всех сообщений
    if (clearMessagesBtn) {
        clearMessagesBtn.addEventListener('click', function() {
            if (confirm('Вы уверены, что хотите удалить все сохранённые сообщения?')) {
                localStorage.removeItem('feedbackMessages');
                loadSavedMessages();
                showFormResult('Все сообщения удалены', true);
            }
        });
    }

    // ====================
    // 6. ЗАГРУЗКА СОХРАНЕННЫХ ДАННЫХ
    // ====================
    function loadSavedBMIData() {
        const savedHeight = localStorage.getItem('bmiHeight');
        const savedWeight = localStorage.getItem('bmiWeight');

        if (bmiHeight && savedHeight) {
            bmiHeight.value = savedHeight;
            bmiHeightRange.value = savedHeight;
        }

        if (bmiWeight && savedWeight) {
            bmiWeight.value = savedWeight;
            bmiWeightRange.value = savedWeight;
        }
    }

    function loadSavedHealthData() {
        const savedData = localStorage.getItem('healthData');

        if (savedData) {
            try {
                const data = JSON.parse(savedData);

                document.getElementById('age').value = data.age || 30;
                document.getElementById('pressure-systolic').value = data.systolic || 120;
                document.getElementById('pressure-diastolic').value = data.diastolic || 80;
                document.getElementById('cholesterol').value = data.cholesterol || 5.0;
                document.getElementById('glucose').value = data.glucose || 5.5;
                document.getElementById('smoking').checked = data.smoking || false;
                document.getElementById('active').checked = data.active || false;
            } catch (e) {
                console.error('Ошибка при загрузке сохраненных данных здоровья:', e);
            }
        }
    }

    // ====================
    // 7. ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ
    // ====================
    function init() {
        console.log('Инициализация приложения MedCalc');

        // Загружаем сохраненные данные
        loadSavedBMIData();
        loadSavedHealthData();
        loadSavedMessages();

        // Загружаем последнюю посещенную страницу
        const lastPage = localStorage.getItem('lastPage') || 'home';
        switchPage(lastPage);

        // Если на странице калькуляторов, показываем список калькуляторов
        if (lastPage === 'calculators') {
            hideAllCalculators();
        }

        // Автоматически рассчитываем ИМТ если есть данные
        if (bmiHeight && bmiHeight.value && bmiWeight && bmiWeight.value) {
            setTimeout(calculateBMI, 500);
        }

        // Автоматически рассчитываем здоровье если есть данные
        const healthData = localStorage.getItem('healthData');
        if (healthData) {
            setTimeout(calculateHealth, 500);
        }

        // Обработка хэша в URL
        const hash = window.location.hash.substring(1);
        if (hash) {
            switchPage(hash);
        }

        // Обработка изменения хэша
        window.addEventListener('hashchange', function() {
            const newHash = window.location.hash.substring(1);
            if (newHash && document.getElementById(newHash)) {
                switchPage(newHash);
            }
        });

        console.log('Приложение успешно инициализировано');
    }

    // Запуск инициализации
    init();

    // ====================
    // 8. ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ
    // ====================

    // Сброс всех данных
    function resetAllData() {
        if (confirm('Вы уверены, что хотите сбросить все сохраненные данные (ИМТ, здоровье, сообщения)?')) {
            localStorage.removeItem('bmiHeight');
            localStorage.removeItem('bmiWeight');
            localStorage.removeItem('healthData');
            localStorage.removeItem('feedbackMessages');

            // Сброс полей формы
            if (bmiHeight) bmiHeight.value = 170;
            if (bmiHeightRange) bmiHeightRange.value = 170;
            if (bmiWeight) bmiWeight.value = 70;
            if (bmiWeightRange) bmiWeightRange.value = 70;

            // Сброс формы здоровья
            document.getElementById('age').value = 30;
            document.getElementById('pressure-systolic').value = 120;
            document.getElementById('pressure-diastolic').value = 80;
            document.getElementById('cholesterol').value = 5.0;
            document.getElementById('glucose').value = 5.5;
            document.getElementById('smoking').checked = false;
            document.getElementById('active').checked = false;

            // Обновление результатов
            updateBMIResult('-', 'Введите данные', '#b0b0b0');
            updateHealthResult('-', 'Введите данные', '#b0b0b0', 'Заполните форму для получения рекомендаций');

            // Обновление списка сообщений
            loadSavedMessages();

            alert('Все данные сброшены!');
        }
    }

    // Добавляем кнопку сброса данных в футер (опционально)
    const footer = document.querySelector('#footer .footer-bottom');
    if (footer) {
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Сбросить все данные';
        resetButton.className = 'btn btn-outline';
        resetButton.style.marginTop = '10px';
        resetButton.style.fontSize = '0.8rem';
        resetButton.style.padding = '5px 10px';
        resetButton.addEventListener('click', resetAllData);

        const resetContainer = document.createElement('div');
        resetContainer.style.textAlign = 'center';
        resetContainer.style.marginTop = '10px';
        resetContainer.appendChild(resetButton);

        footer.appendChild(resetContainer);
    }
});