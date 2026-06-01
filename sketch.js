/* -------------------------------------------
   VARIABLES
------------------------------------------- */

let corazones = [];
let particulas = [];
let estrellas = [];
let frases = [];
let polvo = [];
let timerVisible = false;

// ❤️ Texto fijo dentro del corazón
let textoCorazon = "Te amo Rebeca";

/* -------------------------------------------
   SETUP
------------------------------------------- */

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  generarEstrellas();
  generarPolvo();
  generarCorazones();
}

/* -------------------------------------------
   DRAW
------------------------------------------- */

function draw() {
  background(20, 0, 40);

  dibujarEstrellas();
  dibujarPolvo();
  dibujarConstelacion(); // ❤️ corazón luminoso
  dibujarCorazones();
  dibujarFrases();
  dibujarParticulas();
}

/* -------------------------------------------
   ESTRELLAS
------------------------------------------- */

function dibujarEstrellas() {
  noStroke();
  for (let e of estrellas) {
    fill(255, e.alpha);
    circle(e.x, e.y, e.size);
  }
}

function generarEstrellas() {
  for (let i = 0; i < 200; i++) {
    estrellas.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
      alpha: random(100, 255)
    });
  }
}

/* -------------------------------------------
   POLVO
------------------------------------------- */

function dibujarPolvo() {
  noStroke();
  for (let p of polvo) {
    fill(255, 200, 255, p.alpha);
    circle(p.x, p.y, p.size);
    p.y += p.dy;
    if (p.y < -10) p.y = height + 10;
  }
}

function generarPolvo() {
  for (let i = 0; i < 150; i++) {
    polvo.push({
      x: random(width),
      y: random(height),
      size: random(2, 5),
      alpha: random(80, 180),
      dy: random(-0.3, -1)
    });
  }
}

/* -------------------------------------------
   ❤️ CORAZÓN LUMINOSO DEL CENTRO
------------------------------------------- */

function dibujarConstelacion() {
  push();
  translate(width / 2, height / 2);

  // Glow alrededor del corazón
  for (let i = 0; i < 8; i++) {
    fill(255, 80, 120, 20 - i * 2);
    noStroke();
    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.05) {
      let x = 16 * pow(sin(a), 3);
      let y = -(13 * cos(a) - 5 * cos(2 * a) - 2 * cos(3 * a) - cos(4 * a));
      vertex(x * (22 + i * 2), y * (22 + i * 2));
    }
    endShape(CLOSE);
  }

  // Corazón principal
  fill(255, 60, 100);
  stroke(255);
  strokeWeight(4);
  beginShape();
  for (let a = 0; a < TWO_PI; a += 0.05) {
    let x = 16 * pow(sin(a), 3);
    let y = -(13 * cos(a) - 5 * cos(2 * a) - 2 * cos(3 * a) - cos(4 * a));
    vertex(x * 22, y * 22);
  }
  endShape(CLOSE);

  pop();

  // ❤️ Texto fijo dentro del corazón
  push();
  textAlign(CENTER, CENTER);
  textSize(56);
  fill(255);
  stroke(0);
  strokeWeight(6);
  text(textoCorazon, width / 2, height / 2 + 10);
  pop();
}

/* -------------------------------------------
   CORAZONES FLOTANTES
------------------------------------------- */

function dibujarCorazones() {
  noStroke();
  let cx = width / 2;
  let cy = height / 2;
  let radio = 360;

  for (let h of corazones) {

    if (dist(h.x, h.y, cx, cy) < radio) {
      h.x = random(width);
      h.y = height + 50;
    }

    fill(h.col);

    push();
    translate(h.x, h.y);
    scale(h.size / 100);

    beginShape();
    for (let t = 0; t < TWO_PI; t += 0.05) {
      let x = 16 * pow(sin(t), 3);
      let y = -(13 * cos(t) - 5 * cos(2*t) - 2 * cos(3*t) - cos(4*t));
      vertex(x, y);
    }
    endShape(CLOSE);

    pop();

    h.y += h.dy;

    if (h.y < -100) {
      h.x = random(width);
      h.y = height + 50;
    }
  }
}

function generarCorazones() {
  for (let i = 0; i < 40; i++) {

    let x, y;
    let cx = width / 2;
    let cy = height / 2;
    let radio = 360;

    do {
      x = random(width);
      y = random(height);
    } while (dist(x, y, cx, cy) < radio);

    let colores = [
      color(180, 120, 255),
      color(120, 180, 255),
      color(20, 20, 20)
    ];

    corazones.push({
      x,
      y,
      size: random(70, 160),
      dy: random(-1.2, -0.4),
      col: random(colores)
    });
  }
}

