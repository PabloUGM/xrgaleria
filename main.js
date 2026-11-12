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

const scene = document.querySelector('a-scene');
const arStatus = document.querySelector('#ar-status');
const arButton = document.querySelector('#ar-button');
const rotationButton = document.querySelector('#rotation-button');
const marcador = document.querySelector('#marcador');
const modelo = document.querySelector('#modelo');

arButton.addEventListener('click', async () => {
  if (scene.is('ar-mode')) {
    try {
      await scene.exitVR();
    } catch (error) {
      console.error('No se pudo salir del modo AR:', error);
      arStatus.textContent = 'No se pudo salir del modo AR.';
    }
    return;
  }

  if (!navigator.xr) {
    arStatus.textContent = 'AR no está disponible. Abre esta experiencia en un navegador compatible y mediante HTTPS.';
    return;
  }

  arButton.disabled = true;
  arStatus.textContent = 'Iniciando AR…';

  try {
    await scene.enterVR(true);
  } catch (error) {
    console.error('No se pudo iniciar el modo AR:', error);
    arStatus.textContent = 'No se pudo iniciar AR. Comprueba los permisos y que el dispositivo sea compatible.';
    arButton.disabled = false;
  }
});

scene.addEventListener('enter-vr', () => {
  if (!scene.is('ar-mode')) {
    arStatus.textContent = 'Este dispositivo inició VR, pero no admite el modo AR requerido.';
    arButton.disabled = false;
    return;
  }

  arButton.textContent = 'Salir de AR';
  arButton.disabled = false;
  arStatus.textContent = 'Apunta a una superficie plana y toca el lugar donde quieres colocar el personaje.';
});

scene.addEventListener('ar-hit-test-achieved', (event) => {
  const position = event.detail?.position;

  if (position) {
    marcador.setAttribute('position', `${position.x} ${position.y} ${position.z}`);
    marcador.setAttribute('visible', true);
  }

  arStatus.textContent = 'Superficie detectada. Toca para colocar el personaje.';
});

scene.addEventListener('ar-hit-test-select', (event) => {
  const position = event.detail?.position;

  if (position) {
    modelo.setAttribute('position', `${position.x} ${position.y} ${position.z}`);
    marcador.setAttribute('position', `${position.x} ${position.y} ${position.z}`);
    marcador.setAttribute('visible', false);
  }

  arStatus.textContent = 'Personaje colocado. Puedes iniciar la rotación cuando quieras.';
});

scene.addEventListener('exit-vr', () => {
  arButton.textContent = 'Iniciar AR';
  arButton.disabled = false;
  arStatus.textContent = 'Presiona «Iniciar AR» y apunta a una superficie plana para colocar el personaje.';
});

let rotationStarted = false;
let rotationRunning = false;

function toggleRotation() {
  const model = document.querySelector('#modelo');

  if (!rotationStarted) {
    model.emit('rotation-start');
    rotationStarted = true;
    rotationRunning = true;
    rotationButton.textContent = 'Detener rotación';
  } else if (rotationRunning) {
    model.emit('rotation-pause');
    rotationRunning = false;
    rotationButton.textContent = 'Reanudar rotación';
  } else {
    model.emit('rotation-resume');
    rotationRunning = true;
    rotationButton.textContent = 'Detener rotación';
  }
}

rotationButton.addEventListener('click', toggleRotation);
window.toggleRotation = toggleRotation;
