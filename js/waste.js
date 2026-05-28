document.addEventListener('DOMContentLoaded', function () {

    const radioButtons = document.querySelectorAll('input[name="disposal-method"]');
    const pickupGroup = document.getElementById('pickup-address-group');

    radioButtons.forEach(radio => {
        radio.addEventListener('change', function () {
            if (this.value === 'pickup') {
                pickupGroup.style.display = 'block';
                document.getElementById('ewaste-address').required = true;
            } else {
                pickupGroup.style.display = 'none';
                document.getElementById('ewaste-address').required = false;
            }
        });
    });

    const form = document.getElementById('ewasteForm');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const disposalMethod = document.querySelector('input[name="disposal-method"]:checked').value;

            const data = {
                deviceList:     document.getElementById('ewaste-device-list').value,
                disposalMethod: disposalMethod,
                pickupAddress:  document.getElementById('ewaste-address').value,
                preferredDate:  document.getElementById('ewaste-date').value
            };

            fetch('submit-ewaste.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            .then(res => res.json())
            .then(result => {
                if (result.success) {
                    alert('Your e-waste disposal request has been submitted!');
                    form.reset();
                } else {
                    alert(result.message || 'Something went wrong.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Could not connect to server.');
            });
        });
    }

});