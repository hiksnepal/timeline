document.addEventListener('DOMContentLoaded', () => {
    // --- Element Selection ---
    const container = document.querySelector('.timeline-container');
    const cards = document.querySelectorAll('.timeline-card');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const root = document.documentElement;

    let currentActiveIndex = 0;
    const cardWidth = cards[0].offsetWidth;
    const gap = parseInt(window.getComputedStyle(container.querySelector('.timeline-wrapper')).gap);
    let ticking = false; // For debouncing scroll events with requestAnimationFrame

    // --- Core Logic ---
    const updateTimeline = () => {
        // 1. Update the spotlight position based on scroll
        const scrollProgress = container.scrollLeft;
        const totalWidth = container.scrollWidth - container.clientWidth;
        const progressPercent = scrollProgress / totalWidth;
        // Map the scroll percentage to the viewport width for the spotlight
        const spotlightX = progressPercent * window.innerWidth;
        root.style.setProperty('--spotlight-x', `${spotlightX}px`);

        // 2. Determine which card is in the center
        const closestIndex = Math.round(scrollProgress / (cardWidth + gap));
        
        // 3. Update the 'active' class efficiently
        if (currentActiveIndex !== closestIndex && closestIndex < cards.length) {
            cards[currentActiveIndex]?.classList.remove('active');
            cards[closestIndex]?.classList.add('active');
            currentActiveIndex = closestIndex;
        }
        
        // 4. Update button states
        prevBtn.disabled = container.scrollLeft < 10;
        nextBtn.disabled = container.scrollLeft >= totalWidth - 10;
        
        ticking = false;
    };

    // --- High-Performance Scroll Listener ---
    container.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateTimeline);
            ticking = true;
        }
    });

    // --- Navigation Button Logic ---
    const navigate = (direction) => {
        const newIndex = currentActiveIndex + direction;
        if (newIndex >= 0 && newIndex < cards.length) {
            const targetScroll = newIndex * (cardWidth + gap);
            container.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });
        }
    };

    prevBtn.addEventListener('click', () => navigate(-1));
    nextBtn.addEventListener('click', () => navigate(1));

    // --- Initial Setup ---
    setTimeout(() => {
        cards[0].classList.add('active');
        updateTimeline(); // Run once to set initial state
    }, 100);
});