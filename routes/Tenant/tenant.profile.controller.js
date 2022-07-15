//-------- Sakib's part------
let ratingArr = [10, 9, 3, 4, 1];    // count of people per star [e.g. 6 people gave 5stars]

// comments array
let commentArr = [
    {
        // picture link should be added
        name: "Rakib",
        post_date: "21 July 2020",
        star: "⭐⭐⭐",
        comment: "bal sal",
    },
    {
        name: "Ahsan",
        post_date: "21 Feb 2020",
        star: "⭐⭐⭐⭐",
        comment: "bal sal",

    }
]
const house_num = 3;

function postComment(req, res)
{
    // save in database

    res.send(req.body);
}
//-------------------

const total = ratingArr.reduce((curr, elem) => curr + elem, 0);


function renderPage(req, res) {
    return res.render('profile', {
        pre: 'OwnerMain',
        type: "Home-owner",
        name: "rakib",
        catagory: "Individual owner",
        location: "Dhaka",
        email: "123@gmail.com",
        phone: "123455",
        house_num: house_num,
        s: (house_num > 1) ? "s" : "",
        rating: () => {
            let sum = 0;
            for (let i = 0; i < 5; i++)
                sum += (5 - i) * ratingArr[i];
            return (sum / total).toFixed(2);
        },
        maxVal: total,
        count_5: ratingArr[0],
        count_4: ratingArr[1],
        count_3: ratingArr[2],
        count_2: ratingArr[3],
        count_1: ratingArr[4],
        comments: commentArr
    });
}

module.exports = {
    renderPage, postComment
}
