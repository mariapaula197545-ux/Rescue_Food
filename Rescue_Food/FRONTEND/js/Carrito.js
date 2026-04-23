// Función para actualizar el número de productos en el carrito
function updateCartCount() {
    const cartCountSpan = document.getElementById('cartCount');
    if (!cartCountSpan) return;
    
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    cartCountSpan.innerText = totalItems;
}

// Ejecutar después de que el DOM esté listo
document.addEventListener('DOMContentLoaded', updateCartCount);
