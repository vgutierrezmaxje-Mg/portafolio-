/* ========================================
           DATOS DE LOS PROYECTOS 
        ===================================*/

const projectsData = {
    1: {
        title: "Base de Datos Relacional — Sistema de Gestión para Botica",
        codeVars: [
            { label: "BD-Botica.js", var: "CODE_01_BDB" },
            { label: "Consultas.js", var: "CODE_01_CS" },
        ],
        images: [
            { src: "Capturas/Cap-GestionFR-project01/diagramaBD-relacional.png", alt: "Diagrama ER del Sistema de Gestión para Botica" },
        ]
    },
    2: {
        title: "Riego Autónomo Inteligente",
        codeVars: [
            { label: "RiegoAutonomo.js", var: "CODE_02_RIEG" }
        ],
        images: [
            { src: "Capturas/Cap-SistemRiego-project02/riego.png", alt: "Dashboard Principal del Sistema de Riego Autónomo Inteligente" },
        ]
    },
    3: {
        title: "Analizador de Señales Analógicas",
        codeVars: [
            { label: "AnalizadorSenales.js", var: "CODE_03_ANZ" }
        ],
        images: [
            { src: "Capturas/Cap-SeñalesAnalogicas-project03/ondas.png", alt: "Dashboard Principal del Analizador de Señales Analógicas" },
        ]
    },
    4: {
        title: "Gestión de una Biblioteca Universitaria",
        codeVars: [
            { label: "ControlPrestamo.js", var: "CODE_04_CP" },
            { label: "GestionMaterial.js", var: "CODE_04_GM" },
            { label: "ReporteGeneral.js", var: "CODE_04_RG" },
            { label: "ReservacionLibros.js", var: "CODE_04_RL" }
        ],
        images: [
            { src: "Capturas/Cap-GtBibliotecaria-project04/login.png", alt: "Dashboard Principal del Sistema de Gestión para Biblioteca Universitaria" },
            { src: "Capturas/Cap-GtBibliotecaria-project04/ControlPrestamos.png", alt: "Módulo de Registro y Control de Libros" },
            { src: "Capturas/Cap-GtBibliotecaria-project04/ReservacionLibros.png", alt: "Módulo de Gestión de Reservas y Usuarios" },
            { src: "Capturas/Cap-GtBibliotecaria-project04/DevolucionLibros.png", alt: "Módulo de Devoluciones y Multas" },
            { src: "Capturas/Cap-GtBibliotecaria-project04/GestionMaterial.png", alt: "Panel de Gestión de Material Bibliográfico" },
            { src: "Capturas/Cap-GtBibliotecaria-project04/ListadoUsuarios.png", alt: "Listado de Usuarios Registrados en el Sistema" },
            { src: "Capturas/Cap-GtBibliotecaria-project04/Reportes.png", alt: "Módulo de Reportes y Estadísticas de Préstamos" }
        ]
    },
    5: {
        title: "Sistema de una Pollería",
        codeVars: [
            { label: "RegistroClientes.js", var: "CODE_5_RC" },
            { label: "ControlPedidos.js", var: "CODE_05_CP" }
        ],
        images: [
            { src: "Capturas/Cap-Polleria-project05/RestauranteLogin.png", alt: "Dashboard Principal del Sistema de Gestión para Pollería" },
            { src: "Capturas/Cap-Polleria-project05/RegistroProductos.png", alt: "Módulo de Registro y Control de Pedidos" },
            { src: "Capturas/Cap-Polleria-project05/RegistroClientes.png", alt: "Módulo de Gestión de Clientes" }
        ]
    },
    6: {
        title: "Sistema de Recaudación Municipal",
        codeVars: [
            { label: "Base-Datos.js", var: "CODE_6_BD" },
            { label: "ConexionBD.js", var: "CODE_6_CNX" },
            { label: "Deudas.js", var: "CODE_6_DD" }
        ],
        images: [
            { src: "Capturas/Cap-RcMunicipal-project06/InicioRecaudacionMc.png", alt: "Dashboard Principal de Administración del Sistema Tributario" },
            { src: "Capturas/Cap-RcMunicipal-project06/ConsultaDeudasTributarias.png", alt: "Módulo de Consulta de Deudas de Contribuyentes" },
            { src: "Capturas/Cap-RcMunicipal-project06/RegistroUsuariosContribuyentes.png", alt: "Registro y Control de Contribuyentes Municipales" },
            { src: "Capturas/Cap-RcMunicipal-project06/ReporteObligacionesMunicipales.png", alt: "Consultad de Obligación Municipales" },
            { src: "Capturas/Cap-RcMunicipal-project06/RegistroObligaciones.png", alt: "Registro de Obligaciones de Contribuyentes" },
            { src: "Capturas/Cap-RcMunicipal-project06/EmisionRecibosPagos.png", alt: "Módulo de Caja y Emisión de Comprobantes de Pago" },
            { src: "Capturas/Cap-RcMunicipal-project06/ConfiguracionGlobales.png", alt: "Panel de Configuración Goblales" },
            { src: "Capturas/Cap-RcMunicipal-project06/AuditoriaLogSistemas.png", alt: "Registro de Auditoría y Logs de Transacciones del Sistema" },
            { src: "Capturas/Cap-RcMunicipal-project06/BD-RecaudacionMc.png", alt: "Modelo de Datos del Sistema de Recaudación Municipal" }
        ]

    },
};

