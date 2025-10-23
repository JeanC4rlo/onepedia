const headerButtonList = document.querySelectorAll("header button");
const main = document.querySelector("body main");

function renderizarPagina(pagina) {
    fetch(`./pages/${pagina}.html`)
        .then(response => {
            if(!response.ok)
                throw new Error();
            return response.text();
        }) 
        .then(content => {
            main.innerHTML = content;
        })
        .catch(error => {
            main.innerHTML = "<p>Página não encontrada.</p>";
        });
}

headerButtonList.forEach(headerButton => {
    headerButton.addEventListener("click", () => {
        let pagina = headerButton.dataset.page;
        renderizarPagina(pagina);
    })
});

window.addEventListener("DOMContentLoaded", () => {
    renderizarPagina("mainPage");
})
