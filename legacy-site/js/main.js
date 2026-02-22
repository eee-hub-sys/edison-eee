import { getClubs, getEvents, getGallery, submitRegistration, seedInitialData } from "./db-service.js";

// Initial data for seeding (will only seed if DB is empty)
// Initial data for seeding (will only seed if DB is empty)
const initialClubs = [
    { id: "green-energy", name: "Green Energy", description: "Social Awareness on Energy Conservation & Green Energy.", faculty: "Dr. G. Srinivas", student: "23891A0221, 23891A0219, 23891A0208", icon: "🌱", color: "#30D158" },
    { id: "echo", name: "Echo", description: "The Communication Skills Club dedicated to enhancing professional expression.", faculty: "Mrs. G. Sravanthi", student: "23891A0226, 23891A0204", icon: "📣", color: "#818cf8" },
    { id: "vidyut", name: "Vidyut", description: "The EEE Hobby Club for creative exploration and hands-on projects.", faculty: "Mr. Ganji Srikanth", student: "24895A0208, 24895A0219", icon: "🎨", color: "#facc15" },
    { id: "krida", name: "Krida", description: "The official Sport Club of the EEE Department.", faculty: "Mr. M. Ramesh Kumar", student: "24895A0221", icon: "🏅", color: "#ff375f" },
    { id: "tech-forge", name: "Tech Forge Club", description: "The Career Club focused on professional growth and industry readiness.", faculty: "Mr. K. Vishnu", student: "23891A0242, 23891A0218", icon: "🏗️", color: "#38bdf8" }
];

