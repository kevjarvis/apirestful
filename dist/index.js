const toast_success = document.getElementById("toast-success");
const button = document.getElementById("submit");

const URI = "http://127.0.0.1:8080/api/productos/";

document.querySelector("#price").addEventListener("keyup", function () {
  if (/^[1-9][0-9]*$/.test(this.value)) {
    button.disabled = false;
  } else {
    button.disabled = true;
  }
});
const socket = io();

button.addEventListener("click", async function (e) {
  e.preventDefault();

  const data = {
    name: this.parentElement.querySelector('#name').value,
    price: this.parentElement.querySelector('#price').value,
    thumbnail: this.parentElement.querySelector('#thumbnail').value
  }

  try {
    const response = await fetch(URI, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    await response.json();
    // emitir evento para añadir el item a la lista a todos los usuarios
    socket.emit('client:product-update', data)

    this.parentElement.reset()
    
  } catch (error) {
    console.error(error);
  }
  
  toast_success.style.display = "flex";

  setTimeout(function () {
    toast_success.style.display = "none";
  }, 1500);

});

socket.on('server:render-products', (m) => {
  // llama a la función para renderizar el/los productos añadidos
  renderProducts(m)
})

socket.on('server:startup-update', (data) => {
  // carga inicial de los productos
  const products_container = document.getElementById('products-list-render');
  products_container.innerHTML = ''
  JSON.parse(data).forEach(product => renderProducts(product))
})

const close_chat = document.getElementById("close_chat");
const webchat = document.getElementById("webchat");
close_chat.addEventListener("click", (e) => {
  webchat.style.visibility = "hidden";
  webchat.style.opacity = 0;
});

const chat_button = document.getElementById("chat-button");
chat_button.addEventListener("click", () => {
  if (webchat.style.visibility !== "hidden") {
    // si está visible
    webchat.style.visibility = "hidden";
    webchat.style.opacity = 0;
  } else {
    webchat.style.visibility = "visible";
    webchat.style.opacity = '1';
    var messageBody = document.querySelector("#webchat-body");
    messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
  }
});

async function renderProducts (data) { 
  await fetch("./templates/product_home.hbs")
  .then(function(response) {
    return response.text();
  })
  .then(function(template) {
    // compila la plantilla
    const compiledTemplate = Handlebars.compile(template);
    // renderiza la plantilla con la información especificada
    const html = compiledTemplate({
      thumbnail: data.thumbnail,
      name: data.name,
      price: data.price
    });
    // inserta el HTML resultante en el documento
    const products_container = document.getElementById('products-list-render');
    products_container.innerHTML = html + products_container.innerHTML;
  });
  
}

// Validar nombre chat

const signUserButton = document.getElementById('send_username');
signUserButton.addEventListener('click', async (e) => {
  sessionStorage.setItem('username', document.getElementById('name_user').value )
  socket.emit('client:open-chat', true)
  e.preventDefault();
  
  // loadchat

  await fetch('./templates/chatlayout.hbs')
  .then(function(response) {
    return response.text();
  })
  .then(function(template) {
    const compiledTemplate = Handlebars.compile(template);

    const html = compiledTemplate({})
    const chatWrapper = document.getElementById('webchat-main');
    chatWrapper.innerHTML = html;
  } )
})

function sendMessage() {

  const textarea = document.getElementById('textarea');

  socket.emit('client:new-message', {
    autor: sessionStorage.getItem('username'),
    message: textarea.value
  });

  textarea.value = ''
  
}

async function renderMessage(autor, message) {
  await fetch('./templates/message.hbs')
  .then(response => {
    return response.text()
  })
  .then(template => {
    const compiledTemplate = Handlebars.compile(template);
    const html = compiledTemplate({
      autor: autor,
      mensaje: message
    })
    const chatlis = document.getElementById('webchat-body');
    chatlis.innerHTML += html
  })
    let messageBody = document.querySelector("#webchat-body");
  messageBody.scrollTop = messageBody.scrollHeight;
}

socket.on('server:new-message', data => {
  renderMessage(data.autor, data.message)

})