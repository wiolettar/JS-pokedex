// inspired by code Build a Pokédex REPLICA with Vanilla JavaScript and the PokéAPI (Pokémon API) https://www.youtube.com/watch?v=wXjSaZb67n8&list=PLXzMwWvud3xTMYt5cu4THjT3yXMEv63NV&index=2 
//DOM Objects
const mainScreen = document.querySelector('.main-screen');
const pokeName = document.querySelector('.poke-name');
const pokeId = document.querySelector('.poke-id');
const pokeFrontImage = document.querySelector('.poke-front-image');
const pokeBackImage = document.querySelector('.poke-back-image');
const pokeTypOne = document.querySelector('.poke-type-one');
const pokeTypeTwo = document.querySelector('.poke-type-two');
const pokeWeight = document.querySelector('.poke-weight');
const pokeHeight = document.querySelector('.poke-height');
const pokeAbility = document.querySelector('.poke-ability');
const pokeListItems = document.querySelectorAll('.list-item');
const leftButton = document.querySelector('.left-button');
const rightButton = document.querySelector('.right-button');
const randomButton = document.querySelector('.random-button');


// constants and vars
const TYPES = [
    'normal', 'fighting', 'flying',
    'poison', 'ground', 'rock',
    'bug', 'ghost', 'steel',
    'fire', 'water', 'grass',
    'electric', 'psychic', 'ice',
    'dragon', 'dark', 'fairy'
];

let prevURL = null;
let nextURL = null;
const min = 0; 
const max = 1000;

//function

const capitalize = (str) => str[0].toUpperCase() + str.substr(1);

//remove all classes
const resetScreen = () => {
    mainScreen.classList.remove('hide');
    for (const type of TYPES) {
        mainScreen.classList.remove(type);
    }
}
const fetchPokeList = url => {
    // get data for left site pokedex
    fetch(url)
        .then(res => res.json())
        .then(data => {
            const {
                results,
                previous,
                next
            } = data;
            prevURL = previous;
            nextURL = next;

            for (let i = 0; i < pokeListItems.length; i++) {
                const pokeListItem = pokeListItems[i];
                const resultData = results[i];

                if (resultData) {
                    const {
                        name,
                        url
                    } = resultData;
                    // splits array
                    const urlArray = url.split('/');
                    const id = urlArray[urlArray.length - 2];
                    pokeListItem.textContent = id + '. ' + capitalize(name);
                } else {
                    pokeListItem.textContent = '';
                }
            }
        })
}

const fetchPokeData = id => {
    // get data for left site pokedex
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then(res => res.json())
        .then(data => {
            resetScreen();
            const dataTypes = data['types'];
            //extract 2 types of pokes
            const dataFirstType = dataTypes[0];
            const dataSecondType = dataTypes[1];
            pokeTypOne.textContent = capitalize(dataFirstType['type']['name']);
            if (dataSecondType) {
                pokeTypeTwo.classList.remove('hide');
                pokeTypeTwo.textContent = capitalize(dataSecondType['type']['name'])
            } else {
                pokeTypeTwo.textContent = '';
                pokeTypeTwo.classList.add('hide');
            }
            mainScreen.classList.add(dataFirstType['type']['name']);
            pokeName.textContent = capitalize(data['name']);
            pokeId.textContent = '#' + data['id'].toString().padStart(3, '0');
            pokeHeight.textContent = data['height'];
            pokeWeight.textContent = data['weight'];
            pokeAbility.textContent = data['abilities'][0]['ability']['name'];
            //update picture src
            // if there is no pic then go empty
            pokeFrontImage.src = data['sprites']['front_default'] || '';
            pokeBackImage.src = data['sprites']['back_default'] || '';
        })
}

const handleLeftButton = () => {
    if (prevURL) {
        fetchPokeList(prevURL)
    }
}

const handleRightButton = () => {
    if (nextURL) {
        fetchPokeList(nextURL)
    }
}

const handleListItem = (e) => {
    if (!e.target) return;
    const listItem = e.target;
    if (!listItem.textContent) return;
    const id = listItem.textContent.split('.')[0];
    fetchPokeData(id);
}

const handlerandomButton = (e) => {
    const randomId = getRandomInt(min, max);
    fetchPokeData(randomId);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

// add event listrenrs 
leftButton.addEventListener('click', handleLeftButton)
rightButton.addEventListener('click', handleRightButton)
for (const pokeListItem of pokeListItems) {
    pokeListItem.addEventListener('click', handleListItem)
}
randomButton.addEventListener('click', handlerandomButton)
// initialize app
fetchPokeList('https://pokeapi.co/api/v2/pokemon?offset=0&limit=20');