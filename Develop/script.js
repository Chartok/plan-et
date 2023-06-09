// Using async/await & try/catch for error handling
(async () => {
    try {
        // Prompt user to allow notifications for saved events
        const permission = await Notification.requestPermission();

        // Initialize current day; user template string to display date
        const day = dayjs();
        $('#currentDay').text(`${day.format('dddd, MMMM D, YYYY')}`);

        await Promise.all([...Array(10).keys()].map(async (i) => {
            i += 8; // Offset hour to start index at 8AM

            const timeSlot = day.hour(i).minute(0).second(0);
            let event = localStorage.getItem(timeSlot.format('HH:mm')) || '';
            let status = '';

            if (dayjs().hour() > i) {
                status = 'past';
            } else if (dayjs().hour() === i) {
                status = 'present';
            } else {
                status = 'future';
            }

            await $('#calendar').append(`
                <div class="row p-b-4 hourSlot ${status}">
                <div class="col-8 mt-4"><input type="text" class="form-control event" id="${timeSlot.format('HH:mm')}" value="${event}" /></div>
                <div class="col hour">${timeSlot.format('hh:mm A')}</div>
                <div class="col start-10%"><button class="btn btn-primary saveEvent">Save</button></div>
                <div class="row border-bottom saved-events">
                <div class="col mb-3">
                <p><strong>Saved Event:</strong> ${event}</p>
                <div class="col mb-3">
                <button class="btn btn-danger btn-sm clearEvent">Clear</button>
                </div>
                </div>
                </div>
                </div>
                `);

            //
                if (event && permission === 'granted' && status !== 'past') {
                    const eventTimeInMs = timeSlot.diff(dayjs(), 'millisecond');
                    setTimeout(() => new Notification('Calendar Event', { body: event }), eventTimeInMs);
                }

        }));

        // Logic for clear all events from local storage
        $('#clearAll').click(function() {
            localStorage.clear();
            $('.event').val('');
            $('.saved-events p').html('<strong>Saved Event:</strong> ');
        });

        // Logic for clear event from local storage
        $('#calendar').on('click', '.clearEvent', function() {
            const eventTime = $(this).siblings('input').attr('id');
            localStorage.removeItem(eventTime);
            $(this).siblings('input').val('');
            $(this).parent().parent().next('.saved-events').find('p').html('<strong>Saved Event:</strong> ');
        });

        // Logic to save events to local storage
        $('#calendar').on('click', '.saveEvent', async function () {
            const eventTime = $(this).siblings('input').attr('id');
            const eventDesc = $(this).siblings('input').val();

            localStorage.setItem(eventTime, eventDesc);


            await $(this).parent().parent().next('.saved-events').find('p').html(`<strong>Saved Event:</strong> ${eventDesc}`);

            $('#saveModal').modal('show');
        });
    } catch (err) {
        console.error(err);
    }

})();
