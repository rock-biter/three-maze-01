import { BoxGeometry, Mesh, MeshNormalMaterial, Vector2, Vector3 } from 'three'
import Graph from './Graph'
import Node from './Node'

export default class Maze extends Graph {
	constructor({ resolution = new Vector2(20, 20), scene }) {
		super()

		this.resolution = resolution
		this.scene = scene

		const { x, y } = resolution

		for (let i = 0; i < x * y; i++) {
			const cell = new Cell({ maze: this })
			this.addNode(cell)
			cell.setPosition()
		}

		this.generate()
	}

	generate() {
		const stack = []
		let currentNode = this.nodes[0]
		currentNode.visited = true

		do {
			const neighborsIndex = currentNode.getNeighborsIndex()
			const unvisitedNeighbors = this.nodes.filter((cell) => {
				return !cell.visited && neighborsIndex.includes(cell.index)
			})

			const n = unvisitedNeighbors.length

			if (n > 1) {
				stack.push(currentNode)
			}

			if (n) {
				const i = Math.floor(Math.random() * n)
				const nextNode = unvisitedNeighbors[i]
				const [edge] = this.addEdge(currentNode, nextNode)

				this.addBridge(currentNode, nextNode)

				currentNode = nextNode
				nextNode.visited = true
			}

			if (n === 0) {
				currentNode = stack.pop()
			}
		} while (stack.length)
	}

	addBridge(nodeA, nodeB) {
		const geometry = new BoxGeometry(0.45, 0.05, 0.45)
		const material = new MeshNormalMaterial()
		const mesh = new Mesh(geometry, material)

		mesh.position.copy(nodeA.mesh.position)
		mesh.position.lerp(nodeB.mesh.position, 0.5)

		this.scene.add(mesh)
	}
}

export class Cell extends Node {
	constructor({ maze }) {
		super()

		this.maze = maze
		this.geometry = new BoxGeometry(0.45, 0.05, 0.45)
		this.material = new MeshNormalMaterial()
		this.mesh = new Mesh(this.geometry, this.material)
	}

	getPositionByIndex() {
		const p = new Vector3(0, 0, 0)
		const { resolution } = this.maze

		p.x = (this.index % resolution.x) - resolution.x / 2 + 0.5
		p.z = Math.floor(this.index / resolution.x) - resolution.y / 2 + 0.5

		return p
	}

	setPosition() {
		this.mesh.position.copy(this.getPositionByIndex())
	}

	getNeighborsIndex() {
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

		if (col < resolution.x - 1) {
			neighbors.push(rightIndex)
		}

		return neighbors
	}
}
