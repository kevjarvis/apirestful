const express = require('express');
const cors = require('cors')
const { param } = require('express/lib/request');

// Importando modulos de utilidad
const { FileHandler } = require('./utilities/FileHandler')

const router = express.Router();

const app = express();
const port = 8080;
app.use(cors());

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
  if (!(await products_handler.getByID(req.params.id))) {
    res.send({error: 'producto no encontrado'})
  };

  const product = products_handler.getByID(req.params.id);
  // validando que el body sea correcto

  const requiredKeys = ['title', 'price', 'thumbnail'];

  // Iteramos sobre la lista de claves necesarias
  for (const key of requiredKeys) {
    if (!req.body.hasOwnProperty(key)) {
      res.send({error: 'el body de la peticion es incorrecto'})
      return false;
    }
  }

  // Si todas las claves necesarias se encuentran en el cuerpo de la petición...
  await products_handler.deleteByID(req.params.id)
  const new_id = await products_handler.save(req.body)

  res.json({
    result: 'ok',
    message: 'producto modificado con éxito',
    nuevo_id: new_id
  })
})

router.delete('/:id', async (req, res) => {
  // elminimar el recurso buscandolo con req.params.id
  await products_handler.deleteByID(req.params.id);
  res.json({
    result: 'ok',
    id: 'producto eliminado exitosamente'
  })
})