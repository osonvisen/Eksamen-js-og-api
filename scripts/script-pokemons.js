// Finner alle pokemons fra apiet og leggerer de i en liste
let pokemons = []; // Her lagrer vi de ferdige pokemons, som skal være vårt 'api'
let pokeContainer = []; // Mellomlager
let favorites = []; // Her lagrer vi de favorittene brukeren har valgt
let maxFavourites = 5; // Her definerer vi hvor mange favoritter vi kan ha
let types = []; // Her lagrer vi typene vi henter ut
let display = document.querySelector(".display");
let sortMenu = document.querySelector("#sort-type");
let selectedFavourites = document.querySelector(".selected-favourites");
const newPokemonBtn = document.querySelector(".create-new-pokemon");
let createNewPokemon = document.querySelector(".make-new-pokemon");

// Jeg predefinerer noen farger for noen typer pokemons.
// Tanken er at vi kan legge til nye farger når en ny
// pokemontype legges til.
let predefinedColors = {
    water: "rgb(0, 191, 255)",
    fire: "rgb(255, 0, 0)",
    grass: "rgb(0, 255, 0)",
    electric: "rgb(255, 255, 0)",
    poison: "rgb(128, 0, 128)",
    bug: "rgb(255, 128, 0)",
    fairy: "rgb(255, 255, 255)",
};
// Fetcher pokemontypene fra apiet
let allPokemonTypes = [];
fetchPokemonTypes();
async function fetchPokemonTypes() {
    try {
        const response = await fetch("https://pokeapi.co/api/v2/type");
        const data = await response.json();
        allPokemonTypes = data.results.map((type) => type.name);
        allPokemonTypes.splice(18, 2); // Fjerner de to siste typene
        readLocalStorage();
    } catch (error) {
        console.log(error);
    }
}
// Lager et array med alle typene pokemons
newPokemonBtn.addEventListener("click", () => {
    makeNewPokemon();
});
// Sjekker om det ligger noe i localStorage
// readLocalStorage();
function readLocalStorage() {
    if (localStorage.getItem("storedPokemons")) {
        pokemons = JSON.parse(localStorage.getItem("storedPokemons"));
        findTypes();
        showAllPokemons(pokemons, display);
        if (localStorage.getItem("storedFavorites")) {
            favorites = JSON.parse(localStorage.getItem("storedFavorites"));
            renderFavourites();
        } else {
            console.log("Ingen favoritter funnet i localStorage");
        }
    } else {
        catchEmAll();
    }
}

// Fanger 50 tilfeldige pokemons
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
            });
        } catch (error) {
            console.error("Sliter med å sette sammen pokemons..! " + error);
        }
    });
    setTimeout(storePokemons, 200, pokemons, "storedPokemons");
    setTimeout(findTypes, 300);
    setTimeout(showAllPokemons, 500);
}
function findRandomColor(pokemonType) {
    // Finner farge til en bakgrunn
    // Vi kan forhåndsdefinere noen farger
    if (pokemonType in predefinedColors) {
        return predefinedColors[pokemonType];
    } else {
        let r = Math.floor(Math.random() * 256);
        let g = Math.floor(Math.random() * 256);
        let b = Math.floor(Math.random() * 256);
        const bgColor = "rgb(" + r + ", " + g + ", " + b + ")";
        // Vi legger til fargen i arrayet med predefinerte farger
        // sånn at nye pokemons med samme type får lik farge
        predefinedColors[pokemonType] = bgColor;
        return bgColor;
    }
}

function storePokemons(array, key) {
    if (array === undefined) {
        console.log("Mottok ingen array");
    } else {
        if (key === undefined && array.length > 6) {
            key = "storedPokemons";
        }
        localStorage.setItem(key, JSON.stringify(array));
    }
}

function showAllPokemons() {
    renderPokemons(pokemons, display, true);
}
function findTypes() {
    // Lager et array med alle typene pokemons
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
}

sortMenu.addEventListener("change", () => {
    if (sortMenu.value == "") {
        showAllPokemons();
    } else {
        let pokemonsSorted = pokemons.filter(
            (pokemon) => pokemon.type === sortMenu.value
        );
        renderPokemons(pokemonsSorted, display, true, true);
    }
});