/* ====================================================
   MÓDULO 1: Active Navigation Highlight
==================================================== */
(function initActiveNav() {
    const navLinks = document.querySelectorAll('.sidebar__nav-link');
    const sections = document.querySelectorAll('.content-section[data-view]');
    if (!sections.length || !navLinks.length) return;
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const activeId = entry.target.getAttribute('data-view');
                    navLinks.forEach(link => {
                        const isActive = link.getAttribute('data-section') === activeId;
                        link.classList.toggle('is-active', isActive);
                        link.setAttribute('aria-current', isActive ? 'page' : 'false');
                    });
                }
            });
        },
        { rootMargin: '-10% 0px -60% 0px', threshold: 0 }
    );
    sections.forEach(section => observer.observe(section));
})();

/* ====================================================
   MÓDULO: Mobile Menu Toggle
==================================================== */
(function initMobileMenu() {
    const toggleBtn = document.getElementById('btn-mobile-menu');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (!toggleBtn || !sidebar || !overlay) return;

    function openMenu() {
        sidebar.classList.add('sidebar--open');
        overlay.classList.add('sidebar-overlay--visible');
        toggleBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        sidebar.classList.remove('sidebar--open');
        overlay.classList.remove('sidebar-overlay--visible');
        toggleBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    toggleBtn.addEventListener('click', () => {
        sidebar.classList.contains('sidebar--open') ? closeMenu() : openMenu();
    });
    overlay.addEventListener('click', closeMenu);
})();

/* ====================================================
   MÓDULO 3: Scroll Reveal
==================================================== */
(function initScrollReveal() {
    const revealTargets = document.querySelectorAll(
        '.content-section, .project-card, .article-card, .metric-card, .timeline__entry, .meta-card, .formacion-card, .problema-card, .dashboard-card'
    );
    if (!('IntersectionObserver' in window)) {
        revealTargets.forEach(el => el.classList.add('is-revealed'));
        return;
    }
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.08 }
    );
    revealTargets.forEach((el, index) => {
        el.style.setProperty('--reveal-delay', `${(index % 6) * 80}ms`);
        revealObserver.observe(el);
    });
})();

