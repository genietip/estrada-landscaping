import { createContext, useContext, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Route, Switch, Link, useLocation, Router as WouterRouter } from 'wouter';
import { AnimatePresence, motion } from 'framer-motion';
import {
  filterGalleryPhotos,
  galleryCategories,
  galleryFilterLabels,
  getGalleryPhotoCategory,
  type GalleryFilter,
} from './lib/gallery-categories';
import {
  getGalleryFilterFromUrl,
  listenForGalleryFilterHistory,
  updateGalleryFilterHistory,
} from './lib/gallery-url';
import {
  ArrowDownRight, ArrowRight, Check, Flower2, Leaf,
  MapPin, Menu, Phone, Share2, Sprout, Trees, Trash2, X, MessageCircle,
} from 'lucide-react';
import facebookQrImage from './assets/estrada-facebook-qr.svg';

const PHONE = '484-510-6701';
const ADDRESS = '73 Virginia Ave, Coatesville, PA 19320';
const FACEBOOK_URL = 'https://www.facebook.com/profile.php?id=100054702103280';
const photo = (id: string, width = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=85`;

const copy = {
  en: {
    serviceMessage: 'Neighborly care for the places we call home',
    nav: { home: 'Home', about: 'About Us', services: 'Services', gallery: 'Gallery', contact: 'Contact' },
    mainNav: 'Main navigation',
    languageLabel: 'Choose language',
    languageEnglish: 'Switch language to English',
    languageSpanish: 'Switch language to Spanish',
    headerCta: 'Let’s talk',
    footerBlurb: 'A local landscaping team for the everyday joy of a cared-for outdoor space.',
    footerLinks: 'Find your way',
    footerHello: 'Say hello',
    footerWhatsApp: 'Message us on WhatsApp',
    footerRooted: 'Rooted in Coatesville, Pennsylvania',
    chatButton: 'Chat with our crew',
    chatAria: 'Chat with Estrada Landscaping on WhatsApp',
    home: {
      heroKicker: 'Your neighborhood landscape crew',
      heroTitle: 'A little more',
      heroTitleAccent: 'life outside.',
      heroIntro: 'Thoughtful lawn and garden care, right here in Coatesville. We help make the outside of home feel as welcoming as the inside.',
      talkYard: 'Talk about your yard',
      exploreServices: 'Explore services',
      heroNote: 'Free estimates · Serving Coatesville, Thorndale, Downingtown & Parkesburg',
      local: 'Local',
      roots: 'roots',
      videosKicker: 'A glimpse of the work',
      videosTitle: 'Care you can',
      videosTitleSecond: 'see taking shape.',
      videosIntro: 'From a neat edge to a fresh garden bed, the small details make a space feel looked after. Here’s a little inspiration for what outdoor care can look like.',
      sampleFootage: 'Illustrative sample footage — not confirmed Estrada Landscaping projects.',
      videoReplaceNote: 'Videos are public sample footage and can be replaced with your own project videos anytime.',
      videos: [
        { title: 'A lawn, freshly tended', tag: 'Lawn care' },
        { title: 'Room to grow', tag: 'Garden details' },
        { title: 'The finishing touch', tag: 'Outdoor care' },
      ],
      welcomeKicker: 'Good neighbors, good work',
      welcomeTitle: 'We believe home',
      welcomeTitleSecond: 'doesn’t stop at the door.',
      welcomeText: 'Your outdoor space deserves the same care as the rest of your home. We keep the conversation straightforward, listen to what matters to you, and work with care from the first pass to the last leaf.',
      values: ['Clear, direct communication', 'A crew you can reach directly', 'Licensed and insured', '100% customer satisfaction guaranteed', 'Care shaped around your space', 'Proudly based in Coatesville'],
      aboutButton: 'Get to know us',
      planKicker: 'Simple from the start',
      planTitle: 'A good plan.',
      planTitleSecond: 'A cared-for yard.',
      planIntro: 'No guesswork about who to call or what comes next. We keep the process human and easy to follow.',
      steps: [
        { title: 'Tell us what you need', text: 'Call, message, or send a quote request. Share a little about your space and what you have in mind.' },
        { title: 'Talk it through', text: 'We’ll connect directly, learn what matters to you, and discuss a practical next step for your yard.' },
        { title: 'Make it feel cared for', text: 'Our crew gets to work with attention to the details that make your outdoor space feel like yours.' },
      ],
    },
    cta: { title: 'Ready for a little more outside?', text: 'Let’s talk about what your yard could use.', button: 'Start a conversation' },
    about: {
      heroKicker: 'A little about us',
      heroTitle: 'Good work, close',
      heroTitleAccent: 'to home.',
      heroText: 'Estrada Landscaping Professional Inc. is a local landscaping company serving Coatesville, Pennsylvania and nearby neighbors.',
      storyKicker: 'The Estrada approach',
      storyTitle: 'We’re here to make outdoor care feel easy.',
      storyText: 'Great landscaping isn’t only about how a yard looks. It’s also about being able to talk to your crew, know what to expect, and feel good about the care happening around your home.',
      storyTextSecond: 'We’re a neighborhood team based in Coatesville. Whether you need regular lawn attention, a garden bed refreshed, or a seasonal clean-up, we’re ready to listen and work alongside you.',
      principles: [
        ['A local point of contact', 'Direct access to the people doing the work makes the conversation easier.'],
        ['Thoughtful, practical care', 'We shape the work around the needs of your home and outdoor space.'],
        ['A welcoming result', 'The goal is simple: a yard that feels cared for and good to come home to.'],
      ],
      hello: 'Say hello',
      neighborhoodKicker: 'Rooted in the neighborhood',
      neighborhoodTitle: 'Coatesville is home.',
      neighborhoodText: 'We’re proud to serve our local community from Virginia Avenue. We know the value of a welcoming front walk, a tidy lawn, and a place to enjoy a little fresh air.',
      neighborhoodTextSecond: 'Have a project in mind? Tell us what you’re picturing, and we’ll start with a conversation.',
      mapButton: 'Find our neighborhood',
    },
    services: {
      heroKicker: 'What we can do',
      heroTitle: 'Care for every',
      heroTitleAccent: 'corner outside.',
      heroText: 'General landscaping and hardscaping services, with free estimates available for your project.',
      kicker: 'Our services',
      title: 'The right care',
      titleSecond: 'for your place.',
      intro: 'Every yard is a little different. Tell us what you’re hoping to improve, and we’ll talk through the options together. Free estimates are available within 30 miles of Coatesville.',
      items: [
        { title: 'Lawn & garden care', text: 'Lawn care, mulching, pruning, and planting for a cared-for outdoor space.' },
        { title: 'Hardscaping', text: 'Patios, pavers, walkways, and stonework to add lasting structure to your yard.' },
        { title: 'Fireplaces & outdoor kitchens', text: 'Outdoor fireplaces and kitchens for a more inviting place to gather.' },
        { title: 'Junk removal', text: 'Junk removal is now offered. Contact Norberto to discuss what you need removed.' },
      ],
      licensedInsured: 'Licensed & insured',
      satisfactionGuarantee: '100% customer satisfaction guaranteed',
      serviceNumber: 'Service',
      questionTitle: 'Not sure where to start?',
      questionText: 'That’s what a conversation is for. Tell us what your yard needs.',
      askService: 'Ask about a service',
      processKicker: 'Straightforward, every step',
      processTitle: 'Care that starts',
      processTitleSecond: 'with listening.',
      steps: [
        { title: 'Share your ideas', text: 'Let us know what you’d like to change or keep looking its best.' },
        { title: 'Discuss the details', text: 'We’ll talk through your space, the service, and what makes sense next.' },
        { title: 'Keep in touch', text: 'Get in touch directly with our team as your outdoor needs change.' },
      ],
    },
    gallery: {
      heroKicker: 'A little inspiration',
      heroTitle: 'The outdoors,',
      heroTitleAccent: 'well cared for.',
      heroText: 'Take a look at landscaping, masonry, and outdoor living projects completed by Estrada Landscaping.',
      kicker: 'Our work',
      title: 'Every yard has',
      titleSecond: 'its own story.',
      intro: 'From freshly striped lawns to custom patios and stonework, explore projects completed by our crew.',
      filterLabel: 'Filter gallery by service',
      shareLink: 'Share this gallery',
      linkCopied: 'Gallery link copied.',
      linkShared: 'Gallery link shared.',
      shareCancelled: 'Sharing was canceled.',
      shareFailed: 'Could not share or copy the gallery link.',
      resultsShowing: 'Showing',
      resultSingular: 'project',
      resultPlural: 'projects',
      reviewPhotos: 'Photos needing category review:',
      viewer: {
        dialogLabel: 'Photo viewer',
        openImage: 'View full-size photo:',
        close: 'Close photo viewer',
        previous: 'Previous photo',
        next: 'Next photo',
        position: 'of',
      },
    },
    contact: {
      heroKicker: 'Let’s talk',
      heroTitle: 'Tell us about',
      heroTitleAccent: 'your outdoor space.',
      heroText: 'Have a question or a yard that could use some care? Reach out directly. We’re happy to start with a conversation.',
      getInTouch: 'Get in touch',
      cardTitle: 'We’re easy to reach.',
      cardText: 'Free estimates within 30 miles of Coatesville. Call Norberto or message the team. Licensed and insured.',
      callUs: 'Call Norberto',
      homeBase: 'Visit our home base',
      whatsapp: 'WhatsApp',
      messageCrew: 'Message our crew directly',
      serving: 'Serving',
      serviceArea: 'Coatesville, Thorndale, Downingtown, Parkesburg, West Chester, and nearby communities',
      licensedInsured: 'Licensed & insured',
      satisfactionGuarantee: '100% customer satisfaction guaranteed',
      facebookQrTitle: 'Find us on Facebook',
      facebookQrText: 'Scan the code to visit our Facebook page.',
      facebookQrAlt: 'QR code linking to Estrada Landscaping on Facebook',
      quoteKicker: 'Quote request',
      quoteTitle: 'What can we help with?',
      quoteIntro: 'Share a few details and we’ll open a WhatsApp message addressed to our team. You can review and send it there.',
      yourName: 'Your name',
      namePlaceholder: 'How should we address you?',
      phoneNumber: 'Phone number',
      phonePlaceholder: 'Best number to reach you',
      serviceInterest: 'What are you interested in?',
      servicePlaceholder: 'Choose a service (optional)',
      serviceOptions: [
        { value: 'lawn', label: 'Lawn care' },
        { value: 'mulching', label: 'Mulching' },
        { value: 'pruning', label: 'Pruning' },
        { value: 'planting', label: 'Planting' },
        { value: 'hardscaping', label: 'Hardscaping' },
        { value: 'patios', label: 'Patios' },
        { value: 'pavers', label: 'Pavers' },
        { value: 'walkways', label: 'Walkways' },
        { value: 'stonework', label: 'Stonework' },
        { value: 'fireplaces', label: 'Fireplaces' },
        { value: 'outdoor-kitchens', label: 'Outdoor kitchens' },
        { value: 'junk-removal', label: 'Junk removal' },
        { value: 'other', label: 'Something else / not sure' },
      ],
      notSure: 'Not sure yet',
      projectDetails: 'A little about your project',
      detailsPlaceholder: 'What would you like help with?',
      continueWhatsApp: 'Continue in WhatsApp',
      formHelp: 'This form prepares a message in WhatsApp; it does not send anything to a backend. You’ll review and send the message yourself.',
      submitted: 'WhatsApp should open in a new tab so you can review your message.',
      whatsAppGreeting: 'Hi Estrada Landscaping team! I’d love to talk about my outdoor space.',
      quoteGreeting: 'Hi Estrada Landscaping team! I’d like to request a free estimate.',
      quoteService: 'Service of interest',
      project: 'Project details',
      contactFallback: 'I’d like to discuss my outdoor space.',
      directKicker: 'Direct and neighborly',
      directTitle: 'You’ll talk to the people who do the work.',
      directText: 'Questions are welcome. Tell us what you’re picturing, what you’re working with, or what’s been bothering you about the yard. We’ll start there.',
      callButton: 'Call',
    },
    notFound: {
      kicker: 'Well, this is a new patch',
      title: 'We can’t find',
      titleAccent: 'that page.',
      text: 'The page may have moved. Let’s get you back to the garden.',
      back: 'Back to home',
    },
  },
  es: {
    serviceMessage: 'Cuidado cercano para los espacios que llamamos hogar',
    nav: { home: 'Inicio', about: 'Nosotros', services: 'Servicios', gallery: 'Galería', contact: 'Contacto' },
    mainNav: 'Navegación principal',
    languageLabel: 'Elegir idioma',
    languageEnglish: 'Cambiar idioma a inglés',
    languageSpanish: 'Cambiar idioma a español',
    headerCta: 'Hablemos',
    footerBlurb: 'Un equipo local de jardinería para disfrutar cada día de un espacio exterior bien cuidado.',
    footerLinks: 'Explora el sitio',
    footerHello: 'Contáctanos',
    footerWhatsApp: 'Escríbenos por WhatsApp',
    footerRooted: 'Con raíces en Coatesville, Pensilvania',
    chatButton: 'Chatea con nuestro equipo',
    chatAria: 'Chatea con Estrada Landscaping por WhatsApp',
    home: {
      heroKicker: 'Tu equipo local de jardinería',
      heroTitle: 'Un poco más de',
      heroTitleAccent: 'vida al aire libre.',
      heroIntro: 'Cuidado atento del césped y el jardín, aquí mismo en Coatesville. Ayudamos a que el exterior de tu hogar sea tan acogedor como el interior.',
      talkYard: 'Hablemos de tu jardín',
      exploreServices: 'Ver servicios',
      heroNote: 'Estimados gratis · Coatesville, Thorndale, Downingtown y Parkesburg',
      local: 'Local',
      roots: 'con raíces',
      videosKicker: 'Un vistazo al trabajo',
      videosTitle: 'Cuidado que puedes',
      videosTitleSecond: 'ver cómo toma forma.',
      videosIntro: 'Desde un borde bien definido hasta un nuevo arriate, los pequeños detalles hacen que un espacio se sienta cuidado. Aquí tienes ideas de lo que puede ser el cuidado exterior.',
      sampleFootage: 'Video ilustrativo de muestra; no es un proyecto confirmado de Estrada Landscaping.',
      videoReplaceNote: 'Estos videos públicos son de muestra y pueden reemplazarse por videos de tus propios proyectos.',
      videos: [
        { title: 'Un césped recién cuidado', tag: 'Cuidado del césped' },
        { title: 'Un espacio para crecer', tag: 'Detalles del jardín' },
        { title: 'El toque final', tag: 'Cuidado exterior' },
      ],
      welcomeKicker: 'Buenos vecinos, buen trabajo',
      welcomeTitle: 'Creemos que el hogar',
      welcomeTitleSecond: 'también está afuera.',
      welcomeText: 'Tu espacio exterior merece el mismo cuidado que el resto de tu hogar. Hablamos con claridad, escuchamos lo que te importa y trabajamos con esmero desde el primer corte hasta la última hoja.',
      values: ['Comunicación clara y directa', 'Un equipo al que puedes contactar', 'Con licencia y asegurados', 'Satisfacción del cliente garantizada al 100%', 'Cuidado adaptado a tu espacio', 'Orgullosamente de Coatesville'],
      aboutButton: 'Conócenos',
      planKicker: 'Sencillo desde el inicio',
      planTitle: 'Un buen plan.',
      planTitleSecond: 'Un jardín bien cuidado.',
      planIntro: 'Sin dudas sobre a quién llamar ni qué sigue. Mantenemos el proceso sencillo, cercano y fácil de entender.',
      steps: [
        { title: 'Cuéntanos qué necesitas', text: 'Llama, escríbenos o solicita un estimado. Cuéntanos un poco sobre tu espacio y lo que tienes en mente.' },
        { title: 'Hablemos de los detalles', text: 'Nos comunicaremos directamente, escucharemos lo que te importa y conversaremos sobre el siguiente paso para tu jardín.' },
        { title: 'Dejémoslo bien cuidado', text: 'Nuestro equipo trabajará con atención a los detalles que hacen que tu espacio exterior se sienta tuyo.' },
      ],
    },
    cta: { title: '¿Listo para disfrutar más del exterior?', text: 'Hablemos de lo que necesita tu jardín.', button: 'Iniciar conversación' },
    about: {
      heroKicker: 'Un poco sobre nosotros',
      heroTitle: 'Buen trabajo,',
      heroTitleAccent: 'cerca de casa.',
      heroText: 'Estrada Landscaping Professional Inc. es una compañía local de jardinería que presta servicios en Coatesville, Pensilvania y las comunidades cercanas.',
      storyKicker: 'La forma de trabajar de Estrada',
      storyTitle: 'Queremos que cuidar el exterior sea fácil.',
      storyText: 'Un buen trabajo de jardinería no solo se trata de cómo luce el patio. También importa poder hablar con el equipo, saber qué esperar y sentir confianza en el cuidado de tu hogar.',
      storyTextSecond: 'Somos un equipo local de Coatesville. Ya sea que necesites cuidado regular del césped, renovar un arriate o una limpieza de temporada, estamos listos para escucharte y trabajar contigo.',
      principles: [
        ['Un contacto local', 'Hablar directamente con quienes hacen el trabajo facilita todo.'],
        ['Cuidado práctico y atento', 'Adaptamos el trabajo a las necesidades de tu hogar y espacio exterior.'],
        ['Un resultado acogedor', 'La meta es sencilla: un jardín bien cuidado y agradable al volver a casa.'],
      ],
      hello: 'Contáctanos',
      neighborhoodKicker: 'Parte del vecindario',
      neighborhoodTitle: 'Coatesville es nuestro hogar.',
      neighborhoodText: 'Nos enorgullece servir a nuestra comunidad desde Virginia Avenue. Sabemos lo que vale una entrada acogedora, un césped ordenado y un lugar para disfrutar el aire fresco.',
      neighborhoodTextSecond: '¿Tienes un proyecto en mente? Cuéntanos lo que imaginas y empezaremos conversando.',
      mapButton: 'Encuentra nuestra zona',
    },
    services: {
      heroKicker: 'Cómo podemos ayudar',
      heroTitle: 'Cuidado para cada',
      heroTitleAccent: 'rincón exterior.',
      heroText: 'Servicios generales de jardinería y paisajismo con estructuras, con estimados gratis para tu proyecto.',
      kicker: 'Nuestros servicios',
      title: 'El cuidado ideal',
      titleSecond: 'para tu hogar.',
      intro: 'Cada jardín es diferente. Cuéntanos qué te gustaría mejorar y conversemos sobre las opciones. Ofrecemos estimados gratis dentro de 30 millas de Coatesville.',
      items: [
        { title: 'Césped y jardín', text: 'Cuidado del césped, mantillo, poda y plantación para mantener tus espacios exteriores cuidados.' },
        { title: 'Paisajismo con estructuras', text: 'Patios, adoquines, senderos y trabajos en piedra para darle estructura duradera a tu jardín.' },
        { title: 'Chimeneas y cocinas exteriores', text: 'Chimeneas y cocinas exteriores para crear un espacio acogedor donde reunirse.' },
        { title: 'Retiro de artículos', text: 'Ahora ofrecemos retiro de artículos y desechos. Contacta a Norberto para conversar sobre lo que necesitas retirar.' },
      ],
      licensedInsured: 'Con licencia y asegurados',
      satisfactionGuarantee: 'Satisfacción del cliente garantizada al 100%',
      serviceNumber: 'Servicio',
      questionTitle: '¿No sabes por dónde empezar?',
      questionText: 'Para eso es la conversación. Cuéntanos qué necesita tu jardín.',
      askService: 'Consultar un servicio',
      processKicker: 'Sencillo en cada paso',
      processTitle: 'El cuidado comienza',
      processTitleSecond: 'escuchándote.',
      steps: [
        { title: 'Comparte tus ideas', text: 'Cuéntanos qué te gustaría cambiar o qué quieres mantener en buen estado.' },
        { title: 'Hablemos de los detalles', text: 'Conversaremos sobre tu espacio, el servicio y el siguiente paso más conveniente.' },
        { title: 'Mantengámonos en contacto', text: 'Comunícate directamente con nuestro equipo cuando cambien tus necesidades.' },
      ],
    },
    gallery: {
      heroKicker: 'Un poco de inspiración',
      heroTitle: 'El exterior,',
      heroTitleAccent: 'bien cuidado.',
      heroText: 'Conoce proyectos de paisajismo, mampostería y espacios al aire libre realizados por Estrada Landscaping.',
      kicker: 'Nuestros proyectos',
      title: 'Cada jardín tiene',
      titleSecond: 'su propia historia.',
      intro: 'Desde céspedes recién cortados hasta patios y trabajos de piedra, explora proyectos realizados por nuestro equipo.',
      filterLabel: 'Filtrar galería por servicio',
      shareLink: 'Compartir esta galería',
      linkCopied: 'Enlace de la galería copiado.',
      linkShared: 'Enlace de la galería compartido.',
      shareCancelled: 'Se canceló el envío.',
      shareFailed: 'No se pudo compartir ni copiar el enlace de la galería.',
      resultsShowing: 'Mostrando',
      resultSingular: 'proyecto',
      resultPlural: 'proyectos',
      reviewPhotos: 'Fotos que necesitan revisión de categoría:',
      viewer: {
        dialogLabel: 'Visor de fotos',
        openImage: 'Ver foto en tamaño completo:',
        close: 'Cerrar el visor de fotos',
        previous: 'Foto anterior',
        next: 'Foto siguiente',
        position: 'de',
      },
    },
    contact: {
      heroKicker: 'Hablemos',
      heroTitle: 'Cuéntanos sobre',
      heroTitleAccent: 'tu espacio exterior.',
      heroText: '¿Tienes una pregunta o un jardín que necesita atención? Escríbenos directamente. Con gusto empezamos conversando.',
      getInTouch: 'Ponte en contacto',
      cardTitle: 'Estamos para ayudarte.',
      cardText: 'Estimados gratis dentro de 30 millas de Coatesville. Llama a Norberto o escribe al equipo. Con licencia y asegurados.',
      callUs: 'Llama a Norberto',
      homeBase: 'Nuestra dirección',
      whatsapp: 'WhatsApp',
      messageCrew: 'Escribe directamente al equipo',
      serving: 'Zona de servicio',
      serviceArea: 'Coatesville, Thorndale, Downingtown, Parkesburg, West Chester y comunidades cercanas',
      licensedInsured: 'Con licencia y asegurados',
      satisfactionGuarantee: 'Satisfacción del cliente garantizada al 100%',
      facebookQrTitle: 'Encuéntranos en Facebook',
      facebookQrText: 'Escanea el código para visitar nuestra página de Facebook.',
      facebookQrAlt: 'Código QR para visitar Estrada Landscaping en Facebook',
      quoteKicker: 'Solicita un estimado',
      quoteTitle: '¿En qué podemos ayudarte?',
      quoteIntro: 'Cuéntanos algunos detalles y prepararemos un mensaje de WhatsApp para nuestro equipo. Allí podrás revisarlo y enviarlo.',
      yourName: 'Tu nombre',
      namePlaceholder: '¿Cómo te llamas?',
      phoneNumber: 'Número de teléfono',
      phonePlaceholder: 'El mejor número para contactarte',
      serviceInterest: '¿Qué servicio te interesa?',
      servicePlaceholder: 'Elige un servicio (opcional)',
      serviceOptions: [
        { value: 'lawn', label: 'Cuidado del césped' },
        { value: 'mulching', label: 'Mantillo' },
        { value: 'pruning', label: 'Poda' },
        { value: 'planting', label: 'Plantación' },
        { value: 'hardscaping', label: 'Paisajismo con estructuras' },
        { value: 'patios', label: 'Patios' },
        { value: 'pavers', label: 'Adoquines' },
        { value: 'walkways', label: 'Senderos' },
        { value: 'stonework', label: 'Trabajos en piedra' },
        { value: 'fireplaces', label: 'Chimeneas' },
        { value: 'outdoor-kitchens', label: 'Cocinas exteriores' },
        { value: 'junk-removal', label: 'Retiro de artículos y desechos' },
        { value: 'other', label: 'Otro / todavía no estoy seguro' },
      ],
      notSure: 'Aún no estoy seguro',
      projectDetails: 'Cuéntanos un poco sobre tu proyecto',
      detailsPlaceholder: '¿En qué te gustaría recibir ayuda?',
      continueWhatsApp: 'Continuar por WhatsApp',
      formHelp: 'Este formulario prepara un mensaje en WhatsApp; no lo envía a un servidor. Podrás revisarlo y enviarlo tú mismo.',
      submitted: 'WhatsApp debería abrirse en una pestaña nueva para que revises tu mensaje.',
      whatsAppGreeting: '¡Hola, equipo de Estrada Landscaping! Me gustaría conversar sobre mi espacio exterior.',
      quoteGreeting: '¡Hola, equipo de Estrada Landscaping! Quisiera solicitar un estimado gratis.',
      quoteService: 'Servicio que me interesa',
      project: 'Detalles del proyecto',
      contactFallback: 'Me gustaría conversar sobre mi espacio exterior.',
      directKicker: 'Cercanos y directos',
      directTitle: 'Hablarás con quienes hacen el trabajo.',
      directText: 'Nos encantan las preguntas. Cuéntanos qué tienes en mente, con qué cuentas o qué te gustaría cambiar de tu jardín. Empecemos por ahí.',
      callButton: 'Llamar',
    },
    notFound: {
      kicker: 'Parece que este rincón es nuevo',
      title: 'No encontramos',
      titleAccent: 'esa página.',
      text: 'Es posible que la página se haya movido. Volvamos al jardín.',
      back: 'Volver al inicio',
    },
  },
} as const;

type Language = keyof typeof copy;
const LanguageContext = createContext<{ language: Language; setLanguage: (language: Language) => void }>({
  language: 'en',
  setLanguage: () => undefined,
});
const useLanguage = () => useContext(LanguageContext);

function whatsAppUrl(message: string) {
  return `https://wa.me/14845106701?text=${encodeURIComponent(message)}`;
}

