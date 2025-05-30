// Variables globales
let currentSlide = 0
let currentCarousel = 0
const slides = document.querySelectorAll(".slide")
const carouselSlides = document.querySelectorAll(".carousel-slide")
const $ = window.$ // Declare the $ variable
const Fancybox = window.Fancybox // Declare the Fancybox variable

// Inicialización
$(document).ready(() => {
  // Mostrar modal después de 3 segundos
  setTimeout(showModal, 3000)

  // Inicializar Fancybox
  Fancybox.bind("[data-fancybox]", {
    Toolbar: {
      display: {
        left: ["infobar"],
        middle: ["zoomIn", "zoomOut", "toggle1to1", "rotateCCW", "rotateCW", "flipX", "flipY"],
        right: ["slideshow", "thumbs", "close"],
      },
    },
  })

  // Inicializar acordeón
  $(".accordion-header").click(function () {
    const content = $(this).next(".accordion-content")
    const icon = $(this).find(".accordion-icon")

    // Cerrar otros acordeones
    $(".accordion-content").not(content).removeClass("active")
    $(".accordion-icon").not(icon).removeClass("fa-minus").addClass("fa-plus")

    // Toggle actual
    content.toggleClass("active")
    icon.toggleClass("fa-plus fa-minus")
  })

  // Menú hamburguesa
  $(".hamburger").click(function () {
    $(this).toggleClass("active")
    $(".nav-links").toggleClass("active")
  })

  // Cerrar menú al hacer click en enlace
  $(".nav-links a").click(() => {
    $(".hamburger").removeClass("active")
    $(".nav-links").removeClass("active")
  })

  // Scroll suave para enlaces
  $('a[href^="#"]').click(function (e) {
    e.preventDefault()
    const target = $($(this).attr("href"))
    if (target.length) {
      $("html, body").animate(
        {
          scrollTop: target.offset().top - 80,
        },
        800,
      )
    }
  })

  // Animaciones al hacer scroll
  $(window).scroll(function () {
    const scrollTop = $(this).scrollTop()

    // Mostrar/ocultar botón scroll to top
    if (scrollTop > 300) {
      $(".scroll-top").addClass("visible")
    } else {
      $(".scroll-top").removeClass("visible")
    }

    // Efecto parallax
    $(".parallax-bg").css("transform", `translateY(${scrollTop * 0.5}px)`)

    // Animaciones fade-in
    $(".fade-in").each(function () {
      const elementTop = $(this).offset().top
      const windowBottom = $(window).scrollTop() + $(window).height()

      if (elementTop < windowBottom - 100) {
        $(this).addClass("visible")
      }
    })
  })

  // Auto-slider
  setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length
    updateSlider()
  }, 5000)

  // Validación de formulario
  $("#contactForm").submit(function (e) {
    e.preventDefault()
    if (validateForm()) {
      // Aquí iría la lógica para enviar el formulario
      alert("¡Mensaje enviado correctamente! Te contactaremos pronto.")
      this.reset()
      $(".form-group").removeClass("error")
    }
  })
})

// Funciones del slider
function changeSlide(direction) {
  currentSlide += direction
  if (currentSlide >= slides.length) currentSlide = 0
  if (currentSlide < 0) currentSlide = slides.length - 1
  updateSlider()
}

function updateSlider() {
  slides.forEach((slide, index) => {
    slide.classList.toggle("active", index === currentSlide)
  })
}

// Funciones del carousel
function nextCarousel() {
  currentCarousel = (currentCarousel + 1) % carouselSlides.length
  updateCarousel()
}

function prevCarousel() {
  currentCarousel = currentCarousel === 0 ? carouselSlides.length - 1 : currentCarousel - 1
  updateCarousel()
}

function updateCarousel() {
  const track = document.querySelector(".carousel-track")
  track.style.transform = `translateX(-${currentCarousel * 100}%)`
}

// Función scroll to top
function scrollToTop() {
  $("html, body").animate({ scrollTop: 0 }, 800)
}

// Funciones del modal
function showModal() {
  document.getElementById("promoModal").classList.add("active")
}

function closeModal() {
  document.getElementById("promoModal").classList.remove("active")
}

// Cerrar modal al hacer click fuera
window.onclick = (event) => {
  const modal = document.getElementById("promoModal")
  if (event.target === modal) {
    closeModal()
  }
}

// Validación del formulario
function validateForm() {
  let isValid = true
  const requiredFields = ["name", "email", "subject", "message"]

  requiredFields.forEach((field) => {
    const input = document.getElementById(field)
    const formGroup = input.parentElement
    const errorMessage = formGroup.querySelector(".error-message")

    if (!input.value.trim()) {
      formGroup.classList.add("error")
      errorMessage.style.display = "block"
      isValid = false
    } else {
      formGroup.classList.remove("error")
      errorMessage.style.display = "none"
    }
  })

  // Validación específica para email
  const email = document.getElementById("email")
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (email.value && !emailRegex.test(email.value)) {
    email.parentElement.classList.add("error")
    email.parentElement.querySelector(".error-message").style.display = "block"
    isValid = false
  }

  return isValid
}

// Limpiar errores al escribir
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("input, textarea").forEach((input) => {
    input.addEventListener("input", function () {
      if (this.value.trim()) {
        this.parentElement.classList.remove("error")
        this.parentElement.querySelector(".error-message").style.display = "none"
      }
    })
  })
})
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // Evita que recargue la página

    // Obtener los valores
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();

    let isValid = true;

    // Limpiar errores anteriores
    form.querySelectorAll(".error-message").forEach(el => el.style.display = "none");
    form.querySelectorAll(".form-group").forEach(el => el.classList.remove("error"));

    // Validaciones simples
    if (name === "") {
      showError("name");
      isValid = false;
    }

    if (!validateEmail(email)) {
      showError("email");
      isValid = false;
    }

    if (subject === "") {
      showError("subject");
      isValid = false;
    }

    if (message === "") {
      showError("message");
      isValid = false;
    }

    if (!isValid) return;

    // Aquí puedes enviar los datos al servidor con fetch()
    const formData = {
      name,
      email,
      phone,
      subject,
      message
    };

    console.log("Formulario listo para enviarse:", formData);

    // Simulamos el envío
    alert("Gracias por tu mensaje. Te responderemos pronto.");

    // Puedes hacer reset del formulario
    form.reset();
  });

  function showError(fieldId) {
    const group = form.querySelector(`#${fieldId}`).closest(".form-group");
    group.classList.add("error");
    group.querySelector(".error-message").style.display = "block";
  }

  function validateEmail(email) {
    // Validación básica de email
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
});
// Tabs functionality
const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Quitar clase activa de todos los botones
    tabButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    // Mostrar solo el tab correspondiente
    const target = btn.getAttribute("data-tab");
    tabContents.forEach((content) => {
      content.classList.toggle("active", content.id === target);
    });
  });
});
