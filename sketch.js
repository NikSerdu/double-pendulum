let l1 = 100;
let l2 = 100;
let m1 = 10;
let m2 = 10;
let a1 = 0;
let a2 = 0;
let a1_v = 0;
let a2_v = 0;
let g = 9.8;
let degree_a1=90
let degree_a2 = 0
let px2 = -1;
let py2 = -1;
let cx = 400
let cy = 200;
let time_step=0.025
let time_rate=0.05
let count = 0;



let canvas;
let input_l1,span_l1
let input_l2,span_l2
let input_m1,span_m1
let input_m2,span_m2
let input_a1,span_a1
let input_a2,span_a2
let input_g,span_g
let input_time_step,span_time_step
let input_time_rate,span_time_rate
let btn_start,btn_stop,btn_restart

let chart;

const getTotalEnergy = () => {
    let k = ((m1*l1*l1+m2*l1*l1)/(2*g))*(a1_v*a1_v) + (m2*l2*l2)/(2*g)*(a2_v*a2_v)+((m2*l1*l2)/g)*a1_v*a2_v
    let p = m1*(l1/2)*a1*a1+m2*((l1/2)*a1*a1+(l2/2)*a2*a2)
    return k+p
}


let queue = [getTotalEnergy()]
let labels = [0]

const ctx = document.getElementById('chartEnergy').getContext('2d');

function test() {
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: "Энергия",
                borderColor: 'rgb(255, 99, 132)',
                data: queue,
            }]
        },
        options: {
            animation:false
        }
    });
}



function setup() {
    test()
    createCanvas(800, 600);
    canvas = createGraphics(width, height);
    canvas.background(255);
    canvas.translate(cx, cy);
    a1=degree_a1*PI/180
    a2=degree_a2*PI/180
    span_l1 = createSpan('Длина первого маятника');
    span_l1.position(800, 80);
    input_l1 = createInput(l1)
    input_l1.position(800, 100);

    span_l2 = createSpan('Длина второго маятника');
    span_l2.position(1050, 80);
    input_l2 = createInput(l2)
    input_l2.position(1050, 100);

    span_m1 = createSpan('Масса первого маятника');
    span_m1.position(800, 150);
    input_m1 = createInput(m1)
    input_m1.position(800, 170);

    span_m2 = createSpan('Масса второго маятника');
    span_m2.position(1050, 150);
    input_m2 = createInput(m2)
    input_m2.position(1050, 170);

    span_a1 = createSpan('Градусы первого маятника');
    span_a1.position(800, 220);
    input_a1 = createInput(degree_a1)
    input_a1.position(800, 240);

    span_a2 = createSpan('Градусы второго маятника');
    span_a2.position(1050, 220);
    input_a2 = createInput(degree_a2)
    input_a2.position(1050, 240);

    span_g = createSpan('Коэффициент g');
    span_g.position(800, 290);
    input_g = createInput(g)
    input_g.position(800, 310);

    span_time_step = createSpan('Шаг по времени');
    span_time_step.position(1050, 290);
    input_time_step = createInput(time_step);
    input_time_step.position(1050, 310);


    span_time_rate = createSpan('Обновлять график каждые');
    span_time_rate.position(800, 360);
    input_time_rate = createInput(time_rate)
    input_time_rate.position(800, 380);

    btn_start = createButton("Start")
    btn_start.position(800,470)

    btn_restart = createButton("Restart")
    btn_restart.position(910,470)

    btn_stop = createButton("Stop")
    btn_stop.position(1040,470)

    
    btn_start.mousePressed(() => {
        loop()
      });
    
    btn_stop.mousePressed(() => {
        noLoop()
      });
    
    btn_restart.mousePressed(() => {
        restart()
      });

    input_l1.input(update)
    input_l2.input(update)
    input_m1.input(update)
    input_m2.input(update)
    input_time_step.input(changeTimeParams)
    input_time_rate.input(changeTimeParams)
    input_a1.input(changeDegree)
    input_a2.input(changeDegree)
    input_g.input(update)

    noLoop()

}

function draw() {
    image(canvas, 0, 0);

    let num1 = -g * (2 * m1 + m2) * sin(a1);
    let num2 = -m2 * g * sin(a1 - 2 * a2);
    let num3 = -2 * sin(a1 - a2) * m2;
    let num4 = a2_v * a2_v * l2 + a1_v * a1_v * l1 * cos(a1 - a2);
    let den = l1 * (2 * m1 + m2 - m2 * cos(2 * a1 - 2 * a2));
    let a1_a = (num1 + num2 + num3 * num4) / den;

    num1 = 2 * sin(a1 - a2);
    num2 = (a1_v * a1_v * l1 * (m1 + m2));
    num3 = g * (m1 + m2) * cos(a1);
    num4 = a2_v * a2_v * l2 * m2 * cos(a1 - a2);
    den = l2 * (2 * m1 + m2 - m2 * cos(2 * a1 - 2 * a2));
    let a2_a = (num1 * (num2 + num3 + num4)) / den;

    translate(cx, cy);
    stroke(0);
    strokeWeight(2);

    let x1 = l1 * sin(a1);
    let y1 = l1 * cos(a1);

    let x2 = x1 + l2 * sin(a2);
    let y2 = y1 + l2 * cos(a2);
    strokeWeight(2);
    line(0, 0, x1, y1);
    fill(0);
    ellipse(x1, y1, m1, m1);

    line(x1, y1, x2, y2);
    fill(0);
    ellipse(x2, y2, m2, m2);

    a1_v += a1_a*time_step;
    a2_v += a2_a*time_step;
    a1 += a1_v*time_step;
    a2 += a2_v*time_step;

    // a1_v *= 0.90;
    // a2_v *= 0.90;


    canvas.stroke(0);


    if(count >= time_rate) {
        count = 0
        chart.update()
        console.log('update');
    }

    if (frameCount > 1) {
        count+=time_step
        strokeWeight(0.5);
        canvas.stroke(0, 0, 255, 150);
        canvas.line(px2, py2, x2, y2);
        queue.push(getTotalEnergy())
        labels.push(labels.at(-1)+time_step)
        if(queue.length >= 11 || labels.length >= 11) {
            queue.shift()
            labels.shift()
        }

    }

    px2 = x2;
    py2 = y2;

    

}

const update = () => {
    l1 = +input_l1.value();
    l2 = +input_l2.value();
    m1 = +input_m1.value();
    m2 = +input_m2.value();
    g = +input_g.value();
    px2 = -1;
    py2 = -1;
    a1=degree_a1*PI/180
    a2=degree_a2*PI/180
    a1_v = 0;
    a2_v = 0;
    queue = [getTotalEnergy()]
    labels = [0]
    count = 0
    test()
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
    restart()
}

const clearCanvas = () => {
    canvas.background(255)

}



function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}


const changeTimeParams = () => {
    time_step = +input_time_step.value()
    time_rate = +input_time_rate.value()
}
      