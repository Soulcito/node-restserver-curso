const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');
let Categoria = require('../models/categoria');

//===============================
// Obtener productos
//===============================

app.get('/producto', verificaToken, (req, res) => {

    // trae todos los productos
    // populate: usuario categoria
    // paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });

        });
});

//===============================
// Obtener un producto por ID
//===============================

app.get('/producto/:id', verificaToken, (req, res) => {

    // populate: usuario categoria

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El ID no existe'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });

        });

});

//===============================
// Buscar productos
//===============================

app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i'); //sensible a las mayusculas y minusculas

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });
        });

});

//===============================
// Crear un nuevo producto
//===============================

app.post('/producto', verificaToken, (req, res) => {

    // grabar el usuario
    // grabar una categoria del listado

    let id = req.usuario._id;
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: id
    })

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });

});


//===============================
// Actualizar un producto
//===============================

app.put('/producto/:id', verificaToken, (req, res) => {

    // grabar el usuario
    // grabar una categoria del listado

    let id = req.params.id;
    let body = req.body;

    let cambios = {

        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria

    }

    Producto.findByIdAndUpdate(id, cambios, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });

});

//===============================
// Borrar un producto
//===============================

app.delete('/producto/:id', verificaToken, (req, res) => {

    // Disponible quede en falso

    let id = req.params.id;

    let cambios = {

        disponible: false

    }

    Producto.findByIdAndUpdate(id, cambios, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });

});




module.exports = app;