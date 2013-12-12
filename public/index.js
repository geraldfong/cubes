$(function() {
  var scene, renderer;
  var geometry, material, mesh;
  var t = 0;
  var projector;
  var score = 0;
  var expandVel = 1;
  

  var cubes = [];
  var expand = false;

  init();
  pollServer();
  animate();

  function init() {
    var r, g, b, hexColor;

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 4500 );
    camera.position.z = 1000;

    scene = new THREE.Scene();
    projector = new THREE.Projector();

    for (var i = 0; i < 150; i++) {
      geometry = new THREE.CubeGeometry( 50 + Math.random() * 100, 50 + Math.random() * 100, 50 + Math.random() * 100 );

      r = Math.floor(Math.random() * 255);
      g = Math.floor(Math.random() * 255) * 256;
      b = Math.floor(Math.random() * 255) * 256 * 256;
      rgb = r + g + b;

      material = new THREE.MeshBasicMaterial( { color: rgb, wireframe: true } );
      mesh = new THREE.Mesh( geometry, material );
      cubes.push(mesh);
      
      mesh.drx = 0.01 + 0.03 * Math.random();
      mesh.dry = 0.02 + 0.06 * Math.random();
      mesh.drz = 0.01 + 0.03 * Math.random();
      mesh.xtheta = 40 + 80 * Math.random();
      mesh.ytheta = 40 + 80 * Math.random();
      mesh.ztheta = 40 + 80 * Math.random();
      mesh.xmag = 400 + 1500 * Math.random();
      mesh.ymag = 200 + 200 * Math.random();
      mesh.zmag = 400 + 1500 * Math.random();
      scene.add( mesh );
    }

    groundMaterial = new THREE.MeshBasicMaterial({color: 0x00aaaa, wireframe: true});
    ground = new THREE.Mesh(new THREE.CubeGeometry(4500, 4500, 10, 12, 12), groundMaterial);
    scene.add(ground);
    ground.rotation.x = Math.PI/2;
    ground.position.y = -500;


    renderer = new THREE.CanvasRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    document.body.appendChild( renderer.domElement );
  }

  function pollServer() {
    $.get("http://geraldfong.com:1500/query", function(data, blah) {
      var val = parseFloat(data);
      expand = val > 2;
    });
    setTimeout(pollServer, 20);
  }
  function animate() {

    // note: three.js includes requestAnimationFrame shim
    requestAnimationFrame( animate );
    for (var i = 0 ; i < cubes.length; i++) {
      var mesh = cubes[i];
      //mesh.rotation.x += mesh.drx;
      //mesh.rotation.y += mesh.dry;
      //mesh.rotation.z += mesh.drz;
      mesh.position.x = mesh.xmag * Math.cos(t/mesh.xtheta);
      mesh.position.y = mesh.ymag * Math.sin(t/mesh.ytheta);
      mesh.position.z = mesh.zmag * Math.cos(t/mesh.ztheta);
      if (expand) {
        expandVel = Math.min(expandVel + 0.00001, 1.05);
      } else {
        expandVel = Math.max(expandVel - 0.00002, 0.99);
      }
      var minMag = 150;
      mesh.xmag = Math.min(Math.max(mesh.xmag * expandVel, minMag), 1300);
      mesh.ymag = Math.min(Math.max(mesh.ymag * expandVel, minMag), 1300);
      mesh.zmag = Math.min(Math.max(mesh.zmag * expandVel, minMag), 1300);

    }
    camera.position.z = 1000 * Math.cos(t/100);
    camera.position.x = 1000 * Math.sin(t/100);
    camera.rotation.y = (t/100);

    renderer.render( scene, camera );
    t++;
  }

  document.addEventListener( 'mousedown', onDocumentMouseDown, false );

  function onDocumentMouseDown( event ) {

    event.preventDefault();

    var vector = new THREE.Vector3(
      ( event.clientX / window.innerWidth ) * 2 - 1,
      - ( event.clientY / window.innerHeight ) * 2 + 1,
      0.5
    );
    projector.unprojectVector( vector, camera );

    var ray = new THREE.Ray( camera.position, 
      vector.subSelf( camera.position ).normalize() );

      var intersects = ray.intersectObjects( cubes );

      if ( intersects.length > 0 ) {

        mesh = intersects[ 0 ].object;
        //scene.remove(mesh);
        
        score += 20;

      } else {
        score -= 5;
      }

      /*
      // Parse all the faces
      for ( var i in intersects ) {
      intersects[ i ].face.material[ 0 ].color
      .setHex( Math.random() * 0xffffff | 0x80000000 );
      }
      */
      $("#score").html(score);
  }
});
