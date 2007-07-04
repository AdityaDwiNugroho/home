'use strict';

class AbstractButtonController {
    constructor() {
        this.buttons = [];
        this.isInitialized = false;
        this.rafId = null;
        this.observers = new Map();
        
        this.backgroundMusic = null;
        this.musicToggle = null;
        this.isMusicPlaying = false;
        
        this.throttle = this.createThrottle();
        this.debounce = this.createDebounce();
        
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupInteractions());
        } else {
            this.setupInteractions();
        }
        
        this.isInitialized = true;
    }

    setupInteractions() {
        this.cacheElements();
        this.setupIntersectionObserver();
        this.setupEventListeners();
        this.setupPerformanceMonitoring();
        this.initializeAnimations();
        this.setupMusicControls();
    }

    cacheElements() {
        this.buttons = Array.from(document.querySelectorAll('.btn'));
        this.heroSection = document.querySelector('.hero-section');
        this.buttonGrid = document.querySelector('.button-grid');
        this.floatingParticles = document.querySelector('.floating-particles');
        this.backgroundMusic = document.getElementById('backgroundMusic');
        this.musicToggle = document.getElementById('musicToggle');
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '50px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.activateElement(entry.target);
                }
            });
        }, observerOptions);

        this.buttons.forEach(button => {
            observer.observe(button);
        });

        this.observers.set('intersection', observer);
    }

    activateElement(element) {
        element.classList.add('animated');
        
        if (element.classList.contains('btn-quantum')) {
            this.enhanceQuantumEffect(element);
        }
        
        if (element.classList.contains('btn-neural')) {
            this.enhanceNeuralNetwork(element);
        }
    }

    setupEventListeners() {
        this.setupMouseTracking();
        
        this.buttons.forEach((button, index) => {
            this.setupButtonInteractions(button, index);
        });

        window.addEventListener('resize', this.throttle(() => {
            this.handleResize();
        }, 250));

        document.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });

        document.addEventListener('contextmenu', (e) => {
            if (e.target.classList.contains('btn')) {
                e.preventDefault();
            }
        });
    }

    setupMouseTracking() {
        let mouseX = 0;
        let mouseY = 0;

        const updateMousePosition = this.throttle((e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            this.updateMagneticEffects(mouseX, mouseY);
        }, 16);

        document.addEventListener('mousemove', updateMousePosition, { passive: true });
    }

    updateMagneticEffects(mouseX, mouseY) {
        const magneticButtons = document.querySelectorAll('.btn-magnetic');
        
        magneticButtons.forEach(button => {
            const rect = button.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const deltaX = mouseX - centerX;
            const deltaY = mouseY - centerY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            const maxDistance = 150;
            const maxTranslate = 10;
            
            if (distance < maxDistance) {
                const factor = (maxDistance - distance) / maxDistance;
                const translateX = (deltaX / distance) * factor * maxTranslate;
                const translateY = (deltaY / distance) * factor * maxTranslate;
                
                button.style.transform = `translate(${translateX}px, ${translateY}px) scale(${1 + factor * 0.1})`;
            } else {
                button.style.transform = '';
            }
        });
    }

    setupButtonInteractions(button, index) {
        button.addEventListener('mouseenter', () => {
            this.onButtonHover(button);
        });

        button.addEventListener('mouseleave', () => {
            this.onButtonLeave(button);
        });

        button.addEventListener('click', (e) => {
            this.onButtonClick(button, e);
        });

        button.addEventListener('touchstart', () => {
            this.onButtonHover(button);
        }, { passive: true });

        button.addEventListener('touchend', () => {
            this.onButtonLeave(button);
        }, { passive: true });
    }

    onButtonHover(button) {
        this.createRippleEffect(button);
        button.style.filter = 'brightness(1.1) saturate(1.2)';
        this.playHoverSound();
    }

    onButtonLeave(button) {
        button.style.filter = '';
    }

    onButtonClick(button, event) {
        if (button.dataset.clicking === 'true') return;
        
        button.dataset.clicking = 'true';
        
        this.createClickEffect(button, event);
        
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }

        setTimeout(() => {
            button.dataset.clicking = 'false';
        }, 300);

        this.trackInteraction(button);
    }

    createRippleEffect(button) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple-effect';
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            animation: ripple-animation 0.6s ease-out;
            z-index: 10;
        `;

        button.appendChild(ripple);

        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    createClickEffect(button, event) {
        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const clickEffect = document.createElement('div');
        clickEffect.className = 'click-effect';
        clickEffect.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            width: 0;
            height: 0;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 70%);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            animation: click-explosion 0.5s ease-out;
            z-index: 10;
        `;

        button.appendChild(clickEffect);

        setTimeout(() => {
            if (clickEffect.parentNode) {
                clickEffect.parentNode.removeChild(clickEffect);
            }
        }, 500);
    }

    enhanceQuantumEffect(button) {
        const particles = button.querySelector('.quantum-particles');
        if (!particles) return;

        for (let i = 0; i < 3; i++) {
            const particle = document.createElement('div');
            particle.className = 'quantum-particle';
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: #ffffff;
                border-radius: 50%;
                opacity: 0;
                animation: quantum-float-${i + 3} ${2 + i * 0.5}s infinite ease-in-out ${i * 0.3}s;
            `;
            particles.appendChild(particle);
        }
    }

    enhanceNeuralNetwork(button) {
        const network = button.querySelector('.neural-network');
        if (!network) return;

        const connections = document.createElement('div');
        connections.className = 'neural-connections';
        connections.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: 
                linear-gradient(45deg, transparent 48%, rgba(255, 255, 255, 0.1) 50%, transparent 52%),
                linear-gradient(-45deg, transparent 48%, rgba(255, 255, 255, 0.1) 50%, transparent 52%);
            background-size: 15px 15px;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        network.appendChild(connections);

        button.addEventListener('mouseenter', () => {
            connections.style.opacity = '1';
        });

        button.addEventListener('mouseleave', () => {
            connections.style.opacity = '0';
        });
    }

    playHoverSound() {
        if (!this.audioContext && window.AudioContext) {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                return;
            }
        }

        if (this.audioContext && this.audioContext.state === 'running') {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.1);

            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + 0.1);
        }
    }

    handleKeyboardNavigation(event) {
        const focusedElement = document.activeElement;
        
        if (event.key === 'Enter' || event.key === ' ') {
            if (focusedElement.classList.contains('btn')) {
                event.preventDefault();
                focusedElement.click();
            }
        }

        if (event.key === 'Tab') {
            const buttons = Array.from(document.querySelectorAll('.btn'));
            const currentIndex = buttons.indexOf(focusedElement);
            
            if (currentIndex !== -1) {
                buttons.forEach(btn => btn.classList.remove('keyboard-focused'));
                focusedElement.classList.add('keyboard-focused');
            }
        }
    }

    handleResize() {
        this.updateMagneticEffects(0, 0);
    }

    trackInteraction(button) {
        const buttonType = button.className.split(' ').find(cls => cls.startsWith('btn-'));
        const timestamp = Date.now();
        
        const interactions = JSON.parse(sessionStorage.getItem('buttonInteractions') || '[]');
        interactions.push({
            type: buttonType,
            timestamp: timestamp
        });
        
        if (interactions.length > 10) {
            interactions.shift();
        }
        
        sessionStorage.setItem('buttonInteractions', JSON.stringify(interactions));
    }

    setupPerformanceMonitoring() {
        let lastTime = performance.now();
        let frameCount = 0;
        
        const checkPerformance = (currentTime) => {
            frameCount++;
            
            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                
                if (fps < 30) {
                    document.body.classList.add('reduced-effects');
                } else {
                    document.body.classList.remove('reduced-effects');
                }
                
                frameCount = 0;
                lastTime = currentTime;
            }
            
            this.rafId = requestAnimationFrame(checkPerformance);
        };
        
        this.rafId = requestAnimationFrame(checkPerformance);
    }

    initializeAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple-animation {
                to {
                    width: 100px;
                    height: 100px;
                    opacity: 0;
                }
            }
            
            @keyframes click-explosion {
                to {
                    width: 50px;
                    height: 50px;
                    opacity: 0;
                }
            }
            
            @keyframes quantum-float-3 {
                0%, 100% { transform: translate(0, 0) scale(0); opacity: 0; }
                50% { transform: translate(15px, -5px) scale(1); opacity: 1; }
            }
            
            @keyframes quantum-float-4 {
                0%, 100% { transform: translate(0, 0) scale(0); opacity: 0; }
                50% { transform: translate(-5px, 15px) scale(1); opacity: 1; }
            }
            
            @keyframes quantum-float-5 {
                0%, 100% { transform: translate(0, 0) scale(0); opacity: 0; }
                50% { transform: translate(-15px, -15px) scale(1); opacity: 1; }
            }
            
            .keyboard-focused {
                outline: 2px solid #6366f1;
                outline-offset: 4px;
            }
            
            .reduced-effects * {
                animation-duration: 0.1s !important;
                transition-duration: 0.1s !important;
            }
        `;
        document.head.appendChild(style);
    }

    createThrottle() {
        return (func, wait) => {
            let timeout;
            let previous = 0;
            
            return function executedFunction(...args) {
                const now = Date.now();
                const remaining = wait - (now - previous);
                
                if (remaining <= 0 || remaining > wait) {
                    if (timeout) {
                        clearTimeout(timeout);
                        timeout = null;
                    }
                    previous = now;
                    func.apply(this, args);
                } else if (!timeout) {
                    timeout = setTimeout(() => {
                        previous = Date.now();
                        timeout = null;
                        func.apply(this, args);
                    }, remaining);
                }
            };
        };
    }

    createDebounce() {
        return (func, wait, immediate) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    timeout = null;
                    if (!immediate) func.apply(this, args);
                };
                const callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(this, args);
            };
        };
    }

    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }
        if (this.audioContext) {
            this.audioContext.close();
        }
    }

    setupMusicControls() {
        if (!this.backgroundMusic || !this.musicToggle) return;
        
        this.musicToggle.addEventListener('click', (e) => {
            this.toggleMusic();
        });
        
        this.isMusicPlaying = true;
        this.musicToggle.classList.add('playing');
        this.updateMusicIcon(true);
        this.musicToggle.querySelector('.music-text').textContent = 'Disable Music';
        
        this.backgroundMusic.addEventListener('load', () => {
        });
        
        this.backgroundMusic.addEventListener('error', () => {
            this.musicToggle.style.display = 'none';
        });
    }
    
    updateMusicIcon(isPlaying) {
        const iconElement = this.musicToggle.querySelector('.music-icon');
        if (!iconElement) return;
        
        if (isPlaying) {
            iconElement.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 3L12 21M8 7L8 17M16 7L16 17M4 10L4 14M20 10L20 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="2" opacity="0.5"/>
                    <line x1="1" y1="12" x2="23" y2="12" stroke="currentColor" stroke-width="2" opacity="0.3"/>
                </svg>
            `;
        } else {
            iconElement.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                    <path d="M23 9L17 15M17 9L23 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            `;
        }
    }
    
    toggleMusic() {
        if (!this.backgroundMusic) return;
        
        if (this.isMusicPlaying) {
            this.pauseMusic();
        } else {
            this.startMusic();
        }
    }
    
    startMusic() {
        if (!this.backgroundMusic) return;
        
        this.backgroundMusic.style.display = 'block';
        this.backgroundMusic.style.position = 'absolute';
        this.backgroundMusic.style.top = '-9999px';
        this.backgroundMusic.style.left = '-9999px';
        this.backgroundMusic.style.width = '1px';
        this.backgroundMusic.style.height = '1px';
        this.backgroundMusic.src = 'https://www.youtube-nocookie.com/embed/jfKfPfyJRdk?autoplay=1&loop=1&playlist=jfKfPfyJRdk&controls=0&mute=0&rel=0&modestbranding=1&cc_load_policy=0&start=1&enablejsapi=0';
        
        this.isMusicPlaying = true;
        this.musicToggle.classList.add('playing');
        this.updateMusicIcon(true);
        this.musicToggle.querySelector('.music-text').textContent = 'Disable Music';
        this.musicToggle.setAttribute('aria-label', 'Disable music');
    }
    
    pauseMusic() {
        if (!this.backgroundMusic) return;
        
        this.backgroundMusic.style.display = 'none';
        this.backgroundMusic.src = '';
        
        this.isMusicPlaying = false;
        this.musicToggle.classList.remove('playing');
        this.updateMusicIcon(false);
        this.musicToggle.querySelector('.music-text').textContent = 'Enable Music';
        this.musicToggle.setAttribute('aria-label', 'Enable music');
    }
}

const app = new AbstractButtonController();

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        document.body.classList.add('page-hidden');
    } else {
        document.body.classList.remove('page-hidden');
    }
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AbstractButtonController;
}
