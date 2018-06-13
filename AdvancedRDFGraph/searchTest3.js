const path = require('path')
const fs = require('fs')
const rdfstore = require('rdfstore')
const uuid = require('uuid-random')
const loadJsonFile = require('load-json-file')
const jquery = require('jQuery')
const moment = require('moment')

let store = rdfstore.create(function(err, store) {
  if(err){
    console.log("not able to create store")
  }
  return store
})
store.rdf.setPrefix("ex", "http://example.org/")
store.rdf.setPrefix("rdf", "http://www.w3.org/1999/02/22-rdf-syntax-ns#")
store.rdf.setPrefix("foaf", "http://xmlns.com/foaf/0.1/")
store.rdf.setPrefix("prov", "http://www.w3.org/ns/prov#")
store.rdf.setPrefix("dc", "http://purl.org/dc/terms/")
store.rdf.setPrefix("xsd", "http://www.w3.org/2001/XMLSchema#")
store.rdf.setPrefix("nidm", "http://purl.org/nidash/nidm#")
store.rdf.setPrefix("nda","https://ndar.nih.gov/api/datadictionary/v2/dataelement/")
store.rdf.setPrefix("provone","http://purl.org/provone#")


let query = 'PREFIX xsd:<http://www.w3.org/2001/XMLSchema#> \
PREFIX ex:<http://example.org/> \
SELECT * \
FROM NAMED <http://example.org/test> \
{GRAPH <http://example.org/test> { ?s ex:date ?date . \
  FILTER (?date > "2014-05-23T10:20:13+05:30"^^xsd:dateTime) \
} }'

var listOfFiles = new Promise(function(resolve){
    fs.readdir(path.join(__dirname, '/../inputFiles/test6'), function(err,list){
    //fs.readdir(path.join(__dirname, '/../inputFiles/acquisition'), function(err,list){
     let alist = []
      if(err) throw err;
      for(let i=0;i<list.length;i++){
        if(list[i] != '.DS_Store'){
          alist.push(list[i])
        }
      }

      resolve(alist)
    })
  })
listOfFiles.then(function(list){
    var arrayOfPromises = list.map(function(f){
      let data = fs.createReadStream(path.join(__dirname,'/../inputFiles/test6/'+f))
      console.log("file names: ", f)
      //let data = fs.createReadStream(path.join(__dirname,'/../inputFiles/acquisition/'+f))
      let name = f.split(".")
      return new Promise(function(resolve){
        store.load('text/turtle',data,"nidm:"+name[0], function(err,results){
          console.log("name[0]:: ", name[0], "results: ", results)
          console.log("err:: ", err)
          resolve(name[0])
        })
      })
    }) //array of promises
    //console.log("array: ", arrayOfPromises)
    return Promise.all(arrayOfPromises)
  }).then(function(g){
    //console.log("array: ", g)
    return new Promise(function(resolve){
      store.registeredGraphs(function(results, graphs) {
        var values = []
        for (var i = 0; i < graphs.length; i++) {
          values.push(graphs[i].valueOf())
        }
        //console.log("Registered graphs: ", values)
        resolve(values)
      })
    }).then(function(values){
      console.log("registered graphs before map:  ", values)
        var graphOfPromises = values.map(function(graph){
          return new Promise(function(resolve){
            //console.log("graph:  ", graph)
            store.graph(graph, function(err, graph2){
              var serialized = graph2.toNT();
              //console.log("serialized: ", serialized)
            })
            //store.execute(queryFunction("<"+graph+">"), function(err,results){
            //store.execute(queryFunction("S11","gender","<"+graph+">"), function(err,results){
          //  store.execute(queryFunction("S19","<"+graph+">"), function(err,results){ <--working
          store.execute(queryFunction("","<"+graph+">"), function(err,results){
            //store.execute(queryFunction("<"+graph+">"), function(err,results){
              console.log("[execute] graph: ", graph, "  results: ", results)
              if(results !== [] && results !== undefined){
                console.log("results: ", results)
                resolve(results)
                /*resolve({
                  "origin":results[0].s.value,
                  "derivedFrom":results[0].derivedFrom.value,
                  "date":results[0].date.value,
                  "pjname":results[0].pjname.value
                })*/
              }else{
                resolve({})
              }
            })//execute
          })//promise
        })//graph of promises
        return Promise.all(graphOfPromises)
    }).then(function(obj){
        //console.log("obj:", obj)
        console.log("obj-------------:all processed-------------")
        /*let unique = []
        for(i=0;i<obj.length;i++){
          let flag = true
          //console.log("i=",i, " ", obj[i]["origin"])
          for(j=0;j<obj.length;j++){
            if(obj[i]["origin"] === obj[j]["derivedFrom"]){
              flag = false
              break;
            }
          }
          if(flag){
            unique.push(obj[i])
          }
        }
        console.log("unique array", unique)*/
    })
}).catch(function(error){
    console.log(error)
  })
