let listaUsuario = JSON.parse(localStorage.getItem("usuarios"));
if (!listaUsuario) {
  listaUsuario = [
    { id: 1,  nombre: "admin",  email: "admin@gmail.com",  contrasena: "1",   tipo: "admin"   },
    { id: 2,  nombre: "juan",   email: "juan@gmail.com",   contrasena: "123", tipo: "usuario" },
    { id: 3,  nombre: "maria",  email: "maria@gmail.com",  contrasena: "456", tipo: "empleado"},
    { id: 4,  nombre: "pedro",  email: "pedro@gmail.com",  contrasena: "999", tipo: "empleado"},
    { id: 11, nombre: "claudio",email: "claudio@gmail.com",contrasena: "999", tipo: "empleado"},
    { id: 12, nombre: "agustin",email: "agustin@gmail.com",contrasena: "999", tipo: "empleado"},
  ];
  localStorage.setItem("usuarios", JSON.stringify(listaUsuario));
}

const getUsuarios = () => JSON.parse(localStorage.getItem("usuarios")) || [];
const setUsuarios = (arr) => localStorage.setItem("usuarios", JSON.stringify(arr));
const getUsuarioActual = () => JSON.parse(localStorage.getItem("usuarioActual"));
const setUsuarioActual = (u) => localStorage.setItem("usuarioActual", JSON.stringify(u));


function mostrarEmpleados() {
  const contenedor = document.getElementById("listaEmpleados");
  if (!contenedor) return;
  contenedor.innerHTML = "";

  const empleados = getUsuarios().filter((u) => u.tipo === "empleado");
  if (empleados.length === 0) {
    contenedor.innerHTML = "<p>No hay empleados registrados.</p>";
    return;
  }

  empleados.forEach((empleado) => {
    const item = document.createElement("div");
    item.classList.add("empleado-item");
    item.innerHTML = `
      <p><strong>ID:</strong> ${empleado.id}</p>
      <p><strong>Nombre:</strong> ${empleado.nombre}</p>
      <p><strong>Email:</strong> ${empleado.email}</p>
    `;
    contenedor.appendChild(item);
  });
}

function mostrarClientes() {
  const contenedor = document.getElementById("listaClientes");
  if (!contenedor) return;
  contenedor.innerHTML = "";

  const clientes = getUsuarios().filter((u) => u.tipo === "usuario");
  if (clientes.length === 0) {
    contenedor.innerHTML = "<p>No hay clientes registrados.</p>";
    return;
  }

  clientes.forEach((cliente) => {
    const item = document.createElement("div");
    item.classList.add("cliente-item");
    item.innerHTML = `
      <p><strong>ID:</strong> ${cliente.id}</p>
      <p><strong>Nombre:</strong> ${cliente.nombre}</p>
      <p><strong>Email:</strong> ${cliente.email}</p>
    `;
    contenedor.appendChild(item);
  });
}

/* ====== Contadores ====== */
function contarUsuarios() {
  return getUsuarios().filter((u) => u.tipo === "usuario").length;
}
function contarEmpleados() {
  return getUsuarios().filter((u) => u.tipo === "empleado").length;
}

/* ====== Login ====== */
function validarUsuario(email, contrasena) {
  return getUsuarios().find((u) => u.email === email && u.contrasena === contrasena);
}

const formLogin = document.querySelector(".login-form");
if (formLogin) {
  formLogin.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = formLogin.querySelector('input[type="text"], input[type="email"]').value;
    const contrasena = formLogin.querySelector('input[type="password"]').value;

    const usuario = validarUsuario(email, contrasena);

    if (usuario) {
      // Guardar usuario logueado para usarlo en otras páginas
      setUsuarioActual(usuario);

      if (usuario.tipo === "admin") {
        window.location.href = "home-admin.html";
      } else {
        window.location.href = "index.html";
      }
    } else {
      alert("Usuario o contraseña incorrectos.");
    }
  });
}

/* ====== Registro de usuarios ====== */
const registroForm = document.querySelector(".registro-form");
if (registroForm) {
  registroForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (!nombre || !email || !password || !confirmPassword) {
      alert("Todos los campos son obligatorios.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 5 ){
      alert("La cotraseña debe tener al menos 5 caracteres");
      return;
    }

    const usuarios = getUsuarios();
    const usuarioExistente = usuarios.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (usuarioExistente) {
      alert("Este correo ya está registrado.");
      return;
    }

    const nuevoUsuario = {
      id: usuarios.length ? Math.max(...usuarios.map(u => u.id)) + 1 : 1,
      nombre,
      email,
      contrasena: password,
      tipo: "usuario",
    };

    usuarios.push(nuevoUsuario);
    setUsuarios(usuarios);
    registroForm.reset();
    window.location.href = "inicio-sesion.html";
  });
}

