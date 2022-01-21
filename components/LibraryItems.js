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
import { libraryViewState } from '../atoms/libraryAtom'
import { albumState } from '../atoms/albumAtom'


function LibraryItems() {

    const ref = useRef()
    const playlists = useRecoilValue(playlistState)
    const albums = useRecoilValue(albumState)
    const [playlistId, setPlaylistId] = useRecoilState(currentPlaylistIdState);
    const [view, setView] = useRecoilState(centerDisplayAtom)
    const [playlistObjects, setPlaylistObjects] = useState([])
    const [albumObjects, setAlbumObjects] = useState([])
    const [cardGridPos, setCardGridPos] = useState([])
    const [cardInitPos, setCardInitPos] = useState([])
    const [camera, setCameraState] = useState()
    const [renderer, setrendererState] = useState()
    const [scene, setsceneState] = useState()
    const libraryView = useRecoilValue(libraryViewState)

    function transform( objects, targets, duration ) {

        

        TWEEN.removeAll();

        for ( var i = 0; i < objects.length; i ++ ) {

            var object = objects[ i ];
            var target = targets[ i ];

            if (!target) return

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

    function render() {
        if (!renderer) return
        renderer.render( scene, camera );

    }


    useEffect(() => {

        var camera, scene, renderer;

        function init() {
            const width = document.getElementById('container').parentNode.clientWidth
            const height = document.getElementById('container').parentNode.clientHeight
            camera = new THREE.PerspectiveCamera( 50, width / height, 1, 100 );
            camera.position.z = 200;

            scene = new THREE.Scene();

            setCameraState(camera)

            playlists.map((playlist,i) => {

                console.log(playlist)
                var playlistCard = document.createElement( 'div' );

                var image = document.createElement( 'img' );
                image.className = 'w-64 h-64 ease-in-out transition-all hover:scale-150';
                image.src = playlist.images[0]?.url
                image.onclick = () => {setPlaylistId(playlist.id); setView(<PlaylistView/>)}
                playlistCard.appendChild( image ); 

                var object = new CSS3DObject( playlistCard );
                object.position.x = Math.random() * 400 - 200;
                object.position.y = Math.random() * 400 - 200;
                object.position.z = Math.random() * -40000;
                scene.add( object );

                setPlaylistObjects(objects => [...objects, object]);

            })

            albums.map(({album}) => {
                console.log(album)
                var albumCard = document.createElement( 'div' );
                
                var image = document.createElement( 'img' );
                image.className = 'w-64 h-64 ease-in-out transition-all hover:scale-150';
                image.src = album.images[0]?.url
                // image.onclick = () => {setView(<PlaylistView/>)}
                albumCard.appendChild( image ); 

                var object = new CSS3DObject( albumCard );
                object.position.x = Math.random() * 400 - 200;
                object.position.y = Math.random() * 400 - 200;
                object.position.z = Math.random() * -4000 - 5000;
                scene.add( object );

                setAlbumObjects(objects => [...objects, object]);

            })

            setsceneState(scene)

            // sphere

            // var vector = new THREE.Vector3();

            // for ( var i = 0, l = objects.length; i < l; i ++ ) {

            //     var phi = Math.acos( -1 + ( 2 * i ) / l );
            //     var theta = Math.sqrt( l * Math.PI ) * phi;

            //     var object = new THREE.Object3D();

            //     object.position.x = 800 * Math.cos( theta ) * Math.sin( phi );
            //     object.position.y = 800 * Math.sin( theta ) * Math.sin( phi );
            //     object.position.z = 800 * Math.cos( phi );

            //     vector.copy( object.position ).multiplyScalar( 2 );

            //     object.lookAt( vector );

            //     // targets.sphere.push( object );
            //     setTargets(targets => [...targets, targets.sphere.push(object)])

            // }

            // helix

            // var vector = new THREE.Vector3();

            // for ( var i = 0, l = objects.length; i < l; i ++ ) {

            //     var phi = i * 0.175 + Math.PI;

            //     var object = new THREE.Object3D();

            //     object.position.x = 900 * Math.sin( phi );
            //     object.position.y = - ( i * 8 ) + 450;
            //     object.position.z = 900 * Math.cos( phi );

            //     vector.x = object.position.x * 2;
            //     vector.y = object.position.y;
            //     vector.z = object.position.z * 2;

            //     object.lookAt( vector );

            //     // targets.helix.push( object );
            //     setTargets(targets => [...targets, targets.helix.push(object)])

            // }

            renderer = new CSS3DRenderer();
            renderer.setSize( width, height );
            document.getElementById( 'container' ).appendChild( renderer.domElement );
            setrendererState(renderer)

            window.addEventListener( 'resize', onWindowResize, false );

        }
        

        function onWindowResize() {

            const width = document.getElementById('container').parentNode.clientWidth
            const height = document.getElementById('container').parentNode.clientHeight

            camera.aspect = width/height;
            camera.updateProjectionMatrix();

            renderer.setSize( width, height );

            render();

        }

        function animate() {

            requestAnimationFrame( animate );

            TWEEN.update();

        }

        init()
        animate()
    }, [])

    // create card positions
    useEffect(() => {
        if (playlistObjects.length < 1) return
        const inits = []
        const targets = []
        const maxItemsToShow = Math.max(playlistObjects.length, albumObjects.length)
        for ( var i = 0; i < maxItemsToShow; i ++ ) {

            var object = new THREE.Object3D();

            object.position.x = ( ( i % 5 ) * 400 ) - 800;
            object.position.y = ( - ( Math.floor( i / 5 ) % 5 ) * 400 ) + 800;
            object.position.z = ( Math.floor( i / 25 ) ) * 1000 - 2000;

            targets.push( object );

            var object = new THREE.Object3D();

            object.position.x = Math.random() * 400 - 200;
            object.position.y = Math.random() * 400 - 200;
            object.position.z = Math.random() * -40000 - 2000;

            inits.push( object );

        }
        setCardGridPos(targets)
        setCardInitPos(inits)
    }, [playlistObjects])

    useEffect(() => {
        if (cardGridPos.length < 1) return
        transform( playlistObjects, cardGridPos, 500)
        setTimeout(() => {
            transform( albumObjects, cardInitPos, 500)
        },2000)
    }, [cardGridPos])

    useEffect(() => {
        
        if (libraryView != 'userPlaylists') {
            // console.log('transforming to album')
            transform( playlistObjects, cardInitPos, 500)
            setTimeout(() => {
                transform( albumObjects, cardGridPos, 500)
            },1000)
        } else {
            // console.log('transforming to playlist')
            transform( albumObjects, cardInitPos, 500)
            setTimeout(() => {
                transform( playlistObjects, cardGridPos, 500)
            },1000)
        }
    }, [libraryView])
    

    return (
        <div className='w-full h-3/4 '>
            <div id="container"></div>
        </div>
            
    )
}

export default LibraryItems
