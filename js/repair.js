document.addEventListener('DOMContentLoaded', function () {

    const form = document.getElementById('repairBookingForm');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const data = {
                fullName:        document.getElementById('client-name').value,
                email:           document.getElementById('client-email').value,
                phone:           document.getElementById('client-phone').value,
                deviceModel:     document.getElementById('device-model').value,
                issueType:       document.getElementById('repair-type').value,
                appointmentDate: document.getElementById('appointment-date').value,
                issueDesc:       document.getElementById('issue-desc').value
            };

            fetch('submit-repair.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            .then(res => res.json())
            .then(result => {
                if (result.success) {
                    alert('Your repair request has been submitted! We will contact you soon.');
                    form.reset();
                } else {
                    alert(result.message || 'Something went wrong. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Could not connect to server.');
            });
        });
    }

});