/* ====== Perfil Admin (edición) ====== */
function hookPerfilAdmin() {
  const form = document.getElementById("form-perfil-admin");
  if (!form) return; // No estamos en la página de perfil

  const inputNombre = document.getElementById("perfil-nombre");
  const inputEmail  = document.getElementById("perfil-email");
  const inputPass1  = document.getElementById("perfil-password");
  const inputPass2  = document.getElementById("perfil-password2");
  const btnCancelar = document.getElementById("btn-cancelar");
  const msgEl       = document.getElementById("perfil-msg");

  const showMsg = (texto, tipo = "ok") => {
    if (!msgEl) return;
    msgEl.textContent = texto;
    msgEl.classList.remove("ok", "err");
    msgEl.classList.add(tipo);
  };


  const ua = getUsuarioActual();
  // Precargar
  if (inputNombre) inputNombre.value = ua.nombre || "";
  if (inputEmail)  inputEmail.value  = ua.email  || "";

  // Guardar
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = (inputNombre?.value || "").trim();
    const email  = (inputEmail?.value  || "").trim().toLowerCase();
    const pass1  = (inputPass1?.value  || "").trim();
    const pass2  = (inputPass2?.value  || "").trim();

    if (!nombre || !email) {
      showMsg("Nombre y email son obligatorios.", "err");
      return;
    }

    const usuarios = getUsuarios();
    const emailTomado = usuarios.some((u) => u.email.toLowerCase() === email && u.id !== ua.id);
    if (emailTomado) {
      showMsg("Ese email ya está registrado por otro usuario.", "err");
      return;
    }

    let nuevaContrasena = ua.contrasena;
    if (pass1 || pass2) {
      if (pass1 !== pass2) {
        showMsg("Las contraseñas no coinciden.", "err");
        return;
      }
      if (pass1.length < 3) {
        showMsg("La contraseña debe tener al menos 3 caracteres.", "err");
        return;
      }
      nuevaContrasena = pass1;
    }

    const idx = usuarios.findIndex((u) => u.id === ua.id);
    if (idx === -1) {
      showMsg("No se encontró el usuario en la base local.", "err");
      return;
    }

    const actualizado = {
      ...usuarios[idx],
      nombre,
      email,
      contrasena: nuevaContrasena,
      tipo: "admin",
    };

    usuarios[idx] = actualizado;
    setUsuarios(usuarios);
    setUsuarioActual(actualizado);

    if (inputPass1) inputPass1.value = "";
    if (inputPass2) inputPass2.value = "";

    showMsg("Perfil actualizado correctamente.", "ok");
  });

  // Cancelar → restaurar
  btnCancelar?.addEventListener("click", () => {
    const u = getUsuarioActual(); // por si cambió en otra pestaña
    if (u) {
      if (inputNombre) inputNombre.value = u.nombre || "";
      if (inputEmail)  inputEmail.value  = u.email  || "";
    }
    if (inputPass1) inputPass1.value = "";
    if (inputPass2) inputPass2.value = "";
    showMsg("Cambios cancelados.");
  });
}

/* ====== Carrusel ====== */
function hookCarrusel() {
  const slides = document.querySelectorAll(".carrusel-slide");
  const prevBtn = document.querySelector(".carrusel-btn.prev");
  const nextBtn = document.querySelector(".carrusel-btn.next");
  if (!slides.length || !prevBtn || !nextBtn) return;

  let index = 0;
  function showSlide(n) {
    slides.forEach((slide) => slide.classList.remove("active"));
    slides[n].classList.add("active");
  }
  function nextSlide() {
    index = (index + 1) % slides.length;
    showSlide(index);
  }
  function prevSlide() {
    index = (index - 1 + slides.length) % slides.length;
    showSlide(index);
  }

  nextBtn.addEventListener("click", nextSlide);
  prevBtn.addEventListener("click", prevSlide);
  setInterval(nextSlide, 5000);
}

/* ====== Inicializaciones por página ====== */
document.addEventListener("DOMContentLoaded", () => {
  // Contadores
  const totalUsuariosEl = document.getElementById("totalUsuarios");
  const totalEmpleadosEl = document.getElementById("totalEmpleados");
  if (totalUsuariosEl) totalUsuariosEl.innerText = contarUsuarios();
  if (totalEmpleadosEl) totalEmpleadosEl.innerText = contarEmpleados();

  // Listas (si existen)
  if (document.getElementById("listaClientes")) mostrarClientes();
  if (document.getElementById("listaEmpleados")) mostrarEmpleados();

  // Otros contadores opcionales (si tienes esas funciones definidas en otro archivo)
  const satisfaccionEl = document.getElementById("satisfaccion");
  if (typeof obtenerSatisfaccion === "function" && satisfaccionEl) {
    satisfaccionEl.innerText = obtenerSatisfaccion();
  }
  const productosSinStockEl = document.getElementById("productosSinStock");
  if (typeof productosSinStock === "function" && productosSinStockEl) {
    productosSinStockEl.innerText = productosSinStock();
  }
  const totalComprasEl = document.getElementById("totalCompras");
  if (typeof totalCompras === "function" && totalComprasEl) {
    totalComprasEl.innerText = totalCompras();
  }

  // Hooks específicos de páginas
  hookPerfilAdmin(); // si está el form, se activa
  hookCarrusel();    // si hay carrusel, se activa
});
