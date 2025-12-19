// Oscar's Classic Model Cars Collection - Main Application

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const carGrid = document.getElementById('carGrid');
    const searchInput = document.getElementById('searchInput');
    const manufacturerFilter = document.getElementById('manufacturerFilter');
    const scaleFilter = document.getElementById('scaleFilter');
    const typeFilter = document.getElementById('typeFilter');
    const eraFilter = document.getElementById('eraFilter');
    const sortBy = document.getElementById('sortBy');
    const clearFiltersBtn = document.getElementById('clearFilters');
    const resultsCount = document.getElementById('resultsCount');
    const noResults = document.getElementById('noResults');
    const themeToggle = document.getElementById('themeToggle');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const nav = document.querySelector('.nav');
    const modal = document.getElementById('carModal');
    const modalClose = document.getElementById('modalClose');
    const modalBody = document.getElementById('modalBody');

    // State
    let filteredCars = [...carsCollection];

    // Initialize
    init();

    function init() {
        populateFilters();
        renderCars(filteredCars);
        updateStats();
        setupEventListeners();
        initTheme();
        animateHeroStats();
    }

    // Populate filter dropdowns
    function populateFilters() {
        // Get unique values
        const manufacturers = [...new Set(carsCollection.map(car => car.manufacturer))].sort();
        const scales = [...new Set(carsCollection.map(car => car.scale))].sort();
        const types = [...new Set(carsCollection.map(car => car.type))].sort();

        // Populate manufacturer filter
        manufacturers.forEach(manufacturer => {
            const option = document.createElement('option');
            option.value = manufacturer;
            option.textContent = manufacturer;
            manufacturerFilter.appendChild(option);
        });

        // Populate scale filter
        scales.forEach(scale => {
            const option = document.createElement('option');
            option.value = scale;
            option.textContent = scale;
            scaleFilter.appendChild(option);
        });

        // Populate type filter
        types.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            typeFilter.appendChild(option);
        });
    }

    // Render car cards
    function renderCars(cars) {
        carGrid.innerHTML = '';

        if (cars.length === 0) {
            noResults.style.display = 'block';
            resultsCount.textContent = 'No models found';
            return;
        }

        noResults.style.display = 'none';
        resultsCount.textContent = `Showing ${cars.length} of ${carsCollection.length} models`;

        cars.forEach((car, index) => {
            const card = createCarCard(car);
            card.style.animationDelay = `${Math.min(index * 0.05, 0.5)}s`;
            carGrid.appendChild(card);
        });
    }

    // Create a single car card
    function createCarCard(car) {
        const card = document.createElement('div');
        card.className = 'car-card';
        card.dataset.carId = car.id;

        const badge = car.series ? car.series : car.material;

        card.innerHTML = `
            <div class="car-image">
                <span class="car-badge">${badge}</span>
                ${car.icon}
            </div>
            <div class="car-info">
                <span class="car-year">${car.year}</span>
                <h3 class="car-name">${car.name}</h3>
                <p class="car-type">${car.type} • ${car.country}</p>
                <div class="car-details">
                    <span class="car-detail car-manufacturer">${car.manufacturer}</span>
                    <span class="car-detail">${car.scale}</span>
                    <span class="car-detail">${car.madeIn}</span>
                </div>
            </div>
        `;

        card.addEventListener('click', () => openModal(car));
        return card;
    }

    // Filter and sort cars
    function filterAndSortCars() {
        const searchTerm = searchInput.value.toLowerCase();
        const manufacturerValue = manufacturerFilter.value;
        const scaleValue = scaleFilter.value;
        const typeValue = typeFilter.value;
        const eraValue = eraFilter.value;
        const sortValue = sortBy.value;

        // Filter
        filteredCars = carsCollection.filter(car => {
            // Search filter
            const searchMatch = !searchTerm ||
                car.name.toLowerCase().includes(searchTerm) ||
                car.manufacturer.toLowerCase().includes(searchTerm) ||
                car.type.toLowerCase().includes(searchTerm) ||
                car.country.toLowerCase().includes(searchTerm) ||
                car.year.toString().includes(searchTerm) ||
                (car.series && car.series.toLowerCase().includes(searchTerm)) ||
                (car.description && car.description.toLowerCase().includes(searchTerm));

            // Manufacturer filter
            const manufacturerMatch = !manufacturerValue || car.manufacturer === manufacturerValue;

            // Scale filter
            const scaleMatch = !scaleValue || car.scale === scaleValue;

            // Type filter
            const typeMatch = !typeValue || car.type === typeValue;

            // Era filter
            let eraMatch = true;
            if (eraValue) {
                const decade = eraValue.replace('s', '');
                const yearStart = parseInt(decade);
                const yearEnd = yearStart + 9;
                eraMatch = car.year >= yearStart && car.year <= yearEnd;
            }

            return searchMatch && manufacturerMatch && scaleMatch && typeMatch && eraMatch;
        });

        // Sort
        filteredCars.sort((a, b) => {
            switch (sortValue) {
                case 'year-asc':
                    return a.year - b.year;
                case 'year-desc':
                    return b.year - a.year;
                case 'name-asc':
                    return a.name.localeCompare(b.name);
                case 'name-desc':
                    return b.name.localeCompare(a.name);
                case 'manufacturer':
                    return a.manufacturer.localeCompare(b.manufacturer);
                default:
                    return 0;
            }
        });

        renderCars(filteredCars);
    }

    // Open modal with car details
    function openModal(car) {
        modalBody.innerHTML = `
            <div class="modal-image">${car.icon}</div>
            <div class="modal-info">
                <span class="car-year">${car.year}</span>
                <h2>${car.name}</h2>
                <p class="car-type">${car.type} • ${car.country}</p>
                <p style="margin-top: 1rem; color: var(--text-secondary); line-height: 1.8;">
                    ${car.description}
                </p>
                <div class="modal-details">
                    <div class="modal-detail">
                        <div class="modal-detail-label">Manufacturer</div>
                        <div class="modal-detail-value">${car.manufacturer}</div>
                    </div>
                    <div class="modal-detail">
                        <div class="modal-detail-label">Model Number</div>
                        <div class="modal-detail-value">${car.modelNumber}</div>
                    </div>
                    <div class="modal-detail">
                        <div class="modal-detail-label">Scale</div>
                        <div class="modal-detail-value">${car.scale}</div>
                    </div>
                    <div class="modal-detail">
                        <div class="modal-detail-label">Production Date</div>
                        <div class="modal-detail-value">${car.productionDate}</div>
                    </div>
                    <div class="modal-detail">
                        <div class="modal-detail-label">Made In</div>
                        <div class="modal-detail-value">${car.madeIn}</div>
                    </div>
                    <div class="modal-detail">
                        <div class="modal-detail-label">Material</div>
                        <div class="modal-detail-value">${car.material}</div>
                    </div>
                    ${car.series ? `
                    <div class="modal-detail" style="grid-column: span 2;">
                        <div class="modal-detail-label">Series</div>
                        <div class="modal-detail-value">${car.series}</div>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Update statistics
    function updateStats() {
        // Update hero stats
        const totalCarsEl = document.getElementById('totalCars');
        const totalManufacturersEl = document.getElementById('totalManufacturers');

        const manufacturers = [...new Set(carsCollection.map(car => car.manufacturer))];

        // Animate counting
        animateNumber(totalCarsEl, carsCollection.length);
        animateNumber(totalManufacturersEl, manufacturers.length);

        // Update stat cards
        updateStatBars();
    }

    function animateNumber(element, target) {
        let current = 0;
        const increment = Math.ceil(target / 30);
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = current;
        }, 50);
    }

    function updateStatBars() {
        // Manufacturer stats
        const manufacturerStats = {};
        carsCollection.forEach(car => {
            manufacturerStats[car.manufacturer] = (manufacturerStats[car.manufacturer] || 0) + 1;
        });
        renderStatBars('manufacturerStats', manufacturerStats);

        // Scale stats
        const scaleStats = {};
        carsCollection.forEach(car => {
            scaleStats[car.scale] = (scaleStats[car.scale] || 0) + 1;
        });
        renderStatBars('scaleStats', scaleStats);

        // Material stats
        const materialStats = {};
        carsCollection.forEach(car => {
            materialStats[car.material] = (materialStats[car.material] || 0) + 1;
        });
        renderStatBars('materialStats', materialStats);

        // Country stats
        const countryStats = {};
        carsCollection.forEach(car => {
            countryStats[car.madeIn] = (countryStats[car.madeIn] || 0) + 1;
        });
        renderStatBars('countryStats', countryStats);
    }

    function renderStatBars(containerId, stats) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';

        const total = carsCollection.length;
        const sortedStats = Object.entries(stats).sort((a, b) => b[1] - a[1]).slice(0, 5);

        sortedStats.forEach(([label, count]) => {
            const percentage = (count / total) * 100;
            const bar = document.createElement('div');
            bar.className = 'stat-bar';
            bar.innerHTML = `
                <div class="stat-bar-label">
                    <span>${label}</span>
                    <span>${count}</span>
                </div>
                <div class="stat-bar-track">
                    <div class="stat-bar-fill" style="width: 0%"></div>
                </div>
            `;
            container.appendChild(bar);

            // Animate bar fill
            setTimeout(() => {
                bar.querySelector('.stat-bar-fill').style.width = `${percentage}%`;
            }, 100);
        });
    }

    // Theme handling
    function initTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.setAttribute('data-theme', 'dark');
            updateThemeIcon(true);
        }
    }

    function toggleTheme() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            updateThemeIcon(false);
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            updateThemeIcon(true);
        }
    }

    function updateThemeIcon(isDark) {
        const themeIcon = themeToggle.querySelector('.theme-icon');
        themeIcon.textContent = isDark ? '☀️' : '🌙';
    }

    // Animate hero stats on scroll
    function animateHeroStats() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateStats();
                    observer.disconnect();
                }
            });
        }, { threshold: 0.5 });

        const heroStats = document.querySelector('.hero-stats');
        if (heroStats) {
            observer.observe(heroStats);
        }
    }

    // Event Listeners
    function setupEventListeners() {
        // Search with debounce
        let searchTimeout;
        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(filterAndSortCars, 300);
        });

        // Filter changes
        manufacturerFilter.addEventListener('change', filterAndSortCars);
        scaleFilter.addEventListener('change', filterAndSortCars);
        typeFilter.addEventListener('change', filterAndSortCars);
        eraFilter.addEventListener('change', filterAndSortCars);
        sortBy.addEventListener('change', filterAndSortCars);

        // Clear filters
        clearFiltersBtn.addEventListener('click', () => {
            searchInput.value = '';
            manufacturerFilter.value = '';
            scaleFilter.value = '';
            typeFilter.value = '';
            eraFilter.value = '';
            sortBy.value = 'year-asc';
            filterAndSortCars();
        });

        // Theme toggle
        themeToggle.addEventListener('click', toggleTheme);

        // Mobile menu
        mobileMenuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });

        // Modal close
        modalClose.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });

        // Smooth scroll for nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                        nav.classList.remove('active');
                    }
                }
            });
        });
    }
});
