const carousel      = document.getElementById("carousel")
const scene         = document.getElementById("scene")
const finalMessage  = document.getElementById("finalMessage")
const hint          = document.querySelector(".hint")
const hugeText      = document.querySelector(".hugeText")
const restartText   = document.querySelector(".restart")

let rotation = 0
let clicks   = 0
let finished = false

/* ══════════════════════════════════════════
   TAMAÑOS — todo se calcula desde el viewport
   real en el momento de llamar la función
   ══════════════════════════════════════════ */

function calcSizes() {

  // Dimensiones reales del viewport (funciona en móviles con barra de navegación)
  const vw = document.documentElement.clientWidth
  const vh = document.documentElement.clientHeight

  const isLandscape = vw > vh

  // Espacio disponible para la escena del carrusel
  // Dejamos margen vertical para el hint (5vh) y aire arriba (3vh)
  const maxByWidth  = vw  * 0.86
  const maxByHeight = vh  * 0.72

  const sceneSize = Math.min(maxByWidth, maxByHeight, 340)

  // Tarjetas: proporcionales a la escena
  const cardW = Math.round(sceneSize * 0.68)
  const cardH = Math.round(sceneSize * 0.74)

  // Radio del carrusel (translateZ)
  // Para 6 caras regulares: radio = lado / (2 * tan(π/6)) ≈ lado * 0.866
  // Ajustamos un poco más para que no se solapen en pantallas chicas
  const radius = Math.round(sceneSize * 0.86)

  // Fuente y padding de tarjetas
  const cardFont    = Math.max(11, Math.round(cardW * 0.082))
  const cardPadding = Math.max(10, Math.round(cardW * 0.092))

  // Foto dentro de la tarjeta
  const photoW = Math.round(cardW * 0.76)

  // Texto final
  const finalFont   = isLandscape
    ? Math.max(20, Math.round(vh * 0.22))
    : Math.max(28, Math.round(vw * 0.135))

  // Hint
  const hintFont = Math.max(11, Math.round(vw * 0.030))

  return {
    vw, vh,
    sceneSize,
    cardW, cardH,
    radius,
    cardFont, cardPadding,
    photoW,
    finalFont,
    hintFont
  }

}


function applyLayout() {

  const s = getViewportSize()  // dimensiones reales (ver abajo)
  const sizes = calcSizes()

  // ── Escena ──
  scene.style.width  = sizes.sceneSize + "px"
  scene.style.height = sizes.sceneSize + "px"

  // ── Tarjetas ──
  const cards  = document.querySelectorAll(".card")
  const angles = [0, 60, 120, 180, 240, 300]

  cards.forEach((card, i) => {
    card.style.width     = sizes.cardW + "px"
    card.style.height    = sizes.cardH + "px"
    card.style.left      = Math.round((sizes.sceneSize - sizes.cardW) / 2) + "px"
    card.style.top       = Math.round((sizes.sceneSize - sizes.cardH) / 2) + "px"
    card.style.fontSize  = sizes.cardFont + "px"
    card.style.padding   = sizes.cardPadding + "px"
    card.style.transform = `rotateY(${angles[i]}deg) translateZ(${sizes.radius}px)`
  })

  // ── Fotos ──
  document.querySelectorAll(".photo").forEach(p => {
    p.style.width = sizes.photoW + "px"
  })

  // ── Texto gigante final ──
  hugeText.style.fontSize   = sizes.finalFont + "px"
  restartText.style.fontSize = Math.max(12, Math.round(sizes.finalFont * 0.22)) + "px"
  restartText.style.marginTop = Math.max(12, Math.round(sizes.vh * 0.025)) + "px"

  // ── Hint ──
  hint.style.fontSize = sizes.hintFont + "px"

}


/* Obtener dimensiones reales del viewport en móvil
   (evita el bug de 100vh en Safari/Chrome móvil) */
function getViewportSize() {
  return {
    w: document.documentElement.clientWidth,
    h: document.documentElement.clientHeight
  }
}


/* ══════════════════════════════════════════
   INTERACCIÓN
   ══════════════════════════════════════════ */

document.body.addEventListener("click", () => {

  if (finished) {
    location.reload()
    return
  }

  rotation -= 60
  carousel.style.transform = `rotateY(${rotation}deg)`

  clicks++

  if (clicks === 6) {
    breakEffect()
  }

})


function breakEffect() {

  scene.style.transition = "transform 1s ease"
  scene.style.transform  = "scale(0)"

  setTimeout(() => {
    finalMessage.style.opacity   = "1"
    finalMessage.style.transform = "scale(1)"
    finished = true
  }, 1000)

}


/* ══════════════════════════════════════════
   PÉTALOS
   ══════════════════════════════════════════ */

const petalsCanvas = document.getElementById("petals")
const pctx = petalsCanvas.getContext("2d")

function resizePetals() {
  petalsCanvas.width  = document.documentElement.clientWidth
  petalsCanvas.height = document.documentElement.clientHeight
}

let petals = []

function initPetals() {
  petals = []
  for (let i = 0; i < 40; i++) {
    petals.push({
      x:     Math.random() * petalsCanvas.width,
      y:     Math.random() * petalsCanvas.height,
      size:  Math.random() * 5 + 3,
      speed: Math.random() * 1 + 0.4
    })
  }
}

function drawPetals() {
  pctx.clearRect(0, 0, petalsCanvas.width, petalsCanvas.height)
  pctx.fillStyle = "#ffc0da"

  petals.forEach(p => {
    pctx.beginPath()
    pctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    pctx.fill()
    p.y += p.speed
    if (p.y > petalsCanvas.height) {
      p.y = 0
      p.x = Math.random() * petalsCanvas.width
    }
  })

  requestAnimationFrame(drawPetals)
}


/* ══════════════════════════════════════════
   ESTRELLAS
   ══════════════════════════════════════════ */

const starsCanvas = document.getElementById("stars")
const sctx = starsCanvas.getContext("2d")

function resizeStars() {
  starsCanvas.width  = document.documentElement.clientWidth
  starsCanvas.height = document.documentElement.clientHeight
}

let stars = []

function initStars() {
  stars = []
  for (let i = 0; i < 80; i++) {
    stars.push({
      x:    Math.random() * starsCanvas.width,
      y:    Math.random() * starsCanvas.height,
      size: Math.random() * 2
    })
  }
}

function drawStars() {
  sctx.clearRect(0, 0, starsCanvas.width, starsCanvas.height)
  sctx.fillStyle = "white"

  stars.forEach(s => {
    sctx.beginPath()
    sctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
    sctx.fill()
  })

  requestAnimationFrame(drawStars)
}


/* ══════════════════════════════════════════
   RESIZE — debounced para no sobre-disparar
   ══════════════════════════════════════════ */

let resizeTimer = null

window.addEventListener("resize", () => {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => {
    resizePetals()
    initPetals()
    resizeStars()
    initStars()
    applyLayout()
  }, 80)
})

// También escuchar cambio de orientación explícito
window.addEventListener("orientationchange", () => {
  setTimeout(() => {
    resizePetals()
    initPetals()
    resizeStars()
    initStars()
    applyLayout()
  }, 300)
})


/* ══════════════════════════════════════════
   INIT
   ══════════════════════════════════════════ */

resizePetals()
initPetals()
drawPetals()

resizeStars()
initStars()
drawStars()

applyLayout()