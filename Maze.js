import {
	BoxGeometry,
	Mesh,
	MeshNormalMaterial,
	MeshStandardMaterial,
	Vector2,
	Vector3,
} from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry'
import Graph from './Graph'
import Node from './Node'

const CELL_MATERIAL = new MeshStandardMaterial({ color: 0xdbdbdb })
const HEIGHT = 0.05

export default class Maze extends Graph {
	constructor({ resolution = new Vector2(20, 20), cellSize = 1, scene } = {}) {
		super()

		this.scene = scene
		this.resolution = resolution
		this.cellSize = cellSize

		for (let i = 0; i < resolution.x * resolution.y; i++) {
			const cell = this.addNode(new Cell({ maze: this }))
			this.scene.add(cell.draw())
		}

		this.generate()
	}

	generate() {
		const stack = []
		let currentNode = this.nodes[26]
		currentNode.visited = true

		do {
			const neighborsIndex = currentNode.getNeighbors()
			const unvisitedNeighbors = this.nodes.filter((node, i) => {
				return !node.visited && neighborsIndex.includes(i)
			})

			const n = unvisitedNeighbors.length
			if (n > 1) {
				stack.push(currentNode)
			}

			if (n) {
				const i = Math.floor(Math.random() * n)
				const nextNode = unvisitedNeighbors[i]
				const [edge] = this.addEdge(currentNode, nextNode)
				const edgeMesh = this.drawEdge(edge)
				this.scene.add(edgeMesh)

				currentNode = nextNode
				nextNode.visited = true
			}

			if (n === 0) {
				currentNode = stack.pop()
			}
		} while (stack.length)
	}

	drawEdge(edge) {
		const { from, to } = edge

		const cellSize = this.cellSize
		this.geometry = new RoundedBoxGeometry(
			cellSize / 2 - 0.05,
			HEIGHT,
			cellSize / 2 - 0.05,
			5,
			HEIGHT / 2
		)
		this.material = CELL_MATERIAL
		this.mesh = new Mesh(this.geometry, this.material)

		this.mesh.position.copy(from.mesh.position).lerp(to.mesh.position, 0.5)
		this.mesh.position.y = -HEIGHT / 2

		return this.mesh
	}
}

export class Cell extends Node {
	visited = false

	constructor({ maze }) {
		super()
		this.maze = maze
	}

	/**
	 * get space coordinates by index of cell
	 */
	getPositionByIndex() {
		const p = new Vector3(0, 0, 0)
		const { resolution, cellSize } = this.maze

		p.x =
			(this.index % resolution.x) * cellSize -
			(resolution.x * cellSize) / 2 +
			cellSize / 2
		p.z =
			Math.floor(this.index / resolution.x) * cellSize -
			(resolution.y * cellSize) / 2 +
			cellSize / 2

		return p
	}

	getNeighbors() {
		const { resolution } = this.maze

		const topIndex = this.index - resolution.x
		const bottomIndex = this.index + resolution.x
		const leftIndex = this.index - 1
		const rightIndex = this.index + 1

		const neighbors = []

		if (topIndex >= 0) {
			neighbors.push(topIndex)
		}

		if (bottomIndex < resolution.x * resolution.y) {
			neighbors.push(bottomIndex)
		}

		const col = this.index % resolution.x

		if (col !== 0) {
			neighbors.push(leftIndex)
		}

		if (col != resolution.x - 1) {
			neighbors.push(rightIndex)
		}

		return neighbors
	}

	draw() {
		const { cellSize } = this.maze
		this.geometry = new RoundedBoxGeometry(
			cellSize / 2 - 0.05,
			HEIGHT,
			cellSize / 2 - 0.05,
			5,
			HEIGHT / 2
		)
		this.material = CELL_MATERIAL
		this.mesh = new Mesh(this.geometry, this.material)

		this.mesh.position.copy(this.getPositionByIndex())
		this.mesh.position.y = -HEIGHT / 2

		return this.mesh
	}
}
