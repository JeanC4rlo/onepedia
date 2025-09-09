fetch("data/akumas.json")
    .then(res => res.json())
    .then(akumasData => {
        // Renderização da informação principal
        document.querySelector(".image").src = akumasData.image;
        document.querySelector(".name").textContent = akumasData.name;
        
        let aliases = document.querySelector(".alias");
        for(let i = 0; i < akumasData.aliases.length; i++) {
            aliases.textContent += akumasData.aliases[i];
            if(i < akumasData.aliases.length - 1)
                aliases.textContent += " | ";
        }

        // Renderização dos usuários
        fetch("data/characters.json")
            .then(res => res.json())
            .then(charactersData => {
                let userList = document.querySelector(".user-list");

                akumasData.users.forEach(userId => {
                    const user = charactersData.find(char => char.id == userId);
                    if(!user) return;

                    const userContainer = document.createElement("div");
                    userContainer.classList.add("user");

                    const userStatus = document.createElement("span");
                    userStatus.classList.add("user-status");
                    userStatus.textContent = user.status;

                    switch(user.status.toLowerCase()) {
                        case "vivo":
                            userStatus.classList.add("alive");
                            break;
                        case "falecido":
                            userStatus.classList.add("dead");
                            break;
                        case "desconhecido":
                            userStatus.classList.add("unknown");
                            break;
                        default:
                            userStatus.classList.add("other")
                    }

                    const userImage = document.createElement("img");
                    userImage.classList.add("user-image")
                    userImage.src = user.image;
                    userImage.alt = user.name;

                    const userInfo = document.createElement("div");
                    userInfo.classList.add("user-info");

                    const userName = document.createElement("h3");
                    userName.classList.add("user-name");
                    userName.textContent = user.name;

                    const userDesc = document.createElement("p");
                    userDesc.classList.add("user-description");
                    userDesc.textContent = user.description;

                    userInfo.append(userName);
                    userInfo.append(userDesc);

                    userContainer.append(userStatus);
                    userContainer.append(userImage);
                    userContainer.append(userInfo);

                    userList.append(userContainer);
                });
            })
    })
    .catch(err => {
        console.error("Erro detectado: ", err);
    })