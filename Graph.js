import { Vector2 } from 'three'
import Node from './Node'

export default class Graph {
	nodes = []

	addNode(node) {
		const nextIndex = this.nodes.length
		node.index = nextIndex
		this.nodes.push(node)

		return node
	}

	addEdge(nodeA, nodeB) {
		const edgeA = nodeA.connectTo(nodeB)
		const edgeB = nodeB.connectTo(nodeA)

		return [edgeA, edgeB]
	}
}
