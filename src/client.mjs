import { mountCarousel } from './lib/carousel.mjs';
import { mountSupportAssistant } from './lib/support-assistant.mjs';
import { mountNavigation } from './client/navigation.mjs';
import { mountContact, mountCoverageDock } from './client/contact.mjs';
import { mountPageMotion, mountMedia } from './client/media.mjs';

// Módulo deferido pelo HTML: compõe os comportamentos uma vez por página.
mountSupportAssistant(document.querySelector('.support-assistant'));
mountCarousel(document.querySelector('[data-carousel]'));
mountPageMotion();
mountNavigation();
mountContact();
mountMedia();
mountCoverageDock();
