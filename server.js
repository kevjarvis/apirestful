const express = require("express");
const handlebars = require("express-handlebars");
const request = require("request");
const {Server: HttpServer} = require('http');
const {Server: IOServer} = require('socket.io');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
io.serveClient(true);

app.engine(
  "hbs",
  handlebars.engine({
    extname: ".hbs",
    defaultLayout: "index.hbs",
    layoutDir: __dirname + "\\views\\layouts",
    partialsDir: __dirname + "\\views\\partials",
  })
);

app.set("view engine", "hbs");
app.set("views", "./views");
app.use(express.static("dist"));

app.get("/", (req, res) => {
  res.render("formulario_productos", { layout: "container" });
});

const PRODUCT_API_URI = "http://127.0.0.1:8080/api/productos/";

const PORT = 3000;
httpServer.listen(PORT, () => {
  console.log(`Servidor inicializado en el puerto ${PORT}`);
});



app.get("/productos", (req, res) => {

  var options = {
    'method': 'GET',
    'url': PRODUCT_API_URI,
    'headers': {
      'Content-Type': 'application/json'
    }
  };
  
  console.log(options)
  
  request(options, function (error, response) {
    if (error) throw new Error(error);
    res.render("productos", {layout: "container", products : JSON.parse(response.body)})
  });
  
});


io.on('connection', (socket) => {
  console.log(`[NEW_USSR]: Usuario ${socket.id} se ha conectado`)

  socket.on('client:product-update', data => {
    io.sockets.emit('server:render-products', data)
  })

  var options = {
    'method': 'GET',
    'url': PRODUCT_API_URI,
    'headers': {
      'Content-Type': 'application/json'
    }
  };
  
  request(options, function (error, response) {
    if (error) throw new Error(error);
    io.emit('server:startup-update', response.body)
  });

  socket.on('client:new-message', data => {
    io.sockets.emit('server:new-message', data)
  })


})

