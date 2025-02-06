// script.js
document.addEventListener('DOMContentLoaded', () => {
    const beats = [
        {
            id: 1,
            title: "Midnight Dreams",
            genre: "Trap",
            bpm: 140,
            key: "Am",
            price: {
                basic: 29.99,
                premium: 79.99,
                exclusive: 299.99
            },
            tags: ["Dark", "Melodic", "Atmospheric"],
            plays: 1240,
            likes: 89
        },
        {
            id: 2,
            title: "Summer Waves",
            genre: "R&B",
            bpm: 95,
            key: "Gm",
            price: {
                basic: 34.99,
                premium: 89.99,
                exclusive: 349.99
            },
            tags: ["Smooth", "Chill", "Romantic"],
            plays: 2150,
            likes: 167
        },
        {
            id: 3,
            title: "Street Light",
            genre: "Hip Hop",
            bpm: 90,
            key: "Cm",
            price: {
                basic: 39.99,
                premium: 99.99,
                exclusive: 399.99
            },
            tags: ["Hard", "Bass Heavy", "Dark"],
            plays: 1890,
            likes: 145
        }
    ];

    let currentlyPlaying = null;
    const beatGrid = document.getElementById('beatGrid');
    let audio = null;

    function createWaveform() {
        const bars = Array.from({ length: 50 }, (_, i) => {
            const height = Math.random() * 100;
            return `<div class="waveform-bar" style="height: ${height}%"></div>`;
        }).join('');
        return `<div class="waveform">${bars}</div>`;
    }

    function formatPrice(price) {
        return price.toFixed(2);
    }

    function renderBeat(beat) {
        return `
            <div class="beat-card" data-beat-id="${beat.id}">
                <div class="beat-header">
                    <div class="beat-title-row">
                        <div class="beat-info">
                            <h3 class="beat-title">${beat.title}</h3>
                            <div class="beat-metadata">
                                <span>${beat.genre}</span>
                                <span>•</span>
                                <span>${beat.bpm} BPM</span>
                                <span>•</span>
                                <span>${beat.key}</span>
                            </div>
                        </div>
                        <button class="play-btn" data-beat-id="${beat.id}">
                            <i class="lucide-${currentlyPlaying === beat.id ? 'pause' : 'play'}"></i>
                        </button>
                    </div>
                    ${createWaveform()}
                </div>
                <div class="beat-content">
                    <div class="tags">
                        ${beat.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <div class="beat-stats">
                        <div class="stat-group">
                            <div class="stat">
                                <i class="lucide-volume-2"></i>
                                <span>${beat.plays.toLocaleString()}</span>
                            </div>
                            <div class="stat">
                                <i class="lucide-heart"></i>
                                <span>${beat.likes.toLocaleString()}</span>
                            </div>
                        </div>
                        <i class="lucide-share-2 cursor-pointer"></i>
                    </div>
                    <div class="pricing-grid">
                        <div class="price-option" onclick="handlePurchase(${beat.id}, 'basic')">
                            <div class="price-label">Basic</div>
                            <div class="price-amount">$${formatPrice(beat.price.basic)}</div>
                        </div>
                        <div class="price-option premium" onclick="handlePurchase(${beat.id}, 'premium')">
                            <div class="price-label">Premium</div>
                            <div class="price-amount">$${formatPrice(beat.price.premium)}</div>
                        </div>
                        <div class="price-option" onclick="handlePurchase(${beat.id}, 'exclusive')">
                            <div class="price-label">Exclusive</div>
                            <div class="price-amount">$${formatPrice(beat.price.exclusive)}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function handlePlayClick(beatId) {
        if (currentlyPlaying === beatId) {
            if (audio) {
                audio.pause();
                audio = null;
            }
            currentlyPlaying = null;
        } else {
            if (audio) {
                audio.pause();
            }
            // In a real implementation, you would load the actual audio file
            audio = new Audio(`beats/${beatId}.mp3`);
            audio.play();
            currentlyPlaying = beatId;
        }
        renderBeats();
    }

    function handlePurchase(beatId, licenseType) {
        const beat = beats.find(b => b.id === beatId);
        const price = beat.price[licenseType];
        // Implementation for purchase flow would go here
        console.log(`Purchasing ${beat.title} with ${licenseType} license for $${price}`);
    }

    function renderBeats() {
        beatGrid.innerHTML = beats.map(beat => renderBeat(beat)).join('');
        initEventListeners();
    }

    function initEventListeners() {
        document.querySelectorAll('.play-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const beatId = parseInt(btn.dataset.beatId);
                handlePlayClick(beatId);
            });

            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const beatId = parseInt(btn.dataset.beatId);
                handlePlayClick(beatId);
            });
        });

        // Handle touch events for mobile devices
        document.querySelectorAll('.beat-card').forEach(card => {
            card.addEventListener('touchstart', handleTouchStart);
            card.addEventListener('touchmove', handleTouchMove);
        });

        // Search functionality
        const searchInput = document.querySelector('.search-box input');
        if (searchInput) {
            searchInput.addEventListener('input', handleSearch);
        }
    }

    // Touch event handling
    let touchStartY = 0;
    
    function handleTouchStart(e) {
        touchStartY = e.touches[0].clientY;
    }

    function handleTouchMove(e) {
        const touchEndY = e.touches[0].clientY;
        const deltaY = touchEndY - touchStartY;
        
        // Prevent default only if scrolling horizontally
        if (Math.abs(deltaY) < 10) {
            e.preventDefault();
        }
    }

    // Search functionality
    function handleSearch(e) {
        const searchTerm = e.target.value.toLowerCase();
        const filteredBeats = beats.filter(beat => {
            return (
                beat.title.toLowerCase().includes(searchTerm) ||
                beat.genre.toLowerCase().includes(searchTerm) ||
                beat.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
        });
        
        beatGrid.innerHTML = filteredBeats.map(beat => renderBeat(beat)).join('');
        initEventListeners();
    }

    // Volume control
    let volume = 0.8;
    function setVolume(level) {
        volume = level;
        if (audio) {
            audio.volume = volume;
        }
    }

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            renderBeats();
        }, 250);
    });

    // Initialize everything
    renderBeats();

    // Share functionality
    window.handleShare = async function(beatId) {
        const beat = beats.find(b => b.id === beatId);
        if (navigator.share) {
            try {
                await navigator.share({
                    title: beat.title,
                    text: `Check out this ${beat.genre} beat: ${beat.title}`,
                    url: window.location.href
                });
            } catch (err) {
                console.log('Share failed:', err);
            }
        } else {
            // Fallback copy to clipboard
            const dummy = document.createElement('textarea');
            document.body.appendChild(dummy);
            dummy.value = window.location.href;
            dummy.select();
            document.execCommand('copy');
            document.body.removeChild(dummy);
            alert('Link copied to clipboard!');
        }
    };

    // Add keyboard controls
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && currentlyPlaying) {
            e.preventDefault();
            handlePlayClick(currentlyPlaying);
        }
    });

    // Handle visibility change to pause audio
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && audio) {
            audio.pause();
            currentlyPlaying = null;
            renderBeats();
        }
    });
});

// Add to window for onclick handlers
window.handlePurchase = function(beatId, licenseType) {
    // Implementation would go here
    console.log(`Purchase: Beat ${beatId}, License: ${licenseType}`);
};