import Edge from './Edge'

export default class Node {
	edges = []
	visited = false
	index = 0

	addConnection(connection) {
		this.edges.push(connection)
	}

	connectTo(node) {
		const connection = new Edge(this, node)
		this.addConnection(connection)
		return connection
	}

	removeConnection(connection) {
		const i = this.edges.indexOf(connection)
		if (i >= 0) {
			this.edges.splice(i, 1)
		}
	}

	get connectedNodes() {
		return this.edges.map(({ to }) => to)
	}
}
