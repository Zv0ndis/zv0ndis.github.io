// Content for the "what I use" page.
//
// Seeded from the tools and technologies already listed in copy/cv.js, so the
// two never contradict each other — if something changes, change it in both.
//
// Hardware is deliberately not here: nobody has said what it is. To add it,
// drop a group like this at the top of `groups`:
//
//     {
//         heading: "Hardware",
//         items: [
//             { name: "…", note: "…" },
//         ],
//     },

export default {
    cs: {
        h1: "Vybavení",
        subtitle: "Nástroje, se kterými pracuju",
        intro: "Nic z toho není doporučení — jen soupis toho, co mi sedlo a u čeho jsem zůstal.",
        groups: [
            {
                heading: "Vývoj",
                items: [
                    { name: "VS Code", note: "editor, ve kterém trávím většinu času" },
                    { name: "Git", note: "verzování všeho včetně téhle stránky" },
                    { name: "Docker", note: "izolovaná prostředí, ať mi nehnije systém" },
                    { name: "Linux", note: "hlavně kvůli síťařině a serverům" },
                ],
            },
            {
                heading: "Jazyky",
                items: [
                    { name: "C", note: "škola a všechno, co má běžet nízko" },
                    { name: "C#" },
                    { name: "Python", note: "skripty a rychlé prototypy" },
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
                heading: "Hardware a projekty",
                items: [
                    { name: "ESP32", note: "mikrokontrolér pro domácí vychytávky" },
                    { name: "3D tisk", note: "od návrhu ve Fusionu po hotový díl" },
                ],
            },
        ],
    },

    en: {
        h1: "Uses",
        subtitle: "The tools I work with",
        intro: "None of this is a recommendation — just what stuck.",
        groups: [
            {
                heading: "Development",
                items: [
                    { name: "VS Code", note: "where most of the time goes" },
                    { name: "Git", note: "versioning everything, this site included" },
                    { name: "Docker", note: "isolated environments, so the host stays clean" },
                    { name: "Linux", note: "mostly for networking and servers" },
                ],
            },
            {
                heading: "Languages",
                items: [
                    { name: "C", note: "university, and anything close to the metal" },
                    { name: "C#" },
                    { name: "Python", note: "scripts and quick prototypes" },
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
                heading: "Hardware and projects",
                items: [
                    { name: "ESP32", note: "microcontroller for home builds" },
                    { name: "3D printing", note: "from a Fusion sketch to a finished part" },
                ],
            },
        ],
    },
};
