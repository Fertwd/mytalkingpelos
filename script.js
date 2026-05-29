// ==============================
// SISTEMA DE PRECARGA (OPTIMIZACIÓN)
// ==============================
const imagenesAPrecargar = [
    'imagenes/intro.png', 'imagenes/normal.png', 'imagenes/normal_cocina.png', 
    'imagenes/normal_cuarto.png', 'imagenes/baño_normal.png',
    'imagenes/normal_recamara.png', 'imagenes/usando_telefono.png', 'imagenes/dormido_cama.png',
    'imagenes/boca_abierta.png', 'imagenes/masticando.png', 
    'imagenes/dormido.png', 'imagenes/corazones.png',
    'imagenes/tecleando.png', 'imagenes/jugando.png', 
    'imagenes/sentado_taza.png', 'imagenes/bañandose.png'
];

imagenesAPrecargar.forEach(src => {
    const img = new Image();
    img.src = src;
});

document.addEventListener('touchmove', function (event) { if (event.scale !== 1) { event.preventDefault(); } }, { passive: false });
let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) { let now = (new Date()).getTime(); if (now - lastTouchEnd <= 300) { event.preventDefault(); } lastTouchEnd = now; }, false);

// Instanciar Audios Generales
const audioJugar = new Audio('sonidos/jugar.mp3');
const musicaFondo = new Audio('sonidos/cancion.mp3');
musicaFondo.loop = true;

const audioFoco = new Audio('sonidos/foco.mp3');
const audioCorazon = new Audio('sonidos/corazon.mp3');
const audioComida = new Audio('sonidos/comida.mp3');
const audioMasticar = new Audio('sonidos/masticar.mp3');
const audioTecleando = new Audio('sonidos/tecleando.mp3');
const audioJugando = new Audio('sonidos/jugando.mp3');
audioTecleando.loop = true; audioJugando.loop = true;

const audioRegadera = new Audio('sonidos/regadera.mp3');
const audioTaza = new Audio('sonidos/taza.mp3');
audioRegadera.loop = true; 

// NUEVOS AUDIOS RECAMARA
const audioTiktok1 = new Audio('sonidos/tiktok1.mp3');
const audioTiktok2 = new Audio('sonidos/tiktok2.mp3');
const audioTiktok3 = new Audio('sonidos/tiktok3.mp3');
const audioDormido1 = new Audio('sonidos/dormido1.mp3');
const audioDormido2 = new Audio('sonidos/dormido2.mp3');

const audioPausa = new Audio('sonidos/pausa.mp3');

// DOM - Menús y Botones Globales
const pantallaPrincipal = document.getElementById('pantalla-principal');
const btnJugar = document.getElementById('btn-jugar');
const btnPausa = document.getElementById('btn-pausa');
const menuPausa = document.getElementById('menu-pausa');
const btnRegresar = document.getElementById('btn-regresar');
const btnToggleMusica = document.getElementById('btn-toggle-musica');
const btnSalirMenu = document.getElementById('btn-salir-menu');

const capasBotones = document.getElementById('capas-botones');
const zonasClick = document.getElementById('zonas-click');
const mensajeAmor = document.getElementById('mensaje-amor');
const mensajeComida = document.getElementById('mensaje-comida');
const mensajeBurbuja = document.getElementById('mensaje-burbuja');
const contenedorParticulas = document.getElementById('contenedor-particulas');
const gameContainer = document.getElementById('game-container');

const imgIzq = document.getElementById('img-izq');
const imgDer = document.getElementById('img-der');
const imgFoco = document.getElementById('img-foco');
const imgCorazon = document.getElementById('img-corazon');
const imgDorito = document.getElementById('img-dorito');
const imgPizza = document.getElementById('img-pizza');
const imgTeclado = document.getElementById('img-teclado');
const imgControl = document.getElementById('img-control');
const imgJabon = document.getElementById('img-jabon');
const imgTaza = document.getElementById('img-taza');
const imgTelefono = document.getElementById('img-telefono');
const imgSueno = document.getElementById('img-sueno');

