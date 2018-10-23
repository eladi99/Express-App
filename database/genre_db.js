let genres_arr = [
    {
        id: 3810,
        name: 'mystery'
    },
    {
        id: 2943,
        name: 'thriller'
    }
];

function generate_ID(genres) {
    return Math.round(genres.reduce((sum, g) => sum + g.id, 0) / 9);
}

module.exports = {
    genres: genres_arr,
    generate_ID: generate_ID
};