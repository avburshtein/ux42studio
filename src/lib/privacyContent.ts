// Контент страницы /privacy — Privacy Policy EN + ES (решение (36),
// Docs/ui/Main_page_Spec.md). Источник текста: Docs/ui/PP.md; §6/§7 —
// финальные формулировки: единственный процессор — Cloudflare, Inc.
// (WhatsApp-кнопка удалена из админки, спека (31), Meta из процессоров
// выпала); §7 — EU–US Data Privacy Framework (Cloudflare сертифицирован)
// или SCC. Email унифицирован на privacy@ux42.studio (§1 EN имел
// «av.butshtein@…» — вероятная опечатка; §8 и ES используют privacy@).
// Мини-разметка строк: **жирный**. Email/URL в intro/bullets/contact
// подсвечиваются автолинками в PrivacyPolicy.tsx; в lines (§1) — по макету
// обычный текст.

export const PRIVACY_LAST_UPDATED = 'July 28, 2026';

/** Подпись разделителя EN → ES */
export const PRIVACY_ES_LABEL = 'Español — Política de Privacidad';

export interface PrivacyTable {
    /** Заголовки колонок */
    headers: string[];
    /** Строки; первая колонка рендерится полужирной (как в макете) */
    rows: string[][];
}

/** Контактный блок ведомства (§9 AEPD): полужирный заголовок + строки-ссылки */
export interface PrivacyContactBlock {
    title: string;
    lines: string[];
}

export interface PrivacySection {
    number: number;
    title: string;
    /** Абзацы до таблицы/списка */
    intro?: string[];
    /** Простые строки (§1: имя/адрес/email) — без автолинков */
    lines?: string[];
    table?: PrivacyTable;
    /** Маркированный список */
    bullets?: string[];
    /** Контактный блок ведомства (§9) */
    contact?: PrivacyContactBlock;
}

