const fs = require("fs");
const path = require("path");

const baseLink = "https://jeanc4rlo.github.io/";

async function gerarPaginas() {
    console.log("Baixando JSON externo...");

    const response = await fetch(baseLink + "data/akumas.json");
    const frutas = await response.json();

    console.log("JSON carregado, total de frutas:", frutas.length);

    const template = fs.readFileSync("template.html", "utf8");

    frutas.forEach(fruta => {
        let aliases = fruta.aliases.join(" | ");

        let page = template
            .replace(/{{title}}/g, fruta.name)
            .replace(/{{name}}/g, fruta.name)
            .replace(/{{description}}/g, fruta.description)
            .replace(/{{image}}/g, fruta.image)
            .replace(/{{aliases}}/g, aliases)

        const folder = path.join("wiki", fruta.slug);
        fs.mkdirSync(folder, { recursive: true });

        fs.writeFileSync(path.join(folder, "index.html"), page);

        console.log("Gerado:", fruta.slug);
    });

    console.log("Todas as páginas foram geradas!");
}

gerarPaginas();
