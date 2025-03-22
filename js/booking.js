const monthYear = document.getElementById('month-year');
const calendarBody = document.getElementById('calendar-body');
const prevMonthButton = document.getElementById('prev-month');
const nextMonthButton = document.getElementById('next-month');
const eventModal = document.getElementById('event-modal');
const eventList = document.getElementById('event-list');
const closeModalButton = document.getElementById('close-modal');

let currentDate = new Date();

function renderCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    monthYear.textContent = `${new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date)} ${year}`;

    let calendarHtml = '';
    let day = 1;

    for (let i = 0; i < 6; i++) {
        calendarHtml += '<tr>';
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < startingDay) {
                calendarHtml += '<td class="empty-cell"></td>';
            } else if (day > daysInMonth) {
                calendarHtml += '<td class="empty-cell"></td>';
            } else {
                calendarHtml += `<td data-day="${day}">${day}</td>`;
                day++;
            }
        }
        calendarHtml += '</tr>';
    }

    calendarBody.innerHTML = calendarHtml;

    const days = document.querySelectorAll('#calendar-body td[data-day]');
    days.forEach(day => {
        day.addEventListener('click', () => {
            const selectedDay = day.getAttribute('data-day');
            showEvents(selectedDay);
        });
    });
}

function showEvents(day) {
    const events = [
        { time: '10:00 AM', title: 'Meeting with Team' },
        { time: '02:00 PM', title: 'Lunch with Client' }
    ];

    eventList.innerHTML = events.map(event => `
        <li>
            <strong>${event.time}</strong>: ${event.title}
        </li>
    `).join('');

    eventModal.classList.add('open');
}

prevMonthButton.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
});

nextMonthButton.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
});

closeModalButton.addEventListener('click', () => {
    eventModal.classList.remove('open');
});

window.addEventListener('click', (event) => {
    if (event.target === eventModal) {
        eventModal.classList.remove('open');
    }
});

renderCalendar(currentDate);
