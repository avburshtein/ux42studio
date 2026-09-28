// Контент страницы /terms — «Legal Notice & Terms of Use» EN + ES
// (решение (38), Docs/ui/Main_page_Spec.md). Источник:
// Docs/ui/Terms of Use.md; патчи из чата: T1 — реальная дата (синхронно
// с PP), T2 — переименование документа и блок идентификации LSSI Art. 10
// (контакт hello@ux42.studio — он же видимый контакт сайта: page.tsx
// mailto + mainPageContent.emailAddress), T3 — §8 без «dynamically»
// (EN выровнен по ES). Мини-разметка строк: **жирный**; email/URL в
// intro/bullets/contact подсвечиваются автолинками в LegalArticle.tsx.

export const TERMS_LAST_UPDATED = 'September 26, 2026';

/** Подпись разделителя EN → ES */
export const TERMS_ES_LABEL = 'Español — Aviso Legal y Condiciones de Uso';

// Структурно совместимо с PrivacySection из privacyContent.ts — рендерится
// общим LegalArticle (поля number/title/intro/bullets/contact).
export interface TermsSection {
    number: number;
    title: string;
    /** Абзацы секции */
    intro?: string[];
    /** Маркированный список */
    bullets?: string[];
    /** Абзацы после списка (используется в §10 — «наша роль») */
    outro?: string[];
    /** Простые строки без автолинков */
    lines?: string[];
    /** Подблок: полужирный заголовок + строки (email/URL подсвечиваются) */
    contact?: { title: string; lines: string[] };
}

export const EN_TERMS_SECTIONS: TermsSection[] = [
    {
        number: 1,
        title: 'Acceptance of terms',
        intro: [
            'Access to and use of the website https://ux42.studio implies full and unconditional acceptance of these Terms of Use. If you do not agree with any part of these terms, please do not use the Website.',
        ],
    },
    {
        number: 2,
        title: 'Website purpose',
        intro: [
            'This Website is a personal portfolio showcasing design work, UI/UX projects, and related professional content. Operated by Aleksandra Burshtein, Villajoyosa, Alicante, Spain.',
        ],
        contact: {
            title: 'Identification (LSSI Art. 10)',
            lines: [
                'Domain: ux42.studio',
                'Owner: Aleksandra Burshtein',
                'Co-owner / technical operator: Denis Zakharchenko',
                'Location: Villajoyosa, Alicante, Spain',
                'Contact: hello@ux42.studio',
                'Privacy and content complaints: privacy@ux42.studio',
            ],
        },
    },
    {
        number: 3,
        title: 'User obligations',
        intro: [
            'All visitors and users of ux42.studio agree to comply with the following essential standards:',
        ],
        bullets: [
            'Use the Website in accordance with applicable law and ethical practices.',
            "Not engage in activities that could damage, disable, or overload the Website's systems.",
            'Not introduce viruses, malware, or other malicious digital code.',
            'Not attempt unauthorized access to the restricted administrative panels or servers.',
            'Not copy or reproduce design layouts or original artwork without express permission.',
            'Respect intellectual property rights held by the owner or external clients.',
        ],
    },
    {
        number: 4,
        title: 'Intellectual property',
        intro: [
            'All original creative assets, content patterns, code templates, texts, illustrations, vector files, and media published on this site are protected by copyright laws. Aleksandra Burshtein maintains full ownership or valid licensing rights over all published elements.',
        ],
    },
    {
        number: 5,
        title: 'Links to third-party websites',
        intro: [
            'Our portfolio may include links to external project repositories, design awards, or client websites. We are not responsible for the privacy practices, reliability, or specific content quality hosted on those third-party services.',
        ],
    },
    {
        number: 6,
        title: 'Disclaimer of liability',
        intro: [
            'Please take note of the following limitations regarding site performance and materials:',
        ],
        bullets: [
            'The site is presented "as is" without guarantees of uninterrupted continuous uptime.',
            'Content may be modified, updated, or temporarily archived without prior warning.',
            'We do not warrant that all historical projects are error-free or represent current client structures.',
        ],
    },
    {
        number: 7,
        title: 'No contractual relationship',
        intro: [
            'All portfolios, case studies, and conceptual presentations shown on this Website are strictly for informational and presentation purposes. They do not constitute a legally binding offer or contractual commitment.',
        ],
    },
    {
        number: 8,
        title: 'Modifications to Terms',
        intro: [
            'Aleksandra Burshtein and Denis Zakharchenko, as the joint operators of this Website, may revise these Terms of Use. Continued use of the Website after changes constitutes acceptance of the revised version.',
        ],
    },
    {
        number: 9,
        title: 'Applicable law and jurisdiction',
        intro: [
            'These conditions are governed by Spanish law. Any dispute arising from access to or use of this website shall be submitted to the courts of Villajoyosa, Alicante, Spain.',
        ],
    },
    {
        number: 10,
        title: 'Portfolio platform — publisher responsibility',
        intro: [
            'ux42.studio also operates a platform on which independent designers publish their own portfolios and case studies. Each designer is an independent publisher in respect of the content they upload and publish, and is solely responsible for that content.',
            '**Each designer undertakes, as the party deciding what to publish, to:**',
        ],
        bullets: [
            'Hold a lawful basis for any personal data of third parties published on their page (client names, testimonials, team photographs, metrics), including the corresponding consent where it is required.',
            'Not publish special-category data (health, political or religious beliefs, sexual orientation, trade-union affiliation, etc.) without an appropriate legal basis.',
            'Not publish content that is unlawful, infringes intellectual property, defames third parties, or violates the rights of image or privacy of any person.',
            'Keep their published information accurate and up to date, and remove it when it is no longer accurate or when the person concerned objects.',
            'Respond directly and promptly to requests from the person concerned, or to a competent authority, regarding the published content.',
        ],
        outro: [
            '**Scope of our involvement.** UX42 Studio provides the technical platform and performs hosting, storage, access control, security and content moderation functions. Our responsibility for the content published by a designer is limited to those functions. The decision to publish, the selection of content, and the accuracy of what is published belong to the designer. This clause does not limit any obligation that Spanish law imposes on us as host or as joint data controller, nor our duty to act on complaints or removal orders addressed to privacy@ux42.studio.',
        ],
    },
    {
        number: 11,
        title: 'Reporting content and complaints',
        intro: [
            'If you believe that content published on a portfolio page infringes your rights — including personal data, image rights, intellectual property, or defamatory content — report it to us. See section 14 of our Privacy Policy for the procedure.',
        ],
        bullets: [
            '**Email:** privacy@ux42.studio, stating the URL of the page in question and the reason for the complaint.',
            '**Our commitment:** we review every complaint, contact the designer concerned, and remove or restrict the content ourselves where the law requires it, where the content is manifestly unlawful, or where the designer does not respond within a reasonable period.',
        ],
    },

];