/* ====================================================
   MÓDULO: Project Filters (Dinámico)
==================================================== */
(function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('is-active'));
            btn.classList.add('is-active');

            const filter = btn.dataset.filter;

            projectCards.forEach(card => {
                const tech = card.dataset.tech || '';
                const shouldShow = filter === 'all' || tech.includes(filter);

                if (shouldShow) {
                    card.style.display = '';
                    requestAnimationFrame(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    });
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        if (!card.dataset.tech.includes(btn.dataset.filter) && btn.dataset.filter !== 'all') {
                            card.style.display = 'none';
                        }
                    }, 300);
                }
            });
        });
    });
})();

/* ====================================================
   MÓDULO: Modal Dinámico de Código Fuente
==================================================== */
(function initCodeModal() {
    const modal = document.getElementById('code-modal');
    const modalTitle = document.getElementById('code-modal-title');
    const modalFilename = document.getElementById('code-modal-filename');
    const modalContent = document.getElementById('code-modal-content');
    const lineNumbers = document.getElementById('code-line-numbers');
    const tabsContainer = document.getElementById('code-modal-tabs');
    const closeBtn = modal.querySelector('.code-modal__control--close');

    // Renderiza el código y números de línea
    function renderCode(text) {
        modalContent.textContent = text;
        const lines = text.split('\n').length;
        lineNumbers.innerHTML = Array.from(
            { length: lines },
            (_, i) => `<span>${i + 1}</span>`
        ).join('');
    }

    // Construye las pestañas dinámicamente
    function buildTabs(files) {
        tabsContainer.innerHTML = '';
        files.forEach((file, index) => {
            const tab = document.createElement('div');
            tab.className = 'code-modal__tab' + (index === 0 ? ' code-modal__tab--active' : '');
            tab.innerHTML = `
                <span class="code-modal__tab-icon">📄</span>
                <span class="code-modal__tab-name">${file.label}</span>
            `;
            tab.addEventListener('click', () => {
                tabsContainer.querySelectorAll('.code-modal__tab')
                    .forEach(t => t.classList.remove('code-modal__tab--active'));
                tab.classList.add('code-modal__tab--active');
                // Mostrar su código
                renderCode(window[file.var] || `// ⚠ No se cargó: ${file.var}`);
            });
            tabsContainer.appendChild(tab);
        });
    }

    document.querySelectorAll('[data-action="code"]').forEach(btn => {
        btn.addEventListener('click', () => {
            const project = projectsData[btn.dataset.project];
            if (!project) return;

            modalTitle.textContent = project.title;

            // Proyecto con MÚLTIPLES archivos (pestañas) 
            if (project.codeVars && project.codeVars.length > 0) {
                buildTabs(project.codeVars);
                modalFilename.textContent = project.codeVars[0].label;
                renderCode(window[project.codeVars[0].var] || '// Archivo no encontrado.');

                // Proyecto con UN solo archivo
            } else {
                tabsContainer.innerHTML = `
                    <div class="code-modal__tab code-modal__tab--active">
                        <span class="code-modal__tab-icon">📄</span>
                        <span class="code-modal__tab-name">${project.filename || 'codigo.txt'}</span>
                    </div>`;
                modalFilename.textContent = project.filename;
                const text = project.codeVar
                    ? (window[project.codeVar] || '// Variable no encontrada.')
                    : (project.code || '// Sin código disponible.');
                renderCode(text);
            }

            modal.showModal();
        });
    });

    closeBtn.addEventListener('click', () => modal.close());
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.close(); });
})();

/* ====================================================
   MÓDULO: Modal Dinámico de Demo / Capturas
==================================================== */
(function initDemoModal() {
    const modal = document.getElementById('demo-modal');
    const modalTitle = document.getElementById('demo-modal-title');
    const modalContent = document.getElementById('demo-modal-content');
    const closeBtn = modal.querySelector('.demo-modal__close');

    // Abrir modal con imágenes del proyecto
    document.querySelectorAll('[data-action="demo"]').forEach(btn => {
        btn.addEventListener('click', () => {
            const projectId = btn.dataset.project;
            const project = projectsData[projectId];

            if (project && project.images.length > 0) {
                modalTitle.textContent = project.title + ' — Demo';

                // Generar galería de imágenes
                modalContent.innerHTML = project.images.map(img => `
                            <figure class="demo-modal__figure">
                                <img src="${img.src}" alt="${img.alt}" class="demo-modal__image" loading="lazy">
                                <figcaption class="demo-modal__caption">${img.alt}</figcaption>
                            </figure>
                        `).join('');

                modal.showModal();
            }
        });
    });

    closeBtn.addEventListener('click', () => modal.close());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.close();
    });
})();

