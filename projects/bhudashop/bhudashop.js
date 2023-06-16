// Get a reference to the "Add To Cart" buttons
var addToCartButtons = document.querySelectorAll('.cartbtn');

// Create an empty array to store the cart items
var cartItems = [];

// Add a click event listener to each "Add To Cart" button
addToCartButtons.forEach(function(button) {
  button.addEventListener('click', function(event) {
    // Get the parent li element of the clicked button
    var item = event.target.parentNode;

    // Get the product details from the item
    var productName = item.querySelector('p').textContent;
    var productPrice = item.querySelector('.price').textContent;

    // Create an object representing the cart item
    var cartItem = {
      name: productName,
      price: productPrice
    };
    cartItems.push(cartItem);

    // Optionally, you can display a message or update the UI to reflect the addition to the cart
    console.log('Item added to cart:', cartItem);

    // Optional: Update the cart UI with the new item
    updateCartUI();
  });
});

// Select the cart element
var cartElement = document.getElementById('cart');
const view = document.getElementById("cartview")
// Add a click event listener to the cart element
cartElement.addEventListener('click', function() {
  // Display the cart contents
  displayCart();
});

// Function to update the cart UI
function updateCartUI() {
  // Update the cart count
  cartElement.textContent = 'CART (' + cartItems.length + ')';
}

// Function to display the cart contents
function displayCart() {
  // Clear the existing cart content
  const view = document.querySelector("#cart::after")
  view.innerHTML = '';

  // Create a list to display the cart items
  var cartList = document.createElement('ul');

  // Iterate over the cart items and create list items for each item
  cartItems.forEach(function(item) {
    var listItem = document.createElement('li');
    listItem.textContent = item.name + ' - ' + item.price;
    cartList.appendChild(listItem);
  });

  // Add the cart list to the cart content element
  view.appendChild(cartList);

  // Show the cart content
  view.style.display = 'block';
}