export const EN_PRIVACY_SECTIONS: PrivacySection[] = [
    {
        number: 1,
        title: 'Data Controller',
        intro: [
            'The data controller responsible for the processing of your personal data collected via this website is:',
        ],
        lines: [
            'Name: Aleksandra Burshtein',
            'Address: Villajoyosa, Alicante, Spain',
            'Email: privacy@ux42.studio',
        ],
    },
    {
        number: 2,
        title: 'Applicable legislation',
        intro: [
            'Our operations conform strictly to relevant European and Spanish regulations regarding cybersecurity and privacy. The primary legal instruments governing our activities are:',
        ],
        bullets: [
            'General Data Protection Regulation (GDPR - Regulation EU 2016/679)',
            'Ley Orgánica 3/2018 de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD)',
            'Ley 34/2002 de Servicios de la Sociedad de la Información y Comercio Electrónico (LSSI-CE)',
        ],
    },
    {
        number: 3,
        title: 'Data we collect',
        intro: [
            'We implement data minimization principles, collecting only what is strictly necessary to address your specific goals or maintain site performance.',
        ],
        table: {
            headers: ['Source', 'Data Collected', 'Purpose of Processing'],
            rows: [
                [
                    'Contact Form',
                    'Name, email, company, project requirements, custom comments.',
                    'To respond to user design inquiries, prepare initial design proposal briefs, and initiate pre-contractual discussions.',
                ],
                [
                    'Web Analytics',
                    'Anonymized, aggregated usage statistics (page views, visit duration, referrer, device type) collected via Cloudflare Web Analytics.',
                    'This service does not use cookies and does not collect personal data or device fingerprints.',
                ],
                [
                    'Server Logs',
                    'IP address, request date/time, browser type, request status code, protocol used.',
                    "To protect the site's technical integrity, troubleshoot operational errors, and prevent malicious attacks.",
                ],
            ],
        },
    },
    {
        number: 4,
        title: 'Legal basis for processing',
        intro: [
            'We only process personal data when we have a valid legal justification. Our processing relies on the following bases:',
        ],
        table: {
            headers: ['Processing Activity', 'Legal Basis (GDPR / LOPDGDD)'],
            rows: [
                [
                    'Contact Form — General Inquiries',
                    'Legitimate Interest (Art. 6.1.f GDPR) to attend to information requests submitted voluntarily by users.',
                ],
                [
                    'Contact Form — Service Requests',
                    'Pre-contractual measures (Art. 6.1.b GDPR) to prepare bespoke design estimates and review specifications.',
                ],
                [
                    'Web Analytics Tracking',
                    'Legitimate Interest (Art. 6.1.f GDPR) — anonymous, cookieless statistics; no personal data or identifiers are processed.',
                ],
                [
                    'Server Security Logging',
                    'Legitimate Interest (Art. 6.1.f GDPR) to maintain security, optimize service delivery, and resolve critical server errors.',
                ],
            ],
        },
    },
    {
        number: 5,
        title: 'Data retention',
        intro: [
            'We store your details only as long as necessary for the specified purposes, utilizing clear disposal protocols once thresholds are met.',
        ],
        table: {
            headers: ['Data Category', 'Retention Period Policy'],
            rows: [
                [
                    'Contact Form Communications',
                    '12 months following last communication, unless a commercial contract is initiated (retained for contract duration).',
                ],
                [
                    'Web Analytics Metrics',
                    '14 months maximum duration, automatically cleared on a rolling monthly cycle.',
                ],
                [
                    'Server logs & Security metrics',
                    '30 to 90 days, unless a security incident demands extended preservation for legal diagnostics.',
                ],
            ],
        },
    },
    {
        number: 6,
        title: 'Recipients of data',
        intro: [
            'We do not sell, trade, or rent your personal information to third parties. Personal data you send us by email is processed by: **Cloudflare, Inc.** (web hosting, CDN, object storage, anonymous web analytics, and email routing for the privacy@ux42.studio address) and **Google LLC** (Gmail — storage of the forwarded correspondence), acting as Data Processors under strict confidentiality agreements.',
        ],
    },

    {
        number: 7,
        title: 'International data transfers',
        intro: [
            'Some third-party providers may store data in cloud facilities located outside the European Economic Area (EEA). Whenever such transfers occur, we guarantee they rely on compliant mechanisms, such as the **EU–US Data Privacy Framework** (Cloudflare is certified) or Standard Contractual Clauses (SCCs) approved by the European Commission, ensuring equivalent data protection.',
        ],
    },
    {
        number: 8,
        title: 'Data subject rights',
        intro: [
            'Under the GDPR, you possess absolute control over your personal details. You can request any of the following by writing to us at privacy@ux42.studio:',
        ],
        bullets: [
            '**Right of access:** To obtain a copy of all details currently processed.',
            '**Right to rectification:** To correct outdated or incomplete data records.',
            '**Right to erasure:** To request complete removal of data when consent is withdrawn.',
            '**Right to restrict processing:** To limit how your data is handled during disputes.',
            '**Right to data portability:** To request your details in a readable digital format.',
            '**Right to object:** To oppose processing activities based on legitimate interests.',
            '**Right to withdraw consent:** At any time, without affecting prior lawfulness.',
        ],
    },
    {
        number: 9,
        title: 'Right to lodge a complaint',
        intro: [
            'If you believe our processing violates privacy laws, we encourage you to contact us first. However, you retain the legal right to file an official complaint with the Spanish Data Protection Agency (AEPD) at:',
        ],
        contact: {
            title: 'Agencia Española de Protección de Datos (AEPD)',
            lines: ['C/ Jorge Juan, 6, 28001 Madrid', 'www.aepd.es'],
        },
    },
    {
        number: 10,
        title: 'Automated decision-making',
        intro: [
            'We do not employ any automated processing systems, automated profiling algorithms, or dynamic decision-making techniques that could significantly impact your legal rights or privileges.',
        ],
    },
    {
        number: 11,
        title: 'Security measures',
        intro: [
            'To keep your portfolio interactions and inquiries safe, we implement robust safety layers:',
        ],
        bullets: [
            'HTTPS/TLS encryption active on all page transfers.',
            'Access controls strictly restricting data review.',
            'Security patches applied regularly to hosting configurations.',
            'Strict data minimization to reduce risk exposure.',
        ],
    },
    {
        number: 12,
        title: 'Changes to this Privacy Policy',
        intro: [
            'We reserve the right to revise this policy to adapt to legal shifts or operational upgrades. All adjustments will be highlighted here, with the revised "Last updated" date visible at the top. We recommend periodic review.',
        ],
    },

];