/* -------------------------------------------
   FRASES AL CLIC
------------------------------------------- */

function dibujarFrases() {
  textSize(26);
  textAlign(CENTER, CENTER);
  textFont("Georgia");

  let margen = 80;

  for (let f of frases) {

    if (f.estado === "apareciendo") {
      f.alpha += 4;
      if (f.alpha >= 255) {
        f.alpha = 255;
        f.estado = "visible";
        f.tiempo = millis();
      }
    }

    else if (f.estado === "visible") {
      if (millis() - f.tiempo > f.duracion) {
        f.estado = "desapareciendo";
      }
    }

    else if (f.estado === "desapareciendo") {
      f.alpha -= 2;
      if (f.alpha <= 0) {
        frases.splice(frases.indexOf(f), 1);
        continue;
      }
    }

    f.y += sin(frameCount * 0.01 + f.offset) * 0.25;
    f.x += cos(frameCount * 0.01 + f.offset) * 0.25;

    f.x = constrain(f.x, margen, width - margen);
    f.y = constrain(f.y, margen, height - margen);

    stroke(200, 40, 60);
    strokeWeight(2);
    fill(255, f.alpha);

    text(f.txt, f.x, f.y);
  }
}

/* -------------------------------------------
   CLICK — EVITAR LUNA, TIMER, PANEL Y REGALO
------------------------------------------- */

function mousePressed() {
  let panel = document.getElementById("panel");
  let rectPanel = panel.getBoundingClientRect();
  if (mouseX > rectPanel.left && mouseX < rectPanel.right &&
      mouseY > rectPanel.top && mouseY < rectPanel.bottom) return;

  let luna = document.querySelector(".luna");
  let rectLuna = luna.getBoundingClientRect();
  if (mouseX > rectLuna.left && mouseX < rectLuna.right &&
      mouseY > rectLuna.top && mouseY < rectLuna.bottom) return;

  let timer = document.getElementById("timerBox");
  let rectTimer = timer.getBoundingClientRect();
  if (mouseX > rectTimer.left && mouseX < rectTimer.right &&
      mouseY > rectTimer.top && mouseY < rectTimer.bottom) return;

  // 🎁 Evitar clics sobre el icono del regalo
  let regalo = document.getElementById("regalo");
  let rectRegalo = regalo.getBoundingClientRect();
  if (mouseX > rectRegalo.left && mouseX < rectRegalo.right &&
      mouseY > rectRegalo.top && mouseY < rectRegalo.bottom) return;

  crearFraseEn(mouseX, mouseY);
}

function crearFraseEn(x, y) {
  let margen = 80;
  let cx = width / 2;
  let cy = height / 2;
  let radio = 360;

  if (dist(x, y, cx, cy) < radio) return;

  x = constrain(x, margen, width - margen);
  y = constrain(y, margen, height - margen);

  frases.push({
    txt: random([
      "Rebe bonita",
      "Te amo",
      "Mi amor",
      "Mi niña bonita",
      "Mi universo",
      "Mi tesoro",
      "Mi reina",
      "Mi princesa",
      "Mi vida",
      "Te adoro",
      "Mi diosa",
      "Mi todo",
      "La niña de mis ojos",
      "Amor de mi vida",
      "Eres hermosa",
      "Preciosa",
      "Me encantas",
      "Eres lo mejor que tengo",
      "Mi mujer",
      "Te iubesc",
      "I love you"
    ]),
    x,
    y,
    alpha: 0,
    estado: "apareciendo",
    duracion: random(2000, 5000),
    tiempo: 0,
    offset: random(0, TWO_PI)
  });
}

/* -------------------------------------------
   PARTICULAS
------------------------------------------- */

function dibujarParticulas() {
  noStroke();
  for (let p of particulas) {
    fill(255, 150, 200, p.alpha);
    circle(p.x, p.y, p.size);
    p.x += p.dx;
    p.y += p.dy;
    p.alpha -= 4;
  }
}

/* -------------------------------------------
   MENSAJES
------------------------------------------- */

function cerrar(id) {
  document.getElementById(id).classList.remove("mostrar");
}

function cerrarTodosLosMensajes() {
  ["mensaje1", "mensaje2", "mensaje3", "mensajeLuna", "mensajeFraseCorazon", "mensajeRegalo"].forEach(id => {
    document.getElementById(id).classList.remove("mostrar");
  });
}

