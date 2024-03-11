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

const lagrange = () => {
	var k1 = rhs(q1, l1, l2)
	var k2 = rhs(add(q1, multiply(dt / 2, k1)), l1, l2)
	var k3 = rhs(add(q1, multiply(dt / 2, k2)), l1, l2)
	var k4 = rhs(add(q1, multiply(dt, k3)), l1, l2)
	var k = add(add(add(k1, multiply(2, k2)), multiply(2, k3)), k4)
	q2 = add(q1, multiply(dt / 6, k))

	q1 = [...q2]

	a1 = q2[0]
	a2 = q2[1]
	a1_v = q2[2]
	a2_v = q2[3]
	draw_pendulum(cx, cy, l1, l2, a1, a2)
}
