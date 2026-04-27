
import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrainingCarousel from './components/TrainingCarousel';
import TrainingCourseDetail from './components/TrainingCourseDetail';
import VideoCard from './components/VideoCard';
import VideoPlayerModal from './components/VideoPlayerModal';
import AssistantChat from './components/AssistantChat';
import ResourceRepository from './components/ResourceRepository';
import CategoryGrid from './components/CategoryGrid';
import WebinarsView from './components/WebinarsView';
import BlogView from './components/BlogView';
import NemiAgentsView from './components/NemiAgentsView';
import NemiStudio from './components/NemiStudio';
import EduToolsCatalog from './components/EduToolsCatalog';
import AboutCDA from './components/AboutCDA';
import SearchModal from './components/SearchModal'; // Import new modal
import { VIDEOS, NEMI_AGENTS, BLOG_POSTS } from './data/mockData';
import { IA_TOOLS } from './data/eduTools';
import { Video } from './types';
import { ThemeProvider } from './context/ThemeContext';
import { ArrowRight, ExternalLink, Instagram, Youtube, Globe, LogIn, Heart, Phone, Mail, Clock } from 'lucide-react';

type AppView = 'home' | 'repository' | 'webinars' | 'blog' | 'nemi' | 'studio' | 'edutools' | 'about' | 'trainingCourse';