const imgRegresarVisual = document.getElementById('img-regresar-visual');
const imgToggleMusica = document.getElementById('img-toggle-musica');
const imgSalirVisual = document.getElementById('img-salir-visual');

const hitIzq = document.getElementById('hitbox-izq');
const hitAcc1 = document.getElementById('hitbox-acc1');
const hitAcc2 = document.getElementById('hitbox-acc2');
const hitDer = document.getElementById('hitbox-der');

// Arreglo de escenas incluyendo la Recámara
const escenas = ['sala', 'cocina', 'cuarto', 'baño', 'recamara'];
let escenaActual = 0; 
let estaDormido = false; let estaComiendo = false;
let estaTecleando = false; let estaJugando = false;
let estaEnRegadera = false; let estaEnTaza = false;
let estaUsandoTelefono = false; let estaDurmiendoCama = false;
let musicaPausada = false;

let timeoutMensaje = null; let timeoutComida = null; let timeoutMasticar = null;
let timeoutBurbuja = null; let intervaloBurbuja = null;
let audioActivoRecamara = null; // Controla qué audio dinámico pausar/reanudar

// ==============================
// LÓGICA DEL MENÚ DE PAUSA
// ==============================

btnPausa.addEventListener('click', () => {
    animarBotonVisual(btnPausa);
    audioPausa.currentTime = 0;
    audioPausa.play().catch(() => {});
    
    setTimeout(() => {
        menuPausa.classList.remove('oculto');
        btnPausa.classList.add('oculto');
        gameContainer.classList.add('congelar-animaciones');
        
        if (estaTecleando) audioTecleando.pause();
        if (estaJugando) audioJugando.pause();
        if (estaEnRegadera) audioRegadera.pause();
        if (audioActivoRecamara) audioActivoRecamara.pause();
    }, 150);
});

btnRegresar.addEventListener('click', () => {
    animarBotonVisual(imgRegresarVisual);
    setTimeout(() => {
        menuPausa.classList.add('oculto');
        btnPausa.classList.remove('oculto');
        gameContainer.classList.remove('congelar-animaciones'); 
        
        if (estaTecleando) audioTecleando.play().catch(()=>{});
        if (estaJugando) audioJugando.play().catch(()=>{});
        if (estaEnRegadera) audioRegadera.play().catch(()=>{});
        if (audioActivoRecamara) audioActivoRecamara.play().catch(()=>{});
    }, 150);
});

btnToggleMusica.addEventListener('click', () => {
    animarBotonVisual(imgToggleMusica);
    if (musicaPausada) {
        musicaFondo.play().catch(()=>{});
        imgToggleMusica.src = 'imagenes/pausar_musica.png';
        musicaPausada = false;
    } else {
        musicaFondo.pause();
        imgToggleMusica.src = 'imagenes/reanudar_musica.png';
        musicaPausada = true;
    }
});

btnSalirMenu.addEventListener('click', () => {
    animarBotonVisual(imgSalirVisual);
    setTimeout(() => {
        menuPausa.classList.add('oculto');
        gameContainer.classList.remove('congelar-animaciones');
        
        detenerSonidosEInteracciones();
        musicaFondo.pause(); musicaFondo.currentTime = 0;
        musicaPausada = false; imgToggleMusica.src = 'imagenes/pausar_musica.png';
        
        escenaActual = 0; estaDormido = false; estaComiendo = false;
        clearTimeout(timeoutMensaje); clearTimeout(timeoutComida); clearTimeout(timeoutMasticar);
        mensajeAmor.classList.remove('mostrar'); mensajeAmor.classList.add('oculto');
        mensajeComida.classList.remove('mostrar'); mensajeComida.classList.add('oculto');
        ocultarBurbuja(); contenedorParticulas.innerHTML = '';
        
        pantallaPrincipal.src = 'imagenes/intro.png';
        capasBotones.classList.add('oculto'); zonasClick.classList.add('oculto');
        btnPausa.classList.add('oculto'); btnJugar.classList.remove('oculto');
    }, 150);
});

// ==============================
// LÓGICA DEL JUEGO NORMAL
// ==============================

function animarBotonVisual(imgElement) {
    imgElement.classList.add('animar-click');
    setTimeout(() => imgElement.classList.remove('animar-click'), 150);
}

