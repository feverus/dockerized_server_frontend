// @ts-nocheck
import { useEffect } from 'react'

const COLOR_CIRCLE = '102,102,255'
const COLOR_STRIKE = '156,217,249'

function atom() {
    let width, height, canvas, ctx, points, target
    const pointsCount = 20

    class Circle {
        pos
        radius
        color
        active

        constructor(pos, rad, color) {
            this.pos = pos
            this.radius = rad
            this.color = color
        }

        draw() {
            if (!this.active) {
                return
            }
            ctx.beginPath()
            ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI, false)
            ctx.fillStyle = 'rgba(' + COLOR_CIRCLE + ',' + this.active + ')'
            ctx.fill()
        }
    }

    // Main
    initPoints()
    drawPoints()

    function getCanvas() {
        return document.getElementById('canvasAtom')
    }

    function initPoints() {
        width = window.innerWidth
        height = window.innerHeight * 0.8
        target = { x: width / 2, y: height / 2 }

        canvas = getCanvas()
        if (!canvas) {
          return
        }
        canvas.width = width
        canvas.height = height
        ctx = canvas.getContext('2d')

        // create points
        points = []
        for (let x = 0; x < width; x = x + width / pointsCount) {
            for (let y = 0; y < height; y = y + height / pointsCount) {
                let px = x + (Math.random() * width) / 10
                let py = y + (Math.random() * height) / 10
                let p = { x: px, originX: px, y: py, originY: py }
                points.push(p)
            }
        }

        // for each point find the 5 closest points
        for (const element of points) {
            let closest = []
            let p1 = element
            for (const element of points) {
                let p2 = element
                if (p1 !== p2) {
                    let placed = false
                    for (let k = 0; k < 5; k++) {
                        if (!placed) {
                            if (closest[k] === undefined) {
                                closest[k] = p2
                                placed = true
                            }
                        }
                    }
                    for (let k = 0; k < 5; k++) {
                        if (!placed) {
                            if (getDistance(p1, p2) < getDistance(p1, closest[k])) {
                                closest[k] = p2
                                placed = true
                            }
                        }
                    }
                }
            }
            p1.closest = closest
        }

        // assign a circle to each point
        for (let i in points) {
            points[i].circle = new Circle(points[i], 4 + Math.random() * 2)
        }
    }

    function drawPoints() {
        if (ctx) {
            ctx.clearRect(0, 0, width, height)
            for (let i in points) {
                // detect points in range
                if (Math.abs(getDistance(target, points[i])) < 40000) {
                    points[i].active = 0.3
                    points[i].circle.active = 0.6
                } else if (Math.abs(getDistance(target, points[i])) < 200000) {
                    points[i].active = 0.1
                    points[i].circle.active = 0.3
                } else if (Math.abs(getDistance(target, points[i])) < 400000) {
                    points[i].active = 0.02
                    points[i].circle.active = 0.1
                } else {
                    points[i].active = 0
                    points[i].circle.active = 0
                }

                drawLines(points[i])
                points[i].circle.draw()
            }
        }
    }

    // Canvas manipulation
    function drawLines(p) {
        if (!p.active) {
            return
        }
        for (let i in p.closest) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p.closest[i].x, p.closest[i].y)
            ctx.strokeStyle = 'rgba(' + COLOR_STRIKE + ',' + p.active + ')'
            ctx.stroke()
        }
    }

    // Util
    function getDistance(p1, p2) {
        return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)
    }
}

function debounce(func, delay) {
    let timeoutId = null
    return function (...args) {
        const context = this
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
            func.apply(context, args)
        }, delay)
    }
}
const debouncedResizeHandler = debounce(atom, 100)
window.addEventListener('resize', debouncedResizeHandler)

export const CanvasAtom = () => {
    useEffect(() => {
        atom()
    }, [])

    return <canvas id="canvasAtom"></canvas>
}
