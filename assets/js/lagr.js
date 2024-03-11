let p = 2
let g = 9.8 // gravity
let fps = 40 // fps
let t = 0

let init_theta1 = Math.PI / 2 + Math.PI / 6
let init_theta2 = Math.PI / 2 + Math.PI / 3

// vectors to store the angles and angular velocities
var q1 = [init_theta1, init_theta2, 0, 0]
var q2 = [0, 0, 0, 0]

function add(a, b) {
	var result = new Array(a.length).fill(0)
	for (let i = 0; i < a.length; i++) {
		result[i] = a[i] + b[i]
	}
	return result
}
function multiply(k, a) {
	var result = new Array(a.length).fill(0)
	for (let i = 0; i < a.length; i++) {
		result[i] = k * a[i]
	}
	return result
}

// Helper function to compute the right hand side of the nonlinear ODE
function rhs(q, L1, L2) {
	var result = [0, 0, 0, 0]
	result[0] = q[2]
	result[1] = q[3]
	result[2] =
		(-3 * g * sin(q[0]) -
			g * sin(q[0] - 2 * q[1]) -
			2 *
				sin(q[0] - q[1]) *
				(q[3] * q[3] * L2 + q[2] * q[2] * L1 * cos(q[0] - q[1]))) /
		(L1 * (3 - cos(2 * q[0] - 2 * q[1])))
	result[3] =
		(2 *
			sin(q[0] - q[1]) *
			(2 * q[2] * q[2] * L1 +
				2 * g * cos(q[0]) +
				q[3] * q[3] * L2 * cos(q[0] - q[1]))) /
		(L2 * (3 - cos(2 * q[0] - 2 * q[1])))
	return result
}

function draw_pendulums(x, y, l1, l2, theta1, theta2) {
	let m1 = 10,
		m2 = 10
	let x1 = x + l1 * sin(theta1),
		y1 = y + l1 * cos(theta1)
	let x2 = x1 + l2 * sin(theta2),
		y2 = y1 + l2 * cos(theta2)
	line(x, y, x1, y1)
	ellipse(x1, y1, m1, m1)
	line(x1, y1, x2, y2)
	ellipse(x2, y2, m2, m2)
}

function setup() {
	createCanvas(500, 500)
}

function draw() {
	background(220)

	let l1 = 100,
		l2 = 100

	let dt = 2

	// RK4
	var k1 = rhs(q1, l1, l2)
	var k2 = rhs(add(q1, multiply(dt / 2, k1)), l1, l2)
	var k3 = rhs(add(q1, multiply(dt / 2, k2)), l1, l2)
	var k4 = rhs(add(q1, multiply(dt, k3)), l1, l2)
	var k = add(add(add(k1, multiply(2, k2)), multiply(2, k3)), k4)
	q2 = add(q1, multiply(dt / 6, k))

	t = t + dt
	q1 = [...q2]

	let theta1 = q2[0]
	let theta2 = q2[1]
	draw_pendulums(250, 250, 100, 100, theta1, theta2)
}
