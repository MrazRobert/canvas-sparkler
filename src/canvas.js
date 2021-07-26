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
    this.radiusIncrement = this.radius * -0.01
    this.color = color
    this.velocity = velocity
    this.gravity = 1
    this.frictionX = utils.randomIntFromRange(10, 20) * 0.1
    this.frictionY = utils.randomIntFromRange(2, 6) * -0.1
    this.bounced = false
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

    this.x += this.velocity.x
    this.y += this.velocity.y
    this.radius += this.radiusIncrement

    // when sparkle hits bottom
    if (this.y + this.radius + this.velocity.y > canvas.height - groundHeight) {
      if (!this.bounced) {
        this.velocity.x *= this.frictionX
      } else {
        this.velocity.x *= 0.9
      }
      this.bounced = true
      this.velocity.y *= this.frictionY
      this.y = canvas.height - this.radius
    }
    this.velocity.y += this.gravity
  }
}

// Implementation
let sparkles = []
const sparkleDensity = 3
const sparkleSize = 8

function init() {

  for (let i = 0; i < sparkleDensity; i++) {
    const hue = utils.randomIntFromRange(30, 60)
    const light = utils.randomIntFromRange(50, 100)
    const opacity = 1
    sparkles.push(new Sparkle(
      mouse.x,
      mouse.y,
      sparkleSize,
      `hsla(${hue},100%,${light}%,${opacity})`,
      {
        x: utils.randomIntFromRange(-50, 50) * 0.1,
        y: utils.randomIntFromRange(-10, 10)
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

animate()
