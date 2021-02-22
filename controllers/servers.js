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
   if(req.session.page_views){
      req.session.page_views++;
      res.send("You visited this page " + req.session.page_views + " times");
   } else {
      req.session.page_views = 1;
      res.send("Welcome to this page for the first time!");
   }
  // res.status(200).json(servers)
}

exports.getFirst = (req, res) => {
  res.json(servers[0])
}
