const products = {};
fetch('shop?type=json')
	.then(response => response.json())
	.then(data => {
		data.forEach(product  => {
			products[product.productId] = product;
	}	);
		})
	.catch(error => {
		console.error('Ошибка при получении списка товаров:', error);
	});


// Добавление обработчиков событий для кнопок "плюс" и "минус"
const productCards = document.querySelectorAll('.product-card');
productCards.forEach((card) => {
	const colorSelectors = card.querySelectorAll('.color-selector');
	const quantityCounter = card.querySelector('.quantity-counter');
	const plusButton = card.querySelector('.plus-button');
	const minusButton = card.querySelector('.minus-button');
	const addToCartButton = card.querySelector('.add-to-cart');
	
	colorSelectors.forEach(selector => 
		selector.addEventListener('click', () => {
			chengeColor(selector);
	}));

	plusButton.addEventListener('click', () => {
		updateQuantity(quantityCounter, true);
	});

	minusButton.addEventListener('click', () => {
		updateQuantity(quantityCounter, false);
	});

	addToCartButton.addEventListener('click', () => {
		const productName = card.querySelector('.product-title').textContent;
		const selectedColor = card.querySelector('.color-selector').value;
		const selectedQuantity = quantityCounter.getAttribute('data-quantity');
		
		const cartItem = {name: productName, color: selectedColor, quantity: selectedQuantity}
		addToCart(cartItem);
	});
});


function chengeColor(selector) {
	const card = selector.closest(".product-card");
	const image = card.querySelector(".product-image");
	const stock = card.querySelector('.product-stock-value');
	const colorSelectors = card.querySelectorAll('.color-selector');

	const productId = card.getAttribute("data-product-id");
	const selectedColor = selector.getAttribute("data-color");
	const data = products[productId].data;
	console.log(data);

	colorSelectors.forEach(color => color.classList.remove('selected'))
	selector.classList.add('selected');
	for (let element of data) {
		console.log(selectedColor);
		console.log(element.color);
		if (element.color == selectedColor) {
			image.setAttribute("src", element.location);   // замена фотографии
			stock.textContent = element.quantity;        // замена наличия
			console.log(image.getAttribute("src"));
			console.log(stock.textContent);
			break;
		}
	}
}

function updateQuantity(quantityCounter, increment) {
	const currentValue = parseInt(quantityCounter.getAttribute("data-quantity"));
	const newValue = increment ? currentValue + 1 : currentValue - 1;
	quantityCounter.setAttribute("data-quantity", newValue);
	quantityCounter.textContent = (newValue == 1) ? "В корзину" : "Добавить " + newValue + " шт";
}

const cartButton = document.querySelector('.cart-button');
const cartIndicator = document.querySelector('.cart-indicator');

let cartCount = 0;

// Функция для обновления индикатора корзины
function updateCartIndicator() {
	if (document.cookie.indexOf('cartSize=') !== -1) {
		let cookieValue = document.cookie
			.split('; ')
			.find(row => row.startsWith('cartSize='))
			.split('=')[1];
		cartCount = JSON.parse(cookieValue);
		cartIndicator.textContent = cartCount;
	}
}

updateCartIndicator()

// Функция для добавления товара в корзину
function addToCart(cartItem) {
	let cartItems = []
	cartCount++;
	if (document.cookie.indexOf('cartItems=') !== -1) {
		let cookieValue = document.cookie
			.split('; ')
			.find(row => row.startsWith('cartItems='))
			.split('=')[1];
		cartItems = JSON.parse(cookieValue);
	} 
	cartItems.push(cartItem)
	const updatedCartItems = JSON.stringify(cartItems);
	document.cookie = "cartSize=" + cartCount + ";cartItems=" + updatedCartItems;
	cartIndicator.textContent = cartCount;
}