/* ====================================================
   MÓDULO 6: Textarea Character Counter
==================================================== */
(function initCharCounter() {
    const textarea = document.getElementById('campo-mensaje');
    const counter = document.getElementById('mensaje-counter');
    if (!textarea || !counter) return;
    textarea.addEventListener('input', () => {
        counter.textContent = `${textarea.value.length} / 1000`;
    });
})();

/* ====================================================
   MÓDULO 7: Validación Avanzada del Formulario
==================================================== */
(function initContactForm() {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('btn-submit');
    const successMsg = document.getElementById('form-success');

    if (!form) return;

    // Objeto con las configuraciones y mensajes personalizados para cada campo
    const fields = {
        nombre: {
            input: document.getElementById('campo-nombre'),
            errorSpan: document.getElementById('nombre-error'),
            getMsg: (val) => {
                if (!val.trim()) return "El nombre completo es obligatorio.";
                if (val.trim().length < 2) return "El nombre debe tener al menos 2 caracteres.";
                return "";
            }
        },
        email: {
            input: document.getElementById('campo-email'),
            errorSpan: document.getElementById('email-error'),
            getMsg: (val) => {
                if (!val.trim()) return "El correo electrónico es obligatorio.";
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(val.trim())) return "Por favor, ingresa un correo válido.";
                return "";
            }
        },
        asunto: {
            input: document.getElementById('campo-asunto'),
            errorSpan: document.getElementById('asunto-error'),
            getMsg: (val) => {
                if (!val.trim()) return "El asunto es obligatorio.";
                if (val.trim().length < 5) return "El asunto debe detallar al menos 5 caracteres.";
                return "";
            }
        },
        tipo: {
            input: document.getElementById('campo-tipo'),
            errorSpan: null,
            getMsg: (val) => (!val ? "Selecciona un tipo de colaboración." : "")
        },
        mensaje: {
            input: document.getElementById('campo-mensaje'),
            errorSpan: document.getElementById('mensaje-error'),
            counter: document.getElementById('mensaje-counter'),
            getMsg: (val) => {
                if (!val.trim()) return "El mensaje es obligatorio.";
                if (val.trim().length < 20) return "Cuéntame un poco más, mínimo 20 caracteres.";
                return "";
            }
        }
    };

    // Contador dinámico de caracteres para el Textarea
    if (fields.mensaje.input && fields.mensaje.counter) {
        fields.mensaje.input.addEventListener('input', (e) => {
            const len = e.target.value.length;
            fields.mensaje.counter.textContent = `${len} / 1000`;
            if (len >= 20) {
                fields.mensaje.input.classList.remove('is-invalid');
                if (fields.mensaje.errorSpan) fields.mensaje.errorSpan.textContent = "";
            }
        });
    }

    // Función clave para validar un solo campo
    function validarCampo(key) {
        const field = fields[key];
        const mensajeError = field.getMsg(field.input.value);

        if (mensajeError) {
            field.input.classList.add('is-invalid');
            if (field.errorSpan) {
                field.errorSpan.textContent = mensajeError;
                field.errorSpan.style.display = 'block';
            }
            return false;
        } else {
            field.input.classList.remove('is-invalid');
            if (field.errorSpan) {
                field.errorSpan.textContent = "";
                field.errorSpan.style.display = 'none';
            }
            return true;
        }
    }

    // Agregar eventos en tiempo real para limpiar o alertar al salir del campo
    Object.keys(fields).forEach(key => {
        fields[key].input.addEventListener('blur', () => validarCampo(key));
        fields[key].input.addEventListener('input', () => {
            if (fields[key].getMsg(fields[key].input.value) === "") {
                fields[key].input.classList.remove('is-invalid');
                if (fields[key].errorSpan) fields[key].errorSpan.textContent = "";
            }
        });
    });

    // 4. Interceptamos el Submit 
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        let formularioValido = true;
        let primerCampoInvalido = null;

        Object.keys(fields).forEach(key => {
            const esValido = validarCampo(key);
            if (!esValido) {
                formularioValido = false;
                if (!primerCampoInvalido) {
                    primerCampoInvalido = fields[key].input;
                }
            }
        });

        if (!formularioValido) {
            if (primerCampoInvalido) primerCampoInvalido.focus();
            return;
        }

        // Si todo está limpio, simula el envío exitoso con loader
        submitBtn.disabled = true;
        submitBtn.classList.add('is-loading');

        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.classList.remove('is-loading');
            form.reset();

            if (fields.mensaje.counter) fields.mensaje.counter.textContent = "0 / 1000";

            successMsg.removeAttribute('hidden');
            setTimeout(() => successMsg.setAttribute('hidden', ''), 5000);
        }, 1500);
    });
})();

