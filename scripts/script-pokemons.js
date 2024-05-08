// Hentet pokemon-ikoner fra http://www.rw-designer.com/icon-set/pokemon-types
// Finner alle pokemons fra apiet og leggerer de i en liste
let pokemons = []; // Her lagrer vi de ferdige pokemons, som skal være vår database (db)
let pokeContainer = []; // Mellomlager
let favourites = []; // Her lagrer vi de favorittene brukeren har valgt
let maxFavourites = 5; // Her definerer vi hvor mange favoritter vi kan ha
let types = []; // Her lagrer vi typene til de pokemonene vil har lasta ned.
let allPokemonTypes = []; // Her lagres alle 18 typene
let predefinedColors = {
    water: "rgb(0, 191, 255)",
    fire: "rgb(255, 0, 0)",
    grass: "rgb(0, 255, 0)",
    electric: "rgb(255, 255, 0)",
    poison: "rgb(128, 0, 128)",
    bug: "rgb(255, 128, 0)",
    fairy: "rgb(255, 255, 255)",
}; // Jeg har foråndsdefinert noen farger, mens resten av fargene genereres automatisk
// etterhvert som vi legger til nye typer i db
// De delene av skjermen vi skal styre
let display = document.querySelector(".display");
let sortMenu = document.querySelector("#sort-type");
let selectedFavourites = document.querySelector(".selected-favourites");
const newPokemonBtn = document.querySelector(".new-pokemon-btn");
let createNewPokemon = document.querySelector(".make-new-pokemon");
let showIcons = document.querySelector(".show-icons");

