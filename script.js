const carousel = document.getElementById("carousel")
const scene    = document.getElementById("scene")
const finalMessage = document.getElementById("finalMessage")

let rotation = 0
let clicks   = 0
let finished = false


/* ─── TAMAÑOS ADAPTATIVOS ─── */

function getSize(){

  const vw = window.innerWidth
  const vh = window.innerHeight

  // Espacio disponible (dejamos margen para el hint y los bordes)
  const available = Math.min(vw * 0.92, vh * 0.72, 340)

  const sceneSize  = available
  const cardW      = Math.round(sceneSize * 0.70)
  const cardH      = Math.round(sceneSize * 0.76)
  const translateZ = Math.round(sceneSize * 0.88)
  const fontSize   = Math.max(11, Math.round(cardW * 0.085))
  const padding    = Math.max(10, Math.round(cardW * 0.10))
  const photoW     = Math.round(cardW * 0.75)

  return { sceneSize, cardW, cardH, translateZ, fontSize, padding, photoW }

}


function applySize(){

  const s = getSize()

  // Escena
  scene.style.width  = s.sceneSize + "px"
  scene.style.height = s.sceneSize + "px"

  // Tarjetas
  const cards = document.querySelectorAll(".card")
  const angles = [0, 60, 120, 180, 240, 300]

  cards.forEach((card, i) => {

    card.style.width    = s.cardW + "px"
    card.style.height   = s.cardH + "px"
    card.style.left     = ((s.sceneSize - s.cardW) / 2) + "px"
    card.style.top      = ((s.sceneSize - s.cardH) / 2) + "px"
    card.style.fontSize = s.fontSize + "px"
    card.style.padding  = s.padding  + "px"
    card.style.transform = `rotateY(${angles[i]}deg) translateZ(${s.translateZ}px)`

  })

  // Fotos
  const photos = document.querySelectorAll(".photo")
  photos.forEach(p => {
    p.style.width = s.photoW + "px"
  })

}


/* ─── CLICK / GIRO ─── */

document.body.addEventListener("click", () => {

  if(finished){
    location.reload()
    return
  }

  rotation -= 60
  carousel.style.transform = `rotateY(${rotation}deg)`

  clicks++

  if(clicks === 6){
    breakEffect()
  }

})


function breakEffect(){

  scene.style.transition = "1s"
  scene.style.transform  = "scale(0)"

  setTimeout(() => {
    finalMessage.style.opacity   = "1"
    finalMessage.style.transform = "scale(1)"
    finished = true
  }, 1000)

}


/* ─── PÉTALOS ─── */

const petalsCanvas = document.getElementById("petals")
const pctx = petalsCanvas.getContext("2d")

function resizePetals(){
  petalsCanvas.width  = window.innerWidth
  petalsCanvas.height = window.innerHeight
}

let petals = []

function initPetals(){
  petals = []
  for(let i = 0; i < 40; i++){
    petals.push({
      x:     Math.random() * petalsCanvas.width,
      y:     Math.random() * petalsCanvas.height,
      size:  Math.random() * 6 + 4,
      speed: Math.random() * 1 + 0.5
    })
  }
}

function drawPetals(){

  pctx.clearRect(0, 0, petalsCanvas.width, petalsCanvas.height)
  pctx.fillStyle = "#ffc0da"

  petals.forEach(p => {

    pctx.beginPath()
    pctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    pctx.fill()

    p.y += p.speed

    if(p.y > petalsCanvas.height){
      p.y = 0
      p.x = Math.random() * petalsCanvas.width
    }

  })

  requestAnimationFrame(drawPetals)

}


/* ─── ESTRELLAS ─── */

const starsCanvas = document.getElementById("stars")
const sctx = starsCanvas.getContext("2d")

function resizeStars(){
  starsCanvas.width  = window.innerWidth
  starsCanvas.height = window.innerHeight
}

let stars = []

function initStars(){
  stars = []
  for(let i = 0; i < 80; i++){
    stars.push({
      x:    Math.random() * starsCanvas.width,
      y:    Math.random() * starsCanvas.height,
      size: Math.random() * 2
    })
  }
}

function drawStars(){

  sctx.clearRect(0, 0, starsCanvas.width, starsCanvas.height)
  sctx.fillStyle = "white"

  stars.forEach(s => {
    sctx.beginPath()
    sctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
    sctx.fill()
  })

  requestAnimationFrame(drawStars)

}


/* ─── RESIZE ─── */

window.addEventListener("resize", () => {

  resizePetals()
  initPetals()
  resizeStars()
  initStars()
  applySize()

})


/* ─── INIT ─── */

resizePetals()
initPetals()
drawPetals()

resizeStars()
initStars()
drawStars()

applySize()