function mostrarMensaje() {
  cerrarTodosLosMensajes();
  document.getElementById("mensaje1").classList.add("mostrar");

  document.getElementById("texto1").innerText = `
Rebeca,

Hay personas que llegan como un susurro,
otras como un rayo de luz…
y luego estás tú,
que llegaste como una bendición
para hacer de mi mundo
un lugar mucho más colorido y feliz.

Feliz cumpleaños, mi amor.
  `;
}

function mostrarExtra() {
  cerrarTodosLosMensajes();
  document.getElementById("mensaje2").classList.add("mostrar");

  document.getElementById("texto2").innerText = `
Este es mi mensaje secreto para ti:

Si supieras cómo te pienso,
cómo te admiro,
cómo me iluminas,
cómo me inspiras cada día,
y cuánto te amo…

Entenderías por qué
mi mundo entero
se vuelve más bonito
cuando estás cerca.
  `;
}

function mostrarFinal() {
  cerrarTodosLosMensajes();
  document.getElementById("mensaje3").classList.add("mostrar");

  document.getElementById("texto3").innerText = `
Este es el final sorpresa.

No es un final triste,
ni un final cerrado.

Es un final que dice:

"Lo mejor aún está por venir."

Porque contigo,
cada día parece un prólogo
de algo aún más bonito,
de la historia de un libro
que espero con ansias escribir
a tu lado.

Gracias, mi amor.
Gracias por todo lo que haces cada día
por nosotros, por mí y por nuestra relación.
Te amo un universo entero.
  `;
}

/* -------------------------------------------
   NUEVO: MENSAJE DE FRASES DEL CORAZÓN
------------------------------------------- */

function mostrarFraseCorazon() {
  cerrarTodosLosMensajes();
  document.getElementById("textoFraseCorazon").innerText = random(frasesMotivadoras);
  document.getElementById("mensajeFraseCorazon").classList.add("mostrar");
}

function otraFrase() {
  document.getElementById("textoFraseCorazon").innerText = random(frasesMotivadoras);
}

/* -------------------------------------------
   MENSAJE OCULTO DE LA LUNA
------------------------------------------- */

function mostrarLuna() {
  cerrarTodosLosMensajes();
  document.getElementById("mensajeLuna").classList.add("mostrar");

  document.getElementById("textoLuna").innerText = `
Si estás leyendo esto,
es porque tocaste la luna.

Y eso solo significa una cosa:

Que tú también eres la luz de la luna,
la que ilumina incluso
las noches más oscuras.
Siento una paz inmensa cuando te veo.

Gracias por existir.
  `;
}

/* -------------------------------------------
   TIMER FIJO ABAJO
------------------------------------------- */

function toggleTimer() {
  timerVisible = !timerVisible;
  document.getElementById("timerBox").style.display = timerVisible ? "block" : "none";

  if (timerVisible) actualizarTimer();
}

function actualizarTimer() {
  if (!timerVisible) return;

  let inicio = new Date("2026-03-06T00:00:00");
  let ahora = new Date();

  let diff = ahora - inicio;

  let segundos = Math.floor(diff / 1000);
  let minutos = Math.floor(segundos / 60);
  let horas = Math.floor(minutos / 60);
  let dias = Math.floor(horas / 24);

  let años = Math.floor(dias / 365);
  let meses = Math.floor((dias % 365) / 30);
  dias = dias % 30;

  horas = horas % 24;
  minutos = minutos % 60;
  segundos = segundos % 60;

  let partes = [];

  if (años > 0) partes.push(`${años} años`);
  if (meses > 0) partes.push(`${meses} meses`);
  if (dias > 0) partes.push(`${dias} días`);
  if (horas > 0) partes.push(`${horas} horas`);
  if (minutos > 0) partes.push(`${minutos} minutos`);
  partes.push(`${segundos} segundos`);

  document.getElementById("timerText").innerText =
    "Llevamos juntos:\n" + partes.join(" • ");

  setTimeout(actualizarTimer, 1000);
}

/* -------------------------------------------
   MENSAJE DEL REGALO DE CUMPLEAÑOS
------------------------------------------- */

function mostrarRegalo() {
  cerrarTodosLosMensajes();
  document.getElementById("mensajeRegalo").classList.add("mostrar");

  document.getElementById("textoRegalo").innerText = `
Hoy no solo celebramos tu cumpleaños.

Celebramos tu luz,
tu fuerza,
tu manera tan única
de hacer que todo sea más bonito.

Gracias por existir
y gracias por dejarme acompañarte
en este camino tan tuyo y tan especial.

Feliz cumpleaños, amor ✨🎁
  `;
}