// Eventlistener for Lag ny pokemon-knappen
newPokemonBtn.addEventListener("click", () => {
    makeNewPokemon();
});
// Sjekker om det ligger noe i localStorage
readLocalStorage();
function readLocalStorage() {
    if (localStorage.getItem("storedPokemons")) {
        pokemons = JSON.parse(localStorage.getItem("storedPokemons"));
        findTypes();
        showAllPokemons();
        if (localStorage.getItem("storedFavourites")) {
            favourites = JSON.parse(localStorage.getItem("storedFavourites"));
            renderFavourites();
        } else {
            console.log("Ingen favoritter funnet i localStorage");
        }
        if (localStorage.getItem("allTypes")) {
            allPokemonTypes = JSON.parse(localStorage.getItem("allTypes"));
        } else {
            console.log("Ingen typer funnet i localStorage!");
            fetchPokemonTypes();
        }
        if (localStorage.getItem("colors")) {
            predefinedColors = JSON.parse(localStorage.getItem("colors"));
        } else {
            console.log("Ingen predefinerte farger funnet i localStorage!");
        }
    } else {
        catchEmAll();
        fetchPokemonTypes();
    }
}
// Fetcher alle pokemontypene
async function fetchPokemonTypes() {
    try {
        const response = await fetch("https://pokeapi.co/api/v2/type");
        const data = await response.json();
        allPokemonTypes = data.results.map((type) => type.name);
        allPokemonTypes.splice(18, 2); // Fjerner de to siste typene
        storePokemons(allPokemonTypes, "allTypes");
        // readLocalStorage();
    } catch (error) {
        console.error("Får ikke lastet ned pokemons..! " + error);
    }
}
// Fanger 50  pokemons
async function catchEmAll() {
    let collection = []; // Her legger vi rådataene fra apiet
    try {
        // Henter pokemons fra api
        const response = await fetch(
            "https://pokeapi.co/api/v2/pokemon?limit=50"
        );
        const data = await response.json();
        pokeContainer = data.results;
        setTimeout(buildPokemons(), 300);
    } catch (error) {
        console.error("Sliter med å laste ned pokemons..! " + error);
    }
}
// Fetcher og sorterer detaljene vi trenger om pokemonene
// og legger dem i pokemons, som vi skal bruke videre.
function buildPokemons() {
    pokeContainer.forEach(async (pokemon) => {
        try {
            const response = await fetch(pokemon.url);
            const data = await response.json();
            // Henter ut typen, navnet og bildet på pokemonen
            // Legger til et default bilde hvis det ikke finnes et bilde
            let picture;
            const pokeImage = `../images/icons/${data.types[0].type.name}.ico`;
            if (!data.sprites.front_shiny) {
                picture = "../images/default.png";
            } else {
                picture = data.sprites.front_shiny;
            }
            pokemons.push({
                type: data.types[0].type.name,
                image: picture,
                name: data.name,
                color: findRandomColor(data.types[0].type.name),
                icon: `../images/icons/${data.types[0].type.name}.ico`,
            });
        } catch (error) {
            console.error("Sliter med å sette sammen pokemons..! " + error);
        }
    });
    setTimeout(storePokemons, 200, pokemons, "storedPokemons");
    setTimeout(findTypes, 300);
    setTimeout(showAllPokemons, 500);
}
// Finner en tilfeldig farge til de typene som ikke har predefinerte farger
function findRandomColor(pokemonType) {
    if (pokemonType in predefinedColors) {
        return predefinedColors[pokemonType];
    } else {
        let r = Math.floor(Math.random() * 205) + 50;
        let g = Math.floor(Math.random() * 205) + 50;
        let b = Math.floor(Math.random() * 205) + 50;
        const bgColor = "rgb(" + r + ", " + g + ", " + b + ")";
        // Vi legger til fargen i arrayet med predefinerte farger
        // sånn at nye pokemons med samme type får lik farge
        // Så lagrer vi fargene, sånn at vi kan bruke de igjen senere
        predefinedColors[pokemonType] = bgColor;
        storePokemons(predefinedColors, "colors");
        return bgColor;
    }
}
function storePokemons(array, key) {
    if (array === undefined) {
        console.log("Mottok ingen array");
    } else {
        localStorage.setItem(key, JSON.stringify(array));
    }
}
function showAllPokemons() {
    display.innerHTML = "";
    showIcons.innerHTML = "";
    renderPokemons(pokemons, false); // false fordi denne er ikke sortert
}
function findTypes() {
    // Lager et array med alle typene pokemons vi har i db
    // Jeg gjør dette fordi vi bare kan sortere på eksisterende typer.
    types = [];
    pokemons.forEach((pokemon) => {
        if (!types.includes(pokemon.type)) {
            types.push(pokemon.type);
        }
    });
    dropDownMenu();
}
function dropDownMenu() {
    sortMenu.innerHTML = "";
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "alle";
    sortMenu.appendChild(option);
    types.forEach((type) => {
        const option = document.createElement("option");
        option.value = type;
        option.textContent = type;
        sortMenu.append(option);
    });
    return;
}
sortMenu.addEventListener("change", () => {
    if (sortMenu.value == "") {
        showAllPokemons();
    } else {
        sortPokemons(sortMenu.value);
    }
});
function sortPokemons(type) {
    let pokemonsSorted = [];
    pokemonsSorted = pokemons.filter((pokemon) => pokemon.type === type);
    renderPokemons(pokemonsSorted, true); // true fordi dette er en sortert liste
    sortMenu.value = type;
}
// Vi mottar parametre for hvilket array vi skal skrive ut,
// samt om dette er en sortert liste.
function renderPokemons(sortedArray, sorted) {
    if (sortedArray[0].fav == undefined) {
        destination = display;
        edit = true;
    } else {
        destination = selectedFavourites;
        edit = false;
    }
    // Lager ikonene man kan velge typene
    if (sorted) {
        showIcons.innerHTML = "";
        const sortIcons = document.createElement("div");
        sortIcons.style.display = "flex";
        sortIcons.style.justifyContent = "center";
        sortIcons.style.alignItems = "center";
        const iconDiv = document.createElement("div");
        iconDiv.style.marginRight = "15px";
        const iconImg = document.createElement("img");
        iconImg.src = "../images/default.png";
        iconImg.style.width = "50px";
        const iconName = document.createElement("div");
        iconName.innerHTML = "Alle";
        iconImg.addEventListener("click", () => {
            sortMenu.value = "";
            showAllPokemons();
        });
        iconDiv.append(iconImg, iconName);
        sortIcons.appendChild(iconDiv);
        types.forEach((type) => {
            // Vi kan bare sortere på de typene vi har i db
            const iconDiv = document.createElement("div");
            iconDiv.style.marginRight = "8px";
            const iconImg = document.createElement("img");
            iconImg.src = `../images/icons/${type}.ico`;
            iconImg.alt = type.type;
            iconImg.style.width = "50px";
            const iconName = document.createElement("div");
            iconName.innerHTML = type;
            iconDiv.append(iconImg, iconName);
            sortIcons.appendChild(iconDiv);
            iconImg.addEventListener("click", (event) => {
                sortPokemons(type);
            });
        });
        showIcons.append(sortIcons);
    }
    destination.innerHTML = "";
    sortedArray.forEach((pokemon, index) => {
        const pokemonCard = document.createElement("div");
        pokemonCard.style.display = "flex";
        pokemonCard.style.flexDirection = "column";
        pokemonCard.style.position = "relative";
        pokemonCard.style.width = "150px";
        pokemonCard.style.backgroundColor = pokemon.color;
        pokemonCard.style.padding = "7px";
        pokemonCard.style.borderRadius = "10px";
        const imgDiv = document.createElement("div");
        imgDiv.innerHTML = `<img src="${pokemon.image}" alt="${pokemon.name}" style="width: 150px">`;
        imgDiv.style.width = "100%";
        const typeIcon = document.createElement("div");
        typeIcon.style.display = "flex";
        typeIcon.style.position = "absolute";
        typeIcon.innerHTML = `<img src="${pokemon.icon}" style="width: 60px" >`;
        typeIcon.style.borderRadius = "50%;";
        typeIcon.style.top = "120px";
        typeIcon.addEventListener("click", () => {
            sortPokemons(pokemon.type);
        });
        const imgText = document.createElement("div");
        imgText.style.display = "flex";
        imgText.style.flexDirection = "column";
        const nameDiv = document.createElement("div");
        nameDiv.style.display = "flex";
        nameDiv.style.flexDirection = "column";
        nameDiv.style.width = "100%";
        nameDiv.style.textAlign = "center";
        const nameKey = document.createElement("div");
        nameKey.innerHTML = "Navn: ";
        const nameValue = document.createElement("div");
        nameValue.classList.add("pokemon-name");
        nameValue.innerHTML = pokemon.name;
        nameDiv.append(nameKey, nameValue);
        const typeDiv = document.createElement("div");
        typeDiv.style.display = "flex";
        typeDiv.style.flexDirection = "column";
        typeDiv.style.width = "100%";
        typeDiv.style.textAlign = "center";
        typeDiv.style.marginBottom = "10px";
        const typeKey = document.createElement("div");
        typeKey.innerHTML = "Type: ";
        const typeValue = document.createElement("div");
        typeValue.classList.add("pokemon-name");
        typeValue.innerHTML = pokemon.type;
        typeValue.style.alignContent = "center";
        typeDiv.append(typeKey, typeValue);
        imgText.append(nameDiv, typeDiv);
        const delBtn = document.createElement("button");
        delBtn.innerHTML = "Slett";
        delBtn.style.backgroundColor = "red";
        delBtn.addEventListener("click", () => {
            // Sletter pokemonen fra arrayen med alle pokemons
            // Først finner vi indexen  i  pokemons
            let deleteIndex = pokemons.indexOf(pokemon);
            if (sortedArray === favourites) {
                favourites.splice(index, 1);
                storePokemons(favourites, "storedFavourites");
                renderFavourites();
            } else {
                if (sorted) {
                    sortedArray.splice(index, 1);
                    deletePokemon(deleteIndex);
                    renderPokemons(sortedArray, sorted);
                } else {
                    deletePokemon(index, 1);
                    storePokemons(pokemons, "storedPokemons");
                    showAllPokemons();
                }
            }
        });
        // Jeg velger at brukeren ikke kan redigere direkte fra favorittene
        if (edit) {
            const likeBtn = document.createElement("button");
            likeBtn.innerHTML = "Liker";
            likeBtn.addEventListener("click", () => {
                if (favourites.length >= maxFavourites) {
                    alert(
                        "Du kan bare ha " +
                            maxFavourites +
                            " favoritter! Du må slette en eller flere først!"
                    );
                } else {
                    // Sjekker om pokemonen allerede finnes i favourites
                    if (favourites.some((fav) => fav.name === pokemon.name)) {
                        alert("Pokemonen er allerede en favoritt!");
                    } else {
                        const newFavourite = {
                            color: pokemon.color,
                            icon: pokemon.icon,
                            image: pokemon.image,
                            name: pokemon.name,
                            type: pokemon.type,
                            fav: true,
                        };
                        favourites.push(newFavourite);
                        storePokemons(favourites, "storedFavourites");
                        renderFavourites();
                    }
                }
            });
            const editBtn = document.createElement("button");
            editBtn.innerHTML = "Rediger";
            editBtn.addEventListener("click", () => {
                const editName = document.createElement("input");
                editName.value = pokemon.name;
                nameValue.innerHTML = "";

                const storeEditBtn = document.createElement("button");
                storeEditBtn.innerHTML = "Lagre endringene";
                storeEditBtn.style.marginTop = "5px";

                const typeOptions = document.createElement("select");
                const option = document.createElement("option");
                allPokemonTypes.forEach((type) => {
                    const option = document.createElement("option");
                    typeValue.innerHTML = "";
                    option.value = type;
                    option.innerHTML = type;
                    typeOptions.appendChild(option);
                    typeOptions.addEventListener("change", () => {
                        typeValue.value = typeOptions.value;
                    });
                });
                typeOptions.value = pokemon.type;
                storeEditBtn.addEventListener("click", () => {
                    if (editName.value == "") {
                        alert("Du må skrive inn et navn!");
                        editName.value = pokemon.name;
                    } else {
                        let favoritt = favourites.findIndex(
                            (fav) => fav.name == pokemon.name
                        );
                        pokemons[index] = {
                            type: typeOptions.value,
                            image: pokemon.image,
                            name: editName.value,
                            color: findRandomColor(typeOptions.value),
                            icon: `../images/icons/${typeOptions.value}.ico`,
                        };

                        if (favoritt != -1) {
                            favourites[favoritt] = {
                                fav: true,
                                type: typeOptions.value,
                                image: pokemon.image,
                                name: editName.value,
                                color: findRandomColor(typeOptions.value),
                                icon: `../images/icons/${typeOptions.value}.ico`,
                            };
                            renderFavourites();
                        }
                        //
                        storePokemons(pokemons, "storedPokemons");
                        showAllPokemons();
                    }
                });
                typeDiv.appendChild(storeEditBtn);
                typeValue.appendChild(typeOptions);
                nameValue.append(editName);
            });
            pokemonCard.append(
                imgDiv,
                imgText,
                typeIcon,
                likeBtn,
                editBtn,
                delBtn
            );
        } else {
            pokemonCard.append(imgDiv, imgText, typeIcon, delBtn);
        }
        destination.appendChild(pokemonCard);
    });
}
function deletePokemon(index) {
    let favIndex = favourites.findIndex(
        (pokemon) => pokemon.name == pokemons[index].name
    );
    if (favIndex != -1) {
        favourites.splice(favIndex, 1);
        storePokemons(favourites, "storedFavourites");
        renderFavourites();
    }
    pokemons.splice(index, 1);
    storePokemons(pokemons, "storedPokemons");
    showAllPokemons();
}
// Når vi skal vise favorittene, så trenger vi ikke knappene for
// redigering og liker. Bruker parameteret false til dette.
function renderFavourites() {
    selectedFavourites.innerHTML = "";
    renderPokemons(favourites, false); // false fordi dette er ikke en sortert liste
}
function makeNewPokemon() {
    newPokemonBtn.style.display = "none";
    // Lager den nye pokemonen
    const pokemon = document.createElement("div");
    const image = "./images/default.png";
    const newName = document.createElement("input");
    newName.type = "text";
    newName.placeholder = "Navn på ny pokemon";
    const newType = document.createElement("div");
    const typeOption = document.createElement("select");
    const option = document.createElement("option");
    if (sortMenu.value == "") {
        option.value = "";
        option.innerHTML = "Velg type";
        typeOption.append(option);
    } else {
    }
    allPokemonTypes.forEach((type) => {
        const option = document.createElement("option");
        option.value = type;
        option.innerHTML = type;
        typeOption.appendChild(option);
        typeOption.addEventListener("change", () => {
            newType.value = typeOption.value;
        });
    });
    typeOption.appendChild(option);
    typeOption.value = sortMenu.value;

    newType.appendChild(typeOption);
    const cancelBtn = document.createElement("button");
    cancelBtn.innerHTML = "Avbryt";
    cancelBtn.addEventListener("click", () => {
        pokemon.innerHTML = "";
        newPokemonBtn.style.display = "block";
        if (sortMenu.value !== "") {
            sortPokemons(sortMenu.value);
        } else {
            showAllPokemons();
        }
    });
    const addBtn = document.createElement("button");
    addBtn.innerHTML = "Legg til";
    addBtn.addEventListener("click", () => {
        newPokemonBtn.style.display = "none";
        if (
            newName.value == "" ||
            typeOption.value == "" ||
            typeOption.value == undefined
        ) {
            alert("Du må fylle inn alle feltene");
        } else {
            let funnet = false;
            pokemons.forEach((poke) => {
                if (poke.name == newName.value) {
                    alert("Navnet finnes allerede! Du må lage et nytt!");
                    funnet = true;
                }
            });
            if (funnet) {
                alert("Navnet finnes allerede. Du må lage et nytt!");
                newName.value = "";
            } else {
                let bgColor = findRandomColor(typeOption.value);
                const newPokemon = {
                    name: newName.value.toLocaleLowerCase(),
                    type: typeOption.value,
                    image: image,
                    color: bgColor,
                    icon: `../images/icons/${typeOption.value}.ico`,
                };
                pokemons.push(newPokemon);
                storePokemons(pokemons, "storedPokemons");
                findTypes();
                showAllPokemons();
                pokemon.innerHTML = "";
                newPokemonBtn.style.display = "block";
            }
        }
    });
    pokemon.append(newName, newType, addBtn, cancelBtn);
    createNewPokemon.appendChild(pokemon);
}