function mostrarBurbuja(texto, duracion) {
    mensajeBurbuja.innerHTML = texto; mensajeBurbuja.classList.remove('oculto');
    setTimeout(() => mensajeBurbuja.classList.add('mostrar'), 10);
    if (timeoutBurbuja) clearTimeout(timeoutBurbuja);
    if (duracion) { timeoutBurbuja = setTimeout(() => { ocultarBurbuja(); }, duracion); }
}

function ocultarBurbuja() {
    mensajeBurbuja.classList.remove('mostrar');
    setTimeout(() => { if (!mensajeBurbuja.classList.contains('mostrar')) mensajeBurbuja.classList.add('oculto'); }, 300);
}

function detenerSonidosEInteracciones() {
    estaTecleando = false; estaJugando = false; estaEnRegadera = false; estaEnTaza = false;
    estaUsandoTelefono = false; estaDurmiendoCama = false;
    
    audioTecleando.pause(); audioTecleando.currentTime = 0;
    audioJugando.pause(); audioJugando.currentTime = 0;
    audioRegadera.pause(); audioRegadera.currentTime = 0;
    audioTaza.pause(); audioTaza.currentTime = 0;
    
    if (audioActivoRecamara) {
        audioActivoRecamara.pause();
        audioActivoRecamara.currentTime = 0;
        audioActivoRecamara = null;
    }
    
    // Detener ráfagas viejas de audios de recámara
    const audiosRecamara = [audioTiktok1, audioTiktok2, audioTiktok3, audioDormido1, audioDormido2];
    audiosRecamara.forEach(a => { a.pause(); a.currentTime = 0; });
    
    clearInterval(intervaloBurbuja); ocultarBurbuja();
}

function actualizarEscena() {
    estaDormido = false; estaComiendo = false; imgFoco.src = 'imagenes/foco1.png'; 
    clearTimeout(timeoutComida); clearTimeout(timeoutMasticar);
    mensajeComida.classList.add('oculto'); mensajeComida.classList.remove('mostrar');
    detenerSonidosEInteracciones();
    
    const btnSala = document.querySelectorAll('.btn-sala'); 
    const btnCocina = document.querySelectorAll('.btn-cocina');
    const btnCuarto = document.querySelectorAll('.btn-cuarto'); 
    const btnBano = document.querySelectorAll('.btn-bano');
    const btnRecamara = document.querySelectorAll('.btn-recamara');

    if (escenas[escenaActual] === 'sala') {
        pantallaPrincipal.src = 'imagenes/normal.png';
        btnSala.forEach(b => b.classList.remove('oculto')); btnCocina.forEach(b => b.classList.add('oculto')); btnCuarto.forEach(b => b.classList.add('oculto')); btnBano.forEach(b => b.classList.add('oculto')); btnRecamara.forEach(b => b.classList.add('oculto'));
    } else if (escenas[escenaActual] === 'cocina') {
        pantallaPrincipal.src = 'imagenes/normal_cocina.png';
        btnSala.forEach(b => b.classList.add('oculto')); btnCocina.forEach(b => b.classList.remove('oculto')); btnCuarto.forEach(b => b.classList.add('oculto')); btnBano.forEach(b => b.classList.add('oculto')); btnRecamara.forEach(b => b.classList.add('oculto'));
    } else if (escenas[escenaActual] === 'cuarto') {
        pantallaPrincipal.src = 'imagenes/normal_cuarto.png';
        btnSala.forEach(b => b.classList.add('oculto')); btnCocina.forEach(b => b.classList.add('oculto')); btnCuarto.forEach(b => b.classList.remove('oculto')); btnBano.forEach(b => b.classList.add('oculto')); btnRecamara.forEach(b => b.classList.add('oculto'));
    } else if (escenas[escenaActual] === 'baño') {
        pantallaPrincipal.src = 'imagenes/baño_normal.png';
        btnSala.forEach(b => b.classList.add('oculto')); btnCocina.forEach(b => b.classList.add('oculto')); btnCuarto.forEach(b => b.classList.add('oculto')); btnBano.forEach(b => b.classList.remove('oculto')); btnRecamara.forEach(b => b.classList.add('oculto'));
    } else if (escenas[escenaActual] === 'recamara') {
        pantallaPrincipal.src = 'imagenes/normal_recamara.png';
        btnSala.forEach(b => b.classList.add('oculto')); btnCocina.forEach(b => b.classList.add('oculto')); btnCuarto.forEach(b => b.classList.add('oculto')); btnBano.forEach(b => b.classList.add('oculto')); btnRecamara.forEach(b => b.classList.remove('oculto'));
    }
}

