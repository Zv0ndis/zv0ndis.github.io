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
                    { name: "Laptop", note: "Lenovo Legion 5 Pro" },
                    { name: "CPU", note: "AMD Ryzen 5 5600H" },
                    { name: "GPU", note: "NVIDIA GeForce RTX 3060" },
                    { name: "RAM", note: "32 GB DDR4" },
                    { name: "Úložiště", note: "1 TB NVMe SSD" },
                    { name: "Monitor", note: '24" 144Hz AOC C24G1' },
                    { name: "Klávesnice", note: "Royale Kludge RK61" },
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
                    { name: "Laptop", note: "Lenovo Legion 5 Pro" },
                    { name: "CPU", note: "AMD Ryzen 5 5600H" },
                    { name: "GPU", note: "NVIDIA GeForce RTX 3060" },
                    { name: "RAM", note: "32 GB DDR4" },
                    { name: "Storage", note: "1 TB NVMe SSD" },
                    { name: "Monitor", note: '24" 144Hz AOC C24G1' },
                    { name: "Keyboard", note: "Royale Kludge RK61" },
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
