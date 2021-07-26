import utils from './utils'
import './style.scss'
import 'font-awesome/css/font-awesome.css'

const canvas1 = document.getElementById('canvas1')
const c1 = canvas1.getContext('2d')
const canvas2 = document.getElementById('canvas2')
const c2 = canvas2.getContext('2d')

canvas1.width = innerWidth
canvas1.height = innerHeight * 0.8
canvas2.width = innerWidth
canvas2.height = innerHeight * 0.8

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2
}

// Event Listeners
addEventListener('resize', () => {
  canvas1.width = innerWidth
  canvas1.height = innerHeight * 0.8
  canvas2.width = innerWidth
  canvas2.height = innerHeight * 0.8
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
  }

  drawArc(c, blur = 0) {
    c.beginPath()
    if (blur > 0) {
      c.filter = `blur(${blur}px)`
    }
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
    c.closePath()
  }

  draw() {
    this.drawArc(c1)

    c2.save()
    c2.scale(1, -1)
    c2.translate(0, -canvas2.height)
    c2.globalAlpha = 0.3
    this.drawArc(c2, 1)
    c2.restore()
  }

  update() {
    this.draw()

    this.x += this.velocity.x
    this.y += this.velocity.y
    this.radius += this.radiusIncrement

    // when sparkle hits bottom
    if (this.y + this.radius + this.velocity.y > canvas1.height) {
      if (!this.bounced) {
        this.velocity.x *= this.frictionX
      } else {
        this.velocity.x *= 0.9
      }
      this.bounced = true
      this.velocity.y *= this.frictionY
      this.y = canvas1.height - this.radius
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
  c1.globalCompositeOperation = 'source-over'
  c1.fillStyle = 'rgba(0, 0, 0, 1)'
  c1.fillRect(0, 0, canvas1.width, canvas1.height)
  c1.globalCompositeOperation = 'lighter'
  
  c2.globalCompositeOperation = 'source-over'
  c2.fillStyle = 'rgba(0, 0, 0, 1)'
  c2.fillRect(0, 0, canvas2.width, canvas2.height)
  c2.globalCompositeOperation = 'lighter'

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
