document.addEventListener('DOMContentLoaded', async () => {
    const data = await loadData();
    if (data) {
        renderProfile(data.profile);
        renderRole(data.role);
        renderTiles('experience-tiles', data.experience);
        renderTiles('skills-tiles', data.skills);
        setupModal();
    }
});

async function loadData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error('Failed to load data');
        return await response.json();
    } catch (error) {
        console.error('Error loading data:', error);
        return null;
    }
}

function renderProfile(profile) {
    document.getElementById('profile-icon').textContent = profile.icon;
    document.getElementById('profile-name').textContent = profile.name;
    document.getElementById('profile-tagline').textContent = profile.tagline;
    document.getElementById('linkedin-link').href = profile.linkedIn;
    document.title = `${profile.name} - CV Companion`;
}

function renderRole(role) {
    document.getElementById('role-company').textContent = role.company;
    document.getElementById('role-title').textContent = role.title;
    document.getElementById('role-description').textContent = role.description;
}

function renderTiles(containerId, items) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    items.forEach((item) => {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.innerHTML = `
            <h4>${item.title}</h4>
            <p class="tile-summary">${item.summary}</p>
            <button class="tile-trigger">
                <span class="question-mark">?</span>
                How do I help?
            </button>
        `;
        tile.querySelector('.tile-trigger').addEventListener('click', () => openModal(item));
        container.appendChild(tile);
    });
}

function setupModal() {
    const overlay = document.getElementById('modal-overlay');
    const closeBtn = document.getElementById('modal-close');

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

function openModal(item) {
    const overlay = document.getElementById('modal-overlay');
    const title = document.getElementById('modal-title');
    const bullets = document.getElementById('modal-bullets');
    const quoteBox = document.getElementById('quote-box');
    const quoteText = document.getElementById('quote-text');
    const quoteAuthor = document.getElementById('quote-author');

    title.textContent = item.title;

    bullets.innerHTML = '';
    item.bullets.forEach(bullet => {
        const li = document.createElement('li');
        li.textContent = bullet;
        bullets.appendChild(li);
    });

    if (item.quote && item.quote.text) {
        quoteBox.style.display = 'block';
        quoteText.textContent = item.quote.text;
        quoteAuthor.textContent = item.quote.author;
    } else {
        quoteBox.style.display = 'none';
    }

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const overlay = document.getElementById('modal-overlay');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}
