$(document).ready(function () {
    // Initialize current day
    let day = dayjs();

    // Logic to display current day
    $('#currentDay').text(day.format('dddd, MMMM D, YYYY'));

    // Loop to generate time slots from 8am - 5pm
    for (let i = 8; i <= 17; i++) {
        let timeSlot = day.hour(i).minute(0).second(0);
        let event = localStorage.getItem(timeSlot.format('HH:mm')) || '';
        let status = '';

        // Loop to set past/present/future status conditional
        if (dayjs().hour() > i) {
            status = 'past';
        } else if (dayjs().hour() == i) {
            status = 'present';
        } else {
            status = 'future';
        }

        // jQuery to generate and append time slots
        $('#calendar').append(`
            <div class="hourSlot ${status}">
            <span class="hour">${timeSlot.format('hh:mm A')}</span>
            <input type="text" class="event" id="${timeSlot.format('HH:mm')}" value="${event}" />
            <button class="saveEvent">Save</button>
            </div>
            `)
    }

    // Event listener for save events
    $('.saveEvent').click(function() {
        let eventTime = $(this).siblings('input').attr('id');
        let eventDesc = $(this).siblings('input').val();


        // Store event to local storage
        localStorage.setItem(eventTime, eventDesc);

        $('#modalMessage').text('Event saved for ${eventTime}')
        $('#myModal').modal('show');


        $(this).siblings('.savedEvent').text(eventDesc);
    });
});
