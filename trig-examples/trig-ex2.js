const path = require('path')
const fs = require('fs')
const rdfstore = require('rdfstore')

//let data = fs.createReadStream(path.join(__dirname,'/trig-ex.trig'))
let data = fs.createReadStream(path.join(__dirname,'/bob.ttl'))
let data1 = fs.createReadStream(path.join(__dirname,'/alice.ttl'))
let query = 'PREFIX foaf:<http://xmlns.com/foaf/0.1/> \
PREFIX ex: <http://example.org/> \
PREFIX dc: <http://purl.org/dc/terms/>\
SELECT ?o \
       FROM NAMED <ex:bob> { GRAPH <ex:bob> { ?s foaf:mbox ?o} }';

/*let query1 = 'PREFIX foaf:<http://xmlns.com/foaf/0.1/> \
  PREFIX ex: <http://example.org/> \
  SELECT * \
    FROM NAMED <ex:bob> { GRAPH <ex:bob> { ?s ?p ?o} }'
*/
new rdfstore.Store(function(err, store) {
  store.load('text/turtle',data, "ex:bob",function(err,results){
    store.load('text/turtle',data1, "ex:alice",function(err,results){
      store.registeredGraphs(function (results, graphs) {
        var values = []
        for (var i = 0; i < graphs.length; i++) {
          values.push(graphs[i].valueOf())
        }
        console.log("values", values)
        /*store.close(function () {
        })*/
      })
      store.execute(query, function(err, results){
        console.log("results:  ", results)
      })
    })
  })
})
