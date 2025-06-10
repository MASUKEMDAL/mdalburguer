// Tabs
document.querySelectorAll('.tab-button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));

    btn.classList.add('active');
    const tabId = btn.getAttribute('data-tab');
    document.getElementById(tabId).classList.add('active');
  });
});

// Modal
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modalImage');

document.querySelectorAll('.product-img').forEach(img => {
  img.addEventListener('click', () => {
    modal.style.display = 'block';
    modalImg.src = img.src;
  });
});

document.querySelector('.close-modal').addEventListener('click', () => {
  modal.style.display = 'none';
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

// Carrinho
let cart = [];
const cartButton = document.getElementById('cartButton');
const cartModal = document.getElementById('cart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const whatsappLink = document.getElementById('whatsappLink');

document.querySelectorAll('.add-cart').forEach(button => {
  button.addEventListener('click', e => {
    const card = e.target.closest('.card');
    const name = card.querySelector('h3').textContent;
    const price = parseFloat(card.querySelector('span').textContent.replace('R$', '').replace(',', '.'));

    cart.push({ name, price });
    updateCart();
  });
});

function updateCart() {
  cartItems.innerHTML = '';
  let total = 0;
  const grouped = {};

  // Agrupar os itens
  cart.forEach((item, index) => {
    if (!grouped[item.name]) {
      grouped[item.name] = { name: item.name, totalPrice: item.price, qty: 1, indices: [index] };
    } else {
      grouped[item.name].qty++;
      grouped[item.name].totalPrice += item.price;
      grouped[item.name].indices.push(index);
    }
  });

  // Renderizar itens agrupados com botão de remover
  Object.values(grouped).forEach(group => {
    const li = document.createElement('li');
    li.innerHTML = `${group.name} x${group.qty} - R$ ${group.totalPrice.toFixed(2).replace('.', ',')} 
      <button class="remove-item" data-name="${group.name}">Remover</button>`;
    cartItems.appendChild(li);
    total += group.totalPrice;
  });

  cartTotal.textContent = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;
  cartCount.textContent = cart.length;

  const msg = Object.values(grouped).map(i => `- ${i.name} x${i.qty}`).join('%0A') + `%0ATotal: R$ ${total.toFixed(2).replace('.', ',')}`;
  whatsappLink.href = `https://wa.me/5534998829396?text=Olá! Quero fazer o seguinte pedido:%0A${msg}`;

  // Adiciona evento de remover
  document.querySelectorAll('.remove-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const nameToRemove = btn.getAttribute('data-name');

      // Remove apenas 1 item com esse nome
      const index = cart.findIndex(i => i.name === nameToRemove);
      if (index !== -1) {
        cart.splice(index, 1);
        updateCart();
      }
    });
  });
}

// Abrir/Fechar Carrinho
cartButton.addEventListener('click', () => {
  cartModal.style.display = 'block';
});

document.getElementById('closeCart').addEventListener('click', () => {
  cartModal.style.display = 'none';
});
