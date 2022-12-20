const express = require("express");
const handlebars = require("express-handlebars");
const request = require("request");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.get("/productos", (req, res) => {

  var options = {
    'method': 'GET',
    'url': PRODUCT_API_URI,
    'headers': {
      'Content-Type': 'application/json'
    }
  };
  
  request(options, function (error, response) {
    if (error) throw new Error(error);
    res.render("productos", {layout: "container", products : JSON.parse(response.body)})
  });
  
});

app.post("/productos", async (req, res) => {
  
  var options = {
    'method': 'POST',
    'url': PRODUCT_API_URI,
    'headers': {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(req.body)
  };

  request(options, function (error, response) {
    if (error) throw new Error(error);
  });

  setTimeout(function () {
    res.redirect("/");
  }, 1500);
  
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor inicializado en el puerto ${PORT}`);
});
