const fs = require("fs");
const path = require("path");

const baseLink = "https://jeanc4rlo.github.io/oneapi/";

async function gerarPaginas() {
    try {
        console.log("Baixando JSON...");
        
        const response = await fetch(baseLink + "data/akumas.json");
        const frutas = await response.json();

        console.log(`Total: ${frutas.length} frutas`);

        const template = fs.readFileSync("template.html", "utf8");
        
        // Limpa pasta wiki
        const wikiDir = "wiki";
        if (fs.existsSync(wikiDir)) {
            fs.rmSync(wikiDir, { recursive: true });
        }
        
        fs.mkdirSync(wikiDir);

        // Gera páginas
        frutas.forEach((fruta, i) => {
            const aliases = fruta.aliases?.join(" | ") || "";
            
            const page = template
                .replace(/{{title}}/g, fruta.name || "")
                .replace(/{{name}}/g, fruta.name || "")
                .replace(/{{description}}/g, fruta.description || "")
                .replace(/{{image}}/g, fruta.image || "")
                .replace(/{{aliases}}/g, aliases);

            const folder = path.join(wikiDir, fruta.slug);
            fs.mkdirSync(folder, { recursive: true });
            
            fs.writeFileSync(path.join(folder, "index.html"), page);
            
            console.log(`[${i + 1}] ${fruta.slug}`);
        });

        console.log("✅ Todas as páginas foram geradas!");
        
    } catch (error) {
        console.error("❌ Erro:", error.message);
        process.exit(1);
    }
}

gerarPaginas();