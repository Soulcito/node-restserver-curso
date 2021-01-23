//===============================================
//  Puerto
//===============================================

process.env.PORT = process.env.PORT || 3000;

//===============================================
//  Entorno
//===============================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//===============================================
//  Base de Datos
//===============================================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
}
esle {
    urlDB = 'mongodb+srv://sould:WOnaUUZo2ETPqIZO@cluster0.pmpiy.mongodb.net/cafe';
}

process.env.URLDB = urlDB;