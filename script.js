// Live Clock Functionality
function updateClock() {
    const clockElement = document.getElementById('live-time');
    if (!clockElement) return;

    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; 
    const strMinutes = minutes < 10 ? '0' + minutes : minutes;
    
    const timeString = `${hours}:${strMinutes} ${ampm}`;
    clockElement.textContent = timeString;
}

setInterval(updateClock, 60000);
updateClock();

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').slice(1);
        if (!targetId) return;
        
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Scroll Reveal
const observerOptions = { threshold: 0.1 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('section, .info-grid, .bio, .actions, .project-card, .contact-card, .blog-card, .tech-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
    observer.observe(el);
});

// Blog Configuration
const MEDIUM_USERNAME = ''; // ADD YOUR USERNAME HERE to see live posts

function initBlogs() {
    const container = document.getElementById('blog-container');
    if (!container) return;

    if (MEDIUM_USERNAME) {
        fetchMediumPosts(MEDIUM_USERNAME);
    } else {
        renderComingSoon();
    }
}

function renderComingSoon() {
    const container = document.getElementById('blog-container');
    container.innerHTML = `
        <div class="blog-card" style="cursor: default;">
            <div class="blog-img-container">
                <img src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800" class="blog-img" alt="Coming Soon">
                <span class="blog-badge">Stay Tuned</span>
            </div>
            <div class="blog-content">
                <h3>Writing my first stories...</h3>
                <p style="color: var(--text-secondary); font-size: 14px; margin-top: 8px;">
                    Exciting content about UI/UX, CSS, and AI is on the way.
                </p>
                <div class="blog-date" style="margin-top: 16px;">
                    <i data-lucide="clock" style="width:14px;height:14px"></i>
                    Coming Soon
                </div>
            </div>
        </div>
    `;
    if (window.lucide) window.lucide.createIcons();
}

async function fetchMediumPosts(username) {
    const container = document.getElementById('blog-container');
    const rssUrl = `https://medium.com/feed/@${username}`;
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.status === 'ok' && data.items.length > 0) {
            container.innerHTML = '';
            data.items.slice(0, 3).forEach(post => {
                const date = new Date(post.pubDate).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric'
                });
                
                let thumbnail = post.thumbnail;
                if (!thumbnail || thumbnail.includes('stat?')) {
                    const imgMatch = post.description.match(/<img[^>]+src="([^">]+)"/);
                    thumbnail = imgMatch ? imgMatch[1] : 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800';
                }

                const card = createBlogCard(post.title, date, thumbnail, 'Medium', post.link);
                container.appendChild(card);
            });
            if (window.lucide) window.lucide.createIcons();
        } else {
            renderComingSoon();
        }
    } catch (error) {
        console.error('Error fetching Medium posts:', error);
        renderComingSoon();
    }
}

function createBlogCard(title, date, image, tag, link) {
    const card = document.createElement('a');
    card.href = link;
    card.target = '_blank';
    card.className = 'blog-card';
    card.innerHTML = `
        <div class="blog-img-container">
            <img src="${image}" class="blog-img" alt="${title}">
            <span class="blog-badge">${tag}</span>
        </div>
        <div class="blog-content">
            <h3>${title}</h3>
            <div class="blog-date">
                <i data-lucide="calendar" style="width:14px;height:14px"></i>
                ${date}
            </div>
        </div>
    `;
    return card;
}

initBlogs();


// Theme Toggle with Persistence
const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;

// Click Sound Effect
const clickSound = new Audio('click.mp3');

// Check for saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    body.classList.add('light-theme');
    updateThemeIcon('moon');
}

themeToggle.addEventListener('click', () => {
    clickSound.currentTime = 0;
    clickSound.play();
    
    body.classList.toggle('light-theme');
    const isLight = body.classList.contains('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    updateThemeIcon(isLight ? 'moon' : 'sun');
});

function updateThemeIcon(iconName) {
    let icon = themeToggle.querySelector('i') || themeToggle.querySelector('svg');
    
    if (icon) {
        // Add rotation animation
        icon.style.transform = 'rotate(180deg) scale(0)';
        
        setTimeout(() => {
            if (icon.tagName.toLowerCase() === 'svg') {
                const newIcon = document.createElement('i');
                newIcon.setAttribute('data-lucide', iconName);
                icon.parentNode.replaceChild(newIcon, icon);
            } else {
                icon.setAttribute('data-lucide', iconName);
            }
            lucide.createIcons();
            
            // Reset transformation for the new icon
            const updatedIcon = themeToggle.querySelector('i') || themeToggle.querySelector('svg');
            updatedIcon.style.transform = 'rotate(0deg) scale(1)';
        }, 200);
    }
}
// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.classList.add('nav-scrolled');
    } else {
        nav.classList.remove('nav-scrolled');
    }
});

// Spotlight Effect for Cards
document.querySelectorAll('.spotlight-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});
