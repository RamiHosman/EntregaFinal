import * as data from "./data.js";

// Función para mostrar los productos dependiendo su contenedor: mate, termo o bombilla
function mostrarProductos(contenedor, productos) {
  const contenedorProductos = document.querySelector(contenedor);

  productos.forEach((producto) => {
    const productoDiv = document.createElement("div");
    productoDiv.classList.add("product");

    productoDiv.innerHTML = `
            <h3>${producto.nombre}</h3>
            <p>Precio: $${producto.precio}</p>
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <button class="agregar-carrito-btn" data-nombre="${producto.nombre}" data-precio="${producto.precio}">Agregar al Carrito</button>
        `;

    contenedorProductos.appendChild(productoDiv);

    // Agregar un EventListener a cada botón "AgregarAlCarrito"
    productoDiv
      .querySelector(".agregar-carrito-btn")
      .addEventListener("click", () => {
        agregarAlCarrito(producto.nombre, producto.precio);
      });
  });
}

function agregarAlCarrito(nombre, precio) {
  const carritoItems = document.getElementById("carrito-items");
  let encontrado = false;
  carritoItems.querySelectorAll(".cart-item").forEach((item) => {
    if (item.dataset.nombre === nombre) {
      let cantidadElem = item.querySelector(".cantidad");
      cantidadElem.textContent = parseInt(cantidadElem.textContent) + 1;
      encontrado = true;
    }
  });
  if (!encontrado) {
    const nuevoItem = document.createElement("div");
    nuevoItem.classList.add("cart-item");
    nuevoItem.dataset.nombre = nombre;
    nuevoItem.dataset.precio = precio;
    nuevoItem.innerHTML = `<p>${nombre} - $${precio} x <span class="cantidad">1</span></p>
                           <button class="eliminar-item-btn">Eliminar</button>`;
    nuevoItem
      .querySelector(".eliminar-item-btn")
      .addEventListener("click", () => {
        eliminarDelCarrito(nombre);
      });
    carritoItems.appendChild(nuevoItem);
  }
  // Guardar el producto en el localStorage
  let carrito = obtenerCarritoDelLocalStorage();
  let productoExistente = carrito.find((item) => item.nombre === nombre);
  if (productoExistente) {
    productoExistente.cantidad += 1;
  } else {
    carrito.push({ nombre, precio, cantidad: 1 });
  }
  guardarCarritoEnLocalStorage(carrito);

  // Mostrar el total después de agregar el producto al carrito
  mostrarTotal();
}

// Funcion para eliminar un producto del carrito
function eliminarDelCarrito(nombre) {
  const carritoItems = document.getElementById("carrito-items");
  const item = carritoItems.querySelector(
    `.cart-item[data-nombre="${nombre}"]`
  );
  if (item) {
    carritoItems.removeChild(item);
  }

  let carrito = obtenerCarritoDelLocalStorage();
  carrito = carrito.filter((producto) => producto.nombre !== nombre);
  guardarCarritoEnLocalStorage(carrito);

  mostrarTotal();
}

// Función para vaciar el carrito y eliminar los productos del localStorage
function vaciarCarrito() {
  const carritoItems = document.getElementById("carrito-items");
  carritoItems.innerHTML = "";
  localStorage.removeItem("carrito");

  const totalElement = document.querySelector("span");
  if (totalElement) {
    totalElement.remove();
    localStorage.removeItem("totalAPagar");
  }
}

// Función para mostrar/ocultar el carrito
function toggleCarrito() {
  const carrito = document.getElementById("carrito");
  carrito.style.display = carrito.style.display === "block" ? "none" : "block";
}

// Agrega un event listener para el evento de clic en el icono del carrito
document.querySelector(".cart-icon").addEventListener("click", toggleCarrito);

// Agrega un event listener para el evento de clic en el botón "Vaciar Carrito"
document
  .getElementById("vaciar-carrito-btn")
  .addEventListener("click", vaciarCarrito);

// Función para calcular el total del carrito
function calcularTotal() {
  const carrito = obtenerCarritoDelLocalStorage();
  let total = 0;
  carrito.forEach((item) => {
    total += item.precio * item.cantidad;
  });
  return total;
}

// Función para mostrar el total a pagar junto al botón "Vaciar Carrito"
function mostrarTotal() {
  const total = calcularTotal();
  const totalElement = document.querySelector(".cart-total");
  if (totalElement) {
    totalElement.textContent = `Total a pagar: $${total.toFixed(2)}`;
  } else {
    const nuevoTotalElement = document.createElement("span");
    nuevoTotalElement.textContent = `Total a pagar: $${total.toFixed(2)}`;
    nuevoTotalElement.classList.add("cart-total");
    const vaciarCarritoBtn = document.getElementById("vaciar-carrito-btn");
    vaciarCarritoBtn.insertAdjacentElement("afterend", nuevoTotalElement);
  }
}

// Función para guardar el carrito en el localStorage
function guardarCarritoEnLocalStorage(carrito) {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  // Agregar el total a pagar al localStorage
  const total = calcularTotal();
  localStorage.setItem("totalAPagar", total.toFixed(2));
}

// Función para obtener el carrito del localStorage
function obtenerCarritoDelLocalStorage() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  return carrito;
}

// Función para cargar los productos del localStorage al cargar la página
function cargarProductosDelLocalStorage() {
  const carritoItems = document.getElementById("carrito-items");
  const carrito = obtenerCarritoDelLocalStorage();
  carritoItems.innerHTML = "";
  carrito.forEach((producto) => {
    const nuevoItem = document.createElement("div");
    nuevoItem.classList.add("cart-item");
    nuevoItem.dataset.nombre = producto.nombre;
    nuevoItem.dataset.precio = producto.precio;
    nuevoItem.innerHTML = `<p>${producto.nombre} - $${producto.precio} x <span class="cantidad">${producto.cantidad}</span></p>
                           <button class="eliminar-item-btn">Eliminar</button>`;
    nuevoItem
      .querySelector(".eliminar-item-btn")
      .addEventListener("click", () => {
        eliminarDelCarrito(producto.nombre);
      });
    carritoItems.appendChild(nuevoItem);
  });

  // Mostrar el total después de cargar los productos del carrito desde el localStorage
  mostrarTotal();
}

// Llama a la función para cargar los productos del localStorage al cargar la página
window.addEventListener("load", cargarProductosDelLocalStorage);

// Muestra los productos de mates, termos y bombillas
mostrarProductos(".mates-container", data.mates);
mostrarProductos(".termos-container", data.termos);
mostrarProductos(".bombillas-container", data.bombillas);
