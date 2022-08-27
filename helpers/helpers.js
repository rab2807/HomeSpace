const starString = (value) => {
    let str = "";
    for (let i = 0; i < value; i++)
        str = str.concat('<i class="fas fa-star"></i>');
    for (let i = 0; i < 5 - value; i++)
        str = str.concat('<i class="far fa-star"></i>');
    return str;
};

const concat = (val1, val2) => {
    return val1.concat(val2);
};

const compare = (a, b, opts) => {
    if (a == b) {
        return opts.fn(this);
    }
    return opts.inverse(this);
};

module.exports = {
    starString, compare, concat
}
