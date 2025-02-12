document.addEventListener('DOMContentLoaded', () => {
    // Alternar menu móvel
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');
    let menuOpen = false;

    menuBtn?.addEventListener('click', () => {
        if (!menuOpen) {
            menuBtn.classList.add('open');
            navLinks.style.display = 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            navLinks.style.padding = '1rem';
            menuOpen = true;
        } else {
            menuBtn.classList.remove('open');
            navLinks.style.display = 'none';
            menuOpen = false;
        }
    });

    // Rolagem suave para links de navegação
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Fecha o menu móvel se estiver aberto
                if (menuOpen) {
                    menuBtn.click();
                }
            }
        });
    });

    // Envio de formulário de contato
    const contactForm = document.querySelector('#contactForm');
    contactForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Mostra o estado de carregamento
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;
        
        try {
            // Obter dados do formulário
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Enviar para backend
            const response = await fetch('/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.error || 'Erro ao enviar mensagem');
            }
            
            // Mostrar mensagem de sucesso
            showNotification('Mensagem enviada com sucesso!', 'success');
            contactForm.reset();
            
        } catch (error) {
            console.error('Error:', error);
            showNotification(error.message || 'Erro ao enviar mensagem. Tente novamente.', 'error');
        } finally {
            // Resetar estado do botão
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        }
    });

    // Função de notificação
    function showNotification(message, type = 'success') {
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Adicionar estilos
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.padding = '15px 25px';
        notification.style.borderRadius = '5px';
        notification.style.color = '#fff';
        notification.style.backgroundColor = type === 'success' ? '#10B981' : '#EF4444';
        notification.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        notification.style.zIndex = '1000';
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        notification.style.transition = 'all 0.3s ease';
        
        // Adicionar ao documento
        document.body.appendChild(notification);
        
        // Acionar animação
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 100);
        
        // Remover após o atraso
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Animação de rolagem para elementos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // Header Scroll Animation
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            header.classList.add('scrolled');
        } else if (currentScroll < lastScroll) {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });

    // Mobile Menu Animation
    menuBtn.addEventListener('click', () => {
        if (!menuOpen) {
            menuBtn.classList.add('open');
            navLinks.classList.add('active');
            menuOpen = true;
        } else {
            menuBtn.classList.remove('open');
            navLinks.classList.remove('active');
            menuOpen = false;
        }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (menuOpen && !e.target.closest('.nav-bar')) {
            menuBtn.classList.remove('open');
            navLinks.classList.remove('active');
            menuOpen = false;
        }
    });

    // Active link highlighting
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').slice(1) === current) {
                item.classList.add('active');
            }
        });
    });

    // Add scroll-based header shadow
    window.addEventListener('scroll', () => {
        if (window.scrollY > 0) {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = 'none';
        }
    });

    // Initialize AOS
    AOS.init({
        duration: 800,
        once: true,
        offset: 100
    });

    // Skill Progress Animation
    const skillLevels = document.querySelectorAll('.skill-level');
    
    const animateSkills = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target.querySelector('.skill-progress');
                const level = entry.target.dataset.level;
                
                // Add a small delay before starting the animation
                setTimeout(() => {
                    progressBar.style.width = `${level}%`;
                }, 200);
                
                observer.unobserve(entry.target);
            }
        });
    };

    

    const skillsObserver = new IntersectionObserver(animateSkills, {
        threshold: 0.5,
        rootMargin: '0px'
    });

    skillLevels.forEach(skill => {
        skillsObserver.observe(skill);
    });

    // Add hover effect for skill categories
    const skillCategories = document.querySelectorAll('.skill-category');
    
    skillCategories.forEach(category => {
        category.addEventListener('mouseenter', () => {
            const items = category.querySelectorAll('.skill-item');
            items.forEach((item, index) => {
                item.style.transitionDelay = `${index * 100}ms`;
                item.style.transform = 'translateY(-5px)';
            });
        });
        
        category.addEventListener('mouseleave', () => {
            const items = category.querySelectorAll('.skill-item');
            items.forEach(item => {
                item.style.transitionDelay = '0ms';
                item.style.transform = 'translateY(0)';
            });
        });
    });
});
