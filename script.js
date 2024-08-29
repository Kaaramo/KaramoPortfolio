// Fonction pour basculer entre le mode clair et sombre
function toggleMode() {
    const body = document.body;
    const modeIcon = document.getElementById('mode-icon');
    body.classList.toggle('light-mode');
    body.classList.toggle('dark-mode');
    if (body.classList.contains('light-mode')) {
        modeIcon.setAttribute('data-feather', 'moon');
    } else {
        modeIcon.setAttribute('data-feather', 'sun');
    }
    feather.replace();
    updateCVTheme();
    
    // Sauvegarde du mode dans le localStorage
    localStorage.setItem('theme', body.classList.contains('light-mode') ? 'light' : 'dark');
}

// Fonction pour mettre à jour le thème du CV
function updateCVTheme() {
    const isLightMode = document.body.classList.contains('light-mode');
    const resumeContainer = document.querySelector('.resume-container');
    if (resumeContainer) {
        if (isLightMode) {
            resumeContainer.classList.add('light-mode');
        } else {
            resumeContainer.classList.remove('light-mode');
        }
    }
}

// Fonction pour initialiser le contenu du CV
function initializeCV() {
    const skills = [
        { name: "Intelligence Artificielle", level: 95 },
        { name: "Prompt Engineering", level: 95 },
        { name: "Maitrise parfaite des LLM", level: 90 },
        { name: "Développement d'Agent IA", level: 85 },
        { name: "Programmation:Python, Technologie Full stack", level: 80 },
        { name: "Automatisation des Processus Métiers", level: 99 },
        { name: "Consulting en Stratégie IA", level: 80 },
        { name: "Développement de chatbot IA", level: 90 }
    ];

    const skillsContainer = document.getElementById('skills-container');
    if (skillsContainer) {
        skills.forEach(skill => {
            const skillItem = document.createElement('div');
            skillItem.className = 'skill-item';
            skillItem.innerHTML = `
                <div class="skill-name">${skill.name}</div>
                <div class="skill-level">
                    <div class="skill-progress" style="width: 0%"></div>
                </div>
            `;
            skillsContainer.appendChild(skillItem);
        });

        // Animer les barres de compétences
        setTimeout(() => {
            const progressBars = skillsContainer.querySelectorAll('.skill-progress');
            progressBars.forEach((bar, index) => {
                bar.style.width = `${skills[index].level}%`;
            });
        }, 500);
    }
}

// Fonction pour animer l'entrée des éléments du CV
function animateCVElements() {
    const resumeElements = document.querySelectorAll('.resume-container > *');
    resumeElements.forEach((el, index) => {
        el.style.animationDelay = `${0.1 * (index + 1)}s`;
        el.style.opacity = '0';
        void el.offsetWidth; // Forcer un reflow
        el.style.animation = 'none';
        setTimeout(() => {
            el.style.animation = '';
        }, 10);
    });
}

// Gestion de la navigation
const navItems = document.querySelectorAll('.nav-item');
const sections = {
    About: document.querySelector('#about'),
    Resume: document.getElementById('Resume'),
    Works: document.getElementById('Works'),
    Contact: document.getElementById('Contact')
};

// Mise à jour de la fonction de gestion de la navigation existante
navItems.forEach(item => {
    item.addEventListener('click', function() {
        const sectionName = this.getAttribute('data-section');
        showSection(sectionName);
    });
});

// Fonction pour afficher une section spécifique
function showSection(sectionName) {
    navItems.forEach(navItem => navItem.classList.remove('active'));
    const navItem = document.querySelector(`.nav-item[data-section="${sectionName}"]`);
    if (navItem) {
        navItem.classList.add('active');
    }

    Object.values(sections).forEach(section => section.classList.add('hidden'));
    sections[sectionName].classList.remove('hidden');

    if (sectionName === 'Resume') {
        animateCVElements();
    } else if (sectionName === 'Works') {
        animateProjectElements();
    }
}

// Fonction pour soumettre le formulaire de contact
function submitForm(event) {
    event.preventDefault();

    // Vérification des champs
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');

    if (!name.checkValidity() || !email.checkValidity() || !message.checkValidity()) {
        return;
    }

    const formData = {
        name: name.value,
        email: email.value,
        message: message.value
    };

    fetch('https://hook.eu2.make.com/w60qigoh8f8jwx452jkpslk6d1lt6ueb', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (response.ok) {
            // Cacher le formulaire
            document.getElementById('contactForm').classList.add('hidden');
            
            // Afficher le message de succès
            const successMessage = document.getElementById('successMessage');
            successMessage.textContent = `Merci ${formData.name} ! Votre message a été envoyé avec succès.`;
            successMessage.classList.remove('hidden');
            
            // Réinitialiser le formulaire après un délai
            setTimeout(() => {
                name.value = '';
                email.value = '';
                message.value = '';
                document.getElementById('contactForm').classList.remove('hidden');
                successMessage.classList.add('hidden');
            }, 5000);
        } else {
            throw new Error('Une erreur est survenue lors de l\'envoi du message.');
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
        alert('Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer.');
    });
}

// Ajouter un écouteur d'événement pour le formulaire de contact
document.getElementById('contactForm').addEventListener('submit', submitForm);

// Fonction pour animer les éléments de la section projets
function animateProjectElements() {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.animationDelay = `${0.2 * (index + 1)}s`;
        card.style.animation = 'fadeInUp 0.6s ease-out forwards';
    });
}

// Fonction pour initialiser la navigation mobile
function initializeMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuItems = document.querySelectorAll('.mobile-menu-item');

    mobileMenuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
    });

    mobileMenuItems.forEach(item => {
        item.addEventListener('click', function() {
            const sectionName = this.getAttribute('data-section');
            mobileMenu.classList.remove('active');
            showSection(sectionName);
        });
    });
}

// Fonction pour animer les logos des clients
function animateClientLogos() {
    const logoSlides = document.querySelectorAll('.logo-slide');
    const logos = [
        'https://i.imgur.com/WnROtRg.jpeg', // Fanta Condé
        'https://i.imgur.com/hOWIkSr.jpeg', // Mr dremaxx
        'https://i.imgur.com/XTuZafz.jpeg', // Karamoo Sangaré
        'https://i.imgur.com/nYnqU36.jpeg', // Philipe Simo
        'https://i.imgur.com/HAJRJeG.jpeg', // Antoine blanco
    ];

    logos.forEach(logo => {
        const img = document.createElement('img');
        img.src = logo;
        img.alt = "Logo client";
        logoSlides.forEach(slide => {
            slide.appendChild(img.cloneNode(true));
        });
    });
}

// Fonction pour initialiser le thème au chargement de la page
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
        document.getElementById('mode-icon').setAttribute('data-feather', 'moon');
    } else {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
        document.getElementById('mode-icon').setAttribute('data-feather', 'sun');
    }
    feather.replace();
    updateCVTheme();
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    feather.replace();
    initializeCV();
    initializeMobileMenu();
    animateClientLogos();
    initTheme();
    showSection('About');
});

function loadSection(sectionName) {
fetch(`${sectionName.toLowerCase()}.html`)
.then(response => response.text())
.then(html => {
    document.querySelector('.center-section').innerHTML = html;
    // Initialiser les scripts spécifiques à la section si nécessaire
    if (sectionName === 'Resume') {
        initializeCV();
    } else if (sectionName === 'Works') {
        animateProjectElements();
    }
});
}