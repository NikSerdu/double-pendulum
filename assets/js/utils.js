const update = () => {
	l1 = +input_l1.value()
	l2 = +input_l2.value()
	m1 = +input_m1.value()
	m2 = +input_m2.value()
	g = +input_g.value()
	px2 = -1
	py2 = -1
	a1 = (degree_a1 * PI) / 180
	a2 = (degree_a2 * PI) / 180
	a1_v = 0
	a2_v = 0
	queue = [getTotalEnergy()]
	labels = [0]
	t = 0
	q1 = [a1, a2, 0, 0]
	q2 = [0, 0, 0, 0]
	runChart()
	redraw()
	clearCanvas()
}

const restart = () => {
	update()
	noLoop()
}

const changeDegree = () => {
	degree_a1 = +input_a1.value()
	degree_a2 = +input_a2.value()
	a1 = (degree_a1 * Math.PI) / 180
	a2 = (degree_a2 * Math.PI) / 180
	restart()
}

const changeType = () => {
	method_type = method.selected()
	px2 = -1
	py2 = -1
	a1 = (degree_a1 * PI) / 180
	a2 = (degree_a2 * PI) / 180
	a1_v = 0
	a2_v = 0
	queue = [getTotalEnergy()]
	labels = [0]
	t = 0
	q1 = [a1, a2, 0, 0]
	q2 = [0, 0, 0, 0]
	runChart()
	redraw()
	clearCanvas()
}

const clearCanvas = () => {
	canvas.background(255)
}

function getRandom(min, max) {
	return Math.random() * (max - min) + min
}

const changeTimeParams = () => {
	time_step = +input_time_step.value()
	time_rate = +input_time_rate.value()
	dt = time_step
}

function draw_pendulum(cx, cy, l1, l2, a1, a2) {
	let m1 = 10,
		m2 = 10
	const { x1, x2, y1, y2 } = getCoords(l1, l2, a1, a2)

	strokeWeight(2)
	line(cx, cy, x1, y1)
	fill(0)

	ellipse(x1, y1, m1, m1)

	strokeWeight(2)
	line(x1, y1, x2, y2)
	fill(0)

	ellipse(x2, y2, m2, m2)
}

const getCoords = (l1, l2, a1, a2) => {
	let x1 = cx + l1 * sin(a1),
		y1 = cy + l1 * cos(a1)
	let x2 = x1 + l2 * sin(a2),
		y2 = y1 + l2 * cos(a2)
	return { x1, y1, x2, y2 }
}

const uiSetup = () => {
	canvas = createGraphics(width, height)
	canvas.background(255)
	span_l1 = createSpan('Длина первого маятника')
	span_l1.position(800, 80)
	input_l1 = createInput(l1)
	input_l1.position(800, 100)

	span_l2 = createSpan('Длина второго маятника')
	span_l2.position(1050, 80)
	input_l2 = createInput(l2)
	input_l2.position(1050, 100)

	span_m1 = createSpan('Масса первого маятника')
	span_m1.position(800, 150)
	input_m1 = createInput(m1)
	input_m1.position(800, 170)

	span_m2 = createSpan('Масса второго маятника')
	span_m2.position(1050, 150)
	input_m2 = createInput(m2)
	input_m2.position(1050, 170)

	span_a1 = createSpan('Градусы первого маятника')
	span_a1.position(800, 220)
	input_a1 = createInput(degree_a1)
	input_a1.position(800, 240)

	span_a2 = createSpan('Градусы второго маятника')
	span_a2.position(1050, 220)
	input_a2 = createInput(degree_a2)
	input_a2.position(1050, 240)

	span_g = createSpan('Коэффициент g')
	span_g.position(800, 290)
	input_g = createInput(g)
	input_g.position(800, 310)

	span_time_step = createSpan('Шаг по времени')
	span_time_step.position(1050, 290)
	input_time_step = createInput(time_step)
	input_time_step.position(1050, 310)

	span_time_rate = createSpan('Обновлять график каждые')
	span_time_rate.position(800, 360)
	input_time_rate = createInput(time_rate)
	input_time_rate.position(800, 380)

	method = createSelect('Метод')
	method.position(1050, 380)
	method.option('Прямой')
	method.option('Лагранж')
	method.selected('Прямой')

	btn_start = createButton('Start')
	btn_start.position(800, 470)

	btn_restart = createButton('Restart')
	btn_restart.position(910, 470)

	btn_stop = createButton('Stop')
	btn_stop.position(1040, 470)

	btn_start.mousePressed(() => {
		loop()
	})

	btn_stop.mousePressed(() => {
		noLoop()
	})

	btn_restart.mousePressed(() => {
		restart()
	})

	input_l1.input(update)
	input_l2.input(update)
	input_m1.input(update)
	input_m2.input(update)
	input_time_step.input(changeTimeParams)
	input_time_rate.input(changeTimeParams)
	input_a1.input(changeDegree)
	input_a2.input(changeDegree)
	input_g.input(update)
	method.input(changeType)
}

function getTotalEnergyBase() {
	let k =
		((m1 * l1 * l1 + m2 * l1 * l1) / (2 * g)) * (a1_v * a1_v) +
		((m2 * l2 * l2) / (2 * g)) * (a2_v * a2_v) +
		((m2 * l1 * l2) / g) * a1_v * a2_v
	let p =
		m1 * (l1 / 2) * a1 * a1 + m2 * ((l1 / 2) * a1 * a1 + (l2 / 2) * a2 * a2)
	return k + p
}