const AppContent: React.FC = () => {
    const [currentView, setCurrentView] = useState<AppView>('home');
    const [isSearchOpen, setIsSearchOpen] = useState(false); // State for modal
    const [playingVideo, setPlayingVideo] = useState<Video | null>(null);
    const [initialCategory, setInitialCategory] = useState("all");
    const [studioToolId, setStudioToolId] = useState<string | null>(null);
    const [selectedTrainingCourseId, setSelectedTrainingCourseId] = useState<string | null>(null);

    // Keyboard shortcut for search
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsSearchOpen(true);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        const isAllowedTarget = (target: EventTarget | null) => {
            if (!(target instanceof HTMLElement)) return false;
            return Boolean(target.closest('input, textarea, [contenteditable="true"], .allow-select'));
        };

        const protectContent = (e: Event) => {
            if (isAllowedTarget(e.target)) return;
            if (e.target instanceof HTMLElement && e.target.closest('.content-protected')) {
                e.preventDefault();
            }
        };

        document.addEventListener('copy', protectContent);
        document.addEventListener('cut', protectContent);
        document.addEventListener('contextmenu', protectContent);
        document.addEventListener('dragstart', protectContent);

        return () => {
            document.removeEventListener('copy', protectContent);
            document.removeEventListener('cut', protectContent);
            document.removeEventListener('contextmenu', protectContent);
            document.removeEventListener('dragstart', protectContent);
        };
    }, []);

    const handleNavigate = (view: AppView, param?: string) => {
        setCurrentView(view);
        if (view === 'trainingCourse') {
            setSelectedTrainingCourseId(param ?? null);
        }

        if (view === 'webinars' && param) {
            setInitialCategory(param);
        } else {
            setInitialCategory("all");
        }

        if (view === 'studio' && param) {
            setStudioToolId(param);
        } else {
            setStudioToolId(null);
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleNavigateToCategory = (category: string) => {
        handleNavigate('webinars', category);
    };

    const handleViewTrainingCourse = (courseId: string) => {
        handleNavigate('trainingCourse', courseId);
    };

    const handleBackToTrainingPrograms = () => {
        setCurrentView('home');
        setSelectedTrainingCourseId(null);
        window.setTimeout(() => {
            document
                .getElementById('programas-capacitacion-catalogo')
                ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 0);
    };

    // Featured Content for Home
    const featuredTools = IA_TOOLS.slice(0, 3);
    const featuredAgents = NEMI_AGENTS.slice(0, 3);

    return (
        <div className="content-protected min-h-screen bg-[var(--bg-main)] font-normal text-[var(--text-primary)] selection:bg-[#F24405] selection:text-white transition-colors duration-300 flex flex-col">
            <div className="pointer-events-none fixed bottom-4 left-4 z-[80] hidden md:block select-none rounded-full border border-[var(--border-color)] bg-[rgb(var(--bg-card-rgb))]/70 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-tertiary)] backdrop-blur-md">
                © CDA IEST Anáhuac · Uso educativo
            </div>
            <Navbar
                onSearchClick={() => setIsSearchOpen(true)}
                onToggleMenu={() => { }}
                onNavigate={(view) => handleNavigate(view as any)}
                currentView={currentView === 'trainingCourse' ? 'home' : currentView}
            />

            {/* Global Search Modal */}
            <SearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                onPlayVideo={setPlayingVideo}
                onNavigate={handleNavigate}
            />

            <div className="pt-16 flex-1">

                {/* Renderizado de vistas secundarias */}
                {currentView === 'repository' && <ResourceRepository onPlayVideo={setPlayingVideo} />}
                {currentView === 'webinars' && <WebinarsView onPlayVideo={setPlayingVideo} initialCategory={initialCategory} />}
                {currentView === 'blog' && <BlogView onNavigateToCategory={handleNavigateToCategory} />}
                {currentView === 'nemi' && <NemiAgentsView />}
                {currentView === 'studio' && <NemiStudio initialTool={studioToolId} />}
                {currentView === 'edutools' && <EduToolsCatalog />}
                {currentView === 'about' && <AboutCDA />}
                {currentView === 'trainingCourse' && (
                    <TrainingCourseDetail
                        courseId={selectedTrainingCourseId}
                        onBack={handleBackToTrainingPrograms}
                        onSelectCourse={handleViewTrainingCourse}
                    />
                )}

                {/* HOME PAGE */}
                {currentView === 'home' && (
                    <>
                        <Hero />
                        <TrainingCarousel onViewCourse={handleViewTrainingCourse} />

                        {/* --- CONTENIDO PRINCIPAL DEL HOME --- */}
                        <>

                            {/* 1. SECCIÓN RUTAS */}
                            <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
                                <div className="text-center mb-10">
                                    <h2 className="text-3xl font-semibold text-[var(--text-primary)]">
                                        Inicio
                                    </h2>
                                    <p className="text-[var(--text-secondary)] mt-3 text-lg max-w-2xl mx-auto font-normal">
                                        Colecciones de webinars integrados para desarrollar competencias docentes de forma progresiva.
                                    </p>
                                </div>

                                {/* Categorías (Full Width) */}
                                <div>
                                    <CategoryGrid onVideoClick={setPlayingVideo} />
                                </div>
                            </section>

                            {/* 2. SECCIÓN: HERRAMIENTAS IA DESTACADAS */}
                            <section className="bg-[var(--bg-element)]/50 py-16 border-y border-[var(--border-color)]">
                                <div className="max-w-7xl mx-auto px-4 md:px-8">
                                    <div className="flex justify-between items-end mb-8">
                                        <div>
                                            <span className="text-[#F24405] font-bold text-xs uppercase tracking-widest">Catálogo EduTools</span>
                                            <h3 className="text-2xl font-semibold text-[var(--text-primary)] mt-1">Herramientas de IA para el aula</h3>
                                        </div>
                                        <button onClick={() => handleNavigate('edutools')} className="text-sm font-medium text-[var(--text-secondary)] hover:text-[#F24405] flex items-center gap-1 transition-colors">
                                            Ver todas <ArrowRight size={16} />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {featuredTools.map((tool, i) => (
                                            <div key={i} className="bg-[var(--bg-card)] p-6 rounded-xl border border-[var(--border-color)] hover:shadow-lg transition-all group">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <img src={tool.logo} className="w-10 h-10 rounded bg-white p-1 shadow-sm" alt="" />
                                                    <h4 className="font-bold text-[var(--text-primary)] group-hover:text-[#F24405] transition-colors">{tool.title}</h4>
                                                </div>
                                                <p className="text-base text-[var(--text-secondary)] mb-4 line-clamp-2">{tool.summary}</p>
                                                <button onClick={() => handleNavigate('edutools')} className="text-xs font-bold text-[#F24405] flex items-center gap-1 uppercase tracking-wide">
                                                    Explorar <ArrowRight size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            {/* 3. SECCIÓN: AGENTES NEMI */}
                            <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
                                <div className="flex justify-between items-end mb-8">
                                    <div>
                                        <span className="text-[#F24405] font-bold text-xs uppercase tracking-widest">Nemi Agents</span>
                                        <h3 className="text-2xl font-semibold text-[var(--text-primary)] mt-1">Asistentes Especializados</h3>
                                    </div>
                                    <button onClick={() => handleNavigate('nemi')} className="text-sm font-medium text-[var(--text-secondary)] hover:text-[#F24405] flex items-center gap-1 transition-colors">
                                        Ver catálogo <ArrowRight size={16} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {featuredAgents.map((agent, i) => (
                                        <div key={i} className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] overflow-hidden flex flex-col group hover:-translate-y-1 transition-transform duration-300">
                                            <div className="h-1 w-full" style={{ backgroundColor: agent.color }}></div>
                                            <div className="p-6 flex-1 flex flex-col">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="p-2 rounded-lg bg-[var(--bg-element)] text-[var(--text-primary)] flex items-center justify-center">
                                                        <span className="material-symbols-rounded" style={{ color: agent.color, fontSize: '24px' }}>
                                                            {agent.icon}
                                                        </span>
                                                    </div>
                                                </div>
                                                <h4 className="font-bold text-lg text-[var(--text-primary)] mb-2 group-hover:text-[#F24405] transition-colors">{agent.title}</h4>
                                                <p className="text-base text-[var(--text-secondary)] mb-4 flex-1">{agent.description}</p>
                                                <a
                                                    href={agent.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="w-full py-2 bg-[var(--bg-element)] hover:bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg text-xs font-bold text-center text-[var(--text-primary)] flex items-center justify-center gap-2 transition-colors"
                                                >
                                                    Abrir Agente <ExternalLink size={12} />
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* 4. SECCIÓN: BLOG */}
                            <section className="bg-[var(--bg-element)]/30 py-16 border-t border-[var(--border-color)]">
                                <div className="max-w-7xl mx-auto px-4 md:px-8">
                                    <div className="flex justify-between items-end mb-8">
                                        <div>
                                            <span className="text-[#F24405] font-bold text-xs uppercase tracking-widest">Reflexiones y tendencias</span>
                                            <h3 className="text-2xl font-semibold text-[var(--text-primary)] mt-1">en educación superior ..</h3>
                                            <p className="text-[var(--text-secondary)] mt-2 text-sm max-w-2xl">
                                                Artículos breves, guías prácticas y análisis profundos escritos por Nemi y la Coordinación de Desarrollo Académico.
                                            </p>
                                        </div>
                                        <button onClick={() => handleNavigate('blog')} className="text-sm font-medium text-[var(--text-secondary)] hover:text-[#F24405] flex items-center gap-1 transition-colors">
                                            Ver todo <ArrowRight size={16} />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        {BLOG_POSTS.slice(0, 3).map((post) => (
                                            <article
                                                key={post.id}
                                                onClick={() => handleNavigate('blog')}
                                                className="group cursor-pointer flex flex-col gap-3"
                                            >
                                                <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-slate-900 border border-[var(--border-color)]">
                                                    <img
                                                        src={post.image}
                                                        alt={post.title}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                                                    />
                                                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded border border-white/10">
                                                        {post.category}
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center gap-2 text-[#F24405] text-xs font-semibold">
                                                        <Clock size={14} />
                                                        <span>{post.readTime} de lectura</span>
                                                    </div>

                                                    <h4 className="text-lg font-bold text-[var(--text-primary)] leading-tight group-hover:text-[#F24405] transition-colors line-clamp-2">
                                                        {post.title}
                                                    </h4>

                                                    <p className="text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                                                        {post.content ? post.content.replace(/<[^>]*>?/gm, '').substring(0, 150) + "..." : 'Lee el artículo completo en nuestra sección de blog...'}
                                                    </p>
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            {/* 5. SECCIÓN: CERTIFICACIONES (NEW) */}
                            <section className="max-w-7xl mx-auto px-4 md:px-8 pt-16 pb-6 border-t border-[var(--border-color)]">
                                <div className="text-center mb-8">
                                    <h3 className="text-2xl font-semibold text-[var(--text-primary)]">
                                        Certificaciones que respaldan el contenido
                                    </h3>
                                    <p className="text-[var(--text-secondary)] mt-2 text-base max-w-2xl mx-auto">
                                        Nuestros programas formativos integran marcos de referencia globales para garantizar la excelencia académica y la innovación educativa.
                                    </p>
                                </div>
                                <div className="w-full">
                                    <img
                                        src="https://res.cloudinary.com/dsmvoemnu/image/upload/v1771022107/Copia_de_Copia_de_Oc%C3%A9ano_Google_Aula_de_Google_Encabezado_d3q4qh.png"
                                        alt="Certificaciones"
                                        className="w-full h-auto object-contain hover:scale-[1.01] transition-transform duration-500"
                                    />
                                </div>
                            </section>
                        </>
                    </>
                )}
            </div>

            {/* Footer Mejorado */}
            {currentView !== 'nemi' && currentView !== 'studio' && currentView !== 'edutools' && (
                <footer className="bg-[var(--bg-main)] border-t border-[var(--border-color)] pt-16 pb-8 px-4 mt-auto">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                        {/* Columna 1: Identidad */}
                        <div className="space-y-6">
                            <div className="flex flex-col gap-2">
                                <img src="https://res.cloudinary.com/dsmvoemnu/image/upload/v1763061972/Presentation_-_FLIPPED_CLASSROOM_TRANSFORMAR_TU_CLASE_5_xdedh4.png" className="h-10 w-auto opacity-80 grayscale invert dark:invert-0 transition-all self-start" alt="Logo" />
                                <span className="text-[var(--text-primary)] font-semibold text-sm leading-tight mt-2">
                                    Coordinación de <br /> Desarrollo Académico
                                </span>
                            </div>
                            <p className="text-[var(--text-tertiary)] text-xs leading-relaxed">
                                © 2026 IEST Anáhuac. <br />
                                Comprometidos con la innovación educativa y la formación integral docente.
                            </p>
                            <p className="text-[var(--text-tertiary)] text-[11px] leading-relaxed border-l-2 border-[#F24405]/50 pl-3">
                                Contenido protegido. Prohibida su reproducción, distribución o reutilización sin autorización de la Coordinación de Desarrollo Académico.
                            </p>
                        </div>

                        {/* Columna 2: Navegación */}
                        <div>
                            <h4 className="font-bold text-[var(--text-primary)] mb-6 text-sm uppercase tracking-wide">Navegación</h4>
                            <ul className="space-y-3 text-base text-[var(--text-secondary)]">
                                <li><button onClick={() => handleNavigate('home')} className="hover:text-[#F24405] transition-colors text-left">Inicio</button></li>
                                <li><button onClick={() => handleNavigate('webinars')} className="hover:text-[#F24405] transition-colors text-left">Cursos y Webinars</button></li>
                                <li><button onClick={() => handleNavigate('blog')} className="hover:text-[#F24405] transition-colors text-left">Blog Académico</button></li>
                                <li><button onClick={() => handleNavigate('nemi')} className="hover:text-[#F24405] transition-colors text-left">Nemi Agents</button></li>
                                <li><button onClick={() => handleNavigate('studio')} className="hover:text-[#F24405] transition-colors text-left">Nemi Studio</button></li>
                                <li><button onClick={() => handleNavigate('repository')} className="hover:text-[#F24405] transition-colors text-left">Repositorio de Recursos</button></li>
                            </ul>
                        </div>

                        {/* Columna 3: Contacto */}
                        <div>
                            <h4 className="font-bold text-[var(--text-primary)] mb-6 text-sm uppercase tracking-wide">Contacto</h4>
                            <div className="space-y-5 text-sm text-[var(--text-secondary)]">

                                <div className="space-y-1">
                                    <p className="font-semibold text-[var(--text-primary)] text-sm">Mtra. Teresa Genoveva Espuna Mújica</p>
                                    <p className="text-xs text-[var(--text-tertiary)]">Coordinador de Desarrollo Académico</p>
                                    <div className="flex items-center gap-2 text-xs font-medium text-[#F24405] mt-1">
                                        <Phone size={12} /> Ext. 2238
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <p className="font-semibold text-[var(--text-primary)] text-sm">Mtro. Alejandro Hernández Hernández</p>
                                    <p className="text-xs text-[var(--text-tertiary)]">Responsable de Acompañamiento Docente</p>
                                    <div className="flex items-center gap-2 text-xs font-medium text-[#F24405] mt-1">
                                        <Phone size={12} /> Ext. 2463
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <p className="font-semibold text-[var(--text-primary)] text-sm">Mtro. Jesús Magdiel Hernandez Lam</p>
                                    <p className="text-xs text-[var(--text-tertiary)]">Resp. de Supervisión y Evaluación Docente</p>
                                    <div className="flex items-center gap-2 text-xs font-medium text-[#F24405] mt-1">
                                        <Phone size={12} /> Ext. 2409
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Columna 4: Enlaces Externos */}
                        <div>
                            <h4 className="font-bold text-[var(--text-primary)] mb-6 text-sm uppercase tracking-wide">Síguenos & Enlaces</h4>
                            <div className="flex flex-col gap-3">
                                <a href="https://www.instagram.com/cda_iest" target="_blank" className="flex items-center gap-3 text-sm text-[var(--text-secondary)] hover:text-[#E1306C] transition-colors p-2 rounded-lg hover:bg-[var(--bg-card)] border border-transparent hover:border-[var(--border-color)]">
                                    <Instagram size={18} /> Instagram
                                </a>
                                <a href="https://www.youtube.com/channel/UCUulrQTmNuFdsTJviUBT_AA" target="_blank" className="flex items-center gap-3 text-sm text-[var(--text-secondary)] hover:text-[#FF0000] transition-colors p-2 rounded-lg hover:bg-[var(--bg-card)] border border-transparent hover:border-[var(--border-color)]">
                                    <Youtube size={18} /> Youtube
                                </a>
                                <a href="https://www.anahuac.mx/iest/" target="_blank" className="flex items-center gap-3 text-sm text-[var(--text-secondary)] hover:text-[#F24405] transition-colors p-2 rounded-lg hover:bg-[var(--bg-card)] border border-transparent hover:border-[var(--border-color)]">
                                    <Globe size={18} /> Portal IEST
                                </a>
                                <a href="https://sie.iest.edu.mx/sie/login/securelogv4.php" target="_blank" className="flex items-center gap-3 text-sm text-[var(--text-secondary)] hover:text-[#F24405] transition-colors p-2 rounded-lg hover:bg-[var(--bg-card)] border border-transparent hover:border-[var(--border-color)]">
                                    <LogIn size={18} /> SIE Docente
                                </a>
                            </div>
                        </div>

                    </div>

                    {/* Bottom Bar: Créditos */}
                    <div className="max-w-7xl mx-auto border-t border-[var(--border-color)] pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[var(--text-tertiary)]">
                        <div className="flex items-center gap-1.5 bg-[var(--bg-card)] px-3 py-1.5 rounded-full border border-[var(--border-color)]">
                            <span>Diseño de</span>
                            <Heart size={10} className="text-red-500 fill-red-500" />
                            <span>por docentes para docentes</span>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 text-center md:text-right">
                            <p>Diseñado por: <span className="font-semibold text-[var(--text-secondary)]">Alejandro Hernández Hernández</span></p>
                            <div className="flex items-center gap-3">
                                <span className="bg-[var(--bg-element)] px-2 py-0.5 rounded border border-[var(--border-color)]">Versión CDA 4/2026</span>
                                <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" className="flex items-center gap-1 hover:text-[var(--text-primary)] transition-colors" title="Creative Commons BY-NC-SA">
                                    <span className="font-bold border border-[var(--text-tertiary)] px-1 rounded text-[10px]">CC</span>
                                    <span className="font-bold border border-[var(--text-tertiary)] px-1 rounded text-[10px]">BY-NC-SA</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </footer>
            )}

            {playingVideo && (
                <VideoPlayerModal
                    video={playingVideo}
                    onClose={() => setPlayingVideo(null)}
                    onSwitchVideo={setPlayingVideo}
                    onNavigate={handleNavigate}
                />
            )}

            {/* Nemi Chat Global (Floating) */}
            <AssistantChat
                onPlayVideo={setPlayingVideo}
                onNavigate={handleNavigate}
            />
        </div>
    );
};

const App: React.FC = () => {
    return (
        <ThemeProvider>
            <AppContent />
        </ThemeProvider>
    );
};

export default App;
