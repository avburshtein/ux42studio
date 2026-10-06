// Контент страницы /privacy — Privacy Policy EN + ES.
//
// Правка 26.09.2026 (юридический аудит после деплоя):
//  • §1 — добавлен второй со-ответственный за обработку: Денис Захарченко
//    (владелец домена ux42.studio, со-разработчик платформы). Формулировка
//    «joint controllers» по ст. 26 GDPR + сущность соглашения (Art. 26(2)).
//  • §3 — добавлены категории, которых НЕ было: данные учётных записей
//    платформы, опубликованные профили/кейсы дизайнеров, инвайты по email.
//    До правки политика описывала только «портфолио-сайт», хотя платформа
//    эти данные обрабатывает.
//  • §4 — добавлены основания для учётных записей, инвайтов и публикаций.
//  • §5 — добавлены сроки хранения для них же.
//  • §6 — добавлен Resend, Inc. (транзакционные письма с инвайтами).
//    Раньше провайдер отправки писем вообще не был указан, хотя код шлёт
//    адреса приглашённых в api.resend.com (src/lib/email/send.ts).
//  • §13 (новый) — ответственность владельцев портфолио за публикуемые
//    ими персональные данные + наш контроль/модерация.
//  • §14 (новый) — канал жалоб на контент (LSSI art. 8 notice-and-action).
//
//  • Правка 06.10.2026: публичная форма обратной связи (ContactDialog):
//    §3 — данные из формы + IP-хэш против спама (хранение 7 дней),
//    §4 — основание для обращений из формы,
//    §5 — автоудаление журнала формы через 7 дней,
//    §6 — Resend получает и данные формы; Gmail хранит и hello@-пересылку.
//
// ⚠️ ПЕРЕД ПУБЛИКАЦИЕЙ: заменить CO_CONTROLLER_ADDRESS_DENIS на реальный
//    домашний адрес. Если вы живёте по одному адресу — укажите его же.

export const PRIVACY_LAST_UPDATED = 'October 6, 2026';

/**
 * Домашний адрес второго со-ответственного (ст. 26 GDPR).
 * ⚠️ ПЛЕЙСХОЛДЕР — обязательно заменить перед деплоем.
 * Если адрес совпадает с адресом Алекс, продублируйте CO_CONTROLLER_ADDRESS_ALESANDRA.
 */
export const CO_CONTROLLER_ADDRESS_DENIS = 'Villajoyosa, Alicante, Spain';

/** Единый контактный ящик площадки: обращения по ПДн и по контенту. */
export const PRIVACY_CONTACT_EMAIL = 'privacy@ux42.studio';

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
    /** Абзацы после таблицы (микрораздел cookies в §3, решение (39)) */
    outro?: string[];
    /** Маркированный список */
    bullets?: string[];
    /** Контактный блок ведомства (§9) */
    contact?: PrivacyContactBlock;
}

