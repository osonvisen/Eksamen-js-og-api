// Finner alle pokemons fra apiet og leggerer de i en liste
let pokemons = [];
catchEmAll();
async function catchEmAll() {
    try {
        const response = await fetch(
            "https://pokeapi.co/api/v2/pokemon/?limit=50"
        );
        const data = await response.json();
        const collection = data.results;
        buildPokemonList(collection);
    } catch (error) {
        console.error("Sliter med å laste ned pokemons..! " + error);
    }
}

async function buildPokemonList(collection) {
    console.log(collection[40].url);
    try {
        const response = await fetch(collection[0].url);
        const data = await response.json();
        // Henter ut typen, navnet og bildet på pokemonen
        console.log(data.types[0].type.name);
        console.log(data.name);
        console.log(data.sprites.front_default);
    } catch (error) {
        console.error("Sliter med å sette sammen pokemons..! " + error);
    }
}
