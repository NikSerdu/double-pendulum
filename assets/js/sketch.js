//Base variables
let l1 = 100 //length
let l2 = 100

let m1 = 10
let m2 = 20

let a1_v = 0 //speed
let a2_v = 0

let g = 9.8

let degree_a1 = 90 //degree
let degree_a2 = 0

let a1 = (degree_a1 * Math.PI) / 180 //degree in radian
let a2 = (degree_a2 * Math.PI) / 180

let px2 = -1
let py2 = -1

let cx = 400 //offset
let cy = 200

let time_step = 0.025
let time_rate = 0.05

let t = 0

let q1 = [a1, a2, 0, 0] //degree,degree,angular velocity,angular velocity
let q2 = [0, 0, 0, 0]

let dt = time_step

let chart
let queue = [0]
let labels = [0]

var method_type = 'Прямой'

function getTotalEnergy() {
	let k =
		((m1 * l1 * l1 + m2 * l1 * l1) / (2 * g)) * (a1_v * a1_v) +
		((m2 * l2 * l2) / (2 * g)) * (a2_v * a2_v) +
		((m2 * l1 * l2) / g) * a1_v * a2_v
	let p =
		m1 * (l1 / 2) * a1 * a1 + m2 * ((l1 / 2) * a1 * a1 + (l2 / 2) * a2 * a2)
	return k + p
}

const ctx = document.getElementById('chartEnergy').getContext('2d')

function runChart() {
	chart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: labels,
			datasets: [
				{
					label: 'Энергия',
					borderColor: 'rgb(255, 99, 132)',
					data: queue
				}
			]
		},
		options: {
			animation: false
		}
	})
}

function setup() {
	runChart()
	createCanvas(800, 600)
	uiSetup()
	noLoop()
}

function draw() {
	image(canvas, 0, 0)

	if (method_type === 'Прямой') {
		base()
	} else {
		lagrange()
	}
	const { x2, y2 } = getCoords(l1, l2, a1, a2)

	if (t >= time_rate) {
		t = 0
		chart.update()
	}

	if (frameCount > 1) {
		t += time_step
		canvas.strokeWeight(2)
		canvas.stroke(0, 0, 255, 150)
		canvas.line(px2, py2, x2, y2)
		queue.push(getTotalEnergy())
		labels.push(labels.at(-1) + time_step)
		if (queue.length >= 11 || labels.length >= 11) {
			queue.shift()
			labels.shift()
		}
	}
	px2 = x2
	py2 = y2
}

const base = () => {
	draw_pendulum(cx, cy, l1, l2, a1, a2)
	let num1 = -g * (2 * m1 + m2) * sin(a1)
	let num2 = -m2 * g * sin(a1 - 2 * a2)
	let num3 = -2 * sin(a1 - a2) * m2
	let num4 = a2_v * a2_v * l2 + a1_v * a1_v * l1 * cos(a1 - a2)
	let den = l1 * (2 * m1 + m2 - m2 * cos(2 * a1 - 2 * a2))
	let a1_a = (num1 + num2 + num3 * num4) / den

	num1 = 2 * sin(a1 - a2)
	num2 = a1_v * a1_v * l1 * (m1 + m2)
	num3 = g * (m1 + m2) * cos(a1)
	num4 = a2_v * a2_v * l2 * m2 * cos(a1 - a2)
	den = l2 * (2 * m1 + m2 - m2 * cos(2 * a1 - 2 * a2))
	let a2_a = (num1 * (num2 + num3 + num4)) / den

	a1_v += a1_a * time_step
	a2_v += a2_a * time_step
	a1 += a1_v * time_step
	a2 += a2_v * time_step
}