export const EN_PRIVACY_SECTIONS: PrivacySection[] = [
    {
        number: 1,
        title: 'Data Controllers',
        intro: [
            'This website and the portfolio platform it hosts are operated jointly by the two data controllers identified below. Together they determine the purposes and means of the processing described in this policy, and act as **joint controllers** in the sense of **Article 26 GDPR**.',
            '**Name:** Aleksandra Burshtein — design lead, editorial and visual content',
            '**Name:** Denis Zakharchenko — domain owner, platform engineering and infrastructure',
            '**Address:** Villajoyosa, Alicante, Spain (D. Zakharchenko: see address below)',
            '**Contact:** privacy@ux42.studio — a single point of contact for both controllers',
            '**Arrangement (Art. 26(2) GDPR):** Aleksandra Burshtein decides the editorial content, design and public presentation of the studio site. Denis Zakharchenko decides the technical operation of the platform: hosting, databases, file storage, access control and security. Decisions that are not exclusively assigned to one of them are taken jointly. Either may be contacted through the address above; requests concerning data published by a designer are handled by the studio jointly, without preference to one party.',
        ],
        lines: [
            'Aleksandra Burshtein — Villajoyosa, Alicante, Spain',
            `Denis Zakharchenko — ${CO_CONTROLLER_ADDRESS_DENIS}`,
            'Shared contact: privacy@ux42.studio',
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
                    'Email correspondence',
                    'Name, email address, and the content of the message (company, project requirements, custom comments), including messages sent through the on-site contact form. To protect the form against automated abuse, a salted hash of the sender IP address is kept for 7 days and deleted afterwards.',
                    'To respond to user design inquiries, prepare initial design proposal briefs, and initiate pre-contractual discussions. Contact form messages are delivered to the studio (or to the designer whose page was used) and answered from the Reply-To address.',
                ],
                [
                    'Platform account',
                    'Email address, password hash (never the password itself), role, account status, and account creation/update dates.',
                    'To create and authenticate the account, protect it against unauthorised access, and provide the portfolio editing tools.',
                ],
                [
                    'Portfolio profile and case studies',
                    'Data each designer chooses to publish: full name, professional headline, biography, location, website, social links, avatar and cover images, case studies, metrics, client names, and customer reviews with the author name and role.',
                    'To display the portfolio on the public page chosen by the designer and allow visitors to assess the work. Designers decide themselves what to publish; see section 13.',
                ],
                [
                    'Invitations to register',
                    'Email address entered by an administrator when creating an invitation, the invitation code, and the date of use or expiry.',
                    'To send a single registration invitation to a specific person and to prevent unauthorised registrations.',
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
        outro: [
            '**Cookies and local storage.** This website uses only strictly necessary technical storage: an authentication session cookie (auth-token) for registered users, browser local storage for interface preferences (e.g., light/dark theme), and strictly necessary security cookies set by Cloudflare. We do not use advertising, profiling, or third-party tracking cookies. Our web analytics (Cloudflare Web Analytics) is cookieless. No consent banner is used because no tracking cookies are set.',
        ],
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
                    'Email correspondence — General Inquiries',
                    'Legitimate Interest (Art. 6.1.f GDPR) to attend to information requests submitted voluntarily by users.',
                ],
                [
                    'Email correspondence — Service Requests',
                    'Pre-contractual measures (Art. 6.1.b GDPR) to prepare bespoke design estimates and review specifications.',
                ],
                [
                    'Platform account and authentication',
                    'Performance of a contract (Art. 6.1.b GDPR): registration is requested by the person themselves, and the account is what delivers the service they signed up for.',
                ],
                [
                    'Registration invitations sent by email',
                    'Legitimate interest (Art. 6.1.f GDPR) and steps taken at the request of the administrator who issues the invitation (Art. 6.1.b): access is granted only to people the studio has decided to invite. Recipients who do not wish to receive these messages may ask us to delete their address at privacy@ux42.studio.',
                ],
                [
                    'Contact form submissions',
                    'Pre-contractual measures (Art. 6.1.b GDPR) when the message concerns a design request, plus legitimate interest (Art. 6.1.f GDPR) in protecting the public form against automated abuse and spam.',
                ],
                [
                    'Portfolio content published by a designer',
                    'Performance of a contract (Art. 6.1.b GDPR) for the data of the designer themselves, and legitimate interest (Art. 6.1.f GDPR) for the personal data of third parties that the designer chooses to make public (for example a client name or a customer review). See section 13 for the responsibilities this involves.',
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
                    'Email correspondence',
                    '12 months following last communication, unless a commercial contract is initiated (retained for contract duration).',
                ],
                [
                    'Platform accounts',
                    'For as long as the account remains active. You can delete your account at any time from Profile → Account in the editor, or by writing to privacy@ux42.studio. Deletion is immediate and irreversible: it removes the account, its profile, all case studies and all uploaded images.',
                ],
                [
                    'Registration invitations',
                    'Until 12 months after creation, or until used — whichever comes first. Once an invitation is used, the associated email address is retained only as part of the account created from it. An unused invitation can be revoked at any time, which deletes the stored address immediately.',
                ],
                [
                    'Contact form log entries',
                    'Deleted automatically 7 days after submission. The forwarded message itself is kept as email correspondence (see above).',
                ],
                [
                    'Content published on a portfolio',
                    'For as long as the designer keeps the account active and the content published. On account closure, public content is removed from the web within 30 days.',
                ],
                [
                    'Web Analytics Metrics',
                    'Aggregated, non-identifying data only; retention per provider (Cloudflare) defaults.',
                ],
                [
                    'Server logs & Security metrics',
                    'Transient technical logs, kept only as long as needed for security and diagnostics; not used for profiling.',
                ],
            ],
        },
    },
    {
        number: 6,
        title: 'Recipients of data',
        intro: [
            'We do not sell, trade, or rent your personal information to third parties. We do not disclose it except to the following providers, each acting as a Data Processor under a written agreement with appropriate confidentiality and security commitments:',
        ],
        bullets: [
            '**Cloudflare, Inc.** — web hosting, CDN, object storage, database, anonymous cookieless web analytics, email routing for the privacy@ux42.studio address, and strict-necessity security cookies.',
            '**Resend, Inc.** — transactional email delivery. When an administrator issues a registration invitation, the recipient\'s email address and the contents of the invitation message are transmitted to Resend in order to send that single email. When a visitor submits the contact form, their name, email address and message are transmitted to Resend in order to deliver that message, and only for that purpose. Resend receives no portfolio content and no contact list.',
            '**Google LLC** — Gmail, used to store correspondence forwarded to the privacy@ux42.studio and hello@ux42.studio addresses.',
        ],
    },

    {
        number: 7,
        title: 'International data transfers',
        intro: [
            'Some of the providers above store data in facilities outside the European Economic Area (EEA). Where such transfers occur, they rely on compliant transfer mechanisms: the **EU–US Data Privacy Framework** (Cloudflare and Resend are both certified under it) or Standard Contractual Clauses (SCCs) approved by the European Commission, which guarantee a level of protection equivalent to that applicable in the EEA.',
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
    {
        number: 13,
        title: 'Responsibilities of portfolio owners',
        intro: [
            'Portfolios are created and published by independent designers who decide, on their own initiative, what information to make public: their own details, and possibly personal data relating to third parties (a client name, a customer testimonial, a photograph of a team, a metric).',
            '**The designer is the sole decision-maker and principal responsible party** for the lawfulness of what they publish. By publishing content on this platform, the designer undertakes to:',
        ],
        bullets: [
            'Have a lawful basis for publishing the personal data of third parties, and in particular the corresponding consent of the client or person concerned where it is required.',
            'Not publish special-category data (health, political or religious beliefs, sexual orientation, trade-union affiliation, etc.) without an appropriate legal basis.',
            'Keep the information truthful and updated, and remove it when it is no longer accurate or the person concerned objects.',
            'Respond directly to requests from the person concerned regarding the published content.',
        ],
        outro: [
            '**Our role.** UX42 Studio provides the technical platform: hosting, storage, access control and security. We review and moderate content through our administrator panel, we remove content that violates our Terms of Use or that we are legally required to remove, and we act on complaints received through the channel in section 14. Our involvement in the content itself is limited to these moderation and hosting functions; the decision to publish, and the accuracy of what is published, belongs to the designer.',
        ],
    },
    {
        number: 14,
        title: 'Content complaints and requests for removal',
        intro: [
            'If you believe that a portfolio page publishes personal data about you and that it should not, or that it infringes your rights, write to us. We will forward the request to the designer concerned and act on it ourselves where the law requires us to.',
        ],
        bullets: [
            '**Email:** privacy@ux42.studio (please include the URL of the page in question).',
            '**What we do:** we acknowledge the request, contact the designer, and unpublish or restrict the content ourselves if the complaint concerns data for which we are jointly responsible as controllers, if it is manifestly unlawful, or if the designer does not respond.',
            '**Identity check:** to protect third parties from unjustified requests, we may ask you to confirm your identity before acting on a request that affects another person\'s data.',
        ],
    },

];

export const ES_PRIVACY_SECTIONS: PrivacySection[] = [
    {
        number: 1,
        title: 'Responsables del tratamiento',
        intro: [
            'Este sitio web y la plataforma de portafolios que aloja son operados conjuntamente por los dos responsables del tratamiento identificados a continuación. Ambos determinan los fines y los medios del tratamiento descrito en esta política y actúan como **responsables conjuntos** en el sentido del **artículo 26 del RGPD**.',
            '**Nombre:** Aleksandra Burshtein — dirección de diseño, contenidos editoriales y visuales',
            '**Nombre:** Denis Zakharchenko — titular del dominio, ingeniería de la plataforma e infraestructura',
            '**Domicilio:** Villajoyosa, Alicante, España (D. Zakharchenko: véase domicilio abajo)',
            '**Contacto:** privacy@ux42.studio — punto de contacto único para ambos responsables',
            '**Acuerdo (art. 26.2 RGPD):** Aleksandra Burshtein decide el contenido editorial, el diseño y la presentación pública del sitio de la estudio. Denis Zakharchenko decide la operación técnica de la plataforma: alojamiento, bases de datos, almacenamiento de archivos, control de acceso y seguridad. Las decisiones no atribuidas exclusivamente a uno de ellos se adoptan de común acuerdo. Puede dirigirse a cualquiera de los dos a través de la dirección indicada; las solicitudes relativas a datos publicados por un diseñador se tramitan de forma conjunta por la estudio, sin preferencia por ninguna parte.',
        ],
        lines: [
            'Aleksandra Burshtein — Calle de la Partida, 42, Villajoyosa, Alicante, España',
            `Denis Zakharchenko — ${CO_CONTROLLER_ADDRESS_DENIS}`,
            'Contacto común: privacy@ux42.studio',
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
                    'Correspondencia por correo electrónico',
                    'Nombre, email y contenido del mensaje (empresa, requisitos del proyecto, comentarios personalizados), incluidos los enviados a través del formulario de contacto del sitio. Para proteger el formulario contra abusos automatizados, se conserva durante 7 días un hash con sal de la dirección IP del remitente, que luego se elimina.',
                    'Responder a consultas, elaborar presupuestos de diseño iniciales e iniciar gestiones precontractuales. Los mensajes del formulario llegan al estudio (o al diseñador cuya página se utilizó) y se responden desde la dirección de respuesta del mensaje.',
                ],
                [
                    'Cuenta de la plataforma',
                    'Correo electrónico, hash de la contraseña (nunca la contraseña en sí), rol, estado de la cuenta y fechas de creación y actualización.',
                    'Crear y autenticar la cuenta, protegerla frente a accesos no autorizados y proporcionar las herramientas de edición del portafolio.',
                ],
                [
                    'Perfil y casos de estudio del portafolio',
                    'Datos que cada diseñador decide publicar: nombre completo, titular profesional, biografía, ubicación, sitio web, redes sociales, avatar e imagen de portada, casos de estudio, métricas, nombres de clientes y testimonios con nombre y cargo del autor.',
                    'Mostrar el portafolio en la página pública que el diseñador elija y permitir que los visitantes valoren el trabajo. Los diseñadores deciden qué publican; véase el apartado 13.',
                ],
                [
                    'Invitaciones a registrarse',
                    'Correo electrónico introducido por un administrador al crear una invitación, el código de invitación y la fecha de uso o caducidad.',
                    'Enviar una única invitación de registro a una persona concreta y evitar registros no autorizados.',
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
        outro: [
            '**Cookies y almacenamiento local.** Este sitio web utiliza únicamente almacenamiento técnico estrictamente necesario: una cookie de sesión de autenticación (auth-token) para usuarios registrados, el almacenamiento local del navegador para preferencias de interfaz (p. ej., tema claro/oscuro) y cookies de seguridad estrictamente necesarias establecidas por Cloudflare. No utilizamos cookies publicitarias, de perfilado ni de seguimiento de terceros. Nuestras analíticas web (Cloudflare Web Analytics) no utilizan cookies. No se utiliza banner de consentimiento porque no se establecen cookies de seguimiento.',
        ],
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
                    'Correspondencia electrónica — Consultas generales',
                    'Interés legítimo (Art. 6.1.f RGPD) para atender solicitudes de información enviadas voluntariamente.',
                ],
                [
                    'Correspondencia electrónica — Solicitud de servicios',
                    'Medidas precontractuales (Art. 6.1.b RGPD) para elaborar propuestas de diseño y revisar especificaciones.',
                ],
                [
                    'Envíos del formulario de contacto',
                    'Medidas precontractuales (Art. 6.1.b RGPD) cuando el mensaje se refiere a una solicitud de diseño, e interés legítimo (Art. 6.1.f RGPD) en proteger el formulario público contra abusos automatizados y spam.',
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
                    'Comunicaciones por correo electrónico',
                    '12 meses desde la última interacción, salvo inicio de relación contractual comercial.',
                ],
                [
                    'Cuentas de la plataforma',
                    'Mientras la cuenta esté activa. Puede eliminar su cuenta en cualquier momento desde Perfil → Cuenta en el editor, o escribiendo a privacy@ux42.studio. La eliminación es inmediata e irreversible: borra la cuenta, su perfil, todos los casos de estudio y todas las imágenes subidas.',
                ],
                [
                    'Invitaciones a registrarse',
                    'Hasta 12 meses desde su creación o hasta que se utilicen, lo que ocurra primero. Una vez utilizada la invitación, la dirección de email asociada se conserva únicamente como parte de la cuenta creada. Una invitación no utilizada puede revocarse en cualquier momento, lo que elimina de inmediato la dirección almacenada.',
                ],
                [
                    'Registros del formulario de contacto',
                    'Se eliminan automáticamente 7 días después del envío. El mensaje reenviado se conserva como correspondencia por correo electrónico (véase arriba).',
                ],
                [
                    'Contenido publicado en el portafolio',
                    'Mientras el diseñador mantenga la cuenta activa y el contenido publicado. Al cerrar la cuenta, el contenido público se retira de la web en un máximo de 30 días.',
                ],
                [
                    'Métricas de Análisis Web',
                    'Datos agregados y no identificativos; conservación según los valores predeterminados del proveedor (Cloudflare).',
                ],
                [
                    'Logs de Seguridad',
                    'Registros técnicos transitorios, conservados solo el tiempo necesario para seguridad y diagnóstico; sin fines de perfilado.',
                ],
            ],
        },
    },
    {
        number: 6,
        title: 'Destinatarios de los datos',
        intro: [
            'No vendemos, comerciamos ni alquilamos su información personal a terceros. Solo la revelamos a los siguientes proveedores, cada uno de los cuales actúa como Encargado del Tratamiento en virtud de un contrato escrito con compromisos de confidencialidad y seguridad apropiados:',
        ],
        bullets: [
            '**Cloudflare, Inc.** — alojamiento web, CDN, almacenamiento de objetos, base de datos, analítica web anónima sin cookies, enrutamiento de correo para la dirección privacy@ux42.studio y cookies de seguridad estrictamente necesarias.',
            '**Resend, Inc.** — envío de correos transaccionales. Cuando un administrador emite una invitación de registro, la dirección de correo del destinatario y el contenido del mensaje de invitación se transmiten a Resend para poder enviar ese único correo. Cuando un visitante envía el formulario de contacto, su nombre, correo y mensaje se transmiten a Resend para entregar ese mensaje, y solo con ese fin. Resend no recibe contenido de portafolios ni listas de contactos.',
            '**Google LLC** — Gmail, utilizado para almacenar la correspondencia reenviada a las direcciones privacy@ux42.studio y hello@ux42.studio.',
        ],
    },

    {
        number: 7,
        title: 'Transferencias internacionales de datos',
        intro: [
            'Algunos de los proveedores anteriores almacenan datos en instalaciones situadas fuera del Espacio Económico Europeo (EEE). Cuando se producen dichas transferencias, se apoyan en mecanismos conformes: el **Marco de Privacidad de Datos UE-EE. UU.** (tanto Cloudflare como Resend están certificados en él) o las Cláusulas Contractuales Tipo (CCT) aprobadas por la Comisión Europea, que garantizan un nivel de protección equivalente al aplicable en el EEE.',
        ],
    },

    {
        number: 8,
        title: 'Derechos del interesado',
        intro: [
            'Conforme al RGPD, usted tiene el control absoluto sobre sus datos personales. Puede ejercer cualquiera de los siguientes derechos escribiendo a privacy@ux42.studio:',
        ],
        bullets: [
            '**Derecho de acceso:** obtener una copia de todos los datos tratados actualmente.',
            '**Derecho de rectificación:** corregir datos desactualizados o incompletos.',
            '**Derecho de supresión:** solicitar la eliminación completa de sus datos.',
            '**Derecho de limitación:** limitar el tratamiento de sus datos mientras se discute su exactitud.',
            '**Derecho de portabilidad:** recibir sus datos en un formato digital legible.',
            '**Derecho de oposición:** oponerse a tratamientos basados en interés legítimo.',
            '**Derecho a retirar el consentimiento:** en cualquier momento, sin que ello afecte a la licitud previa del tratamiento.',
        ],
    },

    {
        number: 9,
        title: 'Derecho a presentar reclamación',
        intro: [
            'Si considera que nuestro tratamiento vulnera la normativa de protección de datos, le recomendamos que se ponga en contacto con nosotros primero. No obstante, conserva el derecho a presentar una reclamación oficial ante la Agencia Española de Protección de Datos (AEPD):',
        ],
        contact: {
            title: 'Agencia Española de Protección de Datos (AEPD)',
            lines: ['C/ Jorge Juan, 6, 28001 Madrid', 'www.aepd.es'],
        },
    },

    {
        number: 10,
        title: 'Decisiones automatizadas',
        intro: [
            'No utilizamos sistemas de tratamiento automatizado, algoritmos de perfilado ni técnicas de toma de decisiones dinámicas que puedan afectar significativamente a sus derechos o privilegios legales.',
        ],
    },

    {
        number: 11,
        title: 'Medidas de seguridad',
        intro: [
            'Para mantener seguras sus interacciones y consultas, aplicamos las siguientes capas de protección:',
        ],
        bullets: [
            'Cifrado HTTPS/TLS activo en todas las transferencias de página.',
            'Controles de acceso que restringen estrictamente la consulta de datos.',
            'Actualizaciones de seguridad aplicadas habitualmente a la configuración del alojamiento.',
            'Minimización estricta de datos para reducir la exposición al riesgo.',
        ],
    },

    {
        number: 12,
        title: 'Cambios en esta política de privacidad',
        intro: [
            'Nos reservamos el derecho a revisar esta política para adaptarla a cambios legales o mejoras operativas. Toda modificación se reflejará en este documento, con la fecha de última actualización visible al principio. Le recomendamos revisarla periódicamente.',
        ],
    },

    {
        number: 13,
        title: 'Responsabilidad de los titulares de portafolios',
        intro: [
            'Los portafolios son creados y publicados por diseñadores independientes que deciden, por su propia iniciativa, qué información hacen pública: sus propios datos y, en su caso, datos personales de terceros (nombre de un cliente, testimonio de un cliente, fotografía de un equipo, una métrica).',
            '**El diseñador es el único decisor y principal responsable de la licitud de lo que publica.** Al publicar contenido en esta plataforma, el diseñador se compromete a:',
        ],
        bullets: [
            'Tener una base jurídica para publicar los datos personales de terceros y, en particular, el consentimiento correspondiente del cliente o interesado cuando sea necesario.',
            'No publicar datos de categorías especiales (salud, creencias políticas o religiosas, orientación sexual, afiliación sindical, etc.) sin una base jurídica adecuada.',
            'Mantener la información veraz y actualizada, y retirarla cuando deje de ser exacta o el interesado se oponga.',
            'Atender directamente las solicitudes del interesado sobre el contenido publicado.',
        ],
        outro: [
            '**Nuestro papel.** UX42 Studio aporta la plataforma técnica: alojamiento, almacenamiento, control de acceso y seguridad. Revisamos y moderamos el contenido desde nuestro panel de administración, retiramos el contenido que vulnere nuestras Condiciones de Uso o que estamos obligados legalmente a retirar, y actuamos ante las reclamaciones recibidas por el canal del apartado 14. Nuestra intervención en el contenido se limita a esas funciones de moderación y alojamiento; la decisión de publicar y la exactitud de lo publicado corresponden al diseñador.',
        ],
    },

    {
        number: 14,
        title: 'Reclamaciones sobre contenido y solicitudes de retirada',
        intro: [
            'Si considera que una página de portafolio publica datos personales suyos que no debería publicar, o que infringe sus derechos, escríbanos. Trasladaremos la solicitud al diseñador afectado y actuaríamos nosotros mismos cuando la ley nos obligue a ello.',
        ],
        bullets: [
            '**Correo electrónico:** privacy@ux42.studio (indique la URL de la página en cuestión).',
            '**Qué hacemos:** acusamos recibo, contactamos con el diseñador y retiramos o restringimos el contenido nosotros mismos si la reclamación versa sobre datos de los que somos responsables conjuntos, si el contenido es manifiestamente ilícito o si el diseñador no responde.',
            '**Comprobación de identidad:** para proteger a terceros de solicitudes injustificadas, podemos pedirle que confirme su identidad antes de actuar en una solicitud que afecte a los datos de otra persona.',
        ],
    },

];
