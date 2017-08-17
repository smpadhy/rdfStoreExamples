let rdfstore = require('rdfstore')

rdfstore.create(function(err, store) {
var graph = store.rdf.createGraph();
/*graph.addAction(store.rdf.createAction(store.rdf.filters.p(store.rdf.resolve("foaf:name")),
								 function(triple){ var name = triple.object.valueOf();
												   var name = name.slice(0,1).toUpperCase()
												   + name.slice(1, name.length);
												   triple.object = store.rdf.createNamedNode(name);
												   return triple;}));
*/
store.rdf.setPrefix("ex", "http://example.org/people/");
graph.add(store.rdf.createTriple( store.rdf.createNamedNode(store.rdf.resolve("ex:Alice")),
								  store.rdf.createNamedNode(store.rdf.resolve("foaf:name")),
								  //store.rdf.createLiteral("alice") ));
									store.rdf.createNamedNode("Alice")))

var triples = graph.match(null, store.rdf.createNamedNode(store.rdf.resolve("foaf:name")), null).toArray();


console.log("worked? "+(triples[0].object.valueOf() === 'Alice'));
console.log("original triples", triples)
console.log(store)
/*var query = "CONSTRUCT { <http://example.org/people/Alice> ?p ?o } \
			 WHERE { <http://example.org/people/Alice> ?p ?o  }"
*/
let query = "CONSTRUCT{ ?x ?p ?o} WHERE {?x ?p ?o}"
store.execute("SELECT * WHERE { ?s ?p ?o } LIMIT 3", function(err, graph1){
	if(err){
		console.log("error", err)
	}
	console.log("triples", graph1.triples)
  if(graph1.some(store.rdf.filters.p(store.rdf.resolve('foaf:name')))) {
	let nameTriples = graph1.match(null,
							  store.rdf.createNamedNode(rdf.resolve('foaf:name')),
							  null);
  console.log("nameTriple:",nameTriples)
	nameTriples.forEach(function(triple) {
	  console.log("value:", triple.object.valueOf());
	});
}
});
})
