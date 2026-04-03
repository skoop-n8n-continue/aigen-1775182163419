async function loadAppData() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to load app data:', error);
        return null;
    }
}

async function init() {
    const data = await loadAppData();
    if (!data) return;

    // Apply Styles from app_settings
    const settings = data.sections.app_settings;
    document.documentElement.style.setProperty('--primary', settings.primary_color.value);
    document.documentElement.style.setProperty('--dark', settings.background_dark.value);
    document.documentElement.style.setProperty('--card-bg-opacity', settings.card_bg_opacity.value);

    // Set background image
    const bgImage = data.sections.storefront.background_image.value;
    const bgOverlay = document.querySelector('.background-overlay');
    if (bgImage) {
        bgOverlay.style.backgroundImage = `url('${bgImage}')`;
    }

    // Bind Storefront Data
    document.getElementById('hotel-name').innerHTML = data.sections.storefront.hotel_name.value.replace(' ', '<br>');
    document.getElementById('guest-name').textContent = data.sections.storefront.guest_name.value;
    document.getElementById('location').textContent = data.sections.storefront.location.value;

    // Render Navigation
    const navItems = data.sections.navigation.value;
    const navContainer = document.getElementById('nav-container');
    navContainer.innerHTML = '';
    navItems.forEach(item => {
        const navEl = document.createElement('div');
        navEl.className = `nav-item ${item.active ? 'active' : ''}`;
        navEl.textContent = item.label;
        navContainer.appendChild(navEl);
    });

    // Render TV Guide
    const tvItems = data.sections.tv_guide.value;
    const tvContainer = document.getElementById('tv-guide-container');
    tvContainer.innerHTML = '';
    tvItems.forEach(item => {
        const tvEl = document.createElement('div');
        tvEl.className = `tv-item ${item.is_live ? 'playing' : ''}`;
        tvEl.innerHTML = `
            <span class="channel">${item.channel}</span>
            <span class="show">${item.show}</span>
            <span class="${item.is_live ? 'time-status' : 'time'}">${item.time}</span>
        `;
        tvContainer.appendChild(tvEl);
    });

    // Render Attractions
    const attractions = data.sections.attractions.value;
    const attrContainer = document.getElementById('attractions-container');
    // Keep H3
    const attrHeader = attrContainer.querySelector('h3');
    attrContainer.innerHTML = '';
    if (attrHeader) attrContainer.appendChild(attrHeader);

    attractions.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'attraction-card';
        itemEl.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="card-info">
                <h4>${item.name}</h4>
                <p>${item.description}</p>
            </div>
        `;
        attrContainer.appendChild(itemEl);
    });

    // Render Restaurants
    const restaurants = data.sections.restaurants.value;
    const restContainer = document.getElementById('restaurants-container');
    const restHeader = restContainer.querySelector('h3');
    restContainer.innerHTML = '';
    if (restHeader) restContainer.appendChild(restHeader);

    restaurants.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'restaurant-card';
        itemEl.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="card-info">
                <h4>${item.name}</h4>
                <p>${item.description}</p>
            </div>
        `;
        restContainer.appendChild(itemEl);
    });

    // Bind Room Service
    const rs = data.sections.room_service;
    document.getElementById('room-service-image').src = rs.image.value;
    document.getElementById('room-service-title').textContent = rs.title.value;
    document.getElementById('room-service-desc').textContent = rs.description.value;
    document.getElementById('room-service-cta').textContent = rs.cta_text.value;

    // Start Utilities
    updateDateTime();
    setInterval(updateDateTime, 1000);
    updateWeather();
    setInterval(updateWeather, 600000);
    startSubtleAnimations();
    initCyclingEffect();

    // Reveal App
    document.getElementById('app-container').classList.add('loaded');
}

function updateDateTime() {
    const now = new Date();
    const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
    const timeEl = document.getElementById('current-time');
    if (timeEl) timeEl.textContent = now.toLocaleTimeString('en-US', timeOptions);

    const dateOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    const dateEl = document.getElementById('current-date');
    if (dateEl) dateEl.textContent = now.toLocaleDateString('en-US', dateOptions);
}

function updateWeather() {
    const temps = [71, 72, 73, 70];
    const randomTemp = temps[Math.floor(Math.random() * temps.length)];
    const tempEl = document.getElementById('weather-temp');
    if (tempEl) tempEl.textContent = `${randomTemp}°F`;
}

function startSubtleAnimations() {
    const activeNav = document.querySelector('.nav-item.active');
    if (activeNav) {
        activeNav.style.animation = 'pulse 3s infinite ease-in-out';
    }

    if (!document.getElementById('pulse-style')) {
        const style = document.createElement('style');
        style.id = 'pulse-style';
        style.innerHTML = `
            @keyframes pulse {
                0% { transform: translateX(0); opacity: 1; }
                50% { transform: translateX(5px); opacity: 0.8; }
                100% { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
}

function initCyclingEffect() {
    let cycleCounter = 0;
    setInterval(() => {
        cycleCounter++;
        const sections = document.querySelectorAll('.grid-card');
        if (sections.length === 0) return;
        sections.forEach(s => s.style.borderColor = 'rgba(255, 255, 255, 0.1)');
        sections[cycleCounter % sections.length].style.borderColor = 'var(--primary)';
    }, 10000);
}

init();
