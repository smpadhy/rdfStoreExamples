const path = require('path')
const fs = require('fs')
const rdfstore = require('rdfstore')
const uuid = require('uuid-random')

/*let query = "PREFIX nidm: <http://purl.org/nidash/nidm#> \
    PREFIX prov: <http://www.w3.org/ns/prov#> \
    SELECT * {?s ?p ?o} WHERE\
    { }
    "*/
/*let query = " PREFIX  rdfs:<http://www.w3.org/2000/01/rdf-schema#>\
PREFIX prov: <http://www.w3.org/ns/prov#>\
SELECT ?entity \
WHERE { \
    ?entity rdfs:subClassOf prov:Entity . \
} \
"*/

/* This query works for nidm.owl
let query = " PREFIX  rdfs:<http://www.w3.org/2000/01/rdf-schema#>\
PREFIX prov: <http://www.w3.org/ns/prov#>\
PREFIX owl: <http://www.w3.org/2002/07/owl#>\
PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\
SELECT ?entity ?p ?o \
WHERE { \
    ?entity rdf:type owl:ObjectProperty ; \
    rdfs:label ?p ; \
    rdfs:range ?o . \
    } \
"*/

/*let query = "PREFIX  dc:  <http://purl.org/dc/elements/1.1/>\
PREFIX  ns:  <http://example.org/ns#>\
SELECT  ?title ?price\
{  ?x ns:price ?p .\
   ?x ns:discount ?discount\
   BIND (?p*(1-?discount) AS ?price)\
   FILTER(?price < 20)\
   ?x dc:title ?title . \
}"*/

/* this query works for nidm.owl
let query = "PREFIX  rdfs:<http://www.w3.org/2000/01/rdf-schema#>\
  PREFIX  rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\
  SELECT ?x ?type\
  { ?x rdfs:subClassOf ?type .\
  }\
"*/

/* This query works for test1.ttl
let query = "PREFIX  dc:  <http://purl.org/dc/elements/1.1/>\
  PREFIX  ns:  <http://example.org/ns#>\
  SELECT ?x ?title\
  { ?x dc:title ?title .\
  }\
"*/
/* this query works for test2.ttl*/
/*let query = "PREFIX  rdfs:<http://www.w3.org/2000/01/rdf-schema#>\
  PREFIX  rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\
  SELECT ?x ?type\
  { ?x rdf:type ?type .\
  }\
"*/
/* this query works for test2.ttl*/
let query = "PREFIX  rdfs:<http://www.w3.org/2000/01/rdf-schema#>\
  PREFIX  rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\
  PREFIX nidm: <http://purl.org/nidash/nidm#>\
  SELECT ?x ?val\
  { ?x nidm:race ?val .\
  }\
"

let data = fs.createReadStream(path.join(__dirname,'/test4.ttl'))
new rdfstore.Store(function(err, store) {
  store.load("text/turtle",data, function(err, results){
    console.log("inside store load", results)
    store.execute(query, function(success, results) {
      console.log("after query",results)
    })
  })

})