export const ES_PRIVACY_SECTIONS: PrivacySection[] = [
    {
        number: 1,
        title: 'Responsable del tratamiento',
        intro: [
            'El responsable del tratamiento de los datos personales obtenidos a través de esta web es:',
        ],
        lines: [
            'Nombre: Aleksandra Burshtein',
            'Domicilio: Calle de la Partida, 42, Villajoyosa, Alicante, España',
            'Correo electrónico: privacy@ux42.studio',
        ],
    },
    {
        number: 2,
        title: 'Legislación aplicable',
        intro: [
            'Nuestras actividades cumplen estrictamente con la normativa europea y española en materia de privacidad y ciberseguridad, regulándose principalmente por:',
        ],
        bullets: [
            'Reglamento General de Protección de Datos (RGPD - Reglamento UE 2016/679)',
            'Ley Orgánica 3/2018 de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD)',
            'Ley 34/2002 de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE)',
        ],
    },
    {
        number: 3,
        title: 'Datos que recopilamos',
        intro: [
            'Aplicamos principios de minimización de datos, limitándonos a obtener aquello que sea estrictamente necesario para cumplir con sus solicitudes o el rendimiento de la web.',
        ],
        table: {
            headers: ['Origen', 'Datos Recopilados', 'Finalidad del Tratamiento'],
            rows: [
                [
                    'Formulario de Contacto',
                    'Nombre, email, empresa, requisitos del proyecto, comentarios personalizados.',
                    'Responder a consultas, elaborar presupuestos de diseño iniciales e iniciar gestiones precontractuales.',
                ],
                [
                    'Análisis Web',
                    'Estadísticas de uso anónimas y agregadas (páginas vistas, duración, origen, tipo de dispositivo) mediante Cloudflare Web Analytics.',
                    'No utiliza cookies ni recopila datos personales.',
                ],
                [
                    'Logs del Servidor',
                    'Dirección IP, fecha/hora de la solicitud, tipo de navegador, código de estado, protocolo.',
                    'Proteger la integridad técnica del sitio, solucionar errores y prevenir ataques maliciosos.',
                ],
            ],
        },
    },

    {
        number: 4,
        title: 'Base legal para el tratamiento',
        intro: [
            'Solo procesamos datos personales cuando disponemos de una justificación legal válida, de acuerdo con los siguientes supuestos:',
        ],
        table: {
            headers: ['Actividad de Tratamiento', 'Base Legal (RGPD / LOPDGDD)'],
            rows: [
                [
                    'Contacto — Consultas generales',
                    'Interés legítimo (Art. 6.1.f RGPD) para atender solicitudes de información enviadas voluntariamente.',
                ],
                [
                    'Contacto — Solicitud de servicios',
                    'Medidas precontractuales (Art. 6.1.b RGPD) para elaborar propuestas de diseño y revisar especificaciones.',
                ],
                [
                    'Análisis Web',
                    'Interés legítimo (Art. 6.1.f RGPD) — estadísticas anónimas sin cookies; no se tratan datos personales.',
                ],
                [
                    'Logs de Seguridad',
                    'Interés legítimo (Art. 6.1.f RGPD) para mantener la seguridad y resolver fallos críticos en el servidor.',
                ],
            ],
        },
    },
    {
        number: 5,
        title: 'Conservación de datos',
        intro: [
            'Conservamos su información únicamente durante el período necesario para cumplir con las finalidades descritas, empleando protocolos de eliminación segura una vez cumplidos dichos plazos.',
        ],
        table: {
            headers: ['Categoría de Datos', 'Plazo de Conservación'],
            rows: [
                [
                    'Comunicaciones de Contacto',
                    '12 meses desde la última interacción, salvo inicio de relación contractual comercial.',
                ],
                [
                    'Métricas de Análisis Web',
                    'Máximo de 14 meses, eliminándose de forma automática en ciclos mensuales.',
                ],
                [
                    'Logs de Seguridad',
                    'Entre 30 y 90 días, salvo que un incidente de seguridad exija un plazo mayor para análisis legal.',
                ],
            ],
        },
    },
    {
        number: 6,
        title: 'Destinatarios de los datos',
        intro: [
            'No vendemos, comerciamos ni alquilamos su información personal a terceros. Los datos personales que nos envía por correo electrónico son tratados por: **Cloudflare, Inc.** (alojamiento web, CDN, almacenamiento de objetos, analítica web anónima y enrutamiento de correo para la dirección privacy@ux42.studio) y **Google LLC** (Gmail — almacenamiento de la correspondencia reenviada), actuando como Encargados del Tratamiento bajo estrictos acuerdos de confidencialidad.',
        ],
    },

];
