function loader() {
    let template = '';
    template += '<div class="overlay">'+
                '<span class="spinner v3">'+
                '<span></span>' +
                '<span></span>' +
                '</span>' +
                '</div>'; 
    $('.loader').html(template);
}
loader();
const API ='https://pokeapi.co/api/v2/pokemon?limit=200';
const $pokemonsList = $('.list .pokemon-list');
const $query = $('.list .query');

let pokemons = [];
let filteredPokemons = [];

function resultGenerator(forms, experience, ability, type, sprites) {
        let template = '<table class="description-poke">';
        template +='<tr><th>Name:</th>'; 
        forms.forEach(function(el) {                                   
            template += '<td>'+ el.name +'</td>';       
        });
        template += '<td><img src="'+ sprites.front_default +'"></td>' +
        '</th></tr>' +
        '<tr><th>Base experience:</th>' + 
        '<td>'+ experience +'</td>' +
        '<td></td>' +
        '</th></tr>' +
        '<tr><th>Abilities:</th>';
        ability.forEach(function(el) {                                   
            template += '<td>' + el.ability.name + '</td>';       
        });
        template +='</th></tr>' +
        '<tr><th>Types:</th>';
        type.forEach(function(el){
            template += '<td>' + el.type.name + '</td>';
        });
        template +='</th></tr></table>';
        
        $('.param').html(template);  
}
function templateGenerator(list) {
    let template = '';
    if (list.length == 0) {
        template = '<li>Not Found</li>';
    } else {
        list.forEach(function (el) {
            template += '<li class="item" data-url="' + el.url + '"><a href="#'+ el.name +'">' + el.name + '</a></li>';
        });
    }

    $pokemonsList.html(template);
}

$.getJSON(API)
    .done(function (data) {   
        $('.loader').addClass('hidden');
        pokemons = data.results;
        pokemons.sort(function (a, b) {
            if (a.name > b.name) return 1;
            else if (a.name < b.name) return -1;
            return 0;
        });
        templateGenerator(pokemons);
    });

$query.on('input', function () {
    let value = $(this).val();
    filteredPokemons = pokemons.filter(function (el) {
        if (el.name.indexOf(value) != (-1)) return true;
        else return false;
    });
    templateGenerator(filteredPokemons);
});

$pokemonsList.on('click', '.item', function () {
    let pokemonURL = $(this).attr('data-url');
    $.getJSON(pokemonURL)
            .done(function (data) {
                resultGenerator(data.forms, data.base_experience, data.abilities, data.types, data.sprites);
            });
});