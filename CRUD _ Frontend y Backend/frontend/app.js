
const API_URL = 'http://localhost:3000/products';
let products = [];
let deleteId = null;

window.addEventListener('DOMContentLoaded', () => {
  getProducts();
})

const getProducts = () => {
  fetch(API_URL)
  .then(response => response.json())
  .catch(error => {
    alertManager('error', 'Ocurrió un problema al cargar los productos');
  })
  .then(data => {
    products = data.data;
    renderResult(products);
  })
}

const productsList = document.querySelector('#productsList');

const renderResult = (products) => {
  let listHTML = "";
  products.forEach(product => {
    listHTML += `
      <div class="card">
        <div>Nombre: ${product.Nombre}</div>
        <div>Marca: ${product.Marca}</div>
        <div>Precio: ${product.Precio}</div>
        <div>Vencimiento: ${product.Vencimiento}</div>
        <div class="options">
          <button type="button" onclick="editProduct(${product.Id})">Editar</button>
          <button type="button" onclick="openModalConfirm(${product.Id})">Eliminar</button>
        </div>
      </div>
    `
  })
  productsList.innerHTML = listHTML;
}

const createProduct = () => {
  const formData = new FormData(document.querySelector('#formAdd'));

  if(!formData.get('nombre').length || !formData.get('marca') || !formData.get('precio')|| !formData.get('vencimiento')) {
    document.querySelector('#msgFormAdd').innerHTML = '* Llena todos los campos';
    return;
  }
  document.querySelector('#msgFormAdd').innerHTML = '';

  const product = {
    Nombre: formData.get('nombre'),
    Marca: formData.get('marca'),
    Precio: formData.get('precio'),
    Vencimiento: formData.get('vencimiento'),
  }

  console.log(product)

  fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify(product),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(res => res.json())
  .catch(error => {
    alertManager('error', error);
    document.querySelector('#formAdd').reset();
  })
  .then(response => {
    alertManager('success', response.mensaje)
    getProducts();
  })
}

const editProduct = (id) => {
  let product = {};
  products.filter(prod => {
    if(prod.Id == id){
      product = prod
    }
  });

  document.querySelector('#formEdit #ID').value = product.Id;
  document.querySelector('#formEdit #nombre').value = product.Nombre;
  document.querySelector('#formEdit #marca').value = product.Marca;
  document.querySelector('#formEdit #precio').value = product.Precio;
  document.querySelector('#formEdit #vencimiento').value = product.Vencimiento;

  console.log(product);
  openModalEdit();
}

const updateProduct = () => {
  const product = {
    Nombre: document.querySelector('#formEdit #nombre').value,
    Marca: document.querySelector('#formEdit #marca').value,
    Precio: document.querySelector('#formEdit #precio').value,
    Vencimiento: document.querySelector('#formEdit #vencimiento').value,
    Id: document.querySelector('#formEdit #ID').value,
  }

  if(!product.Nombre || !product.Marca || !product.Precio|| !product.Vencimiento) {
    document.querySelector('#msgFormEdit').innerHTML = '* Los campos no deden estar vacios';
    return;
  }
  document.querySelector('#msgFormEdit').innerHTML = '';

  fetch(API_URL, {
    method: 'PUT',
    body:JSON.stringify(product),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(res => res.json())
  .catch(error => {
    alertManager('error', error);
  })
  .then(response => {
    alertManager('success', response.mensaje);
    getProducts();
  });
  document.querySelector('#formEdit').reset();
}

const deleteProduct = (id) => {

  fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  })
  .then(res => res.json())
  .catch(error => {
    alertManager('error', error);
  })
  .then(response => {
    alertManager('success', response.mensaje);
    closeModalConfirm();
    getProducts();
    deleteId = null;
  })

}

const confirmDelete = (res) => {
  if(res){
    deleteProduct(deleteId);
  } else {
    closeModalConfirm();
  }
}



// MODAL ADD MANAGER
/** --------------------------------------------------------------- */
const btnAdd = document.querySelector('#btnAdd');
const modalAdd = document.querySelector('#modalAdd');

btnAdd.onclick = () => openModalAdd();

window.onclick = function(event) {
  if (event.target == modalAdd) {
    //modalAdd.style.display = "none";
  }
}

const closeModalAdd = () => {
  modalAdd.style.display = 'none';
}

const openModalAdd = () => {
  modalAdd.style.display = 'block';
}

// MODAL ADIT MANAGER
/** --------------------------------------------------------------- */
const modalEdit = document.querySelector('#modalEdit');

const openModalEdit = () => {
  modalEdit.style.display = 'block';
}

const closeModalEdit = () => {
  modalEdit.style.display = 'none';
}

window.onclick = function(event) {
  if (event.target == modalEdit) {
    //modalEdit.style.display = "none";
  }
}

// MODAL CONFIRM MANAGER
/** --------------------------------------------------------------- */
const modalConfirm = document.getElementById('modalConfirm');

window.onclick = function(event) {
  if (event.target == modalConfirm) {
    modalConfirm.style.display = "none";
  }
}

const closeModalConfirm = () => {
  modalConfirm.style.display = 'none';
}

const openModalConfirm = (id) => {
  deleteId = id;
  modalConfirm.style.display = 'block';
}


/** ALERT */
const alertManager = (typeMsg, message) => {
  const alert = document.querySelector('#alert');

  alert.innerHTML = message || 'Se produjo cambios';
  alert.classList.add(typeMsg);
  alert.style.display = 'block';

  setTimeout(() => {
    alert.style.display = 'none';
    alert.classList.remove(typeMsg);
  }, 3500);

}