const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const router = require('./router/router');
const BD = require('./config/database');
const app = express();

app.set('port', process.env.PORT || 3000);
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

//Rutas
app.use('/api', router);
app.use('/', express.static(path.join(__dirname, './public/dist')));
app.use('/images', express.static(path.join(__dirname, './public/images')));

// Iniciar servidor
app.listen(app.get('port'), async () => {
  console.log(`Servidor escuchando en el puerto: ${app.get('port')}`);
  try {
    await BD.sync();
    console.log('Base de datos conectada correctamente');
  } catch (error) {
    console.log('Ocurrió un error conectandose a la base de datos', error);
  }
});
