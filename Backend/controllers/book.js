const Book = require ('../models/book');
const fs = require ('fs');
const sharp = require('sharp');

exports.createBook = (req, res, next) => {
const url = req.protocol + '://' + req.get('host');
req.body.book = JSON.parse(req.body.book)

const webpFilename = req.file.originalname.split(' ').join('_').split('.')[0] + Date.now() + '.webp';

sharp(req.file.buffer)
.webp({ quality: 20 })
.toFile(`images/${webpFilename}`)
.then(() => {
const book = new Book({
userId: req.auth.userId,
title: req.body.book.title,
author: req.body.book.author,
imageUrl: url + '/images/' + webpFilename,
year: req.body.book.year,
genre: req.body.book.genre,
ratings: [
{
userId: req.auth.userId,
grade: req.body.book.ratings[0].grade,
}
],
averageRating: req.body.book.averageRating,
});

return book.save()

})
.then(() => {
    res.status(201).json({
        message: 'Book saved Successfully'
    });
})
.catch((error) => {
res.status(400).json({
    error: error
})    })
};

exports.getOneBook = (req, res, next) => {
    Book.findOne({
        _id: req.params.id
    }).then(
        (book) => {
            res.status(200).json(book);
        })
       .catch((error) => {
            res.status(404).json({
                error: error
            });
        });
};

exports.modifyBook = (req, res, next) => {
    
let book = ({_id: req.params.id})
if(req.file) {
const url = req.protocol + '://' + req.get('host');
req.body.book = JSON.parse(req.body.book)

const webpFilename = req.file.originalname.split(' ').join('_').split('.')[0] + Date.now() + '.webp';

book = {
_id: req.params.id,
title: req.body.book.title,
author: req.body.book.author,
imageUrl: url + '/images/' + webpFilename,
year: req.body.book.year,
genre: req.body.book.genre,
averageRating: req.body.book.averageRating,
}; 
sharp(req.file.buffer)
.webp({ quality: 20 })
.toFile(`images/${webpFilename}`)
} 

else {
book = {
_id: req.params.id,
title: req.body.title,
author: req.body.author,
imageUrl: req.body.imageUrl,
year: req.body.year,
genre: req.body.genre,
averageRating: req.body.averageRating,
    };
}
Book.updateOne({_id: req.params.id}, book) .then(() => {
    res.status(201).json({
        message: 'Book updated successfully!'
    });
    })
    .catch((error) => {
    res.status(400).json({
        error: error
    })
    })
};

exports.deleteBook = (req, res, next) => {
    Book.findOne({_id: req.params.id}) .then((book) => {
        const webpFilename = book.imageUrl.split('/images/')[1];
        fs.unlink('images/' + webpFilename , () => {
        Book.deleteOne({_id: req.params.id}) .then(() => {
        res.status(200).json({
            message: 'Book deleted'})
        })
        .catch((error) => {
            res.status(400).json({
                error: error
            })
        });    
        })
    });
    };

exports.getAllBooks = (req, res, next) => {
    Book.find().then(
    (books) => {
    res.status(200).json(books);
    })
    .catch((error) => {
    res.status(400).json({
    error: error
});
    });
};

exports.getTopThreeBooks = (req, res, next) => {
Book.find()
.sort({averageRating: -1})
.limit(3)
.then(
    (books) => {
    res.status(200).json(books);
    })
    .catch((error) => {
    res.status(400).json({
    error: error
});
    });
};

exports.createRateBook = (req, res, next) => {
Book.findOne({_id: req.params.id}) .then((book) => {

    if(req.body.ratings < 0 || req.body.ratings > 5) {
        return res.status(400).json({
        message: "The rate must be between 0 and 5!"
        });
    };

    const userAlreadyRated = book.ratings.find(r => r.userId === req.auth.userId)

    if (userAlreadyRated) {
        return res.status(400).json({
            message: "You already rated this book!"
        });
    };

    const newRateUser = {
        userId: req.auth.userId,
        grade: req.body.ratings
    };

    book.ratings.push(newRateUser);

    const totalRatings = book.ratings.length;
    const totalGrades = book.ratings.reduce((acc, ratings) => acc + ratings.grade, 0);

    book.averageRating = totalGrades / totalRatings;

    return book.save();
})

.then((ratedBook) => {
    res.status(201).json(ratedBook)
})
.catch((error) => {
    res.status(500).json({
        error: error
    });
});
};

