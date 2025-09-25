// Управление аудио
let isPlaying = false;
const audio = document.getElementById('backgroundMusic');
const playPauseBtn = document.getElementById('playPauseBtn');

// Слайдшоу для фотографий пары
let currentSlide = 0;
const slides = document.querySelectorAll('.slideshow-photo');

function startSlideshow() {
    if (slides.length === 0) return; // Убедиться, что есть фотографии

    // Скрываем все слайды
    slides.forEach(slide => slide.classList.remove('active'));

    // Показываем текущий слайд
    slides[currentSlide].classList.add('active');

    // Переходим к следующему слайду
    currentSlide = (currentSlide + 1) % slides.length;
}

// Запускаем слайдшоу каждые 5 секунд
setInterval(startSlideshow, 5000);

// Запускаем слайдшоу сразу при загрузке
document.addEventListener('DOMContentLoaded', () => {
    startSlideshow(); // Показать первый слайд сразу
});


// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM загружен, инициализируем аудио...');

    // Проверяем загрузку аудио
    audio.addEventListener('canplaythrough', function () {
        console.log('Аудио загружено успешно');
        // Убираем muted для попытки автовоспроизведения
        audio.muted = false;
        console.log('Пытаемся запустить автовоспроизведение...');
        // Попытка автовоспроизведения (может не работать в некоторых браузерах)
        audio.play().then(() => {
            console.log('Автовоспроизведение успешно запущено');
            playPauseBtn.textContent = '⏸️';
            isPlaying = true;
        }).catch(e => {
            console.log('Автовоспроизведение заблокировано браузером:', e);
            // Показываем уведомление о том, что нужно кликнуть для воспроизведения
            showMusicNotification();
        });
    });

    audio.addEventListener('error', function (e) {
        console.error('Ошибка загрузки аудио:', e);
        alert('Ошибка загрузки музыки. Проверьте, что файл "Empire of the Sun – We Are The People (Original Mix).mp3" находится в папке с сайтом.');
    });

    // Добавляем эффекты при загрузке
    addLoadingEffects();

    // Инициализируем анимации
    initAnimations();

    // Пытаемся запустить музыку при первом скролле
    setupAutoPlayOnScroll();

    // Дополнительная попытка автовоспроизведения через 2 секунды
    setTimeout(() => {
        if (!isPlaying) {
            console.log('Попытка автовоспроизведения через 2 секунды...');
            audio.muted = false;
            audio.play().then(() => {
                playPauseBtn.textContent = '⏸️';
                isPlaying = true;
                console.log('Музыка запущена через 2 секунды');
            }).catch(e => {
                console.log('Не удалось запустить музыку через 2 секунды:', e);
            });
        }
    }, 2000);
});

// Управление воспроизведением музыки
playPauseBtn.addEventListener('click', function () {
    if (isPlaying) {
        audio.pause();
        playPauseBtn.textContent = '🎵';
        isPlaying = false;
    } else {
        // Убираем muted для воспроизведения
        audio.muted = false;
        audio.play().then(() => {
            playPauseBtn.textContent = '⏸️';
            isPlaying = true;
        }).catch(e => {
            console.log('Ошибка воспроизведения:', e);
            alert('Для воспроизведения музыки нажмите на кнопку после взаимодействия со страницей');
        });
    }
});

// Обработка изменения фотографии пары
let currentPhotoType = '';

function changePhoto(type) {
    currentPhotoType = type;
    document.getElementById('photoInput').click();
}

