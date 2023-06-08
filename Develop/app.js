// Using async/await & try/catch for error handling
(async () => {
    try {
        // Prompt user to allow notifications for saved events
        const permission = await Notification.requestPermission();

        // Initialize current day; user template string to display date
        const day = dayjs();
        $('#currentDay').text(`${day.format('dddd, MMMM D, YYYY')}`);

        await Promise.all([...Array(10).keys()].map(async (i) => {
            i+=8; // Offset hour to start index at 8AM

            const timeslot = day.hour(i).minute(0).second(0);
            let event = localStorage.getItem(timeslot.format('HH:mm')) || '';
            let status = '';

            if (dayjs().hour() > i) {
                status = 'past';
            } else if (dayjs().hour() === i) {
                status = 'present';
            } else {
                status = 'future';
            }

            await $('#calendar').append(`
                <div class="row hourSlot ${status}">
                <div class="col-2 hour">${timeSlot.format('hh:mm A')}</div>
                <div class="col-7"><input type="text" class="form-control event" id="${timeSlot.format('HH:mm')}" value="${event}" /></div>
                <div class="col-3"><button class="btn btn-primary saveEvent">Save</button></div>
                </div>
                <div class="row saved-events">
                <div class="col-12">
                <p><strong>Saved Event:</strong> ${event}</p>
                </div>
                </div>
                `);

            if (event && permission === 'granted') {
                const eventTimeInMs = day.hour(i).minute(0).second(0).subtract(dayjs().hour(), 'hour').subtract(dayjs().minute(), 'minute').subtract(dayjs().second(), 'second');
                setTimeout(() => new Notification('Calendar Event', { body: event }), eventTimeInMs);
            }
        }));

        $('#calendar').on('click', '.saveEvent', async function() {
            const eventTime = $(this).sibling('input').attr('id');
            const eventDesc = $(this).sibling('input').val();

            localStorage.setItem(eventTime, eventDesc);

            await $(this).parent().parent().next('.saved-events').find('p').html(`<strong>Saved Event:</strong> ${eventDesc}`);

            $('#saveModal').modal('show');
        });
        } catch (error) {
            console.log(error);
        }
});



