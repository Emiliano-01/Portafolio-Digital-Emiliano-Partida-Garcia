document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       MOBILE MENU TOGGLE
       ========================================================================== */
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('open');
            const isOpen = navMenu.classList.contains('open');
            navToggle.innerHTML = isOpen ? '<i class="bi bi-x-lg"></i>' : '<i class="bi bi-list"></i>';
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                navToggle.innerHTML = '<i class="bi bi-list"></i>';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navMenu.classList.remove('open');
                navToggle.innerHTML = '<i class="bi bi-list"></i>';
            }
        });
    }

    /* ==========================================================================
       THEME SWITCHER (DARK / LIGHT MODE)
       ========================================================================== */
    const themeToggle = document.getElementById('theme-toggle');
    
    // Check for saved theme preference or use dark theme as default
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    if (savedTheme === 'light') {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
    } else {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            if (document.body.classList.contains('dark-theme')) {
                document.body.classList.remove('dark-theme');
                document.body.classList.add('light-theme');
                localStorage.setItem('theme', 'light');
            } else {
                document.body.classList.remove('light-theme');
                document.body.classList.add('dark-theme');
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    /* ==========================================================================
       STICKY NAVBAR & ACTIVE NAVIGATION LINK HIGHLIGHT
       ========================================================================== */
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');

    const handleScroll = () => {
        // Sticky class on navbar
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link highlighting
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120; // adjust offset for header height
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run once on init

    /* ==========================================================================
       CV TABS SYSTEM & PROGRESS BAR ANIMATION
       ========================================================================== */
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    const progressBars = document.querySelectorAll('.skill-progress');

    // Function to animate skill progress bars
    const animateSkills = () => {
        progressBars.forEach(bar => {
            const targetWidth = bar.parentElement.previousElementSibling.lastElementChild.textContent;
            // Map text level to percentage if width is not written in html
            let percentage = bar.style.width;
            if (!percentage) {
                if (targetWidth === 'Excelente') percentage = '90%';
                else if (targetWidth === 'Fuerte') percentage = '80%';
                else if (targetWidth === 'Intermedio' || targetWidth === 'Medio') percentage = '70%';
                else percentage = '60%';
            }
            // For transition effect, we reset and set width after timeout
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = percentage;
            }, 50);
        });
    };

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            // Deactivate all buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            // Activate clicked button
            btn.classList.add('active');

            // Hide all panels
            tabPanels.forEach(panel => {
                panel.classList.remove('active');
            });

            // Show selected panel with delay to trigger transition smoothly
            const activePanel = document.getElementById(`tab-${targetTab}`);
            if (activePanel) {
                activePanel.classList.add('active');
                
                // If it is skills tab, animate progress bars
                if (targetTab === 'habilidades') {
                    animateSkills();
                }
            }
        });
    });

    /* ==========================================================================
       PROJECTS FILTER SYSTEM
       ========================================================================== */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterValue = btn.getAttribute('data-filter');

            // Active button styling
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    // Trigger fade in animation
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px) scale(0.95)';
                    // Hide display after opacity transitions ends
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 400); // matches CSS transition time
                }
            });
        });
    });

    /* ==========================================================================
       SCROLL REVEAL (INTERSECTION OBSERVER)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active-reveal');
                // Optional: Unobserve after animating once
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15, // trigger when 15% of element is visible
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    /* ==========================================================================
       CONTACT FORM VALIDATION & SIMULATED SUBMISSION
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const formSubmitBtn = document.getElementById('form-submit-btn');
    const formMessage = document.getElementById('form-message');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Disable submit button and show loading state
            formSubmitBtn.disabled = true;
            const originalBtnContent = formSubmitBtn.innerHTML;
            formSubmitBtn.innerHTML = '<span>Enviando...</span><i class="bi bi-hourglass-split ms-2"></i>';
            formMessage.style.display = 'none';

            // Extract values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            // Simple validation
            if (!name || !email || !message) {
                showFormMessage('Por favor, completa todos los campos del formulario.', 'error');
                resetBtn();
                return;
            }

            // Simulate server network latency (1.5 seconds)
            setTimeout(() => {
                // Show success feedback
                showFormMessage(`¡Gracias ${name}! Tu mensaje ha sido enviado correctamente. Me pondré en contacto contigo pronto.`, 'success');
                
                // Reset form
                contactForm.reset();
                resetBtn();
            }, 1500);

            function showFormMessage(msg, type) {
                formMessage.textContent = msg;
                formMessage.className = `form-message ${type}`;
                formMessage.style.display = 'block';
            }

            function resetBtn() {
                formSubmitBtn.disabled = false;
                formSubmitBtn.innerHTML = originalBtnContent;
            }
        });
    }
});
