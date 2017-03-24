let rdfstore = require('rdfstore')
let uuid = require('uuid-random')
const path = require('path')
const fs = require('fs')

rdfstore.create(function(err, store) {
var graph1 = store.rdf.createGraph();
/*graph.addAction(store.rdf.createAction(store.rdf.filters.p(store.rdf.resolve("foaf:name")),
								 function(triple){ var name = triple.object.valueOf();
												   var name = name.slice(0,1).toUpperCase()
												   + name.slice(1, name.length);
												   triple.object = store.rdf.createNamedNode(name);
												   return triple;}));*/

store.rdf.setPrefix("nidm", "http://purl.org/nidash/nidm#")
store.rdf.setPrefix("prov", "http://www.w3.org/ns/prov#")
store.rdf.setPrefix("rdfs", "http://www.w3.org/2000/01/rdf-schema#")
store.rdf.setPrefix("xsd", "http://www.w3.org/2001/XMLSchema#")
store.rdf.setPrefix("foaf", "http://xmlns.com/foaf/0.1/")
store.rdf.setPrefix("rdf", "http://www.w3.org/1999/02/22-rdf-syntax-ns#")

console.log("prefix:", store.rdf.prefixes.get("nidm"))
let x = store.rdf.createPrefixMap()
console.log(x)
let dgO = uuid()
let n = store.rdf.createNamedNode(store.rdf.resolve("nidm:entity_"+ dgO))
graph1.add(store.rdf.createTriple(n,
	store.rdf.createNamedNode(store.rdf.resolve("rdf:type")),
	store.rdf.createNamedNode("DemographicsAcquisitionObject1")));
graph1.add(store.rdf.createTriple(n,
  store.rdf.createNamedNode(store.rdf.resolve("rdf:label")),
  store.rdf.createLiteral("Demographics data1")));
graph1.add(store.rdf.createTriple(n,
	  store.rdf.createNamedNode(store.rdf.resolve("nidm:sex1")),
	  store.rdf.createLiteral("M1")));
//var serialized = graph1.toNT();
//console.log("serialized:1", serialized)

let data = fs.createReadStream(path.join(__dirname,'/test2.ttl'))

	//graph1.addAll(data)
//store.execute(query, function(success, results) {
//	console.log("after query",results)
//store.insert(graph1, "nidm:tgraph", function(err) {
	store.load("text/turtle",data, "nidm:tgraph",function(err, results){
		console.log("inside store load")
  //store.insert(graph1, "nidm:tgraph", function(err) {
	store.graph("nidm:tgraph",function(err, graph){
		console.log("inside graph")
		var serialized = graph.toNT();
		console.log("serialized:2", serialized)
	})
	//})
})


//var triples = graph1.match(null, store.rdf.createNamedNode(store.rdf.resolve("nidm:sex")), null).toArray();

//console.log(triples)

/*store.execute(query, function(err, results){
	console.log(results)
})*/

})