export const ES_TERMS_SECTIONS: TermsSection[] = [
    {
        number: 1,
        title: 'Aceptación de condiciones',
        intro: [
            'El acceso y uso del sitio web https://ux42.studio implica la aceptación plena y sin reservas de las presentes Condiciones de Uso. Si no está de acuerdo con cualquiera de estas condiciones, rogamos no utilice el Sitio Web.',
        ],
    },
    {
        number: 2,
        title: 'Propósito del sitio web',
        intro: [
            'Este Sitio Web es un portafolio personal que muestra trabajos de diseño, proyectos de UI/UX y contenido profesional relacionado. Gestionado por Aleksandra Burshtein, Villajoyosa, Alicante, España.',
        ],
        contact: {
            title: 'Identificación (LSSI Art. 10)',
            lines: [
                'Dominio: ux42.studio',
                'Titular: Aleksandra Burshtein',
                'Cotitular y operador técnico: Denis Zakharchenko',
                'Domicilio: Villajoyosa, Alicante, España',
                'Contacto: hello@ux42.studio',
                'Protección de datos y reclamaciones sobre contenido: privacy@ux42.studio',
            ],
        },
    },
    {
        number: 3,
        title: 'Obligaciones del usuario',
        intro: [
            'Todos los visitantes y usuarios de ux42.studio acuerdan cumplir con los siguientes estándares básicos:',
        ],
        bullets: [
            'Utilizar el Sitio Web de acuerdo con la legislación vigente y las prácticas éticas.',
            'No realizar actividades que puedan dañar, deshabilitar o sobrecargar los sistemas de la web.',
            'No introducir virus, malware u otro código informático malicioso.',
            'No intentar acceder sin autorización a los paneles de administración o servidores.',
            'No copiar o reproducir las maquetaciones ni las obras de arte originales sin permiso.',
            'Respetar los derechos de propiedad intelectual de la titular o clientes externos.',
        ],
    },
    {
        number: 4,
        title: 'Propiedad intelectual',
        intro: [
            'Todos los activos creativos originales, patrones de contenido, plantillas de código, textos, ilustraciones, archivos vectoriales y medios publicados en este sitio están protegidos por las leyes de propiedad intelectual. Aleksandra Burshtein mantiene la propiedad total o derechos de licencia válidos sobre todos los elementos publicados.',
        ],
    },
    {
        number: 5,
        title: 'Enlaces a terceros',
        intro: [
            'Nuestro portafolio puede incluir enlaces a repositorios de proyectos externos, premios de diseño o webs de clientes. No nos hacemos responsables de las prácticas de privacidad, fiabilidad o calidad de contenido de esos servicios externos.',
        ],
    },
    {
        number: 6,
        title: 'Limitación de responsabilidad',
        intro: [
            'Tenga en cuenta las siguientes limitaciones respecto al rendimiento de la web:',
        ],
        bullets: [
            "El sitio se presenta 'tal cual' sin garantías de funcionamiento continuo ininterrumpido.",
            'El contenido puede modificarse, actualizarse o archivarse temporalmente sin previo aviso.',
            'No garantizamos que todos los proyectos históricos estén libres de errores.',
        ],
    },
    {
        number: 7,
        title: 'Sin relación contractual',
        intro: [
            'Todos los portafolios, estudios de caso y presentaciones conceptuales que se muestran en este Sitio Web son estrictamente informativos y con fines de presentación. No constituyen una oferta vinculante o compromiso contractual.',
        ],
    },
    {
        number: 8,
        title: 'Modificaciones de las condiciones',
        intro: [
            'Aleksandra Burshtein y Denis Zakharchenko, como operadores conjuntos de este Sitio Web, se reservan el derecho de revisar o ajustar estas Condiciones de Uso. El uso continuado del sitio tras los cambios implica su aceptación.',
        ],
    },
    {
        number: 9,
        title: 'Legislación aplicable y jurisdicción',
        intro: [
            'Estas condiciones se rigen por la legislación española. Cualquier controversia derivada del acceso o uso de este sitio web será sometida a los juzgados de Villajoyosa, Alicante, España.',
        ],
    },
    {
        number: 10,
        title: 'Plataforma de portafolios — responsabilidad del editor',
        intro: [
            'ux42.studio también opera una plataforma en la que diseñadores independientes publican sus propios portafolios y casos de estudio. Cada diseñador es un editor independiente respecto del contenido que carga y publica, y es el único responsable de dicho contenido.',
            '**Cada diseñador se compromete, como parte que decide qué publicar, a:**',
        ],
        bullets: [
            'Tener una base jurídica para cualquier dato personal de terceros que publique en su página (nombres de clientes, testimonios, fotografías de equipo, métricas), incluido el consentimiento correspondiente cuando sea necesario.',
            'No publicar datos de categorías especiales (salud, creencias políticas o religiosas, orientación sexual, afiliación sindical, etc.) sin una base jurídica adecuada.',
            'No publicar contenido que sea ilegal, vulnere derechos de propiedad intelectual, difame a terceros o наруve los derechos de imagen o privacidad de alguna persona.',
            'Mantener su información publicada veraz y actualizada, y retirarla cuando deje de ser exacta o cuando el interesado se oponga.',
            'Atender de forma directa y rápida las solicitudes del interesado o de una autoridad competente sobre el contenido publicado.',
        ],
        outro: [
            '**Alcance de nuestra intervención.** UX42 Studio aporta la plataforma técnica y realiza funciones de alojamiento, almacenamiento, control de acceso, seguridad y moderación de contenidos. Nuestra responsabilidad sobre el contenido publicado por un diseñador se limita a esas funciones. La decisión de publicar, la selección del contenido y la exactitud de lo publicado corresponden al diseñador. Esta cláusula no limita ninguna obligación que la legislación española nos imponga como anfitrión o como responsables conjuntos del tratamiento, ni nuestro deber de actuar ante reclamaciones u órdenes de retirada dirigidas a privacy@ux42.studio.',
        ],
    },
    {
        number: 11,
        title: 'Denuncia de contenido y reclamaciones',
        intro: [
            'Si considera que el contenido publicado en una página de portafolio vulnera sus derechos —incluidos datos personales, derechos de imagen, propiedad intelectual o contenido difamatorio— denomínelo. Véase el apartado 14 de nuestra Política de Privacidad para el procedimiento.',
        ],
        bullets: [
            '**Correo electrónico:** privacy@ux42.studio, indicando la URL de la página en cuestión y el motivo de la reclamación.',
            '**Nuestro compromiso:** revisamos cada reclamación, contactamos con el diseñador afectado y retiramos o restringimos el contenido nosotros mismos cuando la ley lo exija, cuando el contenido sea manifiestamente ilícito o cuando el diseñador no responda en un plazo razonable.',
        ],
    },

];
