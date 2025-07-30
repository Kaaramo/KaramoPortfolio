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
        { name: "AI Agents & workflow automation (n8n / Make)", level: 95 },
        { name: "Retrieval‑Augmented Generation (RAG)", level: 90 },
        { name: "Prompt engineering & fine‑tuning", level: 95 },
        { name: "Context Engineering", level: 92 },
        { name: "Vector databases & embedding engineering", level: 85 },
        { name: "LangChain", level: 88 },
        { name: "Pinecone", level: 82 },
        { name: "MCP Model Context Protocol", level: 80 },
        { name: "AI Voice", level: 85 },
        { name: "AI Chatbot", level: 92 },
        { name: "ADK ( Google Development Kit )", level: 78 },
        { name: "Maîtrise des Grands Modèles de Langage (LLMs)", level: 95 },
        { name: "Développement Front-End IA & UX Produits", level: 88 },
        { name: "Mise en Place d'infrastructures IA", level: 90 },
        { name: "Cursor", level: 90 },
        { name: "Claude Code", level: 88 }
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

    // Afficher un indicateur de chargement
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Envoi en cours...';
    submitButton.disabled = true;

    fetch('https://n8n.srv858309.hstgr.cloud/webhook/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        // Restaurer le bouton
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        if (response.ok || response.status === 200) {
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
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }
    })
    .catch(error => {
        // Restaurer le bouton en cas d'erreur
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        console.error('Erreur détaillée:', error);
        alert('Une erreur est survenue lors de l\'envoi du message. Veuillez vérifier votre connexion et réessayer.');
    });
}

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
        'https://i.imgur.com/K4pAS8b.jpeg', // Aiguebelle
        'https://i.imgur.com/Es3O3mi.png', // Royal AIR Maroc
        'https://i.imgur.com/msdBlbm.jpeg', // AFMA
        'https://i.imgur.com/MwTbmzH.png', // Credit agricole du maroc
        
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
    
    // Initialiser le formulaire de contact
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', submitForm);
    }
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

