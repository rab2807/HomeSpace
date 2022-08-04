const starString = (value) => {
    let str = "";
    for (let i = 0; i < value; i++)
        str = str.concat('<i class="fas fa-star"></i>');
    for (let i = 0; i < 5 - value; i++)
        str = str.concat('<i class="far fa-star"></i>');
    return str;
};
const ratingBarHelper = (arr) => {
    /*
                <tr>
                    <td>
                        <label htmlFor="rating">5<i className="fas fa-star"></i> ({{count_5}})</label>
                    </td>
                    <td style="padding-left: 10px">
                        <progress value={{count_5}} max={{maxVal}}></progress>
                    </td>
                </tr>
    */
    let str = ``;
    let sum = arr.reduce((t, n) => t += n, 0);
    for (let i = 0; i < 5; i++) {
        str = str.concat(`<tr><td><label for="rating">${(5 - i)}<i class="fas fa-star"></i>(${arr[i]})</label></td>` +
            `<td style="padding-left: 10px"><progress value=${arr[i]} max=${sum}></progress></td></tr>`);
    }
    return str;
};

const concat = (val1, val2) => {
    return val1.concat(val2);
};

const compare = (a, b, opts) => {
    if (a === b) {
        return opts.fn(this);
    }
    return opts.inverse(this);
};

module.exports = {
    starString, compare, concat, ratingBarHelper
}
