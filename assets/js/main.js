const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" onclick="showPokemonDetail(${pokemon.number})">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
        </li>
    `;
}

function showPokemonDetail(pokemonId) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            const detailEl = document.getElementById('pokemonDetail');

            const typeColor = data.types[0].type.name;
            const abilities = data.abilities.map(a => a.ability.name).join(', ');

            detailEl.innerHTML = `
                <img src="${data.sprites.other['official-artwork'].front_default}" alt="${data.name}">
                <div class="info">
                    <h2>${data.name}</h2>
                    <p><strong>Tipo:</strong> ${data.types.map(t => t.type.name).join(', ')}</p>
                    <p><strong>Altura:</strong> ${data.height / 10} m</p>
                    <p><strong>Peso:</strong> ${data.weight / 10} kg</p>
                    <p><strong>Habilidades:</strong> ${abilities}</p>
                    <p><strong>Experiência Base:</strong> ${data.base_experience}</p>
                    <p><strong>HP:</strong> ${data.stats[0].base_stat}</p>
                    <p><strong>Ataque:</strong> ${data.stats[1].base_stat}</p>
                    <p><strong>Defesa:</strong> ${data.stats[2].base_stat}</p>
                    <p><strong>Ataque Especial:</strong> ${data.stats[3].base_stat}</p>
                    <p><strong>Defesa Especial:</strong> ${data.stats[4].base_stat}</p>
                    <p><strong>Velocidade:</strong>
                    ${data.stats[5].base_stat}</p> 
                </div>
            `;
            detailEl.className = `pokemon-detail ${typeColor}`;
            detailEl.style.display = 'block';
        });
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})