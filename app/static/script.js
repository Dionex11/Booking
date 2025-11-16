let currentWorkspaceId = null;
const startDateInput = document.getElementById('modalStartDateInput');
const startTimeInput = document.getElementById('modalStartTimeInput');
const endDateInput = document.getElementById('modalEndDateInput');
const endTimeInput = document.getElementById('modalEndTimeInput');
const resultMessage = document.getElementById('modalResultMessage');
const bookingModal = document.getElementById('bookingModal');
const confirmBtn = document.getElementById('confirmBookingBtn');

function combineDateTime(dateStr, timeStr) {
    if (!dateStr || !timeStr) return null;
    return new Date(`${dateStr}T${timeStr}`);
}

function formatDate(date) {
    return date.toISOString().split('T')[0];
}

function formatTime(date) {
    const nextHour = new Date(date);
    nextHour.setHours(date.getHours() + 1, 0, 0, 0);
    return nextHour.toTimeString().substring(0, 5);
}

function updateDisplay() {
    const startDateTime = combineDateTime(startDateInput.value, startTimeInput.value);
    const endDateTime = combineDateTime(endDateInput.value, endTimeInput.value);
    confirmBtn.disabled = true;

    if (!startDateTime || !endDateTime) {
        resultMessage.className = 'p-3 rounded-lg text-center font-medium bg-gray-100 text-gray-600';
        resultMessage.innerHTML = 'Please select both start and end date/time.';
        return;
    }

    const now = new Date();
    if (startDateTime < now) {
        resultMessage.className = 'p-3 rounded-lg text-center font-bold bg-yellow-100 text-yellow-700 border border-yellow-300';
        resultMessage.innerHTML = '⚠️ Start time is in the past.';
    }

    if (endDateTime <= startDateTime) {
        resultMessage.className = 'p-3 rounded-lg text-center font-bold bg-red-100 text-red-700 border border-red-300';
        resultMessage.innerHTML = '⚠️ End Time must be later than Start Time.';
    } else {
        const durationMs = endDateTime.getTime() - startDateTime.getTime();
        const minutes = Math.floor(durationMs / (1000 * 60));
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        const days = Math.floor(hours / 24);
        const remainingHours = hours % 24;

        let durationStr = '';
        if (days > 0) durationStr += `${days} day${days !== 1 ? 's' : ''}, `;
        durationStr += `${remainingHours} hour${remainingHours !== 1 ? 's' : ''}`;
        if (days === 0 && remainingMinutes > 0)
            durationStr += `, ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;

        resultMessage.className = 'p-3 rounded-lg text-center bg-green-100 text-green-800 border border-green-300';
        resultMessage.innerHTML = `Reservation valid! Duration: ${durationStr.trim()}.`;

        if (startDateTime >= now) confirmBtn.disabled = false;
    }
}

function showBookingModal(id, name, status) {
    if (status === 'booked') return;
    currentWorkspaceId = id;
    document.getElementById('modalWorkspaceName').textContent = name;

    const now = new Date();
    const todayDateStr = formatDate(now);
    const defaultStartTimeStr = formatTime(now);

    startDateInput.value = todayDateStr;
    startTimeInput.value = defaultStartTimeStr;
    endDateInput.value = todayDateStr;

    const defaultEndTime = combineDateTime(todayDateStr, defaultStartTimeStr);
    if (defaultEndTime) {
        defaultEndTime.setHours(defaultEndTime.getHours() + 1);
        endTimeInput.value = defaultEndTime.toTimeString().substring(0, 5);
    }

    updateDisplay();
    bookingModal.classList.remove('hidden');
    bookingModal.classList.add('flex');
}

function closeBookingModal() {
    bookingModal.classList.add('hidden');
    bookingModal.classList.remove('flex');
    confirmBtn.disabled = true;
}

function handleOutsideClick(event) {
    if (event.target.id === 'bookingModal') closeBookingModal();
}

async function confirmBooking() {
    const startdate = startDateInput.value;
    const starttime = startTimeInput.value;
    const enddate = endDateInput.value;
    const endtime = endTimeInput.value;

    if (!startdate || !starttime || !enddate || !endtime) {
        alert("Please fill all fields");
        return;
    }

    const data = {
        workspace_id: currentWorkspaceId,
        startdate,
        starttime,
        enddate,
        endtime
    };

    try {
        const response = await fetch("/book", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        const messageBox = resultMessage;

        messageBox.textContent = result.message || result.error;

        if (response.ok) {
            messageBox.classList.remove("bg-gray-100", "text-gray-600");
            messageBox.classList.add("bg-green-100", "text-green-700");
        } else {
            messageBox.classList.remove("bg-gray-100", "text-gray-600");
            messageBox.classList.add("bg-red-100", "text-red-700");
        }

    } catch (err) {
        console.error("Error submitting booking:", err);
        alert("Something went wrong.");
    }
}

function initializeApp() {
    [startDateInput, startTimeInput, endDateInput, endTimeInput].forEach(input => {
        input.addEventListener('change', updateDisplay);
    });
}

window.onload = initializeApp;
window.showBookingModal = showBookingModal;
window.closeBookingModal = closeBookingModal;
window.confirmBooking = confirmBooking;
window.handleOutsideClick = handleOutsideClick;
