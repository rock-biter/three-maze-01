import Edge from './Edge'

export default class Node {
	edges = []
	visited = false
	index = 0

	addEdge(edge) {
		this.edges.push(edge)
	}

	connectTo(node) {
		const edge = new Edge(this, node)
		this.addEdge(edge)
		return edge
	}

	removeEdge(edge) {
		const i = this.edges.indexOf(edge)
		if (i >= 0) {
			this.edges.splice(i, 1)
		}
	}

	get connectedNodes() {
		return this.edges.map(({ to }) => to)
	}
}