const videoMedia = [
  { url: 'https://videos.pexels.com/video-files/12215822/12215822-hd_1920_1080_60fps.mp4', image: photo('1416879595882-3373a0480b5b', 900) },
  { url: 'https://videos.pexels.com/video-files/3078390/3078390-hd_1280_720_30fps.mp4', image: photo('1585320806297-9794b3e4eeae', 800) },
  { url: 'https://videos.pexels.com/video-files/7655570/7655570-hd_1280_720_25fps.mp4', image: photo('1501004318641-b39e6451bec6', 800) },
];
const galleryPhotos = [
  { file: 'estrada-01.jpg', label: { en: 'Lawn striping', es: 'Franjas en el césped' }, alt: { en: 'Freshly mowed lawn with crisp stripes across a large green yard', es: 'Césped recién cortado con franjas definidas en un amplio jardín verde' } },
  { file: 'estrada-02.jpg', label: { en: 'New garden steps', es: 'Nuevos escalones de jardín' }, alt: { en: 'New timber steps and paver landing along a sloped front yard', es: 'Nuevos escalones de madera y descanso de adoquines en un jardín inclinado' } },
  { file: 'estrada-03.jpg', label: { en: 'Stone steps and walkway', es: 'Escalones y camino de piedra' }, alt: { en: 'Stone walkway and timber steps connecting a home to the street', es: 'Camino de piedra y escalones de madera que conectan una casa con la calle' } },
  { file: 'estrada-04.jpg', label: { en: 'Outdoor masonry in progress', es: 'Trabajo de mampostería en proceso' }, alt: { en: 'Masonry fireplace structure being built beside a backyard patio', es: 'Construcción de una chimenea de mampostería junto a un patio trasero' } },
  { file: 'estrada-05.jpg', label: { en: 'Covered patio fireplace', es: 'Chimenea en patio cubierto' }, alt: { en: 'Finished stone fireplace beneath a covered patio with pavers', es: 'Chimenea de piedra terminada bajo un patio cubierto con adoquines' } },
  { file: 'estrada-06.jpg', label: { en: 'Stone patio detail', es: 'Detalle de patio de piedra' }, alt: { en: 'Stonework and paved outdoor seating area in a landscaped yard', es: 'Mampostería y área exterior pavimentada en un jardín paisajístico' } },
  { file: 'estrada-07.jpg', label: { en: 'Patio and stone wall', es: 'Patio y muro de piedra' }, alt: { en: 'Paver patio with a low stone seating wall and green lawn', es: 'Patio de adoquines con un muro bajo de piedra y césped verde' } },
  { file: 'estrada-08.jpg', label: { en: 'Curved retaining wall', es: 'Muro de contención curvo' }, alt: { en: 'Curved stone retaining wall bordering a spacious paver patio', es: 'Muro curvo de contención de piedra junto a un amplio patio de adoquines' } },
  { file: 'estrada-09.jpg', label: { en: 'Paver patio', es: 'Patio de adoquines' }, alt: { en: 'Newly installed paver patio beside a home', es: 'Patio de adoquines recién instalado junto a una casa' } },
  { file: 'estrada-10.jpg', label: { en: 'Stone walkway', es: 'Camino de piedra' }, alt: { en: 'Paved side walkway and landscaped border beside a home', es: 'Camino lateral pavimentado y borde paisajístico junto a una casa' } },
  { file: 'estrada-11.jpg', label: { en: 'Curved stonework', es: 'Mampostería curva' }, alt: { en: 'Curved stone wall following the edge of a backyard patio', es: 'Muro curvo de piedra que bordea un patio trasero' } },
  { file: 'estrada-12.jpg', label: { en: 'Outdoor stone kitchen', es: 'Cocina exterior de piedra' }, alt: { en: 'Stone outdoor kitchen and fireplace under a pergola', es: 'Cocina exterior y chimenea de piedra bajo una pérgola' } },
  { file: 'estrada-13.jpg', label: { en: 'Stone fireplace', es: 'Chimenea de piedra' }, alt: { en: 'Outdoor stone fireplace framed by landscaped greenery', es: 'Chimenea exterior de piedra rodeada de vegetación paisajística' } },
  { file: 'estrada-14.jpg', label: { en: 'Patio fireplace', es: 'Chimenea en el patio' }, alt: { en: 'Stone fireplace and built-in outdoor kitchen beneath a pergola', es: 'Chimenea de piedra y cocina exterior integrada bajo una pérgola' } },
  { file: 'estrada-15.jpg', label: { en: 'Custom stonework', es: 'Trabajo de piedra personalizado' }, alt: { en: 'Masonry work underway on a tall outdoor stone feature', es: 'Trabajo de mampostería en curso en una estructura exterior alta de piedra' } },
  { file: 'estrada-16.jpg', label: { en: 'Chimney construction', es: 'Construcción de chimenea' }, alt: { en: 'Stone chimney and fireplace masonry being built beside a home', es: 'Construcción de chimenea y mampostería junto a una casa' } },
  { file: 'estrada-17.jpg', label: { en: 'Finished outdoor fireplace', es: 'Chimenea exterior terminada' }, alt: { en: 'Completed stone fireplace with a paved outdoor sitting area', es: 'Chimenea de piedra terminada con un área exterior pavimentada' } },
  { file: 'estrada-18.jpg', label: { en: 'Fireplace and patio', es: 'Chimenea y patio' }, alt: { en: 'Stone fireplace and paver patio at the edge of a garden', es: 'Chimenea de piedra y patio de adoquines junto a un jardín' } },
  { file: 'estrada-19.jpg', label: { en: 'Outdoor living space', es: 'Espacio exterior para disfrutar' }, alt: { en: 'Finished outdoor living area with stone fireplace and curved patio wall', es: 'Área exterior terminada con chimenea de piedra y muro curvo de patio' } },
  { file: 'estrada-20.jpg', label: { en: 'Tree removal and yard cleanup', es: 'Retiro de árbol y limpieza del jardín' }, alt: { en: 'Crew removing a tree and clearing branches from a residential yard', es: 'Equipo retirando un árbol y limpiando ramas de un jardín residencial' } },
  { file: 'estrada-21.jpg', label: { en: 'Paver walkway beside the home', es: 'Camino de adoquines junto a la casa' }, alt: { en: 'Paver walkway leading to a home entrance through a landscaped yard', es: 'Camino de adoquines hacia la entrada de una casa entre jardines' } },
  { file: 'estrada-22.jpg', label: { en: 'Tree pruning work', es: 'Poda de árboles' }, alt: { en: 'Worker pruning tree branches above a covered patio', es: 'Trabajador podando ramas de un árbol sobre un patio cubierto' } },
  { file: 'estrada-23.jpg', label: { en: 'Curved garden path and planting', es: 'Camino curvo y plantas de jardín' }, alt: { en: 'Curved garden path bordered by leafy plants and a brick wall', es: 'Camino curvo de jardín rodeado de plantas y un muro de ladrillo' } },
  { file: 'estrada-24.jpg', label: { en: 'Front yard landscaping', es: 'Paisajismo de jardín delantero' }, alt: { en: 'Residential front yard with a curved planting bed and shrubs', es: 'Jardín delantero residencial con arriate curvo y arbustos' } },
  { file: 'estrada-25.jpg', label: { en: 'Clean gravel border', es: 'Borde limpio de grava' }, alt: { en: 'Fresh gravel border along the side of a home', es: 'Borde de grava recién terminado junto al costado de una casa' } },
  { file: 'estrada-26.jpg', label: { en: 'Garden walkway', es: 'Camino de jardín' }, alt: { en: 'Straight walkway bordered by stone edging, mulch, and shrubs', es: 'Camino recto con bordes de piedra, mantillo y arbustos' } },
  { file: 'estrada-27.jpg', label: { en: 'Fresh mulch and walkway', es: 'Mantillo nuevo y camino' }, alt: { en: 'Garden walkway bordered by fresh mulch and neatly trimmed shrubs', es: 'Camino de jardín junto a mantillo nuevo y arbustos bien podados' } },
  { file: 'estrada-28.jpg', label: { en: 'Lawn care equipment', es: 'Equipo para el cuidado del césped' }, alt: { en: 'Lawn care equipment ready for work in a residential yard', es: 'Equipo de jardinería listo para trabajar en un jardín residencial' } },
  { file: 'estrada-29.jpg', label: { en: 'A wide green lawn', es: 'Amplio césped verde' }, alt: { en: 'Large green residential lawn bordered by mature trees', es: 'Amplio césped residencial rodeado de árboles maduros' } },
  { file: 'estrada-30.jpg', label: { en: 'Tree planting project', es: 'Proyecto de plantación de árbol' }, alt: { en: 'A young tree and prepared planting area in a residential yard', es: 'Árbol joven y área preparada para plantar en un jardín residencial' } },
  { file: 'estrada-31.jpg', label: { en: 'Mulch bed and edging', es: 'Arriate con mantillo y borde' }, alt: { en: 'Freshly edged landscape bed beside a driveway and lawn', es: 'Arriate con bordes definidos junto a una entrada y césped' } },
  { file: 'estrada-32.jpg', label: { en: 'Front yard landscaping', es: 'Paisajismo del jardín delantero' }, alt: { en: 'Residential front yard with a curved planting bed around a tree', es: 'Jardín delantero residencial con un arriate curvo alrededor de un árbol' } },
  { file: 'estrada-33.jpg', label: { en: 'Stone fireplace', es: 'Chimenea de piedra' }, alt: { en: 'Tall stone outdoor fireplace beside a paved patio', es: 'Chimenea exterior alta de piedra junto a un patio pavimentado' } },
  { file: 'estrada-34.jpg', label: { en: 'Curved stone retaining wall', es: 'Muro curvo de contención de piedra' }, alt: { en: 'Curved stone retaining wall being built around a backyard patio', es: 'Muro curvo de contención de piedra en construcción alrededor de un patio trasero' } },
  { file: 'estrada-35.jpg', label: { en: 'Curved patio and stone walls', es: 'Patio curvo y muros de piedra' }, alt: { en: 'Curved paver patio surrounded by low stone retaining walls', es: 'Patio curvo de adoquines rodeado de muros bajos de contención de piedra' } },
  { file: 'estrada-36.jpg', label: { en: 'Finished curved patio', es: 'Patio curvo terminado' }, alt: { en: 'Finished curved paver patio with matching stone retaining walls', es: 'Patio curvo de adoquines terminado con muros de contención de piedra' } },
  { file: 'estrada-37.jpg', label: { en: 'Stone wall construction', es: 'Construcción de muro de piedra' }, alt: { en: 'Masonry worker building a low block wall in a backyard', es: 'Trabajador de mampostería construyendo un muro bajo de bloques en un patio' } },
  { file: 'estrada-38.jpg', label: { en: 'Curved paver patio', es: 'Patio curvo de adoquines' }, alt: { en: 'Curved paver patio with a stone seating wall beside a home', es: 'Patio curvo de adoquines con muro de piedra junto a una casa' } },
  { file: 'estrada-39.jpg', label: { en: 'Patio and outdoor stonework', es: 'Patio y mampostería exterior' }, alt: { en: 'Paved outdoor sitting area with a raised stone feature', es: 'Área exterior pavimentada con una estructura elevada de piedra' } },
  { file: 'estrada-40.jpg', label: { en: 'Outdoor fireplace and pavers', es: 'Chimenea exterior y adoquines' }, alt: { en: 'Stone outdoor fireplace beside a paved patio and low wall', es: 'Chimenea exterior de piedra junto a un patio pavimentado y muro bajo' } },
  { file: 'estrada-41.jpg', label: { en: 'Stone patio detail', es: 'Detalle de patio de piedra' }, alt: { en: 'Stone-paved patio with a circular built-in outdoor feature', es: 'Patio de piedra con una estructura circular integrada para exteriores' } },
  { file: 'estrada-42.jpg', label: { en: 'Paver walkway installation', es: 'Instalación de camino de adoquines' }, alt: { en: 'Paver walkway being installed beside a residential driveway', es: 'Instalación de camino de adoquines junto a la entrada de una casa' } },
  { file: 'estrada-43.jpg', label: { en: 'Retaining wall and steps', es: 'Muro de contención y escalones' }, alt: { en: 'Stone retaining wall and steps being built into a landscaped slope', es: 'Construcción de muro de contención y escalones de piedra en una pendiente ajardinada' } },
  { file: 'estrada-44.jpg', label: { en: 'Garden wall and steps', es: 'Muro de jardín y escalones' }, alt: { en: 'Finished stone retaining wall with planting beds and steps', es: 'Muro de contención de piedra terminado con arriates y escalones' } },
  { file: 'estrada-45.jpg', label: { en: 'Raised stone garden beds', es: 'Arriates elevados de piedra' }, alt: { en: 'Raised stone planting beds arranged around a paved outdoor area', es: 'Arriates elevados de piedra alrededor de un área exterior pavimentada' } },
  { file: 'estrada-46.jpg', label: { en: 'Stone fireplace detail', es: 'Detalle de chimenea de piedra' }, alt: { en: 'Tall stone fireplace with a paved patio in the background', es: 'Chimenea alta de piedra con un patio pavimentado al fondo' } },
  { file: 'estrada-47.jpg', label: { en: 'Outdoor fireplace project', es: 'Proyecto de chimenea exterior' }, alt: { en: 'Stone fireplace and paver patio as part of an outdoor living project', es: 'Chimenea de piedra y patio de adoquines como parte de un proyecto exterior' } },
  { file: 'estrada-48.jpg', label: { en: 'Curved stone walkway', es: 'Camino curvo de piedra' }, alt: { en: 'Curved walkway with large stone pavers and brick edging', es: 'Camino curvo con losas de piedra y bordes de ladrillo' } },
  { file: 'estrada-49.jpg', label: { en: 'Round stone fire pit', es: 'Fogón circular de piedra' }, alt: { en: 'Round stone fire pit set into a paved backyard patio', es: 'Fogón circular de piedra integrado en un patio trasero pavimentado' } },
  { file: 'estrada-50.jpg', label: { en: 'Built-in fire pit seating', es: 'Asientos con fogón integrado' }, alt: { en: 'Stone fire pit with built-in seating in a backyard', es: 'Fogón de piedra con asientos integrados en un patio trasero' } },
  { file: 'estrada-51.jpg', label: { en: 'Outdoor fireplace under construction', es: 'Chimenea exterior en construcción' }, alt: { en: 'Masonry crew building a tall stone outdoor fireplace', es: 'Equipo de mampostería construyendo una chimenea exterior alta de piedra' } },
  { file: 'estrada-52.jpg', label: { en: 'Finished stone fireplace', es: 'Chimenea de piedra terminada' }, alt: { en: 'Completed stone fireplace with built-in benches and a paved patio', es: 'Chimenea de piedra terminada con bancos integrados y patio pavimentado' } },
  { file: 'estrada-53.jpg', label: { en: 'Stone patio and fireplace', es: 'Patio de piedra y chimenea' }, alt: { en: 'Stone patio with an outdoor fireplace and circular fire feature', es: 'Patio de piedra con chimenea exterior y fogón circular' } },
  { file: 'estrada-54.jpg', label: { en: 'Brick garden walkway', es: 'Camino de ladrillo en el jardín' }, alt: { en: 'Red brick walkway with stone edging leading through a garden', es: 'Camino de ladrillo rojo con bordes de piedra que atraviesa un jardín' } },
  { file: 'estrada-55.jpg', label: { en: 'Garden path detail', es: 'Detalle de camino de jardín' }, alt: { en: 'Brick path and paver steps laid through a sloped yard', es: 'Camino de ladrillo y escalones de adoquines en un jardín inclinado' } },
  { file: 'estrada-56.jpg', label: { en: 'Paver walkway beside the home', es: 'Camino de adoquines junto a la casa' }, alt: { en: 'Finished paver walkway alongside a home and landscaped planting bed', es: 'Camino de adoquines terminado junto a una casa y un arriate' } },
  { file: 'estrada-57.jpg', label: { en: 'Natural stone patio', es: 'Patio de piedra natural' }, alt: { en: 'Natural flagstone patio with irregular stone shapes', es: 'Patio de losas de piedra natural con formas irregulares' } },
  { file: 'estrada-58.jpg', label: { en: 'Outdoor stone feature', es: 'Estructura exterior de piedra' }, alt: { en: 'Stonework detail in a landscaped outdoor living area', es: 'Detalle de mampostería en un espacio exterior ajardinado' } },
  { file: 'estrada-59.jpg', label: { en: 'Stone retaining wall and fireplace', es: 'Muro de contención y chimenea de piedra' }, alt: { en: 'Long stone retaining wall with an outdoor fireplace beside a home', es: 'Muro largo de contención de piedra con chimenea exterior junto a una casa' } },
  { file: 'estrada-60.jpg', label: { en: 'Freestanding stone fireplace', es: 'Chimenea independiente de piedra' }, alt: { en: 'Freestanding stone fireplace centered in a paved outdoor space', es: 'Chimenea independiente de piedra en un espacio exterior pavimentado' } },
  { file: 'estrada-61.jpg', label: { en: 'Landscaped home entrance', es: 'Entrada de casa con paisajismo' }, alt: { en: 'Paver walkway leading to a home entrance through landscaped garden beds', es: 'Camino de adoquines hacia una entrada rodeada de arriates ajardinados' } },
  { file: 'estrada-62.jpg', label: { en: 'Paver driveway', es: 'Entrada de adoquines' }, alt: { en: 'Broad paved driveway with a clean curved edge', es: 'Amplia entrada pavimentada con un borde curvo y definido' } },
  { file: 'estrada-63.jpg', label: { en: 'Covered outdoor kitchen', es: 'Cocina exterior techada' }, alt: { en: 'Covered outdoor kitchen with stone counters and a paved patio', es: 'Cocina exterior techada con encimeras de piedra y patio pavimentado' } },
  { file: 'estrada-64.jpg', label: { en: 'Curved paver walkway', es: 'Camino curvo de adoquines' }, alt: { en: 'Curved paver walkway with a dark stone border', es: 'Camino curvo de adoquines con borde oscuro de piedra' } },
  { file: 'estrada-65.jpg', label: { en: 'Stone outdoor kitchen and patio', es: 'Cocina exterior de piedra y patio' }, alt: { en: 'Stone outdoor kitchen and seating area beside a home', es: 'Cocina exterior de piedra y área para sentarse junto a una casa' } },
  { file: 'estrada-66.jpg', label: { en: 'Covered patio project', es: 'Proyecto de patio techado' }, alt: { en: 'Covered patio with stone outdoor kitchen and paved floor', es: 'Patio techado con cocina exterior de piedra y piso pavimentado' } },
  { file: 'estrada-67.jpg', label: { en: 'Flagstone patio', es: 'Patio de losas de piedra' }, alt: { en: 'Finished outdoor patio made with large natural flagstones', es: 'Patio exterior terminado con grandes losas de piedra natural' } },
  { file: 'estrada-68.jpg', label: { en: 'Brick paver walkway', es: 'Camino de adoquines de ladrillo' }, alt: { en: 'Brick paver walkway with a light stone border beside a home', es: 'Camino de adoquines de ladrillo con borde claro de piedra junto a una casa' } },
  { file: 'estrada-69.jpg', label: { en: 'Garden bed preparation', es: 'Preparación de arriate' }, alt: { en: 'Prepared garden bed beside a home with pavers ready for installation', es: 'Arriate preparado junto a una casa con adoquines listos para instalar' } },
  { file: 'estrada-70.jpg', label: { en: 'Paver patio with seating wall', es: 'Patio de adoquines con muro para sentarse' }, alt: { en: 'Finished paver patio bordered by a low stone seating wall', es: 'Patio de adoquines terminado con un muro bajo de piedra para sentarse' } },
  { file: 'estrada-71.jpg', label: { en: 'Patio beside the home', es: 'Patio junto a la casa' }, alt: { en: 'Paver patio and raised stone seating wall beside a home', es: 'Patio de adoquines y muro elevado de piedra junto a una casa' } },
  { file: 'estrada-72.jpg', label: { en: 'Outdoor kitchen and stonework', es: 'Cocina exterior y mampostería' }, alt: { en: 'Outdoor grill and stone counter built into a backyard patio', es: 'Parrilla exterior y encimera de piedra integradas en un patio trasero' } },
  { file: 'estrada-73.jpg', label: { en: 'Built-in outdoor grill', es: 'Parrilla exterior integrada' }, alt: { en: 'Stainless steel grill set into a custom stone outdoor kitchen island', es: 'Parrilla de acero inoxidable integrada en una isla de cocina exterior de piedra personalizada' } },
  { file: 'estrada-74.jpg', label: { en: 'Covered patio stonework', es: 'Mampostería de patio techado' }, alt: { en: 'Stone outdoor kitchen and paver patio beneath a raised deck', es: 'Cocina exterior de piedra y patio de adoquines bajo una terraza elevada' } },
  { file: 'estrada-75.jpg', label: { en: 'Covered paver patio', es: 'Patio techado de adoquines' }, alt: { en: 'Spacious paver patio beneath a covered deck beside a home', es: 'Amplio patio de adoquines bajo una terraza techada junto a una casa' } },
  { file: 'estrada-76.jpg', label: { en: 'Paver patio installation', es: 'Instalación de patio de adoquines' }, alt: { en: 'Paver floor being installed under a covered backyard deck', es: 'Instalación de piso de adoquines bajo una terraza trasera techada' } },
  { file: 'estrada-77.jpg', label: { en: 'Patio project in progress', es: 'Proyecto de patio en proceso' }, alt: { en: 'Worker laying pavers beneath a raised backyard deck', es: 'Trabajador colocando adoquines bajo una terraza trasera elevada' } },
  { file: 'estrada-78.jpg', label: { en: 'Paver walkway beside the home', es: 'Camino de adoquines junto a la casa' }, alt: { en: 'Long paver walkway alongside a home and fresh landscape bed', es: 'Largo camino de adoquines junto a una casa y un arriate recién preparado' } },
  { file: 'estrada-79.jpg', label: { en: 'Backyard patio work', es: 'Trabajo de patio trasero' }, alt: { en: 'Hardscape installation underway in a residential backyard', es: 'Instalación de superficies exteriores en proceso en un patio residencial' } },
  { file: 'estrada-80.jpg', label: { en: 'Stone garden edging', es: 'Borde de piedra para jardín' }, alt: { en: 'Low stone edging around a planting bed beside a covered patio', es: 'Borde bajo de piedra alrededor de un arriate junto a un patio techado' } },
  { file: 'estrada-81.jpg', label: { en: 'Landscape site preparation', es: 'Preparación del terreno' }, alt: { en: 'Compact loader preparing a residential yard for landscaping work', es: 'Minicargadora preparando un jardín residencial para trabajos de paisajismo' } },
  { file: 'estrada-82.jpg', label: { en: 'Front yard planting', es: 'Plantación en jardín delantero' }, alt: { en: 'Freshly landscaped planting beds at the front of a home', es: 'Arriates recién ajardinados frente a una casa' } },
  { file: 'estrada-83.jpg', label: { en: 'Tree and yard work', es: 'Trabajo en árboles y jardín' }, alt: { en: 'Crew member working near a mature tree in a residential yard', es: 'Trabajador realizando labores junto a un árbol maduro en un jardín residencial' } },
  { file: 'estrada-84.jpg', label: { en: 'Lawn and garden maintenance', es: 'Mantenimiento de césped y jardín' }, alt: { en: 'Yard maintenance beside a curved garden edge and large shrub', es: 'Mantenimiento del jardín junto a un borde curvo y un arbusto grande' } },
  { file: 'estrada-85.jpg', label: { en: 'Curved brick walkway', es: 'Camino curvo de ladrillo' }, alt: { en: 'Curved brick paver walkway bordered by garden beds and shrubs', es: 'Camino curvo de adoquines de ladrillo junto a arriates y arbustos' } },
  { file: 'estrada-86.jpg', label: { en: 'Garden bed installation', es: 'Instalación de arriate' }, alt: { en: 'Worker leveling a new garden bed beside a home', es: 'Trabajador nivelando un nuevo arriate junto a una casa' } },
  { file: 'estrada-87.jpg', label: { en: 'Yard drainage installation', es: 'Instalación de drenaje del jardín' }, alt: { en: 'Drainage trench and pipe being installed in a residential side yard', es: 'Zanja y tubería de drenaje en instalación en el jardín lateral de una casa' } },
  { file: 'estrada-88.jpg', label: { en: 'Yard drainage work in progress', es: 'Trabajo de drenaje del jardín en proceso' }, alt: { en: 'Corrugated drainage pipe staged beside a house during yard drainage work', es: 'Tubería corrugada junto a una casa durante trabajos de drenaje del jardín' } },
  { file: 'estrada-89.jpg', label: { en: 'Arched stone fire feature', es: 'Estructura arqueada de piedra para fuego' }, alt: { en: 'Close-up of a stone outdoor fireplace or oven with an arched opening and firewood', es: 'Primer plano de una chimenea u horno exterior de piedra con abertura arqueada y leña' } },
  { file: 'estrada-90.jpg', label: { en: 'Wood fence across the yard', es: 'Cerca de madera en el jardín' }, alt: { en: 'Wood post-and-rail fence running along a residential yard', es: 'Cerca de madera con postes y travesaños a lo largo de un jardín residencial' } },
  { file: 'estrada-91.jpg', label: { en: 'Fence corner detail', es: 'Detalle de esquina de cerca' }, alt: { en: 'Wood post-and-rail fence turning around the edge of a yard', es: 'Cerca de madera con postes y travesaños que rodea un jardín' } },
  { file: 'estrada-92.jpg', label: { en: 'Stone fireplace by the fence', es: 'Chimenea de piedra junto a la cerca' }, alt: { en: 'Freestanding stone outdoor fireplace with an arched opening beside a fence', es: 'Chimenea exterior independiente de piedra con abertura arqueada junto a una cerca' } },
  { file: 'estrada-93.jpg', label: { en: 'Arched stone fireplace detail', es: 'Detalle de chimenea arqueada de piedra' }, alt: { en: 'Stone outdoor fireplace and chimney with a close view of the arched firebox', es: 'Chimenea exterior y tiro de piedra con vista cercana de la cámara arqueada' } },
];

