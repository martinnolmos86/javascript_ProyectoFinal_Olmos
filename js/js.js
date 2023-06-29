// FUNCION ASINCRONA

const bring = async () => {
  const response = await fetch("./data.json");
  const data = await response.json();
  return data;
};
// // CAPTURAMOS UN ELEMENTO

const containerDogsAndCats = document.querySelector("#container");

// CREO UN SUPUESTO CARRITO PARA ALMACENAR EL ANIMAL QUE ELIJA EL USUARIO

const carrito = [];

const animals = () => {
  bring().then((response) => {
    let animal = response;
    animal.map((animal, index) => {
      let card = document.createElement("div");
      card.classList.add("card", "col-sm-12", "col-lg-3");
      card.innerHTML = `
        <img src="${animal.imagen}" class="card-img-top" alt="...">
        <div class="card-body">
        <h5 class="card-title">${animal.nombre}</h5>
        <p class="card-text">Un texto de ejemplo rápido para colocal cerca del título de la tarjeta y componer la mayor parte del contenido de la tarjeta.</p>
          <button type="button" class="btn btn-dark btnAnimals" onClick="adoptar(${index})">Adoptar</button>
          </div>
          `;
      containerDogsAndCats.appendChild(card);
    });
  });
};

// LLAMADO A LA FUNCION ANIMALS

animals();

// FUNCION DEL BOTON ADOPTAR QUE ES LLAMADA POR LA FUNCION animals()

function adoptar(index) {
  bring().then(async (response) => {
    let animal = response[index];
    const { value: email } = await Swal.fire({
      title: "Ingresar dirección de correo electrónico",
      text: `Estás adoptando a ${animal.nombre}. Tu solicitud quedará en cola para su revisión.`,
      imageUrl: `${animal.imagen}`,
      imageWidth: 400,
      imageHeight: 200,
      input: "email",
      inputLabel: "Ingresa tu dirección de correo electrónico",
      inputPlaceholder: "Ingresa tu dirección de correo electrónico",
      confirmButtonText: "Enviar solicitud",
      cancelButtonText: "Cancelar",
      showCancelButton: true,
      showLoaderOnConfirm: true,
      preConfirm: (email) => {
        return email;
      },
    });

    if (email) {
      Swal.fire({
        title: "¡Solicitud enviada!",
        text: `Gracias por tu interés en adoptar a ${animal.nombre}! Tu solicitud ha sido enviada y quedará en cola para su revisión. Pronto nos comunicaremos contigo a la dirección de correo ingresada (${email}).`,
        icon: "success",
      });
    }
  });
}

// === SEGUNDA FUNCIONALIDAD ===

// CAPTURO LA ETIQUETA FORM PARA CREAR EL FORMULARIO DE DONACIONES

const formul = document.querySelector("form");

// CREO EL FORMULARIO

formul.innerHTML = `
  <div class="row g-3">
                  <div class="col">
                      <input type="text" class="form-control" id="nombre" placeholder="Nombre" aria-label="Nombre">
                  </div>
                  <div class="col">
                      <input type="text" class="form-control" id="apellido" placeholder="Apellido" aria-label="Apellido">
                  </div>
              </div>
  
              <div class="row mb-3 mt-3">
  
                  <div class="col">
                      <input type="email" class="form-control" id="email" placeholder="Email">
                  </div>
              </div>
              <div class="input-group mb-3">
                  <span class="input-group-text">$</span>
                  <input type="text" class="form-control" id="donacion" aria-label="Cantidad (al dólar más cercano)"
                      placeholder="Ingrese el monto que desea donar">
              </div>
              <button type="submit" class="btn btn-primary button">Enviar</button>
  
  `;

// SECCION DONACIONES

// CREO EL CONSTRUCTOR DE LOS DONANTES

class Donante {
  constructor(name, lastName, email, donation) {
    this.nombre = name;
    this.apellido = lastName;
    this.email = email;
    this.donation = donation;
  }
}

// ARRAY PARA ALMACENAR LOS DONANTES

montoDonar = [];

// CAPTURO EL FORMULARIO Y LOS ID DE LOS IMPUTS

const form = document.querySelector("form");
const captureName = document.querySelector("#nombre");
const captureApellido = document.querySelector("#apellido");
const captureEmail = document.querySelector("#email");
const captureDonacion = document.querySelector("#donacion");

form.addEventListener("submit", validateForm);

function validateForm(e) {
  e.preventDefault();

  // VERIFICAR SI ESTAN LOS CAMPOS COMPLETOS AL ENVIAR

  if (
    captureName.value === "" ||
    captureApellido.value === "" ||
    captureEmail.value === "" ||
    captureDonacion.value === ""
  ) {
    Swal.fire("Por favor, completa todos los campos.");
    return;
  }

  const newDonante = new Donante(
    captureName.value,
    captureApellido.value,
    captureEmail.value,
    captureDonacion.value
  );

  // AGREGO EL NUEVO DONANTE AL ARRAY

  montoDonar.push(newDonante);

  // AGREGAMOS AL LOCALSTORAGE LA DONACION

  localStorage.setItem(`donacion`, JSON.stringify(montoDonar));

  Swal.fire("Gracias por tu generosidad.");

  // CON RESET() BORRAMOS LOS DATOS INGRESADOS EN EL INPUT LUEGO DE PULSAR "ENVIAR"

  form.reset();
}

// CUANDO ACTUALIZO LA PAGINA Y TENGO COSAS EN EL LOCALSTORAGE LAS AGREGO AL CARRITO

if (localStorage.getItem("donacion")) {
  let infoLocalS = JSON.parse(localStorage.getItem("donacion"));
  montoDonar.push(...infoLocalS);
}

// CAPTURO BOTONES DE HTML PARA VER DONACIONES O BORRARLAS

const btn1 = document.querySelector("#btn1");
const btn2 = document.querySelector("#btn2");

// CAPTURO EL DIV DEL HTML

const containerDonation = document.getElementById("containerDonate");

// ESCUCHO EL BOTON 1 PARA VER LAS DONACIONES

btn1.addEventListener("click", () => {
  seeDonation();
});

// FUNCION PARA MOSTRAR LAS DONACIONES

function seeDonation() {
  containerDonation.innerHTML = ``;
  montoDonar.forEach((donate, index) => {
    const divDonate = document.createElement("div");
    divDonate.innerHTML = `  
      <p>Nombre del Donante: ${donate.nombre} ${donate.apellido}</p>
      <p>Dono: ${donate.donation}</p>
      <button type="button" class="btn btn-primary btn-sm btn-delete" data-index="${index}">Eliminar</button>
  
      `;
    containerDonation.appendChild(divDonate);
  });

  // AGREGAR EL EVENT LISTENER A LOS BOTONES DE ELIMINAR

  const deleteButtons = document.getElementsByClassName("btn-delete");
  for (let i = 0; i < deleteButtons.length; i++) {
    deleteButtons[i].addEventListener("click", () => deleteDonation(i));
  }
}
// FUNCION PARA ELIMINAR UNA DONACION

function deleteDonation(index) {
  montoDonar.splice(index, 1); // ELIMINAR EL ELEMENTO DEL ARRAY

  // ACTUALIZAR EL LOCALSTORAGE CON LOS NUEVOS DATOS

  localStorage.setItem("donacion", JSON.stringify(montoDonar));

  // VOLVER A MOSTRAR LAS DONACIONES ACTUALIZADAS

  seeDonation();
}

// ESCUCHO BOTON 2

btn2.addEventListener("click", clearLocal);

// FUNCION BORRAR LOCALSTORAGE

function clearLocal() {
  localStorage.clear();
}
