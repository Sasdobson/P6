// const Sauce = require('../Models/SauceModel')



// exports.hello = (req, res, next) => {
//     res.status(200).json({ bonjour: "hello" })
// }

// exports.create = (req, res, next) => {
//     //req.body
// }
const Sauce = require('../models/SauceModel');
const fs = require('fs');

exports.getAllSauce = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};


exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};


exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
        .catch(error => {
            console.log(json({ error }));
            res.status(400).json({ error });
        });
};
exports.modifySauce = (req, res, next) => {
    if (req.file) {
        // si l'image est modifiée, il faut supprimer l'ancienne image dans le dossier /image
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    // une fois que l'ancienne image est supprimée dans le dossier /image, on peut mettre à jour le reste
                    const sauceObject = {
                        ...JSON.parse(req.body.sauce),
                        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                    }
                    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Sauce modifiée!' }))
                        .catch(error => res.status(400).json({ error }));
                })
            })
            .catch(error => res.status(500).json({ error }));
    } else {
        // si l'image n'est pas modifiée
        const sauceObject = { ...req.body };
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce modifiée!' }))
            .catch(error => res.status(400).json({ error }));
    }
};

/**
 * SUPPRIMER UNE SAUCE
 */
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
                    .catch(error => res.status(400).json({ error }));
            })
        })
        .catch(error => res.status(500).json({ error }));
};

exports.likeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        //console.log('sauce trouvée !')
            //req.body.like 1 pour like, -1 pour dislike, 0 pour unlike ou undislike
        if(req.body.like == 1) {
            console.log('sauce like !')
            sauce.likes += 1
            sauce.usersLiked.push(req.body.userId)
        }
        else if(req.body.like == -1) {
            console.log('sauce dislike !')
            sauce.dislikes += 1
            sauce.usersDisliked.push(req.body.userId)
        }
        else {

            //console.log(sauce)
            let indexLikes = sauce.usersLiked.indexOf(req.body.userId)
            //console.log(indexLikes)
            if(indexLikes !== -1) { //sauce.usersLiked.includes(req.body.userId)
                sauce.likes -= 1
                sauce.usersLiked.splice(indexLikes, 1)
               // console.log(sauce)
               // console.log('sauce unlike !')

            }

            let indexDislikes = sauce.usersDisliked.indexOf(req.body.userId)
            if(indexDislikes !== -1) { //sauce.usersDisliked.includes(req.body.userId)
                sauce.dislikes -= 1
                sauce.usersDisliked.splice(indexDislikes, 1)
                //console.log('sauce undislike !')
            }
        }
        //console.log('save')
        sauce.save()
        res.status(200).json(sauce)
    })
    .catch(error => res.status(400).json({ error }));
}
