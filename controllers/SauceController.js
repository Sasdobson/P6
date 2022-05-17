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
