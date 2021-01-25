const express = require('express');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

const app = express();

const Categoria = require('../models/categoria');

//===============================
// Mostrar todas las categorias
//===============================

app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias
            });
        });

});

//===============================
// Mostrar una categoria por ID
//===============================

app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (categoriaDB) {
            res.json({
                ok: true,
                categoria: categoriaDB
            });
        } else {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe categoria'
                }
            });
        }
    });

});

//===============================
// Crear nueva categoria
//===============================

app.post('/categoria', verificaToken, (req, res) => {

    // regresa la nueva categoria
    // req.usuario._id

    let body = req.body;
    let id = req.usuario._id;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: id
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
        } else {
            res.json({
                ok: true,
                categoria: categoriaDB
            });
        }
    });

});

//===============================
// Actualizar categoria
//===============================

app.put('/categoria/:id', verificaToken, (req, res) => {

    //Actualizar la descripcion de la categoria

    let id = req.params.id;
    let body = req.body;

    let cambios = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate(id, cambios, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (categoriaDB) {
            res.json({
                ok: true,
                categoria: categoriaDB
            });
        } else {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe categoria'
                }
            });
        }


    });

});



//===============================
// Borrar categoria
//===============================

app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndDelete(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (categoriaDB) {
            res.json({
                ok: true,
                categoria: categoriaDB
            });
        } else {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe categoria'
                }
            });
        }

    });

});





module.exports = app;