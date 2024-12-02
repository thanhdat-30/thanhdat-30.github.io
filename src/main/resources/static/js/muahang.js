document.querySelectorAll('.add-to-cart-form').forEach(form => {
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(this);
        const productId = formData.get('productId');
        const quantity = formData.get('quantity');

        fetch(this.action, {
            method: 'POST',
            body: formData,
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.');
        })
        .then(data => {
            document.getElementById('popup-message').textContent = "Thêm sản phẩm vào giỏ hàng thành công!";
            const popup = document.getElementById('notification-popup');
            popup.style.display = 'block';

            document.getElementById('checkout_items').textContent = data.totalQuantity;

            setTimeout(() => {
                popup.style.display = 'none';
            }, 5000);
        })
        .catch(error => {
            document.getElementById('popup-message').textContent = error.message;
            const popup = document.getElementById('notification-popup');
            popup.style.display = 'block';

            setTimeout(() => {
                popup.style.display = 'none';
            }, 5000);
        });
    });
});