btnJugar.addEventListener('click', () => {
    audioJugar.play().catch(() => {});
    if (!musicaPausada) musicaFondo.play().catch(() => {}); 
    actualizarEscena(); 
    btnJugar.classList.add('oculto'); capasBotones.classList.remove('oculto'); zonasClick.classList.remove('oculto');
    btnPausa.classList.remove('oculto'); 
});

hitIzq.addEventListener('click', () => { animarBotonVisual(imgIzq); escenaActual = (escenaActual === 0) ? escenas.length - 1 : escenaActual - 1; actualizarEscena(); });
hitDer.addEventListener('click', () => { animarBotonVisual(imgDer); escenaActual = (escenaActual + 1) % escenas.length; actualizarEscena(); });

hitAcc1.addEventListener('click', () => {
    if (escenas[escenaActual] === 'sala') {
        animarBotonVisual(imgFoco); audioFoco.currentTime = 0; audioFoco.play().catch(() => {});
        if (estaDormido) { pantallaPrincipal.src = 'imagenes/normal.png'; imgFoco.src = 'imagenes/foco1.png'; estaDormido = false; } 
        else { pantallaPrincipal.src = 'imagenes/dormido.png'; imgFoco.src = 'imagenes/foco2.png'; estaDormido = true; mensajeAmor.classList.remove('mostrar'); clearTimeout(timeoutMensaje); }
    } else if (escenas[escenaActual] === 'cocina') { animarBotonVisual(imgDorito); alimentarPersonaje();
    } else if (escenas[escenaActual] === 'cuarto') {
        animarBotonVisual(imgTeclado);
        if (estaJugando) { audioJugando.pause(); estaJugando = false; clearInterval(intervaloBurbuja); ocultarBurbuja(); } 
        if (estaTecleando) { pantallaPrincipal.src = 'imagenes/normal_cuarto.png'; audioTecleando.pause(); estaTecleando = false; clearInterval(intervaloBurbuja); ocultarBurbuja(); } 
        else { pantallaPrincipal.src = 'imagenes/tecleando.png'; audioTecleando.play().catch(() => {}); estaTecleando = true;
            let indiceProg = 0; const textosProgramando = ["Programando la próxima gran app 💻", "Trabajando duro ⌨️", "O durando en el trabajo 😅"];
            mostrarBurbuja(textosProgramando[indiceProg], 2000);
            intervaloBurbuja = setInterval(() => { indiceProg++; if (indiceProg >= textosProgramando.length) indiceProg = 0; mostrarBurbuja(textosProgramando[indiceProg], 2000); }, 4000);
        }
    } else if (escenas[escenaActual] === 'baño') {
        animarBotonVisual(imgTaza);
        if (estaEnRegadera) { audioRegadera.pause(); audioRegadera.currentTime = 0; estaEnRegadera = false; clearInterval(intervaloBurbuja); ocultarBurbuja(); }
        if (estaEnTaza) { pantallaPrincipal.src = 'imagenes/baño_normal.png'; audioTaza.pause(); audioTaza.currentTime = 0; estaEnTaza = false; clearInterval(intervaloBurbuja); ocultarBurbuja(); } 
        else { 
            pantallaPrincipal.src = 'imagenes/sentado_taza.png'; estaEnTaza = true;
            audioTaza.currentTime = 0; audioTaza.play().catch(() => {});
            const pujidos = ["¡Hnnnng...! 🚽", "¡Ufff...! 🧻", "¡Fuerza...! 💢"];
            mostrarBurbuja(pujidos[0], 2000);
            intervaloBurbuja = setInterval(() => { 
                let txt = pujidos[Math.floor(Math.random() * pujidos.length)]; mostrarBurbuja(txt, 2000); 
                audioTaza.currentTime = 0; audioTaza.play().catch(() => {});
            }, 4000);
        }
    } else if (escenas[escenaActual] === 'recamara') {
        animarBotonVisual(imgTelefono);
        if (estaDurmiendoCama) { 
            if (audioActivoRecamara) audioActivoRecamara.pause();
            estaDurmiendoCama = false; clearInterval(intervaloBurbuja); ocultarBurbuja();
        }
        if (estaUsandoTelefono) {
            pantallaPrincipal.src = 'imagenes/normal_recamara.png';
            if (audioActivoRecamara) { audioActivoRecamara.pause(); audioActivoRecamara.currentTime = 0; audioActivoRecamara = null; }
            estaUsandoTelefono = false; clearInterval(intervaloBurbuja); ocultarBurbuja();
        } else {
            pantallaPrincipal.src = 'imagenes/usando_telefono.png'; estaUsandoTelefono = true;
            const tiktoks = [audioTiktok1, audioTiktok2, audioTiktok3];
            const frasesTiktok = ["Que buen feed tengo", "Jajaja Tung Tung Sahur", "Activando la rachini 🔥"];
            
            function lanzarTiktok() {
                tiktoks.forEach(a => { a.pause(); a.currentTime = 0; });
                let rand = Math.floor(Math.random() * tiktoks.length);
                audioActivoRecamara = tiktoks[rand];
                audioActivoRecamara.play().catch(()=>{});
                mostrarBurbuja(frasesTiktok[rand], 2000);
            }
            lanzarTiktok();
            intervaloBurbuja = setInterval(lanzarTiktok, 4000);
        }
    }
});

