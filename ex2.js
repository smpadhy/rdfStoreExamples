let rdfstore = require('rdfstore')

rdfstore.create(function(err, store) {
  // the new store is ready
  store.execute('LOAD <http://www.dbpedialite.org/things/18016>\
			   INTO GRAPH <lisp>', function(err){
  if(!err) {
	var query = 'PREFIX foaf:<http://xmlns.com/foaf/0.1/> SELECT ?o \
				 FROM NAMED <lisp> { GRAPH <lisp> { ?s foaf:page ?o} }';
	store.execute(query, function(err, results) {
	  console.log(results)
	});
  store.clear(function(err){
    console.log('all clear!')
  })
  store.execute(query, function(err, results) {
	  console.log(results)
	});
  }
})

})
