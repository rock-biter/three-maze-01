import Edge from './Edge'

export default class Node {
	connections = []
	visited = false
	index = 0

	addConnection(connection) {
		this.connections.push(connection)
	}

	connectTo(node) {
		const connection = new Edge(this, node)
		this.addConnection(connection)
		return connection
	}

	removeConnection(connection) {
		const i = this.connections.indexOf(connection)
		if (i >= 0) {
			this.connections.splice(i, 1)
		}
	}

	get connectedNodes() {
		return this.connections.map(({ to }) => to)
	}
}
