# Nombre de tu escena

Pablo Mardones Cofré - Galeria Aumentada · Realidades Extendidas y Experiencias Inmersivas · UGM · 2026

## 1 · Qué es

Galería Extendida es una experiencia de realidad aumentada que permite mostrar los trabajos de los estudiantes de Diseño y Animación de INACAP de una forma diferente, incorporando personajes y elementos 3D con los que se puede interactuar desde el celular. La idea es generar curiosidad y sorpresa en los visitantes, haciendo que las exposiciones sean más entretenidas y participativas.

- Inmersión digital ...

## 2 · Cómo se usa

Enlace público de la experiencia (HTTPS): https://pablougm.github.io/xrgaleria/
Dispositivo elegido para el proyecto: Samsung Galaxy S24 (Android).
Recorrido previsto del visitante
1. Escanear el código QR de la exposición o abrir el enlace público.
2. Acceder a la experiencia desde el navegador del teléfono.
3. Dar permiso de cámara cuando sea solicitado.
4. Apuntar el teléfono a una superficie para posicionar el personaje si la detección de superficies está efectivamente implementada.
5. Observar la animación Idle del personaje.
6. Tocar el personaje para reproducir Action y comprobar su retorno a Idle.

## 3 · Cómo está hecha
Tecnología y recursos
-A-Frame 1.8.0 - 	Estructura de la escena 3D e integración web
-JavaScript - 	Gestión del toque y transición entre animaciones
-WebXR / Hit Test - Posicionamiento sobre superficies del mundo real
-HTTPS / GitHub Pages
- Archivos que usé:
 - Modelos GLB/glTF - Personaje tridimensional y animaciones , 	Modelo con clips Idle y Action disponible; verificar integración

## 4 · Decisiones

- Acceso desde el navegador: mantengo la idea de un QR que lleve a una experiencia WebAR, para evitar una instalación adicional.
- Momento clave: concentro el prototipo en un personaje 3D para probar un comportamiento concreto antes de ampliar la cantidad de obras expuestas.
- Animación e interacción: utilizo la secuencia Idle → Action → Idle como respuesta sencilla y reconocible al toque del usuario.
  
-Cambios respecto de la Solemne 1
-Desarrollo web - Propuesta inicial era Three.js con WebXR : Se optó por A-Frame 1.8.0 para construir la escena y organizar sus componentes de manera más directa.


## 5 · Testing

Video del recorrido: [Video grabado de la experincia en el pasillo](https://youtu.be/r1Sr4qK34qs)

### Abrir el enlace en ventana privada
- Resultado: Carga sin quedar en blanco.
- Ajuste que hice: ...

### Dispositivo elegido
- Resultado: Se ve y se maneja correctamente.
- Ajuste que hice: ...

### Interacciones, una por una
- Resultado: Responde según la interacción prevista.
- Ajuste que hice: Tocar boton animar personaje; comprobar Action y retorno a Idle.

### Sonido con audífonos
- Resultado: No tiene, el audio es el del ambiente
- Ajuste que hice: ...

### Fluidez del recorrido
- Resultado: No presenta saltos, bloqueos ni pausas importantes.
- Ajuste que hice: ...

### Entrar como si fuera la primera vez
- Resultado: 	Entrar sin apoyarse en las notas del desarrollo.
- Ajuste que hice: ...

## 6 · Uso de IA

- Se utilizó github copilot como herramienta de apoyo para: Solicitar propuestas de código para cargar un GLB y gestionar la transición entre las animaciones Idle y Action. La animacion secundaria esta hecha con tripo3d
- El codigo base de la escena esta escrito con los recursos visto en clases. El modelado, textura , rigging y la animacion idle son de mi autoria.

## 7 · Pendientes para el examen

- Incorporacion de una segunda experiencia de AR para la carga de un video animado previamente renderizado en .mp4
- Lámina para colocar en el lugar donde inicia la experiencia que acompañe al qr como elemento visual.
