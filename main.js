const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function distanciaPuntos(p1, p2) {
    return Math.sqrt(Math.pow((p2[0] - p1[0]), 2) + Math.pow((p2[1] - p1[1]), 2) + Math.pow((p2[2] - p1[2]), 2));
}

function esfera(radio = 1, anillos = 16, centro = [0, 0, 0]) {
    /*
    * x = r*cos(u)*sin(v)
    * y = r*sin(u)*sin(v)
    * z = r*cos(v)
    * siendo u = [0, 2*PI] y v = [0, PI]
    */
    let puntos = [];
    const ancho = 2 * Math.PI / anillos;
    const alto = Math.PI / anillos;
    for (let i = 0; i < anillos; i++) {
        for (let j = 0; j <= anillos; j++) {
            const x = radio * Math.cos(i * ancho) * Math.sin(j * alto) + centro[0];
            const y = radio * Math.sin(i * ancho) * Math.sin(j * alto) + centro[1];
            const z = radio * Math.cos(j * alto) + centro[2];
            puntos.push([x, y, z]);
        }
    }

    // Eliminamos los puntos duplicados
    puntos = puntos.filter((p, i) => {
            if (i === 0) return true;
            return distanciaPuntos(p, puntos[i - 1]) > 0.1;
        }
    );

    return puntos;
}

function dibujarPuntos(esfera) {
    for (let i = 0; i < esfera.length; i++) {
        ctx.beginPath();
        ctx.arc(esfera[i][0], esfera[i][2], 3, 0, 2 * Math.PI);
        ctx.fillStyle = "white";
        ctx.fill();
    }
}

function dibujarWireframe(esfera) {
    const anillos = Math.floor(Math.sqrt(esfera.length)); // esto solo funciona para esferas simetricas

    const diametro = esfera.map((p, i) => {
        if (i === 0) return 0;
        return distanciaPuntos(p, esfera[i - 1]);
    }).reduce((a, b) => Math.max(a, b));

    for (let i = 0; i < esfera.length; i++) {
        if (i > 0 && Math.abs(distanciaPuntos(esfera[i], esfera[i - 1]) - diametro) === 0) continue;
        if (i < esfera.length - anillos) {
            ctx.beginPath();
            ctx.moveTo(esfera[i][0], esfera[i][2]);
            ctx.lineTo(esfera[i + anillos][0], esfera[i + anillos][2]);
            ctx.strokeStyle = "white";
            ctx.stroke();
        }
    }

    for (let i = 0; i < anillos; i++) {
        if (i > 0 && Math.abs(distanciaPuntos(esfera[i], esfera[i - 1]) - diametro) === 0) continue;
        ctx.beginPath();
        ctx.moveTo(esfera[i][0], esfera[i][2]);
        ctx.lineTo(esfera[esfera.length - anillos + i][0], esfera[esfera.length - anillos + i][2]);
        ctx.strokeStyle = "white";
        ctx.stroke();
    }
}

function rotarZ(punto, angulo) {
    const x = punto[0] * Math.cos(angulo) - punto[1] * Math.sin(angulo);
    const y = punto[0] * Math.sin(angulo) + punto[1] * Math.cos(angulo);
    return [x, y, punto[2]];
}


let e1 = esfera(canvas.width / 6, 16, [canvas.width / 2, canvas.height / 2, 0]);
let angulo = 0;

function animar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const e2 = e1.map(p => rotarZ(p, angulo));
    dibujarWireframe(e2);
    dibujarPuntos(e2);
    angulo += 0.01;
    requestAnimationFrame(animar);
}

animar();
