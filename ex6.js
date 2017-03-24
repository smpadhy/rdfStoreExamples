const path = require('path')
const fs = require('fs')
const rdfstore = require('rdfstore')
const uuid = require('uuid-random')

let query = " PREFIX  rdfs:<http://www.w3.org/2000/01/rdf-schema#>\
PREFIX prov: <http://www.w3.org/ns/prov#>\
PREFIX owl: <http://www.w3.org/2002/07/owl#>\
PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\
PREFIX nidm:<http://purl.org/nidash/nidm#>\
SELECT * \
WHERE {\
  '<http://purl.org/nidash/nidm#entity_4dd12419-1bb0-4c3d-8a1e-34c306083613>' ?p ?o .\
}\
"

/* WHERE { \
    ?entity rdf:type nidm:DemographicsAcquisitionObject; \
    nidm:gender ?p ;\
    nidm:race ?o.\
    } \
"*/

let data = fs.createReadStream(path.join(__dirname,'/test2.ttl'))
new rdfstore.Store(function(err, store) {
  store.load("text/turtle",data, "nidm:tgraph",function(err, results){
    //console.log(data)
    if(err){
      console.log(err)
    }
    console.log("inside store load", results)
    store.graph("nidm:tgraph",function(err, graph){
  		console.log("inside graph")
      graph.forEach(function(triple){
          console.log("subject: ",triple.subject)
          console.log("predicate: ", triple.predicate)
          console.log("object:", triple.object)
        })
  		//var serialized = graph.toNT();
  		//console.log("serialized 2:", serialized)
      //var namedGraphs  = [{'token':'nidm:tgraph', 'value': graph}]
      store.execute("SELECT * WHERE { ?s ?p ?o .}",function(err, results) {
        if(err){
          console.log(err)
        }
        console.log("after query",results)
      })

  	})

  })

})
