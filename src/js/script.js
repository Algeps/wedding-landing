const titles = {
    weeks: ['неделя', 'недели', 'недель'],
    days: ['день', 'дня', 'дней'],
    hours: ['час', 'часа', 'часов'],
    minutes: ['минута', 'минуты', 'минут'],
    seconds: ['секунда', 'секунды', 'секунд']
};

function decline(num, titles) {
    const n = Math.abs(num) % 100;
    const n1 = n % 10;
    if (n > 10 && n < 20) return titles[2];        // 11-19
    if (n1 > 1 && n1 < 5) return titles[1];        // 2-4
    if (n1 === 1) return titles[0];                // 1
    return titles[2];                              // 0, 5-9, 20-99
}

function partsFromMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;

    const weeks = Math.floor(ms / week);
    const days = Math.floor((ms % week) / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor((ms % hour) / minute);
    const seconds = Math.floor((ms % minute) / second);
    return { weeks, days, hours, minutes, seconds };
}

function updateCountdown(targetDate) {
    const countdownElement = document.querySelector('[action="eventTracker"]');

    if (!countdownElement) return;

    function calculate(addtionalClasses) {
        const now = new Date();
        const nowTime = new Date().getTime();
        const targetTime = new Date(targetDate).getTime();
        const distance = targetTime - nowTime;

        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        const isWeddingToday = targetTime >= startOfDay && targetTime <= endOfDay;

        if (isWeddingToday) {
            countdownElement.innerHTML =
                `
            <div class="eventTracker__today ${addtionalClasses}">
                <span>У нас сегодня свадьба!</span>
            </div>
            `
            return;
        }
        
        if (distance < 0) {
            const parts = partsFromMs(Math.abs(distance));
            var alreadyWeddingDuration = "";
            if (parts.weeks) {
                alreadyWeddingDuration += `${parts.weeks} ${decline(parts.weeks, titles.weeks)} `;
            }
            if (parts.days) {
                alreadyWeddingDuration += `${parts.days} ${decline(parts.days, titles.days)} `;
            }
            if (parts.hours) {
                alreadyWeddingDuration += `${parts.hours} ${decline(parts.hours, titles.hours)} `;
            }
            if (parts.minutes) {
                alreadyWeddingDuration += `${parts.minutes} ${decline(parts.minutes, titles.minutes)} `;
            }
            if (parts.seconds && !parts.weeks && !parts.days) {
                alreadyWeddingDuration += `${parts.seconds} ${decline(parts.seconds, titles.seconds)} `;
            }
            countdownElement.innerHTML =
                `
            <div class="eventTracker__yet ${addtionalClasses}">
                <span>Мы женаты уже: <br>
                ${alreadyWeddingDuration} </span>
            </div>
            `
            return;
        }
        
        const parts = partsFromMs(distance);
        const weekStr = decline(parts.weeks, titles.weeks);
        const dayStr = decline(parts.days, titles.days);
        const hourStr = decline(parts.hours, titles.hours);
        const minuteStr = decline(parts.minutes, titles.minutes);
        const secondStr = decline(parts.seconds, titles.seconds);
        const weeks = parts.weeks;
        const days = parts.days;
        const hours = parts.hours;
        const minutes = parts.minutes;
        const seconds = parts.seconds;

        countdownElement.innerHTML =
            `
            <div class="countdown ${addtionalClasses}">
                <div class="countdown__time_unit">
                    <span class="countdown__number">${String(weeks).padStart(2, '0')}</span>
                    <span class="countdown__caption">${weekStr}</span>
                </div>
                <div class="countdown__time_unit">
                    <span class="countdown__number">${String(days).padStart(2, '0')}</span>
                    <span class="countdown__caption">${dayStr}</span>
                </div>
                <div class="countdown__time_unit">
                    <span class="countdown__number">${String(hours).padStart(2, '0')}</span>
                    <span class="countdown__caption">${hourStr}</span>
                </div>
                <div class="countdown__time_unit">
                    <span class="countdown__number">${String(minutes).padStart(2, '0')}</span>
                    <span class="countdown__caption">${minuteStr}</span>
                </div>
                <div class="countdown__time_unit">
                    <span class="countdown__number">${String(seconds).padStart(2, '0')}</span>
                    <span class="countdown__caption">${secondStr}</span>
                </div>
            </div>
        `;
    }

    setTimeout(() => {
        calculate('bloomAnimation');
        setTimeout(() => setInterval(() => calculate(''), 1000), 1500);
    }, 2000);
}
updateCountdown('2026-07-18T12:20:00');

const menuButton = document.querySelector('[action="menu_button_action"]');
const menu = document.getElementById('menu');
menuButton.addEventListener('click', () => {
    menu.classList.toggle('menu_hidden');
})
menu.addEventListener('click', () => {
    menu.classList.toggle('menu_hidden');
})

async function sendForm(idForm, filledFormMap) {
    try {
        await fetch(
            `https://docs.google.com/forms/d/e/${idForm}/formResponse?` + new URLSearchParams(filledFormMap),
            {
                method: 'post',
                mode: 'no-cors',
            }
        )
    } catch(e) {
        console.log(e)
    }
}

/*sendForm(
    '1FAIpQLScEACLtGPQN9QssJ8NEgNpACuzMHEUhJ1mK5r9rC2xrVavQDg',
    {
        // Предпочтение по еде/блюдам (мясо)
        "entry.2120546956": "Курица",
        // Предпочтение по еде/блюдам (морепродукты)
        "entry.1089139046": "Креветки",
        // Есть ли аллергия на продукты
        "entry.740189404": "Нет",
        // Предпочтение по напиткам
        "entry.301840439": "Вода",
        // Пожелания
        "entry.1812285716": "текст",
        // ФИО
        "entry.539072013": "фио"
    }
);
*/
