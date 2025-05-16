const hamburger = document.getElementById('hamburger');
const nav = document.querySelector('.nav');

hamburger.addEventListener('click', () => {
    nav.classList.toggle('open');
});

const container = document.querySelector(".first-container");
  const images = [
    "./images/mainBgImage.jpg",
    "./images/blog5.jpg",
    "./images/bg4.jpg"
  ];

  const dots = document.querySelectorAll(".dot");
  let index = 0;

  function updateCarousel() {
    container.style.backgroundImage = `url(${images[index]})`;
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
  }

  setInterval(() => {
    index = (index + 1) % images.length;
    updateCarousel();
  }, 2000);

 
  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      index = i;
      updateCarousel();
    });
  });

  
  updateCarousel();

document.addEventListener('DOMContentLoaded', () => {
  const TABS = document.querySelectorAll('.tab-item');
  const container = document.querySelector('.products-container');
  const showMoreBtn = document.getElementById('showMoreBtn');

  let allProducts = [];
  let currentCat = 'Novinky';
  let showingAll = false;

  fetch('./data/product.json')
    .then(res => res.json())
    .then(data => {
      allProducts = data;
      renderTab(currentCat);
    })
    .catch(err => console.error('Chyba při načítání produktů:', err));

  function renderTab(category) {
    currentCat = category;
    showingAll = false;
    showMoreBtn.style.display = 'block';

    const filtered = allProducts.filter(p => p.category === category);

    const toShow = filtered.slice(0, 4);
    renderProducts(toShow);

    if (filtered.length <= 4) {
      showMoreBtn.style.display = 'none';
    }
  }

function renderProducts(items) {
  container.innerHTML = '';

  items.forEach(p => {
    let availabilityClass = '';
    if (p.availability === 'Skladem') {
      availabilityClass = 'availability-in-stock';
    } else if (p.availability === 'Na objednávku') {
      availabilityClass = 'availability-on-order';
    } else if (p.availability === 'Momentálně nedostupné') {
      availabilityClass = 'availability-unavailable';
    }

    const flagsHtml = Array.isArray(p.flags)
      ? p.flags.map(f => {
          const flagClass = f.toLowerCase()
                             .normalize('NFD') // убирает акценты
                             .replace(/[\u0300-\u036f]/g, '') // фильтрует диакритику
                             .replace(/\s+/g, '-'); // пробел → дефис
          return `<span class="flag ${flagClass}">${f}</span>`;
        }).join(' ')
      : '';

    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="flags">${flagsHtml}</div>
      <img src="${p.imgSrc}" alt="${p.title}">
      <h3 class="text-h3">${p.title}</h3>
      <p class="${availabilityClass}">${p.availability}</p>
      <p>${p.price.toLocaleString('cs-CZ')} CZK</p>
    `;
    container.appendChild(card);
  });
}




  TABS.forEach(tab => {
    tab.addEventListener('click', e => {
      e.preventDefault();
      TABS.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderTab(tab.dataset.cat);
    });
  });

  showMoreBtn.addEventListener('click', () => {
    if (showingAll) return;
    const filtered = allProducts.filter(p => p.category === currentCat);
    renderProducts(filtered);
    showingAll = true;
    showMoreBtn.style.display = 'none';
  });
});
