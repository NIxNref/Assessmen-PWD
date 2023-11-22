let cartIcon = document.querySelector('#cart-icon');
let cart = document.querySelector('.cart');
let closeCart = document.querySelector('#close-cart');

// open cart
cartIcon.onclick = () => {
    cart.classList.add("active");
}

// close cart
closeCart.onclick = () => {
    cart.classList.remove("active");
}

// Make js working
if (document.readyState == "loading") {
    document.addEventListener("DOMContentLoaded", ready);
} else {
    ready();
}

// making function
function ready() {
    // remove items from cart
    var removeCartBtns = document.getElementsByClassName('cart-remove');
    for (var i = 0; i < removeCartBtns.length; i++) {
        var btn = removeCartBtns[i];
        btn.addEventListener('click', removeCartItems);
    }

    // quantity change
    var quantityInputs = document.getElementsByClassName('cart-quantity');
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i];
        input.addEventListener('change', quantityChanged);
    }

    // add to cart
    var addCart = document.getElementsByClassName('add-cart')
    for (var i = 0; i < addCart.length; i++) {
        var button = addCart[i];
        button.addEventListener('click', addCartClicked);
    }

    // buy button
    var buyButton = document.querySelector('.btn-buy');
    if (buyButton) {
        buyButton.addEventListener('click', buyButtonClicked);
    }
}

// buy button
function buyButtonClicked() {
    alert("Item sudah berhasil dibeli");

    // Transform cart items into a recipe format
    var recipeText = transformCartToRecipe();

    // Download the recipe as a text file
    downloadRecipe(recipeText);

    var cartContent = document.querySelector('.cart-content');
    cartContent.innerHTML = ''; // Clear all child elements
    updateTotal();
}

// download recipe 
function downloadRecipe(recipeText) {
    var blob = new Blob([recipeText], { type: 'text/plain' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'recipes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// jumlah barang
function quantityChanged(event) {
    var input = event.target;
    var newValue = parseInt(input.value);

    if (isNaN(newValue) || newValue <= 0) {
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

// add to cart
function addCartClicked(event) {
    event.preventDefault(); // Prevent the default behavior of the add-to-cart button

    var button = event.target;
    var shopProduct = button.parentElement; // Adjust the level based on your HTML structure
    var title = shopProduct.querySelector(".product-title").innerText;
    var price = shopProduct.querySelector(".price").innerText;
    var productImg = shopProduct.querySelector(".product-img").src;
    addProductToCart(title, price, productImg);
    
    // Show alert when item is added to cart
    alert("Item ditambahkan ke keranjang");
    
    updateTotal();
}

// recipe
function transformCartToRecipe() {
    var cartContent = document.querySelector('.cart-content');
    var cartBoxes = cartContent.getElementsByClassName('cart-box');
    var recipeText = "----------------------------------------------------\n";

    var total = 0;
    var pajakPersentase = 10; // Replace with your tax percentage
    var pajakTotal = 0;

    for (var i = 0; i < cartBoxes.length; i++) {
        var cartBox = cartBoxes[i];
        var title = cartBox.querySelector('.cart-product-title').innerText;
        var priceEl = cartBox.querySelector('.cart-price');
        var qty = cartBox.querySelector('.cart-quantity').value;
        var price = parseFloat(priceEl.innerText.replace("Rp. ", ""));

        recipeText += `${title} - ${qty} - Rp. ${price * qty}\n`;

        // Calculate total price
        total += price * qty;
    }

    // Calculate tax amount
    pajakTotal = total * (pajakPersentase / 100);

    recipeText += `\nTotal Harga: Rp. ${total.toFixed(2)}`;
    recipeText += `\nPajak (10%): Rp. ${pajakTotal.toFixed(2)}`;
    recipeText += `\nTotal Harga (termasuk pajak): Rp. ${(total + pajakTotal).toFixed(2)}`;
    recipeText += `\n----------------------------------------------------\n`;

    return recipeText;
}
// add to cart
function addProductToCart(title, price, productImg) {
    var cartShopBox = document.createElement("div");
    cartShopBox.classList.add("cart-box");

    // Check if the item is already in the cart
    var cartItemsNames = document.querySelectorAll('.cart-product-title');
    for (var i = 0; i < cartItemsNames.length; i++) {
        if (cartItemsNames[i].innerText === title) {
            alert("Kamu telah memasukan item ke keranjang");
            alert("jika ingin menambahkan item silahkan lihat keranjang");
            return;
        }
    }

    var cartItems = document.querySelector('.cart-content');
    cartItems.appendChild(cartShopBox);

    var cartBoxContent = `<img src="${productImg}" alt="" class="cart-img">
                            <div class="detail-box">
                                <div class="cart-product-title">${title}</div>
                                <div class="cart-price">${price}</div>
                                <input type="number" value="1" class="cart-quantity">
                            </div>
                            <!-- remove cart -->
                            <i class='bx bx-trash cart-remove'></i>`;
    cartShopBox.innerHTML = cartBoxContent;

    // Add event listeners
    cartShopBox.querySelector('.cart-remove').addEventListener('click', removeCartItems);
    cartShopBox.querySelector('.cart-quantity').addEventListener('change', quantityChanged);

    // Update total after adding item to cart
    updateTotal();
}


// update harga dan pajak
function updateTotal() {
    var cartContent = document.querySelector('.cart-content');
    var cartBoxes = cartContent.getElementsByClassName('cart-box');
    var total = 0;
    var pajakPersentase = 10; // Ganti dengan persentase pajak yang sesuai
    var pajakTotal = 0;

    for (var i = 0; i < cartBoxes.length; i++) {
        var cartBox = cartBoxes[i];
        var priceEl = cartBox.querySelector('.cart-price'); // Use querySelector to get the first element with class 'cart-price'
        var qty = cartBox.querySelector('.cart-quantity'); // Use querySelector to get the first element with class 'cart-quantity'
        var price = parseFloat(priceEl.innerText.replace("Rp. ", ""));
        var quantity = parseInt(qty.value);
        total = total + (price * quantity);
    }

    pajakTotal = total * (pajakPersentase / 100);
    total += pajakTotal;

    document.querySelector('.total-price').innerText = 'Rp. ' + total.toFixed(2); // Use querySelector to get the first element with class 'total-price'
    document.querySelector('.tax-price').innerText = 'Rp. ' + pajakTotal.toFixed(2); // Use querySelector to get the first element with class 'tax-price'
}
