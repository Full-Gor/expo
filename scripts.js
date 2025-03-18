document.addEventListener('DOMContentLoaded', function() {
    // Variables pour la fonction de zoom
    let scale = 1;
    const zoomFactor = 0.2;
    const maxZoom = 3;
    const minZoom = 1;
    const zoomModal = document.getElementById('zoom-modal');
    const modalImage = document.getElementById('modal-image');
    const backToTop = document.getElementById('back-to-top');
    
    // Ajouter un gestionnaire d'événement à chaque image d'œuvre
    document.querySelectorAll('.artwork-img').forEach((artwork) => {
        // Image et icône de zoom dans l'artwork
        const img = artwork.querySelector('img');
        const zoomIcon = artwork.querySelector('.zoom-icon');
        
        // Ajouter un gestionnaire de clic à l'image entière
        artwork.addEventListener('click', function(e) {
            e.preventDefault();
            openZoomModal(img.src, img.alt, img.dataset.title);
        });
        
        // Ajouter un gestionnaire de clic à l'icône de zoom
        if (zoomIcon) {
            zoomIcon.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation(); // Empêcher la propagation au parent
                openZoomModal(img.src, img.alt, img.dataset.title);
            });
        }
    });
    
    // Fonction pour ouvrir le modal de zoom
    function openZoomModal(imgSrc, imgAlt, imgTitle) {
        modalImage.src = imgSrc;
        modalImage.alt = (imgTitle || imgAlt) + " - vue détaillée";
        
        // Réinitialiser le zoom
        scale = 1;
        updateZoom();
        
        // Afficher le modal
        window.location.hash = 'zoom-modal';
    }
    
    // Ajouter les gestionnaires d'événements aux boutons de zoom
    document.querySelector('.zoom-in').addEventListener('click', function() {
        if (scale < maxZoom) {
            scale += zoomFactor;
            updateZoom();
        }
    });
    
    document.querySelector('.zoom-out').addEventListener('click', function() {
        if (scale > minZoom) {
            scale -= zoomFactor;
            updateZoom();
        }
    });
    
    document.querySelector('.zoom-reset').addEventListener('click', function() {
        scale = 1;
        updateZoom();
    });
    
    // Mettre à jour le zoom
    function updateZoom() {
        modalImage.style.transform = `scale(${scale})`;
        document.querySelector('.zoom-info').textContent = `Zoom: ${Math.round(scale * 100)}%`;
    }
    
    // Permettre le zoom avec la molette de la souris
    document.querySelector('.zoom-content').addEventListener('wheel', function(e) {
        e.preventDefault();
        if (e.deltaY < 0 && scale < maxZoom) {
            scale += zoomFactor;
        } else if (e.deltaY > 0 && scale > minZoom) {
            scale -= zoomFactor;
        }
        updateZoom();
    });
    
    // Gestion du bouton "Back to top"
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    // Scroll fluide pour les liens d'ancrage
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Ne pas appliquer le scroll fluide aux modaux
            if (this.getAttribute('href') === '#zoom-modal' || 
                this.getAttribute('href') === '#cgv-modal' || 
                this.getAttribute('href') === '#retour-modal' ||
                this.getAttribute('href') === '#') {
                return;
            }
            
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
                
                // Mettre à jour l'URL sans provoquer de scroll
                history.pushState(null, null, targetId);
            }
        });
    });
    
    // Gestion du hash dans l'URL
    window.addEventListener('hashchange', function() {
        if (window.location.hash !== '#zoom-modal' && 
            window.location.hash !== '#cgv-modal' && 
            window.location.hash !== '#retour-modal') {
            // Réinitialiser le zoom quand on ferme le modal
            scale = 1;
            updateZoom();
        }
    });
});