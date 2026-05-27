document.addEventListener("DOMContentLoaded", () => {
    const bookingForm = document.getElementById("repairBookingForm");
    if (bookingForm) {
        bookingForm.addEventListener("submit", async function(e) {
            e.preventDefault();
            const bookingData = {
                clientName: document.getElementById("client-name").value,
                clientEmail: document.getElementById("client-email").value,
                clientPhone: document.getElementById("client-phone").value,
                deviceModel: document.getElementById("device-model").value,
                repairType: document.getElementById("repair-type").value,
                appointmentDate: document.getElementById("appointment-date").value,
                description: document.getElementById("issue-desc").value
            };
            console.log("Sending booking request:", bookingData);
            try {
                // Mock API Call
                const data = await new Promise((resolve) => {
                    setTimeout(() => {
                        const repairs = JSON.parse(localStorage.getItem('repairs') || '[]');
                        bookingData.id = Date.now();
                        bookingData.status = 'Pending';
                        repairs.push(bookingData);
                        localStorage.setItem('repairs', JSON.stringify(repairs));
                        resolve({ success: true });
                    }, 100);
                });
                if (data.success) {
                    alert(data.message || "Your repair request has been booked successfully! 🛠️");
                    bookingForm.reset();
                } else {
                    alert(data.message || "Failed to book appointment. Please try again.");
                }

            } catch (error) {
                console.error("Error connecting to server:", error);
                alert("An error occurred while connecting to the server. Please try again later.");
            }
        });
    }
});