const initialEvents = [
    { club: "Green Energy", title: "Energy Conservation Seminar", description: "Learn about sustainable power and conservation strategies.", date: "2024-03-10", image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=800", tags: ["Green", "Awareness"] },
    { club: "Echo", title: "Speech & Debate Meet", description: "Enhance your public speaking skills with current industry topics.", date: "2024-03-15", image: "https://images.unsplash.com/photo-1544531585-9847b68c8c86?auto=format&fit=crop&q=80&w=800", tags: ["Soft Skills", "Debate"] },
    { club: "Vidyut", title: "Creative Tech Workshop", description: "Hands-on session on creative electronics and hobby projects.", date: "2024-03-20", image: "https://images.unsplash.com/photo-1581092334651-ddf26d9a1930?auto=format&fit=crop&q=80&w=800", tags: ["Hobby", "Tech"] },
    { club: "Krida", title: "EEE Annual Sports Meet", description: "Departmental sports competitions and athletic events.", date: "2024-04-01", image: "https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&q=80&w=800", tags: ["Sports", "Tournament"] },
    { club: "Tech Forge Club", title: "Career Growth Bootcamp", description: "Intensive training for placements and professional excellence.", date: "2024-03-25", image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800", tags: ["Career", "Bootcamp"] }
];

const initialGallery = [
    { club: "Green Energy", title: "Solar Power Campaign", image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=800" },
    { club: "Echo", title: "Communication Workshop", image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800" },
    { club: "Vidyut", title: "Hobby Project Showcase", image: "https://images.unsplash.com/photo-1581092334651-ddf26d9a1930?auto=format&fit=crop&q=80&w=800" },
    { club: "Krida", title: "Football Tournament", image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800" },
    { club: "Tech Forge Club", title: "Industry Interaction Session", image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800" }
];


document.addEventListener('DOMContentLoaded', async () => {
    // Initialize AOS
    AOS.init({ duration: 800, easing: 'ease-in-out', once: true });

    // Seed data if necessary
    await seedInitialData(initialClubs, initialEvents, initialGallery);

    // Cache some data
    let allEvents = [];
    let allGallery = [];

    // Mobile Navigation
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const navItems = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const spans = hamburger.querySelectorAll('span');
        if (navLinks.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
        } else {
            spans[0].style.transform = 'none'; spans[1].style.opacity = '1'; spans[2].style.transform = 'none';
        }
    });

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'none'; spans[1].style.opacity = '1'; spans[2].style.transform = 'none';
        });
    });

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    });

    // Typewriter Effect
    const typewriterElement = document.getElementById('typewriter');
    const phrases = ["Innovating the Future of Energy.", "Designing Intelligent Systems.", "Mastering the Speed of Light.", "Powering the Digital World."];
    let phraseIndex = 0, charIndex = 0, isDeleting = false, typeSpeed = 100;

    function type() {
        const currentPhrase = phrases[phraseIndex];
        if (isDeleting) {
            typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--; typeSpeed = 50;
        } else {
            typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++; typeSpeed = 100;
        }
        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true; typeSpeed = 2000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; typeSpeed = 500;
        }
        setTimeout(type, typeSpeed);
    }
    type();

    // Counter Animation
    const stats = document.querySelectorAll('.stat-num');
    const countTo = () => {
        stats.forEach(stat => {
            const target = +stat.getAttribute('data-count');
            const count = +stat.innerText;
            const speed = target / 100;
            if (count < target) {
                stat.innerText = Math.ceil(count + speed);
                setTimeout(countTo, 30);
            } else stat.innerText = target + "+";
        });
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) { countTo(); observer.unobserve(entry.target); } });
    }, { threshold: 0.5 });
    observer.observe(document.querySelector('.hero-stats'));

    // Render Sub-Clubs (Dynamic)
    const clubsGrid = document.getElementById('clubs-grid');
    const clubs = await getClubs();
    if (clubsGrid && clubs.length > 0) {
        clubsGrid.innerHTML = '';
        clubs.forEach((club, index) => {
            const clubCard = document.createElement('div');
            clubCard.className = 'club-card';
            clubCard.setAttribute('data-aos', 'fade-up');
            clubCard.setAttribute('data-aos-delay', (index * 150).toString());
            clubCard.innerHTML = `
        <span class="club-icon">${club.icon}</span>
        <h3>${club.name}</h3>
        <p>${club.description}</p>
        <div class="club-meta">
          <div class="meta-item"><strong>Faculty:</strong> ${club.faculty}</div>
          <div class="meta-item"><strong>Student lead:</strong> ${club.student}</div>
        </div>
      `;
            clubsGrid.appendChild(clubCard);
        });
    }

    // Render Events (Dynamic)
    const eventsGrid = document.getElementById('events-grid');
    const eventFilters = document.querySelectorAll('.events-filter .filter-btn');
    allEvents = await getEvents();

    // --- Dynamic Google Sheets Events Sync ---
    // Using the gviz endpoint which is often more reliable for browser-side fetching
    const SHEET_ID = "138vE4aVOrBAbfRtYPHBmPcpk3OkuxZIGzBmXRT2P-vo";
    const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`;

    async function fetchEventsFromSheet() {
        console.log("EDISON: Syncing with Google Sheets...");
        try {
            const response = await fetch(SHEET_CSV_URL);
            if (!response.ok) throw new Error("Connection failed");

            const csvText = await response.text();

            // Robust CSV Splitting (Handles commas inside quotes)
            const rows = csvText.split(/\r?\n/).map(row => {
                const matched = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
                return matched ? matched.map(m => m.replace(/^"|"$/g, '').trim()) : [];
            }).filter(row => row.length > 0);

            console.log("EDISON: Raw Data from Sheet:", rows);

            if (rows.length > 1) {
                return rows.slice(1).map(row => ({
                    club: row[0] || "General",
                    title: row[1] || "EDISON Update",
                    description: row[2] || "Details pending...",
                    date: row[3] || "Coming Soon",
                    image: row[4] || "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800",
                    tags: row[5] ? row[5].split('|') : ["Live"],
                    isLive: true
                }));
            }
        } catch (error) {
            console.error("EDISON Connection Error: Your browser blocked the Google Sheet. ACTION REQUIRED: In Google Sheets, go to File > Share > Publish to Web, then click 'Publish'.", error);
        }
        return null;
    }

    async function renderEvents() {
        if (!eventsGrid) return;
        eventsGrid.innerHTML = '<div class="loader-container"><div class="spinner"></div></div>';

        const stripTrack = document.getElementById('strip-track');
        let events = await fetchEventsFromSheet();

        // Populate Ticker if Sheet data exists
        if (stripTrack && events && events.length > 0) {
            stripTrack.innerHTML = '';
            // Create strip items from sheet data
            const tickerHtml = events.map(e => `<span class="strip-item">🔔 ${e.title} – ${e.date}</span>`).join('');
            // Duplicate items for seamless scroll
            stripTrack.innerHTML = tickerHtml + tickerHtml + tickerHtml;
            console.log("EDISON: Ticker synced with Sheet.");
        }

        // If sheet is empty or fails, use Firestore as backup for main grid
        if (!events || events.length === 0) {
            console.log("EDISON: Using Firebase Data Fallback for grid.");
            events = await getEvents();
        }

        eventsGrid.innerHTML = '';
        if (!events || events.length === 0) {
            eventsGrid.innerHTML = '<p style="text-align: center; color: var(--text-muted);">No events scheduled at the moment.</p>';
            return;
        }

        events.forEach((event, index) => {
            const eventCard = document.createElement('div');
            eventCard.className = 'event-card';
            eventCard.setAttribute('data-aos', 'zoom-in-up');
            eventCard.setAttribute('data-aos-delay', (index * 50).toString());
            eventCard.innerHTML = `
        <div class="event-img">
          <img src="${event.image}" alt="${event.title}">
          <span class="event-badge" style="background: ${event.isLive ? 'var(--primary)' : 'var(--secondary)'}">
            ${event.club} ${event.isLive ? '●' : ''}
          </span>
          <span class="event-date">${event.date}</span>
        </div>
        <div class="event-details">
          <h3>${event.title}</h3>
          <p>${event.description}</p>
          <div class="event-tags">
            ${(event.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
        </div>
      `;
            eventsGrid.appendChild(eventCard);
        });
    }
    renderEvents();

    // Render Gallery (Dynamic)
    const galleryGrid = document.getElementById('gallery-grid');
    const galleryFilters = document.querySelectorAll('.gallery-filter .filter-btn');
    allGallery = await getGallery();

    function renderGallery(filter = 'all') {
        if (!galleryGrid) return;
        galleryGrid.innerHTML = '';
        const filteredGallery = filter === 'all' ? allGallery : allGallery.filter(g => g.club === filter);
        filteredGallery.forEach((item, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.setAttribute('data-aos', 'fade-up');
            galleryItem.innerHTML = `<img src="${item.image}" alt="${item.title}"><div class="gallery-overlay"><h4>${item.title}</h4><span>${item.club}</span></div>`;
            galleryItem.addEventListener('click', () => openLightbox(item));
            galleryGrid.appendChild(galleryItem);
        });
    }
    renderGallery();
    galleryFilters.forEach(btn => {
        btn.addEventListener('click', () => {
            galleryFilters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderGallery(btn.getAttribute('data-gfilter'));
        });
    });

    // Lightbox
    const lightbox = document.getElementById('lightbox');
    const lightboxImgWrap = document.getElementById('lightbox-img-wrap');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    function openLightbox(item) {
        lightboxImgWrap.innerHTML = `<img src="${item.image}" alt="${item.title}">`;
        lightboxCaption.textContent = item.title + " - " + item.club;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    lightboxClose.addEventListener('click', () => { lightbox.classList.remove('active'); document.body.style.overflow = 'auto'; });
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) { lightbox.classList.remove('active'); document.body.style.overflow = 'auto'; } });

    // Registration Form (Dynamic)
    const registerForm = document.getElementById('register-form');
    const successMessage = document.getElementById('success-message');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            let isValid = true;
            const formData = new FormData(registerForm);
            const data = Object.fromEntries(formData.entries());
            document.querySelectorAll('.error-msg').forEach(err => err.textContent = '');
            if (!data.name) { document.getElementById('err-name').textContent = 'Name is required'; isValid = false; }
            if (!data.roll_number) { document.getElementById('err-roll').textContent = 'Roll number is required'; isValid = false; }
            if (!data.club) { document.getElementById('err-club').textContent = 'Please select a club'; isValid = false; }
            if (!data.mobile || !/^\d{10}$/.test(data.mobile)) { document.getElementById('err-mobile').textContent = 'Valid 10-digit mobile number required'; isValid = false; }
            if (!data.year) { document.getElementById('err-year').textContent = 'Please select your year'; isValid = false; }

            if (isValid) {
                const submitBtn = document.getElementById('submit-btn');
                const btnText = document.getElementById('btn-text');
                const btnLoader = document.getElementById('btn-loader');
                btnText.textContent = 'Submitting...'; btnLoader.classList.remove('hidden'); submitBtn.disabled = true;

                const result = await submitRegistration(data);
                if (result.success) {
                    registerForm.classList.add('hidden');
                    successMessage.classList.remove('hidden');
                } else {
                    btnText.textContent = 'Retry Registration'; btnLoader.classList.add('hidden'); submitBtn.disabled = false;
                    alert('Submission failed. Please try again.');
                }
            }
        });
    }
});
