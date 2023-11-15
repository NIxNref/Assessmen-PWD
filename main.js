// Make js working
if (document.readyState == "loading") {
    document.addEventListener("DOMContentLoaded", ready);
} else {
    ready();
}

// making function
function ready() {
    var removeCartBtns = document.getElementsByClassName('cart-remove');
    for (var i = 0; i < removeCartBtns.length; i++) {
        var btn = removeCartBtns[i];
        btn.addEventListener('click', removeCartItems);
    }

    var quantityInputs = document.getElementsByClassName('cart-quantity');
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i];
        input.addEventListener('change', quantityChanged); 
    }
}

// jumlah barang
function quantityChanged(event) {
    var input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updateTotal();
}

// remove item
function removeCartItems(event) {
    var btnClicked = event.target;
    btnClicked.parentElement.remove();
    updateTotal();
}

// update harga dan pajak
function updateTotal() {
    var cartContent = document.getElementsByClassName('cart-content')[0];
    var cartBoxes = cartContent.getElementsByClassName('cart-box');
    var total = 0;
    var pajakPersentase = 10; // Ganti dengan persentase pajak yang sesuai
    var pajakTotal = 0;

    for (var i = 0; i < cartBoxes.length; i++) {
        var cartBox = cartBoxes[i];
        var priceEl = cartBox.getElementsByClassName('cart-price')[0];
        var qty = cartBox.getElementsByClassName('cart-quantity')[0];
        var price = parseFloat(priceEl.innerText.replace("Rp. ", ""));
        var quantity = qty.value;
        total = total + (price * quantity);
    }

    pajakTotal = total * (pajakPersentase / 100);
    total += pajakTotal;

    document.getElementsByClassName('total-price')[0].innerText = 'Rp. ' + total.toFixed(2);
    document.getElementsByClassName('tax-price')[0].innerText = 'Rp. ' + pajakTotal.toFixed(2);

    
}

// Menambahkan barang ke cart
const cardBody = document.querySelectorAll('#makanan');
cardBody.forEach(function(card){
    card.addEventListener('click', function () {
        console.log(card);
        const nama = card.querySelector('.name').textContent;
        const prices = card.querySelector('#harga').textContent;
        console.log(nama, prices);
        const containerls = document.getElementsByClassName('container-list');
        containerls.innerHtml += InsertList(nama, prices);
    });
});

function InsertList(nama, prices) {
    return `<img src="/Assets/img/burger.jpeg" alt="Test">
            <div class="cart-box">
                <div class="cart-title">${nama}</div><br>
                <div class="cart-price">${prices}</div>
                <input type="number" value="0" class="cart-quantity">
            </div>
            <i class="fa fa-trash-o cart-remove" aria-hidden="true"></i>`
}