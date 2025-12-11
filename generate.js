const fs = require("fs");
const path = require("path");

const baseLink = "https://jeanc4rlo.github.io/oneapi/";
const imageBaseLink = baseLink + "images/";
const dataBaseLink = baseLink + "data/";

async function fetchJson(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    }
    catch (error) {
        throw new Error(`Erro ao buscar JSON de ${url}: ${error.message}`);
    }
}

async function gerarPaginas() {
    try {
        console.log("🍈 Baixando dados...");

        const [akumas, characters] = await Promise.all([
            fetchJson(dataBaseLink + "akumas.json"),
            fetchJson(dataBaseLink + "characters.json")
        ]);

        console.log(`📊 Total: ${akumas.length} akumas`);
        const akumaTemplate = fs.readFileSync("templates/akuma-template.html", "utf8");
        const userTemplate = fs.readFileSync("templates/user-template.html", "utf8");

        // Limpa pasta wiki
        const wikiDir = "wiki";
        if (fs.existsSync(wikiDir)) {
            fs.rmSync(wikiDir, { recursive: true });
        }

        fs.mkdirSync(wikiDir);

        // Gera páginas
        for (const [i, akuma] of akumas.entries()) {
            const aliases = akuma.aliases?.join(" | ") || "";

            const relatedUsers = (akuma.users || [])
                .map(id => characters.find(c => c.id === id))
                .filter(Boolean);

            let usersHTML = "";
            for(const user of relatedUsers) {
                let userBlock = userTemplate
                    .replace(/{{user_image}}/g, imageBaseLink + user.image)
                    .replace(/{{user_name}}/g, user.name)
                    .replace(/{{user_status}}/g, user.status)
                    .replace(/{{user_description}}/g, user.description);

                usersHTML += userBlock + "\n";
            }

            const page = akumaTemplate
                .replace(/{{title}}/g, akuma.name ? `Onepedia | ${akuma.name}` : "Onepedia")
                .replace(/{{name}}/g, akuma.name || "")
                .replace(/{{description}}/g, akuma.description || "")
                .replace(/{{image}}/g, imageBaseLink + akuma.image || "")
                .replace(/{{aliases}}/g, aliases)
                .replace(/{{users}}/g, usersHTML);

            const folder = path.join(wikiDir, akuma.slug);
            fs.mkdirSync(folder, { recursive: true });

            fs.writeFileSync(path.join(folder, "index.html"), page);

            console.log(`➕ [${i + 1}] ${akuma.slug}`);
        }

        console.log("✅ Todas as páginas foram geradas!");

    } catch (error) {
        console.error("❌ Erro:", error.message);
        process.exit(1);
    }
}

gerarPaginas();