function handlePhotoChange(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const targetId = 'couplePhoto';
            const img = document.getElementById(targetId);

            // Добавляем эффект появления с вау-эффектом
            img.style.opacity = '0';
            img.style.transform = 'scale(0.8) rotate(5deg)';
            img.style.filter = 'grayscale(100%) blur(5px)';

            setTimeout(() => {
                img.src = e.target.result;
                img.style.transition = 'all 1s ease';
                img.style.opacity = '1';
                img.style.transform = 'scale(1) rotate(0deg)';
                img.style.filter = 'grayscale(100%) contrast(1.2) brightness(0.9)';

                // Добавляем дополнительный вау-эффект
                setTimeout(() => {
                    img.style.filter = 'grayscale(100%) contrast(1.3) brightness(1.1)';
                    img.style.transform = 'scale(1.02)';
                }, 500);
            }, 200);
        };
        reader.readAsDataURL(file);
    }
}

// Управление модальным окном с правилами
function toggleRules() {
    const modal = document.getElementById('rulesModal');
    if (modal.style.display === 'block') {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    } else {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';

        // Анимация появления модального окна
        modal.style.opacity = '0';
        modal.style.transform = 'scale(0.8)';
        setTimeout(() => {
            modal.style.transition = 'all 0.3s ease';
            modal.style.opacity = '1';
            modal.style.transform = 'scale(1)';
        }, 10);
    }
}

// Закрытие модального окна при клике вне его
window.addEventListener('click', function (event) {
    const modal = document.getElementById('rulesModal');
    if (event.target === modal) {
        toggleRules();
    }
});

// RSVP функциональность
function showRSVPForm(confirmed) {
    const modal = document.getElementById('rsvpFormModal');
    const title = document.getElementById('rsvpFormTitle');
    const rsvpType = document.getElementById('rsvpType');

    if (confirmed) {
        title.textContent = 'Подтверждение присутствия';
        rsvpType.value = 'confirmed';
    } else {
        title.textContent = 'Подтверждение отсутствия';
        rsvpType.value = 'declined';
    }

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    // Анимация появления модального окна
    modal.style.opacity = '0';
    modal.style.transform = 'scale(0.8)';
    setTimeout(() => {
        modal.style.transition = 'all 0.3s ease';
        modal.style.opacity = '1';
        modal.style.transform = 'scale(1)';
    }, 10);
}

function closeRSVPForm() {
    const modal = document.getElementById('rsvpFormModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';

    // Очищаем форму
    document.getElementById('rsvpForm').reset();
    document.getElementById('formMessage').textContent = '';
}

function submitRSVP(event) {
    event.preventDefault();

    const form = document.getElementById('rsvpForm');
    const formData = new FormData(form);
    const formMessage = document.getElementById('formMessage');

    // Показываем загрузку
    formMessage.textContent = 'Отправляем...';
    formMessage.className = '';

    // Настройки Telegram бота (ЗАМЕНИТЕ НА ВАШИ ДАННЫЕ!)
    const BOT_TOKEN = '8294692320:AAGcLlwHyEI_dAinZMra1_ZXpqc1zgMMwVY'; // Ваш токен бота
    const CHAT_ID = '521500516'; // Ваш Chat ID

    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const wishes = formData.get('wishes');
    const rsvpType = formData.get('rsvpType');

    // Формируем сообщение для Telegram
    const fullName = `${lastName} ${firstName}`; // Фамилия Имя
    const status = rsvpType === 'confirmed' ? 'ПРИДЕТ' : 'НЕ СМОЖЕТ ПРИЙТИ';
    const statusEmoji = rsvpType === 'confirmed' ? '✅' : '❌';

    let message = `Свадебное приглашение:\n\n`;
    message += `👤 Гость: ${fullName}\n`;
    message += `📅 Статус: ${statusEmoji} ${status}\n`;

    if (wishes) {
        message += `💝 Пожелания:\n${wishes}\n`;
    }

    message += `\n⏰ Ответ получен: ${new Date().toLocaleString('ru-RU')}`;

    // Отправляем в Telegram
    const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const telegramData = {
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'HTML'
    };

    fetch(telegramUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(telegramData)
    })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                // Успешная отправка в Telegram
                const rsvpMessage = document.getElementById('rsvpMessage');
                const buttons = document.querySelectorAll('.rsvp-btn');

                buttons.forEach(btn => btn.classList.remove('active'));

                if (rsvpType === 'confirmed') {
                    rsvpMessage.textContent = '🎉 Отлично! Мы очень рады, что вы будете с нами!';
                    rsvpMessage.style.color = '#4CAF50';
                    buttons[0].classList.add('active');
                } else {
                    rsvpMessage.textContent = '😢 Очень жаль, что вы не сможете быть с нами. Будем скучать!';
                    rsvpMessage.style.color = '#f44336';
                    buttons[1].classList.add('active');
                }

                formMessage.textContent = 'Сообщение успешно отправлено в Telegram!';
                formMessage.className = 'success';

                // Закрываем форму немедленно
                closeRSVPForm();

                // Запускаем анимацию конфетти
                addConfettiOnConfirm();

            } else {
                throw new Error(data.description || 'Ошибка отправки в Telegram');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            formMessage.textContent = `Ошибка отправки в Telegram: ${error.message}`;
            formMessage.className = 'error';
        });
}

