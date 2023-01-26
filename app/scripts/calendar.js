document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendarEl');

    const calendar = new FullCalendar.Calendar(calendarEl, {
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        height: 550,
        locale: 'ru',
        buttonIcons: false,
        weekNumbers: false,
        firstDay: 1,
        navLinks: false,
        editable: false,
        dayMaxEvents: true,
        events: 'https://fullcalendar.io/api/demo-feeds/events.json?overload-day'
    });
    calendar.render();
});
