function formatCurrency(value) {
    return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }).replace('₫', '').trim() + 'đ';
}

function updateQuantity(button, change) {
    var quantityInput = button.parentElement.querySelector('.quantity-input');
    var currentQuantity = parseInt(quantityInput.value);
    var newQuantity = currentQuantity + change;

    if (newQuantity >= 1) {
        quantityInput.value = newQuantity;

        var productId = button.closest('tr').querySelector('.data-product-id').value;
        var size = button.closest('tr').querySelector('.data-size').value;

        console.log(productId, newQuantity, size);

        fetch('/cart/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `productId=${productId}&quantity=${newQuantity}&size=${size}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Error:', data.error);
                alert(data.error);
            } else {
                document.querySelector('.checkout_items').textContent = data.totalQuantity;
                document.querySelector('.cart_items').textContent = data.totalQuantity;
                document.querySelector('.cart_items1').textContent = data.totalQuantity;

                var priceCell = button.closest('tr').querySelector('.price');
                var itemTotalCell = button.closest('tr').querySelector('.item-total');
                var itemPrice = parseFloat(priceCell.getAttribute('data-price'));
                var newQuantity = parseInt(quantityInput.value);

                itemTotalCell.textContent = formatCurrency(itemPrice * newQuantity);

                if (document.querySelector('.cart-total')) {
                    document.querySelector('.cart-total').textContent = formatCurrency(data.cartTotal);
                }
            }
        })
        .catch(error => console.error('Lỗi:', error));
    }
}
