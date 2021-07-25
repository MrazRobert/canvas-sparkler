import utils from './utils'
import './style.scss'
import 'font-awesome/css/font-awesome.css'

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2
}

const groundHeight = 0

// Event Listeners
addEventListener('resize', () => {
  canvas.width = innerWidth
  canvas.height = innerHeight

  init()
})

addEventListener('mousemove', (event) => {
  mouse.x = event.clientX
  mouse.y = event.clientY
})

// Objects
class Sparkle {
  constructor(x, y, radius, color, velocity) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = velocity
    this.gravity = 3
    this.friction = 0.4
    this.alpha = 1
  }

  draw() {
    c.save()
    // c.globalAlpha = this.alpha
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.shadowColor = this.color
    c.shadowBlur = 1
    c.fill()
    c.closePath()
    c.restore()
  }

  update() {
    this.draw()

    this.velocity.x *= 0.95
    // this.velocity.y *= this.friction
    // this.velocity.y += this.gravity
    this.x += this.velocity.x
    this.y += this.velocity.y
    // this.alpha -= 0.008
    this.radius -= 0.1

    // when sparkla hits bottom of screen
    if (this.y + this.radius + this.velocity.y > canvas.height - groundHeight) {
      // this.friction = 0.6
      this.velocity.y = -this.velocity.y * this.friction
    } else {
      this.velocity.y += this.gravity
    }

  }
}

// Implementation
let sparkles = []
const power = 20
const sparkleDensity = 5

function init() {

  for (let i = 0; i < sparkleDensity; i++) {
    const angle = utils.randomIntFromRange(1, 360)
    const hue = utils.randomIntFromRange(30, 60)
    const light = utils.randomIntFromRange(50, 100)
    const opacity = 1
    sparkles.push(new Sparkle(
      mouse.x,
      mouse.y,
      8,
      `hsla(${hue},100%,${light}%,${opacity})`,
      {
        x: Math.cos(angle) * Math.random() * power,
        y: Math.sin(angle) * Math.random() * power
      }
    ))
  }
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate)
  c.fillStyle = 'rgba(0, 0, 0, 1)'
  c.fillRect(0, 0, canvas.width, canvas.height)

  init()

  sparkles.forEach((sparkle, index) => {
    if (sparkle.radius > 0) {
      sparkle.update()
    } else {
      sparkles.splice(index, 1)
    }
  })
}

init()
animate()