// Données des projets pour les modals
const projectsData = [
    {
        title: "AI LinkedIn Content Agency",
        description: `<p>Cette infrastructure productisée d'automatisation IA vise à offrir aux entreprises une gestion intuitive, simplifiée et efficace de leurs campagnes de contenu sur LinkedIn. Développée entièrement grâce à une architecture automatisée basée sur N8N et Airtable, la solution génère des publications engageantes, adaptées au ton et au style de chaque entreprise cliente.</p>

        <h4>Chaque entreprise peut :</h4>
        
        <p><strong>Créer des campagnes personnalisées</strong> grâce à une analyse automatique de son identité, proposition de valeur, et client idéal (ICP), réalisée par une IA.</p>
        
        <p><strong>Générer du contenu riche et varié</strong> (Story-based, Insight-focused, Engagement-focused) automatiquement à partir de contenus existants (blogs, vidéos).</p>
        
        <p><strong>Obtenir des images personnalisées</strong> grâce à une intégration directe avec le modèle OpenAI Image Generation, assurant une cohérence visuelle professionnelle.</p>
        
        <p><strong>Planifier et visualiser les publications</strong> via une interface épurée et conviviale, pensée pour les utilisateurs non-techniques.</p>
        
        <p>La valeur ajoutée principale est la combinaison parfaite entre puissance de l'IA et supervision humaine, permettant ainsi d'automatiser l'essentiel tout en garantissant un contrôle précis sur les contenus générés.</p>`
    },
    {
        title: "AI Meta Ads Agency",
        description: `<p>AI Meta Ads Agency est une solution innovante d'automatisation complète de la gestion des campagnes publicitaires sur Meta (Facebook Ads), développée grâce à une intégration sans code entre N8N et Airtable.</p>

        <p>Cette infrastructure IA révolutionne le fonctionnement traditionnel des agences publicitaires en automatisant entièrement :</p>

        <h4>Fonctionnalités principales :</h4>
        
        <p><strong>La recherche approfondie</strong> des produits et des profils clients via Perplexity AI pour obtenir un contexte précis et pertinent.</p>
        
        <p><strong>La génération intelligente</strong> d'angles publicitaires, de scripts vidéo complets et de textes accrocheurs, inspirés directement des meilleures performances passées.</p>
        
        <p><strong>Le suivi et l'analyse en temps réel</strong> des performances des publicités (ROAS, CPC, conversions...) grâce à une intégration directe avec le Graph API de Meta.</p>
        
        <p><strong>La boucle d'optimisation continue</strong>, en utilisant automatiquement les scripts et angles publicitaires les plus performants pour générer de nouvelles campagnes toujours plus efficaces.</p>
        
        <p>Grâce à son interface conviviale construite sur Airtable, la prise en main par les utilisateurs est intuitive, offrant une collaboration idéale entre l'intelligence artificielle et le contrôle humain.</p>
        
        <p>AI Meta Ads Agency permet ainsi aux agences et aux entreprises de maximiser leur retour sur investissement publicitaire tout en réduisant considérablement la charge de travail et les coûts opérationnels, propulsant ainsi leur croissance grâce à une publicité intelligente, efficace et optimisée en permanence.</p>`
    },
    {
        title: "AI LeadGen Autopilot",
        description: `<p>AI LeadGen Autopilot est une infrastructure d'automatisation intelligente qui permet de générer et d'enrichir des milliers de prospects ultra-ciblés pour un coût incroyablement bas.</p>

        <h4>Ce système avancé utilise une combinaison puissante des outils suivants :</h4>
        
        <p><strong>Apollo</strong> pour collecter et structurer la base initiale des prospects ciblés (noms, titres, emails vérifiés, LinkedIn).</p>
        
        <p><strong>Apify et Bright Data</strong> pour l'enrichissement approfondi des informations provenant des profils LinkedIn et des sites web d'entreprises, fournissant des insights précis et précieux.</p>
        
        <p><strong>N8N et Airtable</strong> pour automatiser complètement la gestion, l'enrichissement et la personnalisation des prospects, permettant de suivre, organiser et exploiter facilement les données.</p>
        
        <p><strong>Instantly</strong> pour envoyer des campagnes emails 100% personnalisées en intégrant automatiquement des accroches (« icebreakers ») uniques, des offres spéciales sur mesure, et des lignes d'objet accrocheuses générées par l'IA.</p>
        
        <h4>Résultats :</h4>
        
        <p>Grâce à AI LeadGen Autopilot, tu peux désormais obtenir rapidement des listes de prospects hautement qualifiés, enrichis avec des données pertinentes et des accroches ultra-personnalisées. L'ensemble du processus est automatisé pour maximiser le taux de réponse, augmenter les conversions et réduire considérablement ton coût d'acquisition client.</p>
        
        <p>Ce système clé-en-main libère du temps et décuple l'efficacité de tes campagnes de prospection, transformant définitivement la façon dont tu génères de nouveaux leads pour ton entreprise.</p>`
    },
    {
        title: "AI YouTube Growth Strategist",
        description: `<p>AI YouTube Growth Strategist est un système d'automatisation intelligent spécialement conçu pour maximiser la croissance et les revenus de ta chaîne YouTube, en analysant quotidiennement ton audience, ta niche et tes performances vidéo.</p>

        <h4>Ce système avancé agit comme ton stratège YouTube personnel, exécutant automatiquement les tâches clés suivantes :</h4>
        
        <p><strong>Identification des vidéos les plus performantes</strong> de chaînes concurrentes (ou similaires), en analysant leurs titres, mots-clés forts (« power words ») et leurs miniatures (thumbnails).</p>
        
        <p><strong>Analyse quotidienne et hebdomadaire</strong> des tendances générales dans ta niche spécifique, te permettant de rester à jour avec ce qui fonctionne actuellement sur YouTube.</p>
        
        <p><strong>Extraction et analyse intelligente</strong> des commentaires de tes propres vidéos afin d'identifier clairement :</p>
        <ul>
            <li>Ce que ton audience apprécie</li>
            <li>Ce qu'elle aimerait voir amélioré</li>
            <li>Ce qu'elle souhaite comme contenu supplémentaire</li>
        </ul>
        
        <p><strong>Génération quotidienne d'idées vidéo personnalisées</strong>, prenant en compte les performances actuelles des vidéos concurrentes, les attentes précises de ton audience, et les éléments qui suscitent le plus d'engagement (titres accrocheurs et miniatures efficaces).</p>
        
        <p><strong>Centralisation et suivi simplifié</strong> de toutes ces données sur une interface pratique (Google Sheets), avec notifications automatiques via Slack pour consulter rapidement tes nouvelles opportunités vidéo.</p>
        
        <h4>Impact :</h4>
        
        <p>Grâce à AI YouTube Growth Strategist, finis les tâtonnements et les incertitudes. Chaque jour, tu reçois automatiquement des recommandations claires, précises et actionnables pour produire du contenu YouTube optimisé, pertinent et à fort potentiel de croissance. Ce stratège virtuel te permet de mieux comprendre ton audience, de créer des vidéos qui performent, et d'augmenter significativement tes revenus YouTube, tout en gagnant un temps précieux.</p>`
    }
];

// Fonctions pour gérer les modals
function openModal(projectIndex) {
    const modal = document.getElementById('projectModal');
    const modalBody = document.getElementById('modalBody');
    const project = projectsData[projectIndex];
    
    modalBody.innerHTML = `
        <h2 class="modal-title">${project.title}</h2>
        <div class="modal-description">${project.description}</div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Empêche le scroll en arrière-plan
}

function closeModal() {
    const modal = document.getElementById('projectModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto'; // Réactive le scroll
}

// Fermer le modal avec la touche Échap
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});