//function queryFunction(graphId){
function queryFunction(subjectId,graphId){
  let query = 'PREFIX prov:<http://www.w3.org/ns/prov#>\
  PREFIX nidm:<http://purl.org/nidash/nidm#> \
  SELECT * \
  FROM NAMED '+ graphId + '\
  {GRAPH '+graphId+'{ ?s prov:wasDerivedFrom ?p. \
  } }'

  // let query1 = 'PREFIX prov:<http://www.w3.org/ns/prov#>\
  // PREFIX nidm:<http://purl.org/nidash/nidm#> \
  // PREFIX dc:<http://purl.org/dc/terms/> \
  // SELECT * \
  // FROM NAMED '+ graphId + '\
  // {GRAPH '+graphId+'{ ?s prov:wasDerivedFrom ?derivedFrom ; \
  //   nidm:ProjectName ?pjname; \
  //   dc:created ?date.\
  // } }'
  // console.log("querying ...")
  // let query2 = 'PREFIX prov:<http://www.w3.org/ns/prov#>\
  // PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\
  // PREFIX nidm:<http://purl.org/nidash/nidm#> \
  // SELECT * \
  // FROM NAMED '+ graphId + '\
  // {GRAPH '+graphId+'{ ?s rdf:type ?entity ; \
  //   nidm:src_subject_id '+subjectId+' ;\
  //   nidm:gender ?sex .\
  // } }'

  // let query3 = 'PREFIX prov:<http://www.w3.org/ns/prov#>\
  // PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\
  // PREFIX nidm:<http://purl.org/nidash/nidm#> \
  // SELECT * \
  // FROM NAMED '+ graphId + '\
  // {GRAPH '+graphId+'{ ?s rdf:type ?entity ; \
  //   nidm:src_subject_id "'+subjectId+'" ;\
  //   nidm:'+attrName+' ?'+attrName+' .\
  // } }'
  //
  // let query4 = 'PREFIX prov:<http://www.w3.org/ns/prov#>\
  // PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\
  // PREFIX nidm:<http://purl.org/nidash/nidm#> \
  // SELECT * \
  // FROM NAMED '+ graphId + '\
  // {GRAPH '+graphId+'{ nidm:agent_'+subjectId +' rdf:a prov:Agent ; \
  //   nidm:'+attrName+' ?'+attrName+' .\
  // } }'

 // Getting values of a form of a participant
  let query5= 'PREFIX prov:<http://www.w3.org/ns/prov#>\
  PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\
  PREFIX nidm:<http://purl.org/nidash/nidm#> \
  SELECT ?s ?p ?o \
  FROM NAMED '+ graphId + '\
  {GRAPH '+graphId+'{ ?s rdf:type prov:Entity ;\
    prov:wasAttributedTo nidm:agent_'+subjectId+';\
    ?p ?o.\
  } }'

  //Getting the instruments name
  let query6= 'PREFIX prov:<http://www.w3.org/ns/prov#>\
  PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\
  PREFIX nidm:<http://purl.org/nidash/nidm#> \
  SELECT ?s ?p ?o \
  FROM NAMED '+ graphId + '\
  {GRAPH '+graphId+'{ nidm:agent_'+subjectId+' rdf:a prov:Agent ;\
    prov:wasAssociatedWith ?s .\
    ?s rdf:type prov:Activity;\
    prov:used ?o .\
    } }'

  //get the session number and name and project
  let query7 =   'PREFIX prov:<http://www.w3.org/ns/prov#>\
  PREFIX provone:<http://purl.org/provone#>\
  PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\
  PREFIX nidm:<http://purl.org/nidash/nidm#> \
  SELECT ?o ?name ?project\
  FROM NAMED '+ graphId + '\
  {GRAPH '+graphId+'{ nidm:agent_'+subjectId+' rdf:a prov:Agent ;\
    prov:wasAssociatedWith ?s .\
    ?s rdf:type prov:Activity;\
    nidm:SessionNumber ?o ;\
    nidm:SessionName ?name;\
    provone:isPartOf ?p.\
    ?p rdf:type prov:Activity;\
    nidm:Name ?project.\
    } }'

    // get all participants
    let query8 = 'PREFIX prov:<http://www.w3.org/ns/prov#>\
    PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\
    PREFIX nidm:<http://purl.org/nidash/nidm#> \
    SELECT ?s \
    FROM NAMED '+ graphId + '\
    {GRAPH '+graphId+'{ ?s rdf:a prov:Agent .\
    } }'

    // get entity associated with an instrument for a subject
    let query9 = 'PREFIX prov:<http://www.w3.org/ns/prov#>\
    PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\
    PREFIX nidm:<http://purl.org/nidash/nidm#> \
    SELECT ?s ?p ?v\
    FROM NAMED '+ graphId + '\
    {GRAPH '+graphId+'{ ?s rdf:type prov:Entity ;\
      prov:wasAttributedTo nidm:agent_'+subjectId+' ;\
      prov:wasGeneratedBy ?activity; \
      ?p ?v.\
      ?activity rdf:type prov:Activity ;\
      prov:used nidm:terms-Adult253-Adult .\
    } }'

    // get entity associated with an instrument for a subject
    let query10 = 'PREFIX prov:<http://www.w3.org/ns/prov#>\
    PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\
    PREFIX nidm:<http://purl.org/nidash/nidm#> \
    SELECT ?s ?p ?v\
    FROM NAMED '+ graphId + '\
    {GRAPH '+graphId+'{ ?s rdf:type prov:Entity ;\
      prov:wasGeneratedBy ?activity; \
      ?p ?v.\
      ?activity rdf:type prov:Activity ;\
      prov:used nidm:terms-Adult253-Adult .\
    } }'

    // get instruments name for a project
    let projectId = "41cc813a-30bc-4a10-9952-ddee8f5cc27b"
    let query11= 'PREFIX prov:<http://www.w3.org/ns/prov#>\
    PREFIX provone:<http://purl.org/provone#>\
    PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\
    PREFIX nidm:<http://purl.org/nidash/nidm#> \
    SELECT DISTINCT ?p ?instrument \
    FROM NAMED '+ graphId + '\
    {GRAPH '+graphId+'{ ?s rdf:type prov:Activity;\
      provone:isPartOf ?sessionactivity;\
      prov:used ?instrument .\
      ?sessionactivity provone:isPartOf ?p .\
      ?p nidm:ID "'+ projectId +'" .\
    }}'

    // get entity associated with an instrument within a project
    //let instrument = "terms-Adult253-Adult"
    let instrument = "terms-grit01-m83-12-Item"
    projectId = "41cc813a-30bc-4a10-9952-ddee8f5cc27b"
    let query12 = 'PREFIX prov:<http://www.w3.org/ns/prov#>\
    PREFIX provone:<http://purl.org/provone#>\
    PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\
    PREFIX nidm:<http://purl.org/nidash/nidm#> \
    SELECT ?s ?p ?v\
    FROM NAMED '+ graphId + '\
    {GRAPH '+graphId+'{ ?s rdf:type prov:Entity ;\
      prov:wasGeneratedBy ?activity; \
      ?p ?v.\
      ?activity rdf:type prov:Activity ;\
      provone:isPartOf ?sessionactivity;\
      prov:used nidm:'+instrument+' .\
      ?sessionactivity provone:isPartOf ?pj .\
      ?pj nidm:ID "'+ projectId +'" .\
    } }'

    //let instrument = "terms-grit01-m83-12-Item"
    //projectId = "41cc813a-30bc-4a10-9952-ddee8f5cc27b"
    //get agent information as well 
    let query13 = 'PREFIX prov:<http://www.w3.org/ns/prov#>\
    PREFIX provone:<http://purl.org/provone#>\
    PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\
    PREFIX nidm:<http://purl.org/nidash/nidm#> \
    SELECT ?s ?p ?v ?agent\
    FROM NAMED '+ graphId + '\
    {GRAPH '+graphId+'{ ?s rdf:type prov:Entity ;\
      prov:wasGeneratedBy ?activity; \
      prov:wasAttributedTo ?agent;\
      ?p ?v.\
      ?activity rdf:type prov:Activity ;\
      provone:isPartOf ?sessionactivity;\
      prov:used nidm:'+instrument+' .\
      ?sessionactivity provone:isPartOf ?pj .\
      ?pj nidm:ID "'+ projectId +'" .\
    } }'
  return query13
}
