const path = require('path')
const fs = require('fs')
const rdfstore = require('rdfstore')

let data = fs.createReadStream(path.join(__dirname,'/plangraph.ttl'))

new rdfstore.Store(function(err, store) {
  store.load('text/turtle',data, "ex:bob",function(err,results){
      store.registeredGraphs(function (results, graphs) {
        var values = []
        for (var i = 0; i < graphs.length; i++) {
          values.push(graphs[i].valueOf())
        }
        console.log("values", values)
      })
      /*store.execute(query, function(err, results){
        console.log("results:  ", results)
      })*/
  })
})