hitAcc2.addEventListener('click', () => {
    if (escenas[escenaActual] === 'sala') {
        animarBotonVisual(imgCorazon); audioCorazon.currentTime = 0; audioCorazon.play().catch(() => {});
        estaDormido = false; imgFoco.src = 'imagenes/foco1.png'; pantallaPrincipal.src = 'imagenes/corazones.png';
        crearLluviaCorazones(); mensajeAmor.classList.remove('oculto'); setTimeout(() => { mensajeAmor.classList.add('mostrar'); }, 10);
        if (timeoutMensaje) clearTimeout(timeoutMensaje);
        timeoutMensaje = setTimeout(() => { if (!estaDormido && escenas[escenaActual] === 'sala') { pantallaPrincipal.src = 'imagenes/normal.png'; } mensajeAmor.classList.remove('mostrar'); setTimeout(() => { if (!mensajeAmor.classList.contains('mostrar')) { mensajeAmor.classList.add('oculto'); } }, 400); }, 3000); 
    } else if (escenas[escenaActual] === 'cocina') { animarBotonVisual(imgPizza); alimentarPersonaje();
    } else if (escenas[escenaActual] === 'cuarto') {
        animarBotonVisual(imgControl);
        if (estaTecleando) { audioTecleando.pause(); estaTecleando = false; clearInterval(intervaloBurbuja); ocultarBurbuja(); } 
        if (estaJugando) { pantallaPrincipal.src = 'imagenes/normal_cuarto.png'; audioJugando.pause(); estaJugando = false; clearInterval(intervaloBurbuja); ocultarBurbuja(); } 
        else { pantallaPrincipal.src = 'imagenes/jugando.png'; audioJugando.play().catch(() => {}); estaJugando = true;
            let indiceJuego = 0; const textosJugando = ["¡Sacando la win en Fortnite! 🎮", "Ya casi gano 🏆", "Solo quedan 99 💀"];
            mostrarBurbuja(textosJugando[indiceJuego], 2000);
            intervaloBurbuja = setInterval(() => { indiceJuego++; if (indiceJuego >= textosJugando.length) indiceJuego = 0; mostrarBurbuja(textosJugando[indiceJuego], 2000); }, 4000);
        }
    } else if (escenas[escenaActual] === 'baño') {
        animarBotonVisual(imgJabon);
        if (estaEnTaza) { audioTaza.pause(); audioTaza.currentTime = 0; estaEnTaza = false; clearInterval(intervaloBurbuja); ocultarBurbuja(); }
        if (estaEnRegadera) { pantallaPrincipal.src = 'imagenes/baño_normal.png'; audioRegadera.pause(); estaEnRegadera = false; clearInterval(intervaloBurbuja); ocultarBurbuja(); } 
        else { pantallaPrincipal.src = 'imagenes/bañandose.png'; audioRegadera.play().catch(() => {}); estaEnRegadera = true;
            const chiflidos = ["🎶 Fiu fiu fiuuu 🧼 🎶", "🎶 Lalalala 🚿 🎶", "🎶 Turururú 🎶"];
            mostrarBurbuja(chiflidos[0], 2000);
            intervaloBurbuja = setInterval(() => { let txt = chiflidos[Math.floor(Math.random() * chiflidos.length)]; mostrarBurbuja(txt, 2000); }, 4000);
        }
    } else if (escenas[escenaActual] === 'recamara') {
        animarBotonVisual(imgSueno);
        if (estaUsandoTelefono) { 
            if (audioActivoRecamara) audioActivoRecamara.pause();
            estaUsandoTelefono = false; clearInterval(intervaloBurbuja); ocultarBurbuja();
        }
        if (estaDurmiendoCama) {
            pantallaPrincipal.src = 'imagenes/normal_recamara.png';
            if (audioActivoRecamara) { audioActivoRecamara.pause(); audioActivoRecamara.currentTime = 0; audioActivoRecamara = null; }
            estaDurmiendoCama = false; clearInterval(intervaloBurbuja); ocultarBurbuja();
        } else {
            pantallaPrincipal.src = 'imagenes/dormido_cama.png'; estaDurmiendoCama = true;
            const ronquidos = [audioDormido1, audioDormido2];
            const frasesSueno = ["Zzz... ¡A mimir pesado! 😴", "💤💤💤💤", "Pensando en Ami💤"];
            
            function lanzarSueno() {
                ronquidos.forEach(a => { a.pause(); a.currentTime = 0; });
                let rand = Math.floor(Math.random() * ronquidos.length);
                audioActivoRecamara = ronquidos[rand];
                audioActivoRecamara.play().catch(()=>{});
                mostrarBurbuja(frasesSueno[rand], 2000);
            }
            lanzarSueno();
            intervaloBurbuja = setInterval(lanzarSueno, 4000);
        }
    }
});