// Закрытие формы при клике вне ее
window.addEventListener('click', function (event) {
    const modal = document.getElementById('rsvpFormModal');
    if (event.target === modal) {
        closeRSVPForm();
    }
});

// Загрузка сохраненного RSVP ответа
function loadRSVPResponse() {
    const savedResponse = localStorage.getItem('rsvpResponse');
    if (savedResponse) {
        const confirmed = savedResponse === 'confirmed';
        // Обновляем UI без отправки формы
        const rsvpMessage = document.getElementById('rsvpMessage');
        const buttons = document.querySelectorAll('.rsvp-btn');

        buttons.forEach(btn => btn.classList.remove('active'));

        if (confirmed) {
            rsvpMessage.textContent = '🎉 Отлично! Мы очень рады, что вы будете с нами!';
            rsvpMessage.style.color = '#4CAF50';
            buttons[0].classList.add('active');
        } else {
            rsvpMessage.textContent = '😢 Очень жаль, что вы не сможете быть с нами. Будем скучать!';
            rsvpMessage.style.color = '#f44336';
            buttons[1].classList.add('active');
        }
    }
}

// Эффекты загрузки
function addLoadingEffects() {
    const elements = document.querySelectorAll('.photo-frame, .wedding-info, .rules-section, .rsvp-section');

    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(50px)';

        setTimeout(() => {
            element.style.transition = 'all 0.8s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

// Инициализация анимаций
function initAnimations() {
    // Анимация заголовка
    const title = document.querySelector('.main-title');
    if (title) {
        title.style.opacity = '0';
        title.style.transform = 'translateY(-50px)';

        setTimeout(() => {
            title.style.transition = 'all 1s ease';
            title.style.opacity = '1';
            title.style.transform = 'translateY(0)';
        }, 500);
    }

    // Анимация декоративной линии
    const line = document.querySelector('.decorative-line');
    if (line) {
        line.style.width = '0';

        setTimeout(() => {
            line.style.transition = 'width 2s ease';
            line.style.width = '200px';
        }, 1000);
    }

    // Загружаем сохраненный RSVP ответ
    loadRSVPResponse();
}

// Параллакс эффект для фонового видео
// window.addEventListener('scroll', function() {
//     const scrolled = window.pageYOffset;
//     const video = document.querySelector('.video-background video');
//     if (video) {
//         video.style.transform = `translate(-50%, ${-50 + scrolled * 0.1}%)`;
//     }
// });

// Эффект печатания для заголовка
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// Добавляем эффект печатания к заголовку при загрузке
setTimeout(() => {
    const title = document.querySelector('.main-title');
    if (title) {
        const originalText = title.textContent;
        typeWriter(title, originalText, 150);
    }
}, 1000);

// Управление клавиатурой
document.addEventListener('keydown', function (event) {
    // Пробел для воспроизведения/паузы музыки (только если не в поле ввода)
    if (event.code === 'Space' && event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {
        event.preventDefault();
        playPauseBtn.click();
    }

    // Escape для закрытия модального окна
    if (event.code === 'Escape') {
        const modal = document.getElementById('rulesModal');
        if (modal.style.display === 'block') {
            toggleRules();
        }
    }
});

// Эффект конфетти при подтверждении присутствия
function createConfetti() {
    const colors = ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '9999';
            confetti.style.animation = `confettiFall ${Math.random() * 3 + 2}s linear forwards`;

            document.body.appendChild(confetti);

            setTimeout(() => {
                confetti.remove();
            }, 5000);
        }, i * 50);
    }
}

// CSS анимация для конфетти
const style = document.createElement('style');
style.textContent = `
    @keyframes confettiFall {
        to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Функция для добавления конфетти при подтверждении
function addConfettiOnConfirm() {
    createConfetti();
}

// Эффект частиц в фоне
function createParticles() {
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = Math.random() * 100 + 'vh';
        particle.style.width = '2px';
        particle.style.height = '2px';
        particle.style.backgroundColor = 'rgba(255, 215, 0, 0.5)';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1';
        particle.style.animation = `particleFloat ${Math.random() * 10 + 10}s linear infinite`;

        document.body.appendChild(particle);
    }
}

// CSS анимация для частиц
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes particleFloat {
        0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        50% {
            transform: translateY(-100px) translateX(50px);
        }
    }
`;
document.head.appendChild(particleStyle);

// Создаем частицы при загрузке
setTimeout(createParticles, 2000);

// Эффект мерцания для золотых элементов
function addTwinkleEffect() {
    const twinkleElements = document.querySelectorAll('.main-title, .section-title, .heart-divider');

    twinkleElements.forEach(element => {
        element.style.animation = 'twinkle 3s ease-in-out infinite';
    });
}

// CSS анимация мерцания
const twinkleStyle = document.createElement('style');
twinkleStyle.textContent = `
    @keyframes twinkle {
        0%, 100% {
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }
        50% {
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5), 0 0 20px #ffd700, 0 0 30px #ffd700;
        }
    }
`;
document.head.appendChild(twinkleStyle);

// Добавляем эффект мерцания
setTimeout(addTwinkleEffect, 3000);

// Функция для показа уведомления о музыке
function showMusicNotification() {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 15px 25px;
        border-radius: 25px;
        border: 2px solid #ffffff;
        font-family: 'Cormorant Garamond', serif;
        font-size: 1.1rem;
        z-index: 10000;
        backdrop-filter: blur(10px);
        box-shadow: 0 10px 30px rgba(255, 255, 255, 0.3);
        animation: slideDown 0.5s ease-out;
    `;
    notification.innerHTML = '🎵 Нажмите в любом месте для воспроизведения музыки';

    document.body.appendChild(notification);

    // Убираем уведомление через 5 секунд
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.5s ease-out forwards';
        setTimeout(() => notification.remove(), 500);
    }, 5000);
}

// CSS анимации для уведомления
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-50px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }

    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-50px);
        }
    }
`;
document.head.appendChild(notificationStyle);

// Настройка автовоспроизведения при скролле
function setupAutoPlayOnScroll() {
    let hasTriedAutoPlay = false;

    function tryAutoPlay() {
        if (hasTriedAutoPlay) return;
        hasTriedAutoPlay = true;

        console.log('Попытка автовоспроизведения при скролле...');
        // Убираем muted для воспроизведения
        audio.muted = false;
        audio.play().then(() => {
            playPauseBtn.textContent = '⏸️';
            isPlaying = true;
            console.log('Музыка запущена автоматически при скролле');
        }).catch(e => {
            console.log('Не удалось запустить музыку автоматически:', e);
        });
    }

    // Слушаем только событие скролла
    document.addEventListener('scroll', tryAutoPlay, { once: true });
}
