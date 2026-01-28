// Main JavaScript file for Festbau Construction Website

// Mobile menu toggle (for future implementation)
document.addEventListener('DOMContentLoaded', function() {
    console.log('Festbau Construction Website Loaded');
    
    // Add smooth scrolling for all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
