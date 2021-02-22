let servers = [
  {
    id: 1,
    title: 'server1'
  },
  {
    id: 2,
    title: 'server2'
  },
  {
    id: 3,
    title: 'server3'
  }
]

exports.getAll = (req, res) => {
  res.status(200).json(servers)
}

exports.getFirst = (req, res) => {
  res.json(servers[0])
}
