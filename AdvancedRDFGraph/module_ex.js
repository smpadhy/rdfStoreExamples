/*
Working example of NamedGraphs in RDFStorejs
*/
const path = require('path')
const fs = require('fs')
const rdfstore = require('rdfstore')
const uuid = require('uuid-random')
const loadJsonFile = require('load-json-file')
const jquery = require('jQuery')
const moment = require('moment')

const rdfHelper = require('./graphCreatev2.js')

global.setup = rdfHelper.rdfStoreSetup()
global.store = setup.store
global.rgraph = setup.graph

store.setPrefix("ex", "http://example.org/people/")
store.setPrefix("rdf", "http://www.w3.org/1999/02/22-rdf-syntax-ns#")
store.setPrefix("foaf", "http://xmlns.com/foaf/0.1/")
store.setPrefix("prov", "http://www.w3.org/ns/prov#")
store.setPrefix("dc", "http://purl.org/dc/terms/")
store.setPrefix("xsd", "http://www.w3.org/2001/XMLSchema#")

//-------> Different Queries

let query1 = 'PREFIX foaf:<http://xmlns.com/foaf/0.1/> \
PREFIX ex: <http://example.org/> \
PREFIX dc: <http://purl.org/dc/terms/> \
PREFIX prov: <http://www.w3.org/ns/prov#> \
SELECT ?o \
       FROM NAMED <http://example.org/people/alice> { GRAPH <http://example.org/people/alice> { ?s foaf:mbox ?o} }'


let query2 = 'PREFIX foaf:<http://xmlns.com/foaf/0.1/> \
PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#> \
PREFIX ex:<http://example.org/> \
PREFIX dc:<http://purl.org/dc/terms/> \
PREFIX prov: <http://www.w3.org/ns/prov#> \
SELECT ?o \
FROM NAMED <http://example.org/people/bob> { GRAPH <http://example.org/people/bob> { ?s prov:name ?o} }'

var query3 = 'PREFIX foaf:<http://xmlns.com/foaf/0.1/> \
    PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#> \
    SELECT ?o \
      FROM NAMED <http://example.org/people/bob> { GRAPH <http://example.org/people/bob> { ?s a ?o} }'

var query4 = 'PREFIX foaf:<http://xmlns.com/foaf/0.1/> \
    PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#> \
    PREFIX dc:<http://purl.org/dc/terms/> \
    SELECT ?o \
      FROM NAMED <http://example.org/people/bob> { GRAPH <http://example.org/people/bob> { ?s ex:date ?o} }'
//--------

///-----> Creating graph for Alice
var graph = store.rdf.createGraph();
let n = store.rdf.createNamedNode(store.rdf.resolve("ex:Alice"))
graph.add(store.rdf.createTriple(n,
  store.rdf.createNamedNode(store.rdf.resolve("foaf:name")),
  store.rdf.createLiteral("alice")))

graph.add(store.rdf.createTriple(n,
  store.rdf.createNamedNode(store.rdf.resolve("foaf:mbox")),
  store.rdf.createLiteral("<mailto:alice@work.example.org>")))

//---> Inserting Alice
store.insert(graph, "ex:alice", function (err, results) {
    store.node("ex:Alice", "ex:alice", function (err, graph) {
      console.log("Alice graph length:", graph.toArray().length)
      //console.log("Alice graph : ", graph)
      //store.close(function () {})
    })
})

///------> Creating graph for Bob
var graph1 = store.rdf.createGraph();

let n1 = store.rdf.createNamedNode(store.rdf.resolve("ex:Bob"))

graph1.add(store.rdf.createTriple(n1,
    store.rdf.createNamedNode(store.rdf.resolve("foaf:name")),
    store.rdf.createLiteral("bob")))

graph1.add(store.rdf.createTriple(n1,
    store.rdf.createNamedNode(store.rdf.resolve("foaf:knows")),
    store.rdf.createNamedNode(store.rdf.resolve("ex:Alice"))))

graph1.add(store.rdf.createTriple(n1,
  store.rdf.createNamedNode(store.rdf.resolve("rdf:type")),
  store.rdf.createNamedNode(store.rdf.resolve("foaf:Person"))))

graph1.add(store.rdf.createTriple(n1,
  store.rdf.createNamedNode(store.rdf.resolve("prov:wasGeneratedBy")),
  store.rdf.createNamedNode(store.rdf.resolve("ex:Alice"))))

graph1.add(store.rdf.createTriple(store.rdf.createNamedNode(store.rdf.resolve("ex:Bob")),
  store.rdf.createNamedNode(store.rdf.resolve("foaf:mbox")),
    store.rdf.createLiteral("<mailto:bob@work.example.org>")))

graph1.add(store.rdf.createTriple(n1,
  store.rdf.createNamedNode(store.rdf.resolve("prov:name")),
  store.rdf.createLiteral("bob1")))

graph1.add(store.rdf.createTriple(store.rdf.createNamedNode(store.rdf.resolve("foaf:Person")),
  store.rdf.createNamedNode(store.rdf.resolve("foaf:surname")),
  store.rdf.createLiteral("litman")))
var d = moment().format()
var str = d.toString()
console.log("date str: ", str)
graph1.add(store.rdf.createTriple(store.rdf.createNamedNode(store.rdf.resolve("foaf:Person")),
    store.rdf.createNamedNode(store.rdf.resolve("ex:date")),
    store.rdf.createLiteral(str,store.rdf.createNamedNode(store.rdf.resolve("xsd:dateTime")))))

//----> Insert Bob
store.insert(graph1, "ex:bob", function (err, results) {
  //store.node("ex:Bob", "ex:bob", function (err, graph2) {
  store.node("foaf:Person", "ex:bob", function (err, graph2) {
    //console.log("Bob graph length:", graph2.toArray().length)
    console.log("Bob graph : ", graph2.toArray())
    store.execute(query4, function(err, results1){
      if(err){
        console.log("err")
      }
      console.log("results :  \n", results1)

    })
  })
})

store.registeredGraphs(function (results, graphs) {
  var values = []
  for (var i = 0; i < graphs.length; i++) {
    values.push(graphs[i].valueOf())
  }
  console.log("values: ", values)
  /*store.close(function () {
  })*/
})

/*loadJsonFile('proj-plan-Test8-a159e2a2.json').then(ob => {
      console.log("ob:==>", ob)
      rdfHelper.saveToRDFstore(ob)
})*/
