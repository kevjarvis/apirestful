const express = require('express');
const { param } = require('express/lib/request');

// Importando modulos de utilidad
const { FileHandler } = require('./utilities/FileHandler')

const router = express.Router();

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/productos', router);


const DATABASE = 'databases/productos.txt';
const products_handler = new FileHandler('./databases/productos.txt')

app.listen(port, () => {
  console.log(`Servidor iniciado en el puerto ${port}`);
  // comprobando que se ha conectado con la base de dato
  products_handler.test()
});

router.get('/', async (req, res) => {
  const products = await products_handler.getAll()
  res.send(products)
})

router.get('/:id', async (req, res) => {
  const error_message = {error: 'producto no encontrado'}
  const product = await products_handler.getByID(req.params.id) || error_message;
  res.send(product)
})

router.post('/', async (req, res) => {
  console.log(req.body)
  const id = await products_handler.save(req.body)
  res.json({
    result: 'ok',
    message: 'Producto agregado con éxito',
    id: id
  })
})

router.put('/:id', async (req, res) => {
  // hallar el recurse de req.params.id
  // y reemplazar en req.body
  const product = products_handler.getByID(req.params.id);
  // validando que el body sea correcto

  const requiredKeys = ['key1', 'key2', 'key3'];

  // Iteramos sobre la lista de claves necesarias
  for (const key of requiredKeys) {
    // Verificamos si el cuerpo de la petición contiene la clave actual
    if (!requestBody.hasOwnProperty(key)) {
      // Si la clave no se encuentra en el cuerpo de la petición, retornamos false
      return false;
    }
  }

  // Si todas las claves necesarias se encuentran en el cuerpo de la petición, retornamos true
  return true;


  const keys_json = Object.keys(req.body)
  const keys_correctas = ['title', 'price', 'thumbnail']

  res.json({
    result: 'ok',
    message: 'producto modificado con éxito',
    product: products_handler.getByID(id)
  })
})

router.delete('/:id', async (req, res) => {
  // elminimar el recurso buscandolo con req.params.id
  res.json({
    result: 'ok',
    id: req.params.id
  })
})