const hamburger = document.getElementById('hamburger');
const nav = document.querySelector('.list');

hamburger.addEventListener('click', () => {
    nav.classList.toggle('open');
});



// const modal = document.getElementById("modal");
// const openModalBtn = document.getElementById("openModal");
// const closeModalBtn = document.querySelector(".close");

// openModalBtn.addEventListener("click", () => {
//     modal.classList.add("show");
//     document.body.classList.add("modal-open");
// });

// closeModalBtn.addEventListener("click", () => {
//     modal.classList.remove("show");
//     document.body.classList.remove("modal-open"); 
// });




document.addEventListener('DOMContentLoaded', () => {
  const TABS = document.querySelectorAll('.tab-item');
  const container = document.querySelector('.products-container');
  const showMoreBtn = document.getElementById('showMoreBtn');

  let allProducts = [];
  let currentCat = 'Novinky';
  let showingAll = false;

  // 1. Загрузим JSON
  fetch('./data/product.json')
    .then(res => res.json())
    .then(data => {
      // Здесь можно валидировать data через JSONLint если надо
      allProducts = data;
      renderTab(currentCat);
    })
    .catch(err => console.error('Chyba při načítání produktů:', err));

  // 2. Функция рендера вкладки
  function renderTab(category) {
    currentCat = category;
    showingAll = false;
    showMoreBtn.style.display = 'block';

    // Фильтруем продукты по категории
    const filtered = allProducts.filter(p => p.category === category);

    // Показываем первые 4
    const toShow = filtered.slice(0, 4);
    renderProducts(toShow);

    // Если продуктов ≤4, скрываем кнопку
    if (filtered.length <= 4) {
      showMoreBtn.style.display = 'none';
    }
  }

  // 3. Отрисовка карточек
  function renderProducts(items) {
    container.innerHTML = '';
    items.forEach(p => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <img src="${p.imgSrc}" alt="${p.title}">
        <h3>${p.title}</h3>
        <p>${p.availability}</p>
        <p>${p.price.toLocaleString('cs-CZ')} Kč</p>
        <div class="flags">
         ${Array.isArray(p.flags) ? p.flags.map(f => `<span class="flag">${f}</span>`).join(' ') : ''}
        </div>
      `;
      container.appendChild(card);
    });
  }

  // 4. Обработчики клика по вкладкам
  TABS.forEach(tab => {
    tab.addEventListener('click', e => {
      e.preventDefault();
      TABS.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderTab(tab.dataset.cat);
    });
  });

  // 5. Обработчик кнопки "Показать больше"
  showMoreBtn.addEventListener('click', () => {
    if (showingAll) return;
    const filtered = allProducts.filter(p => p.category === currentCat);
    renderProducts(filtered); // Показываем все
    showingAll = true;
    showMoreBtn.style.display = 'none';
  });
});
