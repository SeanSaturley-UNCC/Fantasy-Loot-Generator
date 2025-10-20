document.addEventListener('DOMContentLoaded', () => {
  const genBtn = document.getElementById('genBtn'),
        errEl = document.getElementById('err'),
        card = document.getElementById('card'),
        imgEl = document.getElementById('img'),
        titleEl = document.getElementById('title'),
        rarityEl = document.getElementById('rarity'),
        priceEl = document.getElementById('price'),
        detailsEl = document.getElementById('details');

  const rarityClass = r => `rarity-${(r || '').toLowerCase()}`;

  async function fetchItem() {
    errEl.hidden = true;
    genBtn.disabled = true;


    genBtn.classList.add('loading');

    try {
      const res = await fetch('/loot/generate');
      if (!res.ok) throw new Error('HTTP ' + res.status);

      const item = await res.json();

    
      imgEl.src = item.imageUrl;
      imgEl.alt = item.title || 'item';
      titleEl.textContent = item.title || '—';
      rarityEl.textContent = item.rarity || '—';
      priceEl.textContent = item.price ?? '—';
      detailsEl.textContent = item.details || '—';

      rarityEl.className = rarityClass(item.rarity);
      card.classList.add('show');
    } catch (e) {
      console.error(e);
      errEl.textContent = 'Failed to fetch item. Check server logs.';
      errEl.hidden = false;
    } finally {
     
      genBtn.classList.remove('loading');
      genBtn.disabled = false;
    }
  }

  genBtn.addEventListener('click', fetchItem);
});