function SiteHeader() {
  const { language, setLanguage } = useLanguage();
  const t = copy[language];
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const navItems = [
    { href: '/', label: t.nav.home },
    { href: '/about', label: t.nav.about },
    { href: '/services', label: t.nav.services },
    { href: '/gallery', label: t.nav.gallery },
    { href: '/contact', label: t.nav.contact },
  ];
  return <>
    <div className="topline">
      <div className="wrap topline-inner">
        <span>{t.serviceMessage}</span>
        <a href={`tel:+14845106701`} data-testid="link-top-phone">Coatesville, PA&nbsp;&nbsp; · &nbsp;&nbsp;{PHONE}</a>
      </div>
    </div>
    <header className="header">
      <div className="wrap nav-inner">
        <Link href="/" className="brand" aria-label={`Estrada Landscaping Professional Inc. — ${t.nav.home}`} onClick={() => setOpen(false)}>
          <span className="brand-mark"><Leaf size={22} strokeWidth={1.8} /></span>
          <span className="brand-name">Estrada Landscaping<span>Professional Inc.</span></span>
        </Link>
        <nav className={`nav-links${open ? ' open' : ''}`} aria-label={t.mainNav}>
          {navItems.map((item) => <Link
            href={item.href}
            key={item.href}
            className={`nav-link${location === item.href ? ' active' : ''}`}
            aria-current={location === item.href ? 'page' : undefined}
            onClick={() => setOpen(false)}
            data-testid={`link-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`}
          >{item.label}</Link>)}
        </nav>
        <div className="nav-actions">
          <div className="language-toggle" role="group" aria-label={t.languageLabel}>
            <button type="button" onClick={() => setLanguage('en')} aria-pressed={language === 'en'} aria-label={t.languageEnglish} lang="en">EN</button>
            <button type="button" onClick={() => setLanguage('es')} aria-pressed={language === 'es'} aria-label={t.languageSpanish} lang="es">ES</button>
          </div>
          <Link href="/contact" className="nav-cta" onClick={() => setOpen(false)} data-testid="link-header-quote">
            {t.headerCta} <ArrowRight size={15} />
          </Link>
          <button className="mobile-toggle" type="button" aria-label={open ? (language === 'es' ? 'Cerrar menú' : 'Close navigation menu') : (language === 'es' ? 'Abrir menú' : 'Open navigation menu')} aria-expanded={open} onClick={() => setOpen(!open)} data-testid="button-mobile-menu">
            {open ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </div>
    </header>
  </>;
}

function Footer() {
  const { language } = useLanguage();
  const t = copy[language];
  const navItems = [
    { href: '/', label: t.nav.home },
    { href: '/about', label: t.nav.about },
    { href: '/services', label: t.nav.services },
    { href: '/gallery', label: t.nav.gallery },
    { href: '/contact', label: t.nav.contact },
  ];
  return <footer className="footer">
    <div className="wrap">
      <div className="footer-top">
        <div>
          <Link href="/" className="brand" aria-label="Estrada Landscaping home">
            <span className="brand-mark"><Leaf size={22} /></span>
            <span className="brand-name">Estrada Landscaping<span>Professional Inc.</span></span>
          </Link>
          <p className="footer-blurb">{t.footerBlurb}</p>
        </div>
        <div>
          <div className="footer-heading">{t.footerLinks}</div>
          <div className="footer-links">
            {navItems.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
          </div>
        </div>
        <div>
          <div className="footer-heading">{t.footerHello}</div>
          <div className="footer-links">
            <a href="tel:+14845106701">{PHONE}</a>
            <a href="https://maps.google.com/?q=73+Virginia+Ave,+Coatesville,+PA+19320" target="_blank" rel="noreferrer">73 Virginia Ave<br />Coatesville, PA 19320</a>
            <a href={whatsAppUrl(t.contact.whatsAppGreeting)} target="_blank" rel="noreferrer">{t.footerWhatsApp}</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Estrada Landscaping Professional Inc.</span>
        <span>{t.footerRooted}</span>
      </div>
    </div>
  </footer>;
}

function WhatsAppFloat() {
  const { language } = useLanguage();
  const t = copy[language];
  return <a className="whatsapp-float" href={whatsAppUrl(t.contact.whatsAppGreeting)} target="_blank" rel="noreferrer" aria-label={t.chatAria} data-testid="link-whatsapp-floating">
    <MessageCircle size={21} /><span>{t.chatButton}</span>
  </a>;
}

function Layout({ children }: { children: ReactNode }) {
  return <div className="site-shell"><SiteHeader />{children}<Footer /><WhatsAppFloat /></div>;
}

function PageMotion({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <AnimatePresence mode="wait">
    <motion.main key={location} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: .24, ease: 'easeOut' }}>
      {children}
    </motion.main>
  </AnimatePresence>;
}

function VideoTiles() {
  const { language } = useLanguage();
  const t = copy[language].home;
  return <div className="video-grid">
    {videoMedia.map((video, index) => {
      const details = t.videos[index];
      return <div className="video-tile" key={details.title}>
      <video src={video.url} poster={video.image} autoPlay muted loop playsInline aria-label={`${details.tag}: ${t.sampleFootage}`} />
      <div className="video-caption">
        <div><span>{details.tag}</span><strong>{details.title}</strong></div>
        <div className="play-mark" aria-hidden="true"><ArrowDownRight size={18} /></div>
      </div>
    </div>;
    })}
  </div>;
}

function Home() {
  const { language } = useLanguage();
  const t = copy[language].home;
  return <>
    <section className="hero">
      <div className="hero-video">
        <iframe
          src="/estrada-landscaping-promo/?embed=hero"
          title="Estrada Landscaping animated promo"
          allow="autoplay; fullscreen"
          loading="eager"
        />
      </div>
      <div className="wrap">
        <div className="hero-copy">
          <div className="eyebrow enter">{t.heroKicker}</div>
          <h1 className="enter delay-1">{t.heroTitle}<br /><em>{t.heroTitleAccent}</em></h1>
          <p className="enter delay-2">{t.heroIntro}</p>
          <div className="hero-actions enter delay-2">
            <Link href="/contact" className="button" data-testid="link-hero-quote">{t.talkYard} <ArrowRight size={16} /></Link>
            <Link href="/services" className="button outline" data-testid="link-hero-services">{t.exploreServices}</Link>
          </div>
          <div className="hero-note"><span />{t.heroNote}</div>
        </div>
      </div>
      <div className="hero-stamp" aria-label={language === 'es' ? 'Orgullosamente locales' : 'Proudly local'}><strong>{t.local}</strong>{t.roots}<br />Coatesville, PA</div>
    </section>

    <section className="section cream">
      <div className="wrap">
        <div className="section-head">
          <div><div className="section-kicker">{t.videosKicker}</div><h2 className="section-title">{t.videosTitle}<br />{t.videosTitleSecond}</h2></div>
          <div><p className="section-intro">{t.videosIntro}</p><p className="sample-note">{t.sampleFootage}</p></div>
        </div>
        <VideoTiles />
        <p className="sample-note">{t.videoReplaceNote}</p>
      </div>
    </section>

    <section className="section">
      <div className="wrap values-grid">
        <div className="values-image" style={{ backgroundImage: `url("${photo('1585320806297-9794b3e4eeae', 1100)}")` }} role="img" aria-label={language === 'es' ? 'Arriates y vegetación ilustrativos en un espacio exterior cuidado' : 'Illustrative garden beds and greenery in a thoughtfully tended outdoor space'} />
        <div className="values-copy">
          <div className="section-kicker">{t.welcomeKicker}</div>
          <h2 className="section-title">{t.welcomeTitle}<br />{t.welcomeTitleSecond}</h2>
          <p>{t.welcomeText}</p>
          <div className="values-list">
            {t.values.map((value) => <div className="value-item" key={value}><Check size={17} />{value}</div>)}
          </div>
          <Link href="/about" className="button outline" data-testid="link-about-home">{t.aboutButton} <ArrowRight size={15} /></Link>
        </div>
      </div>
    </section>

    <section className="section green-band">
      <div className="wrap">
        <div className="section-kicker">{t.planKicker}</div>
        <div className="section-head">
          <div><h2 className="section-title">{t.planTitle}<br />{t.planTitleSecond}</h2></div>
          <p className="section-intro">{t.planIntro}</p>
        </div>
        <div className="steps-grid">
          {t.steps.map((step, index) => <div className="step" key={step.title}><span className="step-num">0{index + 1}</span><h3>{step.title}</h3><p>{step.text}</p></div>)}
        </div>
      </div>
    </section>
    <CallToAction />
  </>;
}

function CallToAction() {
  const { language } = useLanguage();
  const t = copy[language].cta;
  return <section className="cta-strip">
    <div className="wrap cta-inner">
      <div><h2>{t.title}</h2><p>{t.text}</p></div>
      <Link href="/contact" className="button" data-testid="link-cta-contact">{t.button} <ArrowRight size={16} /></Link>
    </div>
  </section>;
}

function PageHero({ kicker, title, children }: { kicker: string; title: ReactNode; children: ReactNode }) {
  return <section className="page-hero"><div className="wrap page-hero-inner">
    <div className="eyebrow">{kicker}</div><h1>{title}</h1><p>{children}</p>
  </div></section>;
}

function About() {
  const { language } = useLanguage();
  const t = copy[language].about;
  return <>
    <PageHero kicker={t.heroKicker} title={<>{t.heroTitle}<br /><em>{t.heroTitleAccent}</em></>}>{t.heroText}</PageHero>
    <section className="section">
      <div className="wrap about-story">
        <div className="story-photo-collage" data-testid="about-story-photo-collage">
          <figure className="story-photo story-photo-main">
            <img
              src={`${import.meta.env.BASE_URL}about/estrada-story-01.jpg`}
              alt={language === 'es' ? 'Integrante del equipo de Estrada Landscaping trabajando en una cortadora comercial en un vecindario' : 'Estrada Landscaping team member working on a commercial mower in a neighborhood'}
              loading="eager"
              decoding="async"
              data-testid="img-about-story-work"
            />
          </figure>
          <div className="story-photo-stack">
            <figure className="story-photo">
              <img
                src={`${import.meta.env.BASE_URL}about/estrada-story-02.jpg`}
                alt={language === 'es' ? 'Retrato de un integrante del equipo de Estrada Landscaping' : 'Portrait of an Estrada Landscaping team member'}
                loading="lazy"
                decoding="async"
                data-testid="img-about-story-portrait-one"
              />
            </figure>
            <figure className="story-photo">
              <img
                src={`${import.meta.env.BASE_URL}about/estrada-story-03.jpg`}
                alt={language === 'es' ? 'Retrato de otro integrante del equipo de Estrada Landscaping' : 'Portrait of another Estrada Landscaping team member'}
                loading="lazy"
                decoding="async"
                data-testid="img-about-story-portrait-two"
              />
            </figure>
          </div>
          <span className="story-photo-location">Coatesville, PA</span>
        </div>
        <div className="story-copy">
          <div className="section-kicker">{t.storyKicker}</div>
          <h2 className="section-title">{t.storyTitle}</h2>
          <p>{t.storyText}</p>
          <p>{t.storyTextSecond}</p>
          {t.principles.map(([title, description], i) => <div className="principle" key={title}><span>0{i + 1}</span><div><strong>{title}</strong><p>{description}</p></div></div>)}
          <Link href="/contact" className="button" data-testid="link-about-contact">{t.hello} <ArrowRight size={15} /></Link>
        </div>
      </div>
    </section>
    <section className="section cream">
      <div className="wrap values-grid">
        <div className="values-copy">
          <div className="section-kicker">{t.neighborhoodKicker}</div>
          <h2 className="section-title">{t.neighborhoodTitle}</h2>
          <p>{t.neighborhoodText}</p>
          <p>{t.neighborhoodTextSecond}</p>
          <a className="button outline" href="https://maps.google.com/?q=73+Virginia+Ave,+Coatesville,+PA+19320" target="_blank" rel="noreferrer" data-testid="link-about-map">{t.mapButton} <MapPin size={15} /></a>
        </div>
        <div className="values-image" style={{ backgroundImage: `url("${photo('1416879595882-3373a0480b5b', 1100)}")` }} role="img" aria-label={language === 'es' ? 'Jardín verde de muestra con una persona cuidando las plantas' : 'Sample green garden with someone tending plants'} />
      </div>
    </section>
    <CallToAction />
  </>;
}

const serviceIcons = [Sprout, Trees, Flower2, Trash2];

function Services() {
  const { language } = useLanguage();
  const t = copy[language].services;
  return <>
    <PageHero kicker={t.heroKicker} title={<>{t.heroTitle}<br /><em>{t.heroTitleAccent}</em></>}>{t.heroText}</PageHero>
    <section className="section">
      <div className="wrap">
        <div className="section-head">
          <div><div className="section-kicker">{t.kicker}</div><h2 className="section-title">{t.title}<br />{t.titleSecond}</h2></div>
          <p className="section-intro">{t.intro}</p>
        </div>
        <div className="service-grid">
          {t.items.map(({ title, text }, i) => {
            const Icon = serviceIcons[i];
            return <article className="service-card" key={title}>
            <div className="service-icon"><Icon size={22} strokeWidth={1.7} /></div>
            <h3>{title}</h3><p>{text}</p>
            <div className="section-kicker" style={{ marginTop: 22, marginBottom: 0 }}>{t.serviceNumber} 0{i + 1}</div>
          </article>;
          })}
        </div>
        <div className="service-assurances">
          <div><Check size={16} />{t.licensedInsured}</div>
          <div><Check size={16} />{t.satisfactionGuarantee}</div>
        </div>
        <div className="service-cta">
          <div><h2>{t.questionTitle}</h2><p>{t.questionText}</p></div>
          <Link href="/contact" className="button light" data-testid="link-services-contact">{t.askService} <ArrowRight size={16} /></Link>
        </div>
      </div>
    </section>
    <section className="section cream">
      <div className="wrap">
        <div className="section-kicker">{t.processKicker}</div>
        <h2 className="section-title">{t.processTitle}<br />{t.processTitleSecond}</h2>
        <div className="steps-grid">
          {t.steps.map((step, index) => <div className="step" key={step.title}><span className="step-num">0{index + 1}</span><h3>{step.title}</h3><p>{step.text}</p></div>)}
        </div>
      </div>
    </section>
    <CallToAction />
  </>;
}

function Gallery() {
  const { language } = useLanguage();
  const t = copy[language].gallery;
  const filterLabels = galleryFilterLabels[language];
  const [activeFilter, setActiveFilter] = useState<GalleryFilter>(getGalleryFilterFromUrl);
  const [shareFeedback, setShareFeedback] = useState('');
  useEffect(() => {
    return listenForGalleryFilterHistory(window, setActiveFilter);
  }, []);

  const selectFilter = (filter: GalleryFilter) => {
    updateGalleryFilterHistory(filter);
    setActiveFilter(filter);
  };

  const shareGallery = async () => {
    const currentUrl = window.location.href;
    setShareFeedback('');

    if (navigator.share) {
      try {
        await navigator.share({ title: document.title, url: currentUrl });
        setShareFeedback(t.linkShared);
        return;
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          setShareFeedback(t.shareCancelled);
          return;
        }
      }
    }

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(currentUrl);
      } else {
        const field = document.createElement('textarea');
        field.value = currentUrl;
        field.setAttribute('readonly', '');
        field.style.position = 'fixed';
        field.style.opacity = '0';
        document.body.appendChild(field);
        field.select();
        const copied = document.execCommand('copy');
        field.remove();
        if (!copied) throw new Error('Clipboard copy was not available');
      }
      setShareFeedback(t.linkCopied);
    } catch {
      setShareFeedback(t.shareFailed);
    }
  };

  const photosWithCategories = galleryPhotos.map((item) => ({
    ...item,
    category: getGalleryPhotoCategory(item),
  }));
  const photosNeedingReview = photosWithCategories.filter((item) => item.category === null);
  const visiblePhotos = filterGalleryPhotos(photosWithCategories, activeFilter);
  const filters: { id: GalleryFilter; label: string }[] = [
    { id: 'all', label: filterLabels.all },
    ...galleryCategories.map((id) => ({ id, label: filterLabels[id] })),
  ];
  const getFilterCount = (filter: GalleryFilter) => filterGalleryPhotos(photosWithCategories, filter).length;
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerButtonRef = useRef<HTMLButtonElement | null>(null);
  const isViewerOpen = viewerIndex !== null;

  useEffect(() => {
    if (!isViewerOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setViewerIndex(null);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setViewerIndex((index) => index === null ? null : (index - 1 + visiblePhotos.length) % visiblePhotos.length);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        setViewerIndex((index) => index === null ? null : (index + 1) % visiblePhotos.length);
      } else if (event.key === 'Tab') {
        const dialog = document.querySelector<HTMLElement>('.gallery-viewer');
        const controls = dialog?.querySelectorAll<HTMLButtonElement>('button:not([disabled])');
        if (!controls?.length) return;
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      triggerButtonRef.current?.focus();
    };
  }, [isViewerOpen]);

  return <>
    <PageHero kicker={t.heroKicker} title={<>{t.heroTitle}<br /><em>{t.heroTitleAccent}</em></>}>{t.heroText}</PageHero>
    <section className="section">
      <div className="wrap">
        <div className="section-head">
          <div><div className="section-kicker">{t.kicker}</div><h2 className="section-title">{t.title}<br />{t.titleSecond}</h2></div>
          <p className="section-intro">{t.intro}</p>
        </div>
        <div className="gallery-toolbar">
          <div className="gallery-filters" role="group" aria-label={t.filterLabel} data-testid="gallery-filters">
            {filters.map((filter) => <button
              className={`gallery-filter${activeFilter === filter.id ? ' active' : ''}`}
              type="button"
              key={filter.id}
              aria-pressed={activeFilter === filter.id}
              aria-controls="gallery-photo-grid"
              data-testid={`button-gallery-filter-${filter.id}`}
              onClick={() => selectFilter(filter.id)}
            >
              <span>{filter.label}</span>
              <span className="gallery-filter-count">{getFilterCount(filter.id)}</span>
            </button>)}
          </div>
          <button className="gallery-share" type="button" onClick={shareGallery} data-testid="button-share-gallery">
            <Share2 size={15} aria-hidden="true" />
            <span>{t.shareLink}</span>
          </button>
        </div>
        <p className="gallery-share-feedback" role="status" aria-live="polite" data-testid="text-gallery-share-feedback">{shareFeedback}</p>
        <p className="gallery-results" role="status" data-testid="text-gallery-results">
          {t.resultsShowing} {visiblePhotos.length} {visiblePhotos.length === 1 ? t.resultSingular : t.resultPlural}
        </p>
        {import.meta.env.DEV && photosNeedingReview.length > 0 && <p
          className="gallery-review-notice"
          role="status"
          data-testid="gallery-photos-needing-review"
        >
          {t.reviewPhotos} {photosNeedingReview.map((item) => item.file).join(', ')}
        </p>}
        <div className="gallery-grid" id="gallery-photo-grid" data-testid="gallery-photo-grid">
          {visiblePhotos.map((item, index) => <figure className="gallery-item" key={item.file} data-category={item.category ?? 'needs-review'} data-testid={`gallery-item-${item.file}`}>
            <button
              className="gallery-photo-button"
              type="button"
              aria-haspopup="dialog"
              aria-label={`${t.viewer.openImage} ${item.label[language]}`}
              onClick={(event) => {
                triggerButtonRef.current = event.currentTarget;
                setViewerIndex(index);
              }}
            >
              <img src={`${import.meta.env.BASE_URL}gallery/${item.file}`} alt={item.alt[language]} loading={index > 1 ? 'lazy' : 'eager'} data-testid={`img-gallery-${item.file}`} />
              <span>{item.label[language]}</span>
            </button>
          </figure>)}
        </div>
      </div>
    </section>
    {viewerIndex !== null && <div
      className="gallery-viewer-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) setViewerIndex(null);
      }}
    >
      <div className="gallery-viewer" role="dialog" aria-modal="true" aria-label={t.viewer.dialogLabel}>
        <button className="gallery-viewer-close" type="button" aria-label={t.viewer.close} onClick={() => setViewerIndex(null)} ref={closeButtonRef}>
          <X aria-hidden="true" />
        </button>
        <button className="gallery-viewer-nav gallery-viewer-previous" type="button" aria-label={t.viewer.previous} onClick={() => setViewerIndex((viewerIndex - 1 + visiblePhotos.length) % visiblePhotos.length)}>
          <ArrowRight aria-hidden="true" />
        </button>
        <figure className="gallery-viewer-content">
          <img
            src={`${import.meta.env.BASE_URL}gallery/${visiblePhotos[viewerIndex].file}`}
            alt={visiblePhotos[viewerIndex].alt[language]}
          />
          <figcaption>
            <span>{visiblePhotos[viewerIndex].label[language]}</span>
            <span aria-live="polite">{viewerIndex + 1} {t.viewer.position} {visiblePhotos.length}</span>
          </figcaption>
        </figure>
        <button className="gallery-viewer-nav gallery-viewer-next" type="button" aria-label={t.viewer.next} onClick={() => setViewerIndex((viewerIndex + 1) % visiblePhotos.length)}>
          <ArrowRight aria-hidden="true" />
        </button>
      </div>
    </div>}
    <CallToAction />
  </>;
}