// Vi mottar parametre for hvilket array vi skal skrive ut,
// hvor vi skal skrive ut, om de skal ha liker- og redigerknapper
// samt om dette er en sortert liste.
function renderPokemons(sortedArray, destination, edit, sorted) {
    if (edit === undefined) {
        edit = true;
    }
    destination.innerHTML = "";
    sortedArray.forEach((pokemon, index) => {
        const pokemonCard = document.createElement("div");
        pokemonCard.style.display = "flex";
        pokemonCard.style.flexDirection = "column";
        pokemonCard.style.width = "150px";
        pokemonCard.style.backgroundColor = pokemon.color;
        pokemonCard.style.padding = "7px";
        pokemonCard.style.borderRadius = "10px";
        const imgDiv = document.createElement("div");
        imgDiv.innerHTML = `<img src="${pokemon.image}" alt="${pokemon.name}" style="width: 150px">`;
        imgDiv.style.width = "100%";

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
            if (sorted) {
                sortedArray.splice(index, 1);
            }
            deletePokemon(deleteIndex);

            display.innerHTML = "";
            renderPokemons(sortedArray, display, edit, sorted);
            renderFavourites();
        });

        if (edit) {
            const likeBtn = document.createElement("button");
            likeBtn.innerHTML = "Liker";
            likeBtn.addEventListener("click", () => {
                if (favorites.length >= maxFavourites) {
                    alert(
                        "Du kan bare ha " +
                            maxFavourites +
                            " favoritter! Du må slette en eller flere først!"
                    );
                } else {
                    // Sjekker om pokemonen allerede finnes i favourites
                    if (favorites.some((fav) => fav.name === pokemon.name)) {
                        alert("Pokemonen er allerede en favoritt!");
                    } else {
                        favorites.push(pokemon);
                        storePokemons(favorites, "storedFavorites");
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
                storeEditBtn.addEventListener("click", () => {
                    pokemon.name = editName.value;
                    pokemon.type = typeValue;
                    nameValue.innerHTML = editName.value;
                    typeValue.innerHTML = typeValue.value;
                    pokemons[index].type = typeValue.value;
                    storePokemons(pokemons, "storedPokemons");
                    display.innerHTML = "";
                    showAllPokemons();
                });
                typeDiv.appendChild(storeEditBtn);
                typeValue.appendChild(typeOptions);
                nameValue.append(editName);
            });
            pokemonCard.append(imgDiv, imgText, likeBtn, editBtn, delBtn);
        } else {
            pokemonCard.append(imgDiv, imgText, delBtn);
        }
        destination.appendChild(pokemonCard);
    });
}
function deletePokemon(index) {
    pokemons.splice(index, 1);
    storePokemons(pokemons, "storedPokemons");
}
// Når vi skal vise favorittene, så trenger vi ikke knappene for
// redigering og liker. Bruker parameteret false til dette.
function renderFavourites() {
    renderPokemons(favorites, selectedFavourites, false);
}

function makeNewPokemon() {
    newPokemonBtn.style.display = "none";
    const newCard = document.createElement("div");
    const image = "./images/default.png";
    const newName = document.createElement("input");
    newName.type = "text";
    newName.placeholder = "Navn på ny pokemon";

    const newType = document.createElement("div");

    const typeOption = document.createElement("select");
    const option = document.createElement("option");
    newType.innerHTML = "";
    option.value = "";
    option.innerHTML = "Velg type";
    typeOption.appendChild(option);
    allPokemonTypes.forEach((type) => {
        const option = document.createElement("option");
        option.value = type;
        option.innerHTML = type;
        typeOption.appendChild(option);
        typeOption.addEventListener("change", () => {
            newType.value = typeOption.value;
        });
    });
    newType.appendChild(typeOption);

    const cancelBtn = document.createElement("button");
    cancelBtn.innerHTML = "Avbryt";
    cancelBtn.addEventListener("click", () => {
        newCard.innerHTML = "";
        newPokemonBtn.style.display = "block";
    });
    const addBtn = document.createElement("button");
    addBtn.innerHTML = "Legg til";
    addBtn.addEventListener("click", () => {
        newPokemonBtn.style.display = "none";
        if (newName.value == "" || newType.value == "") {
            alert("Du må fylle inn alle feltene");
        } else {
            let bgColor = findRandomColor(newType.value);
            const newPokemon = {
                name: newName.value,
                type: newType.value,
                image: image,
                color: bgColor,
            };
            console.log("Dytter den nye inn i pokemons..");
            pokemons.push(newPokemon);
            storePokemons(pokemons, "storedPokemons");
            findTypes();
            showAllPokemons();
            newCard.innerHTML = "";
            newPokemonBtn.style.display = "block";
        }
    });
    newCard.append(newName, newType, addBtn, cancelBtn);
    createNewPokemon.appendChild(newCard);
}
