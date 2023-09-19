import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'lil-gui'
import Maze from './Maze'
import gsap from 'gsap'

/**
 * Debug
 */
// const gui = new dat.GUI()

/**
 * Scene
 */
const scene = new THREE.Scene()

/**
 * Player
 */
const material = new THREE.MeshStandardMaterial({ color: 0xce21b1 })
const geometry = new THREE.SphereGeometry(0.1, 30, 30)

const mesh = new THREE.Mesh(geometry, material)
mesh.position.y = 0.1
scene.add(mesh)

/**
 * render sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
}
/**
 * Camera
 */
const fov = 60
const camera = new THREE.PerspectiveCamera(fov, sizes.width / sizes.height, 0.1)
camera.position.set(4, 4, 4)
camera.lookAt(new THREE.Vector3(0, 2.5, 0))

const hemLight = new THREE.HemisphereLight(0xffffff, 0xff9914, 0.3)
const pointLight = new THREE.PointLight(0xffffff, 2, 8, 1.3)
pointLight.position.y = 5
scene.add(hemLight)

mesh.add(camera, pointLight)

scene.fog = new THREE.Fog(0x121212, 10, 20)
scene.background = new THREE.Color(0x121212)

/**
 * Show the axes of coordinates system
 */
const axesHelper = new THREE.AxesHelper(3)
// scene.add(axesHelper)

/**
 * renderer
 */
const renderer = new THREE.WebGLRenderer({
	antialias: window.devicePixelRatio < 2,
	logarithmicDepthBuffer: true,
})
document.body.appendChild(renderer.domElement)
handleResize()

/**
 * OrbitControls
 */
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

/**
 * Graph
 */
const maze = new Maze({ scene, resolution: new THREE.Vector2(40, 40) })
const mazeHelper = new THREE.GridHelper(maze.resolution.x, maze.resolution.x)
// scene.add(mazeHelper)
console.log(maze)

const i = Math.floor(Math.random() * maze.nodes.length)
let currentNode = maze.nodes[i]

mesh.position.x = currentNode.mesh.position.x
mesh.position.z = currentNode.mesh.position.z

/**
 * Three js Clock
 */
// const clock = new THREE.Clock()

/**
 * frame loop
 */
function tic() {
	/**
	 * tempo trascorso dal frame precedente
	 */
	// const deltaTime = clock.getDelta()
	/**
	 * tempo totale trascorso dall'inizio
	 */
	// const time = clock.getElapsedTime()

	// controls.update()

	renderer.render(scene, camera)

	requestAnimationFrame(tic)
}

requestAnimationFrame(tic)

window.addEventListener('resize', handleResize)

function handleResize() {
	sizes.width = window.innerWidth
	sizes.height = window.innerHeight

	camera.aspect = sizes.width / sizes.height
	camera.updateProjectionMatrix()

	renderer.setSize(sizes.width, sizes.height)

	const pixelRatio = Math.min(window.devicePixelRatio, 2)
	renderer.setPixelRatio(pixelRatio)
}

let prevNode

function movePlayer() {
	// const neighborsIndex = currentNode.getNeighbors()
	let neighbors = currentNode.connectedNodes

	if (neighbors.length > 1 && prevNode) {
		neighbors = neighbors.filter((node) => node !== prevNode)
	}

	const i = Math.floor(Math.random() * neighbors.length)
	const nextNode = neighbors[i]

	const { position } = nextNode.mesh

	gsap.to(mesh.position, {
		x: position.x,
		z: position.z,
		ease: 'linear',
		duration: 0.8,
	})

	prevNode = currentNode
	currentNode = nextNode
}

setInterval(movePlayer, 800)
