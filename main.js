import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';

AFRAME.registerComponent('room-interior-hdri', {
  init: function () {
    const scene = this.el;

    new HDRLoader().load(
      'assets/hotel_room_1k.hdr',
      (texture) => {
        texture.colorSpace = AFRAME.THREE.LinearSRGBColorSpace;
        texture.mapping = AFRAME.THREE.EquirectangularReflectionMapping;
        scene.object3D.background = null;
        scene.object3D.environment = texture;
        scene.object3D.environmentIntensity = 0.3;
      },
      undefined,
      (error) => console.error('No se pudo cargar el HDRI de la habitación:', error)
    );
  }
});

AFRAME.registerComponent('rotation-controller', {
  schema: {
    active: { default: false },
    speed: { default: 60 }
  },

  tick: function (_time, delta) {
    if (!this.data.active || !delta) return;

    const elapsed = Math.min(delta, 100) / 1000;
    this.el.object3D.rotateY((this.data.speed * elapsed * Math.PI) / 180);
  }
});

const scene = document.querySelector('a-scene');
const ui = document.querySelector('#ui');
const uiPanel = document.querySelector('.ui-panel');
const arStatus = document.querySelector('#ar-status');
const arButton = document.querySelector('#ar-button');
const rotationButton = document.querySelector('#rotation-button');
const marcador = document.querySelector('#marcador');
const modelo = document.querySelector('#modelo');
const animationButton = document.querySelector('#anima');
const plataforma = document.querySelector('#plataforma');
let arSupported = false;

ui.addEventListener('beforexrselect', (event) => {
  event.preventDefault();
});

function showARStatus(message) {
  arStatus.textContent = message;
  arStatus.hidden = false;
}

async function checkARSupport() {
  if (!navigator.xr) {
    arButton.textContent = 'AR no disponible';
    showARStatus('AR no está disponible. Abre esta experiencia en un navegador compatible y mediante HTTPS.');
    return;
  }

  try {
    arSupported = await navigator.xr.isSessionSupported('immersive-ar');
  } catch (error) {
    console.error('No se pudo comprobar la compatibilidad con AR:', error);
    arButton.textContent = 'AR no disponible';
    showARStatus('No se pudo comprobar si este dispositivo admite AR. Recarga la página e inténtalo nuevamente.');
    return;
  }

  if (!arSupported) {
    arButton.textContent = 'AR no disponible';
    showARStatus('Este dispositivo o navegador no admite experiencias AR.');
    return;
  }

  arButton.disabled = false;
  arButton.textContent = 'Iniciar AR';
  rotationButton.hidden = false;
  animationButton.hidden = false;
}

checkARSupport();

arButton.addEventListener('click', async () => {
  if (scene.is('ar-mode')) {
    try {
      await scene.exitVR();
    } catch (error) {
      console.error('No se pudo salir del modo AR:', error);
      showARStatus('No se pudo salir del modo AR.');
    }
    return;
  }

  if (!arSupported) {
    showARStatus('Este dispositivo o navegador no admite experiencias AR.');
    return;
  }

  arButton.disabled = true;
  arStatus.textContent = 'Iniciando AR…';

  try {
    await scene.enterVR(true);
  } catch (error) {
    console.error('No se pudo iniciar el modo AR:', error);
    showARStatus('No se pudo iniciar AR. Comprueba los permisos y que el dispositivo sea compatible.');
    arButton.disabled = false;
  }
});

scene.addEventListener('enter-vr', () => {
  if (!scene.is('ar-mode')) {
    showARStatus('Este dispositivo inició VR, pero no admite el modo AR requerido.');
    arButton.disabled = false;
    return;
  }

  arButton.textContent = 'Salir de AR';
  arButton.disabled = false;
  plataforma.setAttribute('visible', false);
  showARStatus('Apunta a una superficie plana y toca el lugar donde quieres colocar el personaje.');
});

scene.addEventListener('ar-hit-test-achieved', (event) => {
  const position = event.detail?.position;

  if (position) {
    marcador.setAttribute('position', `${position.x} ${position.y} ${position.z}`);
    marcador.setAttribute('visible', true);
  }

  showARStatus('Superficie detectada. Toca para colocar el personaje.');
});

scene.addEventListener('ar-hit-test-select', (event) => {
  const position = event.detail?.position;

  if (position) {
    modelo.setAttribute('position', `${position.x} ${position.y} ${position.z}`);
    plataforma.setAttribute('position', `${position.x} ${position.y - 0.06} ${position.z}`);
    plataforma.setAttribute('visible', true);
    marcador.setAttribute('position', `${position.x} ${position.y} ${position.z}`);
    marcador.setAttribute('visible', false);
  }

  showARStatus('Personaje colocado. Puedes iniciar la rotación cuando quieras.');
  rotationButton.hidden = false;
  animationButton.hidden = false;
  uiPanel.classList.remove('is-start-screen');
});

scene.addEventListener('exit-vr', () => {
  arButton.textContent = 'Iniciar AR';
  arButton.disabled = false;
  plataforma.setAttribute('position', '0 -0.06 -2');
  plataforma.setAttribute('visible', true);
  rotationButton.hidden = !arSupported;
  animationButton.hidden = !arSupported;
  uiPanel.classList.add('is-start-screen');
  arStatus.hidden = arSupported;
});

let rotationStarted = false;
let rotationRunning = false;

function toggleRotation() {
  if (!rotationStarted) {
    modelo.setAttribute('rotation-controller', 'active', true);
    rotationStarted = true;
    rotationRunning = true;
    rotationButton.textContent = 'Detener rotación';
  } else if (rotationRunning) {
    modelo.setAttribute('rotation-controller', 'active', false);
    rotationRunning = false;
    rotationButton.textContent = 'Reanudar rotación';
  } else {
    modelo.setAttribute('rotation-controller', 'active', true);
    rotationRunning = true;
    rotationButton.textContent = 'Detener rotación';
  }
}

rotationButton.addEventListener('click', toggleRotation);
window.toggleRotation = toggleRotation;

let currentAnimation = 'look_around';
let secondaryAction;

animationButton.addEventListener('click', () => {
  if (currentAnimation === 'box_02') return;

  secondaryAction?.stop();
  currentAnimation = 'box_02';
  animationButton.disabled = true;
  modelo.setAttribute('animation-mixer', 'loop', 'once');
  modelo.setAttribute('animation-mixer', 'clampWhenFinished', true);
  modelo.setAttribute('animation-mixer', 'clip', currentAnimation);
});

modelo.addEventListener('animation-finished', (event) => {
  if (currentAnimation !== 'box_02') return;

  secondaryAction = event.detail.action;
  currentAnimation = 'look_around';
  modelo.setAttribute('animation-mixer', 'loop', 'repeat');
  modelo.setAttribute('animation-mixer', 'clampWhenFinished', false);
  modelo.setAttribute('animation-mixer', 'clip', currentAnimation);
  animationButton.disabled = false;
  animationButton.textContent = 'Cambiar animación';
});
