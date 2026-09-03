// CV content for both languages. Rendered by src/_includes/cv-body.njk.
// Markup differs only in structure (kept in the template); all text lives here.

const contact = {
    email: "zvondatom@gmail.com",
    phone: "+420 728 517 872",
    phoneHref: "tel:+420728517872",
    githubUrl: "https://github.com/zv0ndis",
    githubLabel: "GitHub",
};

export default {
    cs: {
        subtitle: "Student FIT VUT v Brně • 21 let",
        contact: { ...contact, location: "Slavičín, Zlínský kraj" },
        aboutHeading: "O mně",
        about: [
            "Jmenuji se Tomáš a jsem student Fakulty informačních technologií VUT v Brně se silným technickým základem, analytickým myšlením a dlouhodobým zájmem o moderní technologie, kyberbezpečnost a IT infrastrukturu. Už od dětství mě fascinovalo fungování počítačů, sítí a bezpečnosti systémů – právě kyberbezpečnost je oblast, které bych se chtěl v budoucnu věnovat profesionálně.",
            "Vyrůstal jsem v podnikatelském prostředí, kde jsem se díky dědovi naučil nejen pracovat s počítači a technologiemi, ale také komunikovat s lidmi, nést odpovědnost a hledat rovnováhu mezi výkonem a odpočinkem. Jsem držitelem zbrojního průkazu.",
            "Nehledám pouze brigádu – hledám prostředí, kde mohu růst, podílet se na reálných projektech a dlouhodobě přinášet hodnotu.",
        ],
        skills: {
            heading: "Dovednosti",
            items: [
                "Řidičský průkaz skupiny B",
                "Analytické a technické myšlení",
                "Kreativní řešení problémů",
                "Schopnost fungovat pod tlakem",
                "Rychlé učení nových technologií",
                "Samostatnost i týmová spolupráce",
            ],
        },
        tech: {
            heading: "Technologie",
            groups: [
                {
                    label: "Jazyky",
                    value: "C, C#, Java, Python, JavaScript, Shell, HTML, CSS, SQL",
                },
                {
                    label: "Nástroje",
                    value: "VS Code, Git, Docker, Linux, LLM, Figma, Canva, Photopea, Blender, Autodesk Fusion 360",
                },
            ],
        },
        languages: {
            heading: "Jazyky",
            items: [
                { name: "Čeština", level: "mateřský jazyk" },
                { name: "Angličtina", level: "B2 středně pokročilý" },
            ],
        },
        interests: {
            heading: "Zájmy",
            groups: [
                { label: "Technologie", value: "Programování, ESP32, 3D tisk" },
                { label: "Mimo obor", value: "Myslivost, Hudba, Čtení knih, Focení" },
            ],
        },
        experience: {
            heading: "Zkušenosti",
            entries: [
                {
                    title: "Tesco",
                    role: "Všestranný asistent prodeje",
                    text: "Práce v dynamickém prostředí mě naučila zvládat stresové situace, efektivně komunikovat se zákazníky a rychle řešit problémy. Vyzkoušel jsem si fungování provozu od práce na pokladně přes doplňování zboží až po řešení nestandardních situací. Získal jsem schopnost multitaskingu a odolnost vůči stresu.",
                },
                {
                    title: "CVP Galvanika",
                    role: "Přípravář",
                    text: "Práce v průmyslovém provozu mě naučila přesnosti, důslednosti a respektu k technologickým i bezpečnostním postupům. Měl jsem na starosti přípravu a povrchovou úpravu dílů. Manuální zručnost a smysl pro detail využívám i při práci s technologiemi a 3D tiskem.",
                },
            ],
        },
        education: {
            heading: "Vzdělání",
            entries: [
                {
                    title: "VUT v Brně — FIT",
                    date: "2024 – současnost",
                    role: "Bakalářské studium, Fakulta informačních technologií",
                    text: "Přijetí proběhlo bez přijímacích zkoušek – pouze na základě IQ testů, ve kterých jsem dosáhl 98+ percentilu. Studium mi rozšiřuje znalosti v programování, počítačových sítích, systémové infrastruktuře a bezpečnosti IT.",
                },
                {
                    title: "SPŠ Zlín",
                    date: "2020 – 2024",
                    role: "Technické lyceum",
                    text: "Studium zakončeno maturitou s vyznamenáním („červený diplom“). Získal jsem technický přehled napříč strojírenstvím, elektrotechnikou a IT. Součástí studia byly výměnné pobyty, díky nimž jsem si rozšířil jazykové schopnosti a adaptabilitu.",
                },
            ],
        },
        leisure: {
            heading: "Volnočasové aktivity",
            entries: [
                {
                    title: "Myslivost & příroda",
                    text: "Myslivost pro mě nepředstavuje pouze koníček, ale především odpovědnost, disciplínu a respekt k přírodě. Díky ní jsem se naučil trpělivosti, soustředění a schopnosti zachovat klid v náročných situacích.",
                },
                {
                    title: "Studentská unie & technické projekty",
                    text: "Aktivně se podílím na fungování studentského klubu na FIT VUT — správa lokální síťové infrastruktury a vývoj interního informačního systému (KIS). Na akcích pro veřejnost jsem se podílel například na výuce základů programování hry Had.",
                },
            ],
        },
    },

    en: {
        subtitle: "Student at FIT BUT Brno • 20 years old",
        contact: { ...contact, location: "Slavičín, Zlín Region, Czechia" },
        aboutHeading: "About me",
        about: [
            "My name is Tomáš and I'm a student at the Faculty of Information Technology, Brno University of Technology, with a strong technical foundation, analytical thinking, and a long-standing interest in modern technology, cybersecurity, and IT infrastructure. Ever since childhood I've been fascinated by how computers, networks, and system security work — cybersecurity in particular is the field I'd like to pursue professionally.",
            "I grew up in an entrepreneurial environment where my grandfather taught me not only how to work with computers and technology, but also how to communicate with people, take responsibility, and find a balance between work and rest. I hold a firearms license.",
            "I'm not just looking for a part-time job — I'm looking for an environment where I can grow, contribute to real projects, and add long-term value.",
        ],
        skills: {
            heading: "Skills",
            items: [
                "Category B driving license",
                "Analytical and technical thinking",
                "Creative problem solving",
                "Ability to work under pressure",
                "Fast at picking up new technologies",
                "Comfortable working independently or in a team",
            ],
        },
        tech: {
            heading: "Technologies",
            groups: [
                {
                    label: "Languages",
                    value: "C, C#, Java, Python, JavaScript, Shell, HTML, CSS, SQL",
                },
                {
                    label: "Tools",
                    value: "VS Code, Git, Docker, Linux, LLM, Figma, Canva, Photopea, Blender, Autodesk Fusion 360",
                },
            ],
        },
        languages: {
            heading: "Languages",
            items: [
                { name: "Czech", level: "native language" },
                { name: "English", level: "B2 upper-intermediate" },
            ],
        },
        interests: {
            heading: "Interests",
            groups: [
                { label: "Technology", value: "Programming, ESP32, 3D printing" },
                { label: "Outside of tech", value: "Hunting, music, reading, photography" },
            ],
        },
        experience: {
            heading: "Experience",
            entries: [
                {
                    title: "Tesco",
                    role: "General sales assistant",
                    text: "Working in a fast-paced environment taught me to handle stressful situations, communicate effectively with customers, and solve problems quickly. I experienced the full range of store operations, from checkout work to restocking to handling non-standard situations. I gained strong multitasking skills and resilience under stress.",
                },
                {
                    title: "CVP Galvanika",
                    role: "Preparation technician",
                    text: "Working in an industrial setting taught me precision, thoroughness, and respect for technological and safety procedures. I was responsible for preparing and surface-treating parts. I still rely on the manual dexterity and attention to detail from this role when working with technology and 3D printing.",
                },
            ],
        },
        education: {
            heading: "Education",
            entries: [
                {
                    title: "Brno University of Technology — FIT",
                    date: "2024 – present",
                    role: "Bachelor's degree, Faculty of Information Technology",
                    text: "Admitted without entrance exams — based solely on IQ tests, where I scored in the 98th+ percentile. My studies are expanding my knowledge of programming, computer networks, system infrastructure, and IT security.",
                },
                {
                    title: "SPŠ Zlín",
                    date: "2020 – 2024",
                    role: "Technical Lyceum",
                    text: "Graduated with honors (“red diploma”). I gained a technical overview spanning mechanical engineering, electrical engineering, and IT. The program included exchange stays, which broadened my language skills and adaptability.",
                },
            ],
        },
        leisure: {
            heading: "Leisure activities",
            entries: [
                {
                    title: "Hunting & nature",
                    text: "Hunting isn't just a hobby for me — it's above all about responsibility, discipline, and respect for nature. It has taught me patience, focus, and the ability to stay calm in demanding situations.",
                },
                {
                    title: "Student union & technical projects",
                    text: "I actively participate in running the student club at FIT BUT — maintaining local network infrastructure and developing an internal information system (KIS). At public events I've also helped teach the basics of programming through the game Snake.",
                },
            ],
        },
    },
};
