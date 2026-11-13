// Content for the "what I use" page.
//
// The Development, Languages and Design groups mirror copy/cv.js — the CV lists
// the same tools in one comma-separated string, so a change here needs the same
// change there (and vice versa). Hardware is only on this page.

export default {
    cs: {
        h1: "Vybavení",
        subtitle: "Nástroje, se kterými pracuju",
        intro: "Nic z toho není doporučení, jen soupis toho, co mi sedlo a u čeho jsem zůstal.",
        groups: [
            {
                heading: "Vývoj",
                items: [
                    { name: "VS Code", note: "editor, ve kterém trávím většinu času" },
                    { name: "Git", note: "verzování všeho včetně téhle stránky" },
                    { name: "Docker", note: "izolovaná prostředí, ať mi nehnije systém" },
                    { name: "Linux", note: "hlavně kvůli síťařině a serverům" },
                    { name: "LLM", note: "generování kódu a dokumentace" },
                ],
            },
            {
                heading: "Jazyky",
                items: [
                    { name: "C", note: "škola a všechno, co má běžet nízko" },
                    { name: "C#" },
                    { name: "Java" },
                    { name: "Python", note: "skripty a rychlé prototypy" },
                    { name: "JavaScript", note: "tenhle web na něm běží" },
                    { name: "Shell" },
                    { name: "HTML, CSS", note: "mimo jiné tenhle web" },
                    { name: "SQL" },
                ],
            },
            {
                heading: "Grafika a modelování",
                items: [
                    { name: "Figma", note: "návrhy rozhraní" },
                    { name: "Canva" },
                    { name: "Photopea", note: "editor fotek přímo v prohlížeči" },
                    { name: "Blender", note: "3D" },
                    { name: "Autodesk Fusion 360", note: "CAD pro díly na 3D tisk" },
                ],
            },
            {
                heading: "Hardware",
                items: [
                    { name: "Laptop", note: "ASUS TUF Gaming A14 (FA401GM)" },
                    { name: "CPU", note: "AMD Ryzen AI 9 465" },
                    { name: "GPU", note: "NVIDIA GeForce RTX 5060 Laptop" },
                    { name: "RAM", note: "32 GB LPDDR5X 8533 MT/s" },
                    { name: "Úložiště", note: "2× 1 TB NVMe SSD" },
                    { name: "Monitor", note: '27" ASUS TUF Gaming VG27AQ5A, 2560×1440, 210 Hz' },
                    { name: "Monitor", note: '27" ViewSonic VX27G1-2K, 2560×1440, 180 Hz' },
                    { name: "Displej notebooku", note: '14" 2560×1600, 165 Hz' },
                    { name: "Klávesnice", note: "Keychron V6 Ultra 8K" },
                    { name: "Myš", note: "Logitech G305" },
                    { name: "Podložka", note: "Ikea one :3" },
                    { name: "Sluchátka", note: "Sennheiser HD 560S" },
                    { name: "Zvuková karta", note: "Universal Audio Volt 1" },
                    { name: "3D tiskárna", note: "Bambulab P1P" },
                    { name: "3D tiskárna", note: "Ender 3 Pro MK3S DIY" },
                ],
            },
        ],
    },

    en: {
        h1: "Uses",
        subtitle: "The tools I work with",
        intro: "None of this is a recommendation, just what stuck.",
        groups: [
            {
                heading: "Development",
                items: [
                    { name: "VS Code", note: "where most of the time goes" },
                    { name: "Git", note: "versioning everything, this site included" },
                    { name: "Docker", note: "isolated environments, so the host stays clean" },
                    { name: "Linux", note: "mostly for networking and servers" },
                    { name: "LLM", note: "for code generation and documentation" },
                ],
            },
            {
                heading: "Languages",
                items: [
                    { name: "C", note: "university, and anything close to the metal" },
                    { name: "C#" },
                    { name: "Java" },
                    { name: "Python", note: "scripts and quick prototypes" },
                    { name: "JavaScript", note: "what this site runs on" },
                    { name: "Shell" },
                    { name: "HTML, CSS", note: "this site among other things" },
                    { name: "SQL" },
                ],
            },
            {
                heading: "Design and modelling",
                items: [
                    { name: "Figma", note: "interface design" },
                    { name: "Canva" },
                    { name: "Photopea", note: "photo editing straight in the browser" },
                    { name: "Blender", note: "3D" },
                    { name: "Autodesk Fusion 360", note: "CAD for 3D-printed parts" },
                ],
            },
            {
                heading: "Hardware",
                items: [
                    { name: "Laptop", note: "ASUS TUF Gaming A14 (FA401GM)" },
                    { name: "CPU", note: "AMD Ryzen AI 9 465" },
                    { name: "GPU", note: "NVIDIA GeForce RTX 5060 Laptop" },
                    { name: "RAM", note: "32 GB LPDDR5X 8533 MT/s" },
                    { name: "Storage", note: "2× 1 TB NVMe SSD" },
                    { name: "Monitor", note: '27" ASUS TUF Gaming VG27AQ5A, 2560×1440, 210 Hz' },
                    { name: "Monitor", note: '27" ViewSonic VX27G1-2K, 2560×1440, 180 Hz' },
                    { name: "Laptop display", note: '14" 2560×1600, 165 Hz' },
                    { name: "Keyboard", note: "Keychron V6 Ultra 8K" },
                    { name: "Mouse", note: "Logitech G305" },
                    { name: "Mousepad", note: "Ikea one :3" },
                    { name: "Headphones", note: "Sennheiser HD 560S" },
                    { name: "Audio interface", note: "Universal Audio Volt 1" },
                    { name: "3D printer", note: "Bambulab P1P" },
                    { name: "3D printer", note: "Ender 3 Pro MK3S DIY" },
                ],
            },
        ],
    },
};
