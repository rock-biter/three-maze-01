export default class Connection {
	nodes = []

	constructor(from, to) {
		this.nodes.push(from, to)
	}

	get from() {
		return this.nodes[0]
	}

	get to() {
		return this.nodes[1]
	}
}
