import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useRecoilState, useRecoilValue } from "recoil"
import { currentPlaylistIdState, currentPlaylistState, playlistState } from "../atoms/playlistAtom"
import { CSS3DObject, CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer'
import * as THREE from 'three'
import TWEEN from 'tween.js';
import PlaylistView from './PlaylistView';
import { centerDisplayAtom } from '../atoms/centerDisplayAtom'
import spotifyApi from '../lib/spotify'


function Playlists() {

    const ref = useRef()
    const playlists = useRecoilValue(playlistState)
    const [playlistId, setPlaylistId] = useRecoilState(currentPlaylistIdState);
    const [view, setView] = useRecoilState(centerDisplayAtom)
    const [playlistCards, setPlaylistCards] = useState([])
    const [objects, setObjects] = useState([])
    const [targets, setTargets] = useState({ singleColumn: [], table: [], sphere: [], helix: [], grid: [] })



    useEffect(() => {

        var camera, scene, renderer;
        var controls;

        var objects = [];
        var targets = { singleColumn: [], table: [], sphere: [], helix: [], grid: [] };

        function init() {
            const width = document.getElementById('container').parentNode.clientWidth
            const height = document.getElementById('container').parentNode.clientHeight
            camera = new THREE.PerspectiveCamera( 50, width / height, 1, 100 );
            camera.position.z = 200;
            // camera.position.x = width*0.750
            // camera.position.y = height/2

            scene = new THREE.Scene();

            // table

            var columns = 8
            var rows = Math.round(playlists.length/columns)

            playlists.map((playlist,i) => {

                var element = document.createElement( 'div' );
                // // element.className = 'w-20 h-30 border border-solid border-[rgba(127, 255, 255, 0.25)] shadow-lg hover:shadow-2xl hover:border-[rgba(127, 255, 255, 0.75)]';
                // element.className = 'element'
                // element.style.backgroundColor = 'rgba(0,127,127,' + ( Math.random() * 0.5 + 0.25 ) + ')';
                // // element.style.width = Math.round(width/columns)

                var symbol = document.createElement( 'img' );
                symbol.className = 'w-64 h-64 ease-in-out transition-all hover:scale-150';
                symbol.src = playlist.images[0]?.url
                symbol.onclick = () => {setPlaylistId(playlist.id); setView(<PlaylistView/>)}
                element.appendChild( symbol ); 

                // var details = document.createElement( 'div' );
                // details.className = 'details';
                // details.innerHTML = 'PLAYLIST' + '<br>' + playlist.name;
                // element.appendChild( details );

                var object = new CSS3DObject( element );
                object.position.x = Math.random() * 400 - 200;
                object.position.y = Math.random() * 400 - 200;
                object.position.z = Math.random() * -40000;
                scene.add( object );

                objects.push( object );

                // singleColumn

                // var object = new THREE.Object3D();
                // object.position.x = 0
                // // (i%columns) 
                // // * width/3;
                // object.position.y = (Math.floor(i/columns) * height/2);

                // targets.singleColumn.push( object );

                var object = new THREE.Object3D();
                object.position.x = (i%columns) * width/5;
                object.position.y = (Math.floor(i/columns) * height/2);
                targets.table.push( object );

            })

            // sphere

            var vector = new THREE.Vector3();

            for ( var i = 0, l = objects.length; i < l; i ++ ) {

                var phi = Math.acos( -1 + ( 2 * i ) / l );
                var theta = Math.sqrt( l * Math.PI ) * phi;

                var object = new THREE.Object3D();

                object.position.x = 800 * Math.cos( theta ) * Math.sin( phi );
                object.position.y = 800 * Math.sin( theta ) * Math.sin( phi );
                object.position.z = 800 * Math.cos( phi );

                vector.copy( object.position ).multiplyScalar( 2 );

                object.lookAt( vector );

                targets.sphere.push( object );

            }

            // helix

            var vector = new THREE.Vector3();

            for ( var i = 0, l = objects.length; i < l; i ++ ) {

                var phi = i * 0.175 + Math.PI;

                var object = new THREE.Object3D();

                object.position.x = 900 * Math.sin( phi );
                object.position.y = - ( i * 8 ) + 450;
                object.position.z = 900 * Math.cos( phi );

                vector.x = object.position.x * 2;
                vector.y = object.position.y;
                vector.z = object.position.z * 2;

                object.lookAt( vector );

                targets.helix.push( object );

            }

            // grid

            for ( var i = 0; i < objects.length; i ++ ) {

                var object = new THREE.Object3D();

                object.position.x = ( ( i % 5 ) * 400 ) - 800;
                object.position.y = ( - ( Math.floor( i / 5 ) % 5 ) * 400 ) + 800;
                object.position.z = ( Math.floor( i / 25 ) ) * 1000 - 2000;

                targets.grid.push( object );

            }

            //

            renderer = new CSS3DRenderer();
            renderer.setSize( width, height );
            // renderer.domElement.style.position = 'absolute';
            document.getElementById( 'container' ).appendChild( renderer.domElement );

            //

            // controls = new THREE.TrackballControls( camera, renderer.domElement );
            // controls.rotateSpeed = 0.5;
            // controls.minDistance = 500;
            // controls.maxDistance = 6000;
            // controls.addEventListener( 'change', render );


            transform( targets.grid, 2000 )

            // setTimeout(() => {
            //     transform(targets.sphere, 2000)
            // }, 4000)
            

            //

            window.addEventListener( 'resize', onWindowResize, false );

        }

        function transform( targets, duration ) {

            TWEEN.removeAll();

            for ( var i = 0; i < objects.length; i ++ ) {

                var object = objects[ i ];
                var target = targets[ i ];

                new TWEEN.Tween( object.position )
                    .to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
                    .easing( TWEEN.Easing.Exponential.InOut )
                    .start();

                new TWEEN.Tween( object.rotation )
                    .to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
                    .easing( TWEEN.Easing.Exponential.InOut )
                    .start();

            }

            new TWEEN.Tween( this )
                .to( {}, duration * 2 )
                .onUpdate( render )
                .start();

        }

        function onWindowResize() {

            const width = document.getElementById('container').parentNode.clientWidth
            const height = document.getElementById('container').parentNode.clientHeight

            console.log('resizedd')
            camera.aspect = width/height;
            camera.updateProjectionMatrix();

            renderer.setSize( width, height );

            console.log(width, height, width/height)

            render();

        }

        function animate() {

            requestAnimationFrame( animate );

            TWEEN.update();

            // controls.update();

        }

        function render() {

            renderer.render( scene, camera );

        }
        init()
        animate()
    }, [])
    

    return (
        <div className='w-full h-3/4 '>
            <div id="container"></div>
        </div>
            
    )
}

export default Playlists
