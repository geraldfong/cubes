$(function() {
  var camera, scene, renderer;
  var geometry, material, mesh;
  var t = 0;
  var projector;
  var score = 0;
  

  var cubes = [];

  init();
  animate();

  function init() {
    var r, g, b, hexColor;

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 1000;

    scene = new THREE.Scene();
    projector = new THREE.Projector();

    for (var i = 0; i < 20; i++) {
      geometry = new THREE.CubeGeometry( 200, 200, 200 );

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
      mesh.xtheta = 20 + 40 * Math.random();
      mesh.ytheta = 20 + 40 * Math.random();
      mesh.ztheta = 20 + 40 * Math.random();
      mesh.xmag = 400 + 500 * Math.random();
      mesh.ymag = 400 + 500 * Math.random();
      mesh.zmag = 400 + 500 * Math.random();
      scene.add( mesh );
    }

    groundMaterial = new THREE.MeshBasicMaterial({color: 0x0000aa, wireframe: true});
    ground = new THREE.Mesh(new THREE.CubeGeometry(1500, 1500, 10, 10, 10), groundMaterial);
    //scene.add(ground);
    ground.rotation.x = Math.PI/2;
    ground.position.y = -40;
    ground.position.z = 500;


    renderer = new THREE.CanvasRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    document.body.appendChild( renderer.domElement );


  }

  function animate() {

    // note: three.js includes requestAnimationFrame shim
    requestAnimationFrame( animate );
    for (var i = 0 ; i < cubes.length; i++) {
      var mesh = cubes[i];
      mesh.rotation.x += mesh.drx;
      mesh.rotation.y += mesh.dry;
      mesh.rotation.z += mesh.drz;
      mesh.position.x = mesh.xmag * Math.cos(t/mesh.xtheta);
      mesh.position.y = mesh.ymag * Math.sin(t/mesh.ytheta);
      mesh.position.z = mesh.zmag * Math.cos(t/mesh.ztheta);

    }
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