/* ====================================================
   MÓDULO 8: Skill Bar Animations
==================================================== */
(function initSkillBars() {
    const fills = document.querySelectorAll('.skill-item__fill');
    if (!('IntersectionObserver' in window)) {
        fills.forEach(f => f.classList.add('is-animated'));
        return;
    }
    const barObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-animated');
                    barObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );
    fills.forEach(f => barObserver.observe(f));
})();

/* ====================================================
   PATCH MÓVIL — Fix general para navegación, modales,
   formulario y scroll horizontal en tablas
==================================================== */
(function mobilePatch() {

    function smoothScrollTo(targetId) {
        const target = document.getElementById(targetId);
        if (!target) return;

        // Cerrar sidebar si está abierto (móvil)
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        const toggleBtn = document.getElementById('btn-mobile-menu');
        if (sidebar && sidebar.classList.contains('sidebar--open')) {
            sidebar.classList.remove('sidebar--open');
            overlay && overlay.classList.remove('sidebar-overlay--visible');
            toggleBtn && toggleBtn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }

        // Scroll suave
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Interceptar TODOS los links internos (#)
    document.addEventListener('click', function (e) {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;
        const href = link.getAttribute('href');
        if (!href || href === '#') return;
        const targetId = href.slice(1);
        const target = document.getElementById(targetId);
        if (!target) return;
        e.preventDefault();
        smoothScrollTo(targetId);
    });

    /* --------------------------------------------------
       FIX 2: Fallback para <dialog> en móviles
       que no soportan showModal() nativamente
    -------------------------------------------------- */
    function patchDialog(dialogEl) {
        if (!dialogEl) return;
        const nativeShowModal = dialogEl.showModal?.bind(dialogEl);
        const nativeClose = dialogEl.close?.bind(dialogEl);

        if (typeof dialogEl.showModal !== 'function') {
            // Fallback manual si el navegador no soporta <dialog>
            dialogEl.showModal = function () {
                dialogEl.setAttribute('open', '');
                dialogEl.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            };
            dialogEl.close = function () {
                dialogEl.removeAttribute('open');
                dialogEl.style.display = 'none';
                document.body.style.overflow = '';
            };
        } else {
            // Envolver showModal para garantizar visibilidad
            dialogEl.showModal = function () {
                try {
                    nativeShowModal();
                    document.body.style.overflow = 'hidden';
                } catch (err) {
                    // Fallback si falla
                    dialogEl.setAttribute('open', '');
                    dialogEl.style.cssText += 'display:flex!important;position:fixed!important;inset:0!important;z-index:9999!important;max-width:100vw!important;max-height:100dvh!important;';
                    document.body.style.overflow = 'hidden';
                }
            };
            dialogEl.close = function () {
                try { nativeClose(); } catch (e) { dialogEl.removeAttribute('open'); }
                document.body.style.overflow = '';
            };
        }
    }

    patchDialog(document.getElementById('code-modal'));
    patchDialog(document.getElementById('demo-modal'));

    /* --------------------------------------------------
       FIX 3: Scroll horizontal en tablas (Bitácora)
    -------------------------------------------------- */
    document.querySelectorAll('table').forEach(table => {
        // Solo envolver si no tiene ya un wrapper con overflow
        const parent = table.parentElement;
        if (parent && getComputedStyle(parent).overflowX !== 'auto') {
            const wrapper = document.createElement('div');
            wrapper.style.cssText = 'overflow-x:auto;-webkit-overflow-scrolling:touch;width:100%;';
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
        }
    });

    /* --------------------------------------------------
       FIX 4: Asegurar que pointer-events funcionen
       en links de contacto directo
    -------------------------------------------------- */
    document.querySelectorAll('.contacto__channel-link, .contacto__channels a').forEach(link => {
        link.style.pointerEvents = 'auto';
        link.style.position = 'relative';
        link.style.zIndex = '10';
        link.style.minHeight = '44px';
        link.style.display = 'inline-flex';
        link.style.alignItems = 'center';
    });

    /* --------------------------------------------------
       FIX 5: Formulario — prevenir recarga en móvil
       y asegurar que los botones respondan al toque
    -------------------------------------------------- */
    const form = document.getElementById('contact-form');
    if (form) {
        // Quitar action="#" para evitar navegación
        form.removeAttribute('action');

        // Asegurar que el botón reset funcione
        const resetBtn = form.querySelector('button[type="reset"]');
        if (resetBtn) {
            resetBtn.addEventListener('touchend', function (e) {
                e.preventDefault();
                form.reset();
                const counter = document.getElementById('mensaje-counter');
                if (counter) counter.textContent = '0 / 1000';
 
                form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
                form.querySelectorAll('.form-field__error').forEach(el => {
                    el.textContent = '';
                    el.style.display = 'none';
                });
            });
        }

        // Botón submit 
        const submitBtn = document.getElementById('btn-submit');
        if (submitBtn) {
            submitBtn.style.minHeight = '48px';
            submitBtn.style.touchAction = 'manipulation';
        }
        if (resetBtn) {
            resetBtn.style.minHeight = '48px';
            resetBtn.style.touchAction = 'manipulation';
        }
    }

    /* --------------------------------------------------
       FIX 6: Video y Audio — forzar carga en móvil
    -------------------------------------------------- */
    document.querySelectorAll('video, audio').forEach(media => {
        media.style.cssText += 'width:100%!important;max-width:100%!important;display:block!important;';
        if (media.readyState === 0) {
            const src = media.querySelector('source')?.src || media.src;
            if (src) {
                media.load();
            }
        }
    });

    /* --------------------------------------------------
       FIX 7: sidebar-overlay no debe bloquear clicks
       cuando el sidebar está cerrado
    -------------------------------------------------- */
    const overlay = document.getElementById('sidebar-overlay');
    if (overlay) {
        // Cuando el sidebar NO está abierto, el overlay no debe capturar eventos
        const sidebarEl = document.getElementById('sidebar');
        const syncOverlay = () => {
            if (sidebarEl && !sidebarEl.classList.contains('sidebar--open')) {
                overlay.style.pointerEvents = 'none';
            } else {
                overlay.style.pointerEvents = 'auto';
            }
        };
        // Observar cambios de clase en sidebar
        new MutationObserver(syncOverlay).observe(sidebarEl || document.body, {
            attributes: true, attributeFilter: ['class']
        });
        syncOverlay(); 
    }

})();