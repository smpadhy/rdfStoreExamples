let rdfstore = require('rdfstore')

rdfstore.create(function(err, store) {
  // the new store is ready
  store.execute('LOAD <http://www.dbpedialite.org/things/18016>\
			   INTO GRAPH <lisp>', function(err){
  if(!err) {
	/*var query = 'PREFIX foaf:<http://xmlns.com/foaf/0.1/> SELECT ?o \
				 FROM NAMED <lisp> { GRAPH <lisp> { ?s foaf:page ?o} }';*/
  var query = 'PREFIX foaf:<http://xmlns.com/foaf/0.1/> \
  PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#> \
  SELECT ?o \
		FROM NAMED <lisp> { GRAPH <lisp> { ?s a ?o} }'
	store.execute(query, function(err, results) {
	  console.log(results)
	});
  store.registeredGraphs(function(success, graphs){
    var graph_uris = graphs.map(function(namedNode){
      console.log(namedNode)
                    return namedNode.nominalValue;
                    });
    console.log("graph_uris: ", graph_uris)
  });
  /*store.clear(function(err){
    console.log('all clear!')
  })*/
  /*store.execute(query, function(err, results) {
	  console.log(results)
	});*/
  }
})

})