function crearLluviaCorazones() {
    for (let i = 0; i < 15; i++) { setTimeout(() => { const corazon = document.createElement('div'); corazon.classList.add('particula'); corazon.innerHTML = '❤'; corazon.style.left = Math.random() * 100 + 'vw'; corazon.style.animationDuration = (Math.random() * 2 + 2) + 's'; corazon.style.fontSize = (Math.random() * 20 + 20) + 'px'; contenedorParticulas.appendChild(corazon); setTimeout(() => { corazon.remove(); }, 4000); }, i * 100); }
}

function alimentarPersonaje() {
    if (estaComiendo) return; estaComiendo = true;
    mensajeComida.classList.remove('mostrar'); mensajeComida.classList.add('oculto');
    audioComida.currentTime = 0; audioComida.play().catch(() => {}); pantallaPrincipal.src = 'imagenes/boca_abierta.png';
    timeoutComida = setTimeout(() => { pantallaPrincipal.src = 'imagenes/masticando.png'; audioMasticar.currentTime = 0; audioMasticar.play().catch(() => {});
        timeoutMasticar = setTimeout(() => { if (escenas[escenaActual] === 'cocina') { pantallaPrincipal.src = 'imagenes/normal_cocina.png'; mensajeComida.classList.remove('oculto'); setTimeout(() => { mensajeComida.classList.add('mostrar'); }, 10); setTimeout(() => { mensajeComida.classList.remove('mostrar'); setTimeout(() => { if (!mensajeComida.classList.contains('mostrar')) { mensajeComida.classList.add('oculto'); } }, 400); }, 2500); } estaComiendo = false; }, 2000);
    }, 500);
}