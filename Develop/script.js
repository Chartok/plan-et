$(document).ready(function () {
    // Initialize current day
    let day = dayjs();

    for (let i = 8; i <= 17; i++) {
        let timeSlot = day.hour(i).minute(0).second(0);
        let event = localStorage.getItem(timeSlot.format('HH:mm')) || '';

        $('#calendar').append(`
            <div class="hourSlot">
                <span class="hour">${timeSlot.format('hh:mm A')}</span>
                <input type="text" class="event" id="${timeSlot.format('HH:mm')}" value="${event}" />
                <button class="saveEvent">Save</button>
            </div>
        `)
    }

    $('.saveEvent').click(function() {
        let eventTime = $(this).siblings('input').attr('id');
        let eventDesc = $(this).siblings('input').val();


        localStorage.setItem(eventTime, eventDesc);
    });

});
