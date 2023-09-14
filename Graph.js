import { Vector2 } from 'three'
import Node from './Node'

export default class Graph {
	nodes = []

	addNode() {
		const nextIndex = this.nodes.length
		const node = new Node({ index: nextIndex })
		this.nodes.push(node)
	}

	addConnection(nodeA, nodeB) {
		nodeA.connectTo(nodeB)
		nodeB.connectTo(nodeA)
	}
}