function Contact() {
  const { language } = useLanguage();
  const t = copy[language].contact;
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('');
  const [details, setDetails] = useState('');

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const selectedService = t.serviceOptions.find((option) => option.value === service)?.label || t.notSure;
    const message = [
      t.quoteGreeting,
      `${t.yourName}: ${name}`,
      `${t.phoneNumber}: ${phone}`,
      `${t.quoteService}: ${selectedService}`,
      `${t.project}: ${details || t.contactFallback}`,
    ].join('\n');
    setSubmitted(true);
    window.open(whatsAppUrl(message), '_blank', 'noopener,noreferrer');
  };

  return <>
    <PageHero kicker={t.heroKicker} title={<>{t.heroTitle}<br /><em>{t.heroTitleAccent}</em></>}>{t.heroText}</PageHero>
    <section className="section">
      <div className="wrap contact-layout">
        <aside className="contact-card">
          <div className="section-kicker" style={{ color: '#c5d1bc' }}>{t.getInTouch}</div>
          <h2>{t.cardTitle}</h2>
          <p>{t.cardText}</p>
          <div className="contact-detail"><Phone size={20} /><div><small>{t.callUs}</small><a href="tel:+14845106701" data-testid="link-contact-phone">{PHONE}</a></div></div>
          <div className="contact-detail"><MapPin size={20} /><div><small>{t.homeBase}</small><span>{ADDRESS}</span></div></div>
          <div className="contact-detail"><MessageCircle size={20} /><div><small>{t.whatsapp}</small><a href={whatsAppUrl(t.whatsAppGreeting)} target="_blank" rel="noreferrer" data-testid="link-contact-whatsapp">{t.messageCrew}</a></div></div>
          <div className="contact-detail"><MapPin size={20} /><div><small>{t.serving}</small><span>{t.serviceArea}</span></div></div>
          <div className="contact-trust">
            <div><Check size={15} />{t.licensedInsured}</div>
            <div><Check size={15} />{t.satisfactionGuarantee}</div>
          </div>
          <a className="facebook-qr" href={FACEBOOK_URL} target="_blank" rel="noreferrer" aria-label={t.facebookQrText}>
            <img src={facebookQrImage} alt={t.facebookQrAlt} />
            <span><strong>{t.facebookQrTitle}</strong><small>{t.facebookQrText}</small></span>
            <ArrowRight size={17} aria-hidden="true" />
          </a>
        </aside>
        <div className="contact-form">
          <div className="section-kicker">{t.quoteKicker}</div>
          <h2>{t.quoteTitle}</h2>
          <p>{t.quoteIntro}</p>
          <form onSubmit={submit}>
            <div className="form-row">
              <div className="field"><label htmlFor="contact-name">{t.yourName}</label><input id="contact-name" name="name" required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder={t.namePlaceholder} data-testid="input-contact-name" /></div>
              <div className="field"><label htmlFor="contact-phone">{t.phoneNumber}</label><input id="contact-phone" name="phone" required type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t.phonePlaceholder} data-testid="input-contact-phone" /></div>
            </div>
            <div className="field">
              <label htmlFor="contact-service">{t.serviceInterest}</label>
              <select id="contact-service" name="service" value={service} onChange={(e) => setService(e.target.value)} data-testid="select-contact-service">
                <option value="">{t.servicePlaceholder}</option>
                {t.serviceOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </div>
            <div className="field"><label htmlFor="contact-details">{t.projectDetails}</label><textarea id="contact-details" name="details" value={details} onChange={(e) => setDetails(e.target.value)} placeholder={t.detailsPlaceholder} data-testid="textarea-contact-details" /></div>
            <button type="submit" className="button" data-testid="button-contact-submit">{t.continueWhatsApp} <ArrowRight size={16} /></button>
            <p className="form-help">{t.formHelp}</p>
            <div className="form-status" aria-live="polite">{submitted ? t.submitted : ''}</div>
          </form>
        </div>
      </div>
    </section>
    <section className="section cream">
      <div className="wrap values-grid">
        <div className="values-copy">
          <div className="section-kicker">{t.directKicker}</div>
          <h2 className="section-title">{t.directTitle}</h2>
          <p>{t.directText}</p>
          <a className="button outline" href="tel:+14845106701" data-testid="link-contact-call">{t.callButton} {PHONE} <Phone size={15} /></a>
        </div>
        <div className="values-image" style={{ backgroundImage: `url("${photo('1501004318641-b39e6451bec6', 1000)}")` }} role="img" aria-label={language === 'es' ? 'Imagen ilustrativa de plantas verdes en un jardín acogedor' : 'Illustrative image of green plants in a welcoming outdoor garden'} />
      </div>
    </section>
  </>;
}

function NotFound() {
  const { language } = useLanguage();
  const t = copy[language].notFound;
  return <section className="page-hero"><div className="wrap page-hero-inner">
    <div className="eyebrow">{t.kicker}</div><h1>{t.title}<br /><em>{t.titleAccent}</em></h1><p>{t.text}</p>
    <Link href="/" className="button" style={{ marginTop: 25 }}>{t.back} <ArrowRight size={16} /></Link>
  </div></section>;
}

function Router() {
  return <Layout><PageMotion><Switch>
    <Route path="/" component={Home} />
    <Route path="/about" component={About} />
    <Route path="/services" component={Services} />
    <Route path="/gallery" component={Gallery} />
    <Route path="/contact" component={Contact} />
    <Route component={NotFound} />
  </Switch></PageMotion></Layout>;
}

function App() {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      return window.localStorage.getItem('estrada-site-language') === 'es' ? 'es' : 'en';
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    document.documentElement.lang = language;
    try {
      window.localStorage.setItem('estrada-site-language', language);
    } catch {
      // The language still works for this visit if browser storage is unavailable.
    }
  }, [language]);

  return <LanguageContext.Provider value={{ language, setLanguage }}>
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter>
  </LanguageContext.Provider>;
}

export default App;
