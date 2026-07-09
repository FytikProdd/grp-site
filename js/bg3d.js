/* GRP — золотая 3D-вселенная (Three.js, фиксированный фон) */
(function () {
  var canvas = document.getElementById("bg3d");
  if (!canvas || typeof THREE === "undefined") return;

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
  } catch (e) {
    canvas.style.display = "none";
    return;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  var scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x060402, 0.055);

  var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 11);

  /* ---- Gold dust: particle field ---- */
  function makeGlowTexture() {
    var c = document.createElement("canvas");
    c.width = c.height = 64;
    var g = c.getContext("2d");
    var grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255, 240, 180, 1)");
    grad.addColorStop(0.35, "rgba(246, 226, 122, 0.7)");
    grad.addColorStop(1, "rgba(212, 175, 55, 0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
    var tex = new THREE.CanvasTexture(c);
    return tex;
  }

  var glowTex = makeGlowTexture();

  var COUNT = window.innerWidth < 760 ? 900 : 1800;
  var positions = new Float32Array(COUNT * 3);
  var speeds = new Float32Array(COUNT);
  var SPREAD = 34;
  for (var i = 0; i < COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * SPREAD;
    positions[i * 3 + 1] = (Math.random() - 0.5) * SPREAD * 0.7;
    positions[i * 3 + 2] = (Math.random() - 0.5) * SPREAD * 0.6;
    speeds[i] = 0.15 + Math.random() * 0.7;
  }

  var geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  var mat = new THREE.PointsMaterial({
    size: 0.14,
    map: glowTex,
    color: 0xd4af37,
    transparent: true,
    opacity: 0.75,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });

  var dust = new THREE.Points(geo, mat);
  scene.add(dust);

  /* second, brighter close layer */
  var COUNT2 = Math.floor(COUNT / 5);
  var pos2 = new Float32Array(COUNT2 * 3);
  for (var j = 0; j < COUNT2; j++) {
    pos2[j * 3] = (Math.random() - 0.5) * 20;
    pos2[j * 3 + 1] = (Math.random() - 0.5) * 14;
    pos2[j * 3 + 2] = Math.random() * 6;
  }
  var geo2 = new THREE.BufferGeometry();
  geo2.setAttribute("position", new THREE.BufferAttribute(pos2, 3));
  var mat2 = new THREE.PointsMaterial({
    size: 0.28,
    map: glowTex,
    color: 0xf6e27a,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });
  var sparks = new THREE.Points(geo2, mat2);
  scene.add(sparks);

  /* ---- Imperial geometry: wireframe relics floating in depth ---- */
  var goldWire = new THREE.MeshBasicMaterial({
    color: 0xd4af37,
    wireframe: true,
    transparent: true,
    opacity: 0.16,
  });
  var brightWire = new THREE.MeshBasicMaterial({
    color: 0xf6e27a,
    wireframe: true,
    transparent: true,
    opacity: 0.1,
  });

  var relics = [];
  function addRelic(geometry, x, y, z, mtl, spin) {
    var mesh = new THREE.Mesh(geometry, mtl);
    mesh.position.set(x, y, z);
    mesh.userData.spin = spin;
    mesh.userData.baseY = y;
    mesh.userData.phase = Math.random() * Math.PI * 2;
    scene.add(mesh);
    relics.push(mesh);
    return mesh;
  }

  addRelic(new THREE.TorusKnotGeometry(2.4, 0.55, 140, 18), 0, 0.4, -6, goldWire, 0.05);
  addRelic(new THREE.OctahedronGeometry(1.15, 0), -7.5, 2.6, -4, brightWire, 0.22);
  addRelic(new THREE.OctahedronGeometry(0.8, 0), 7.8, -2.2, -3, brightWire, 0.3);
  addRelic(new THREE.IcosahedronGeometry(1.5, 0), 6.4, 3.4, -8, goldWire, 0.14);
  addRelic(new THREE.TetrahedronGeometry(0.9, 0), -6.8, -3.2, -5, goldWire, 0.26);
  addRelic(new THREE.TorusGeometry(1.2, 0.05, 12, 60), 4.6, -3.8, -7, brightWire, 0.18);

  /* ---- Interaction state ---- */
  var mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
  var scrollRatio = 0;

  window.addEventListener("mousemove", function (e) {
    targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  window.addEventListener("scroll", function () {
    var max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    scrollRatio = window.scrollY / max;
  }, { passive: true });

  window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  /* ---- Render loop ---- */
  var clock = new THREE.Clock();
  var running = true;

  document.addEventListener("visibilitychange", function () {
    running = !document.hidden;
    if (running) animate();
  });

  function animate() {
    if (!running) return;
    requestAnimationFrame(animate);

    var t = clock.getElapsedTime();

    mouseX += (targetX - mouseX) * 0.04;
    mouseY += (targetY - mouseY) * 0.04;

    dust.rotation.y = t * 0.018 + mouseX * 0.12;
    dust.rotation.x = mouseY * 0.08 + scrollRatio * 0.5;
    dust.position.y = scrollRatio * 4;

    sparks.rotation.y = -t * 0.03 + mouseX * 0.2;
    sparks.position.y = scrollRatio * 6 - 1;

    /* gentle drift of individual particles */
    var arr = geo.attributes.position.array;
    for (var i = 0; i < COUNT; i++) {
      arr[i * 3 + 1] += Math.sin(t * speeds[i] + i) * 0.0012;
    }
    geo.attributes.position.needsUpdate = true;

    for (var r = 0; r < relics.length; r++) {
      var m = relics[r];
      m.rotation.x = t * m.userData.spin;
      m.rotation.y = t * m.userData.spin * 1.4;
      m.position.y = m.userData.baseY + Math.sin(t * 0.5 + m.userData.phase) * 0.5 + scrollRatio * 5;
    }

    camera.position.x = mouseX * 0.9;
    camera.position.y = -mouseY * 0.7 - scrollRatio * 1.4;
    camera.lookAt(0, -scrollRatio * 1.2, -4);

    renderer.render(scene, camera);
  }

  if (prefersReduced) {
    renderer.render(scene, camera);
  } else {
    animate();
  }
})();
