/**
 * ==========================================================================
 * SISTEMA DE INTERACCIONES Y ANIMACIONES PREMIUM (ALTA DEFINICIÓN)
 * Proyecto: Página de Recuerdos Especiales (Ive & Yael)
 * Hecho por: Yael Andrés Vázquez Camas
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar los componentes interactivos de la interfaz
    initBackgroundParticles();
    initScrollReveal();
    setupSmoothScroll();
});

/* ==========================================================================
   1. SISTEMA DE PARTÍCULAS INTERACTIVAS (CANVAS DE FONDO)
   ========================================================================== */
function initBackgroundParticles() {
    const canvas = document.getElementById('particles');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particlesArray = [];

    // Ajustar el tamaño del lienzo de forma dinámica al tamaño de la ventana
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Objeto para registrar la posición y el rango de magnetismo del puntero
    const mouse = {
        x: null,
        y: null,
        radius: 140 // Rango de interacción física con las partículas
    };

    // Registrar el movimiento del mouse sobre la pantalla
    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    // Limpiar las coordenadas si el puntero sale de la ventana del navegador
    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Estructura y comportamiento físico de cada partícula
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.5 + 0.8; // Tamaños variados y sutiles
            this.speedX = (Math.random() - 0.5) * 0.35; // Velocidad horizontal muy suave
            this.speedY = (Math.random() - 0.5) * 0.35; // Velocidad vertical muy suave
            
            // Paleta Premium: Alternancia entre Oro Metálico (#dfb76c) y Azul Eléctrico (#3b82f6)
            this.color = Math.random() > 0.45 ? '#dfb76c' : '#3b82f6';
            this.baseSize = this.size;
        }

        // Dibujar la partícula en el lienzo
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        // Actualizar posiciones y calcular el efecto de proximidad inteligente
        update() {
            // Movimiento autónomo constante
            this.x += this.speedX;
            this.y += this.speedY;

            // Rebotar suavemente en los bordes horizontales del lienzo
            if (this.x < 0 || this.x > canvas.width) {
                this.speedX = -this.speedX;
            }
            // Rebotar suavemente en los bordes verticales del lienzo
            if (this.y < 0 || this.y > canvas.height) {
                this.speedY = -this.speedY;
            }

            // Magnetismo y expansión controlada por proximidad al puntero
            if (mouse.x !== null && mouse.y !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                // Si la partícula entra en el radio de acción, se expande de forma orgánica
                if (distance < mouse.radius) {
                    if (this.size < this.baseSize * 2) {
                        this.size += 0.12;
                    }
                } else if (this.size > this.baseSize) {
                    this.size -= 0.08;
                }
            } else if (this.size > this.baseSize) {
                this.size -= 0.08;
            }
        }
    }

    // Poblar el arreglo balanceando el rendimiento según el tamaño de pantalla
    function populateParticles() {
        particlesArray = [];
        // Fórmula de densidad matemática para evitar sobrecargas en teléfonos móviles
        const numberOfParticles = Math.floor((canvas.width * canvas.height) / 12000);
        
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    // Ciclo infinito de renderizado de alto rendimiento nativo a 60FPS
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        requestAnimationFrame(animate);
    }

    // Inicializar el motor del fondo cinemático
    populateParticles();
    animate();

    // Recalcular la cantidad de partículas de forma reactiva si se redimensiona la pantalla
    window.addEventListener('resize', () => {
        populateParticles();
    });
}

/* ==========================================================================
   2. REVELADO GRADUAL DE SECCIONES PREMIUM (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollReveal() {
    const sections = document.querySelectorAll('.section');
    if (sections.length === 0) return;

    // Configuración milimétrica del observador del viewport
    const observerOptions = {
        root: null, // Detecta cambios respecto a la pantalla del navegador
        rootMargin: '0px 0px -100px 0px', // Activa el efecto 100px antes de entrar por completo
        threshold: 0.1 // Se dispara en cuanto el 10% de la sección es visible
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Inyectar la clase CSS que activa la transición y remueve la opacidad
                entry.target.classList.add('visible');
                // Dejar de observar el contenedor renderizado para liberar memoria y GPU
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Asignar el observador a cada bloque con la clase .section
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
}

/* ==========================================================================
   3. NAVEGACIÓN FLUIDA INTERNA (SMOOTH SCROLL)
   ========================================================================== */
function setupSmoothScroll() {
    const scrollButton = document.querySelector('.scroll-down');
    if (!scrollButton) return;

    scrollButton.addEventListener('click', () => {
        const targetSection = document.getElementById('primera-cita');
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
}