import Connection from './Connection'

export default class Node {
	connections = []
	visited = false

	constructor({ index }) {
		this.index = index
	}

	addConnection(connection) {
		this.connections.push(connection)
	}

	connectTo(node) {
		const connection = new Connection(this, node)
		this.addConnection(connection)
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
