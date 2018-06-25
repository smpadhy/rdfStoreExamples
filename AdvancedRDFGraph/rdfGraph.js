const path = require('path')
const fs = require('fs')
const rdfstore = require('rdfstore')
const uuid = require('uuid-random')
const loadJsonFile = require('load-json-file')
const jquery = require('jQuery')

const rdfConfig = require('./rdfPrefixes.js')
let namespaces = {}
let snodes = {}

var _rdfStoreSetup = function(){
  let rstore = rdfstore.create(function(err, store) {
    if(err){
      console.log("not able to create store")
    }else{
      console.log("rdf store setup")
    }
    return store
  })
  rstore.rdf.setPrefix("nidm", "http://purl.org/nidash/nidm#")
  rstore.rdf.setPrefix("rdf", "http://www.w3.org/1999/02/22-rdf-syntax-ns#")
  rstore.rdf.setPrefix("nda","https://ndar.nih.gov/api/datadictionary/v2/dataelement/")
  rstore.rdf.setPrefix("prov","http://www.w3.org/ns/prov#")
  rstore.rdf.setPrefix("xsd", "http://www.w3.org/2001/XMLSchema#")
  rstore.rdf.setPrefix("dc", "http://purl.org/dc/terms/")
  rstore.rdf.setPrefix("provone", "http://purl.org/provone#")

  rstore.rdf.setPrefix("ILX","http://uri.interlex.org/base/")

  _addToStoreNamespace("nidm", "http://purl.org/nidash/nidm#")
  _addToStoreNamespace("rdf", "http://www.w3.org/1999/02/22-rdf-syntax-ns#")
  _addToStoreNamespace("nda","https://ndar.nih.gov/api/datadictionary/v2/dataelement/")
  _addToStoreNamespace("prov","http://www.w3.org/ns/prov#")
  _addToStoreNamespace("xsd","http://www.w3.org/2001/XMLSchema#")
  _addToStoreNamespace("dc","http://purl.org/dc/terms/")
  _addToStoreNamespace("provone","http://purl.org/provone#")
  _addToStoreNamespace("ILX", "http://uri.interlex.org/base/")

  console.log("Namespaces:---->", namespaces)
  return {store:rstore}
}


var _addToStoreNamespace = function(prefix, uri){
  namespaces[uri] = prefix
}

function getPrefix(uri){
  return namespaces[uri]
}

var _getRegisteredGraphsList = function(){
  store.registeredGraphs(function (results, graphs) {
          var values = []
          for (var i = 0; i < graphs.length; i++) {
            values.push(graphs[i].valueOf())
          }
    console.log("values", values)
    return values
  })
}

/**
** NIDM Graph Class
**/
var NIDMGraph = class NIDMGraph {
  /*
  * create a RDF graph
  */
  constructor(){
    this.snodes = {}
    this.rgraph = store.rdf.createGraph()
  }

  /*
  * addResultEntity node to the Graph
    */
  addResultEntity(rsObj){
    let rsId = "nidm:result_" + uuid()
    let n = store.rdf.createNamedNode(store.rdf.resolve(rsId))

    this.rgraph.add(store.rdf.createTriple(n,
    store.rdf.createNamedNode(store.rdf.resolve("rdf:type")),
    store.rdf.createNamedNode(store.rdf.resolve("prov:Entity"))))

    for(var key1 in rsObj){
      //console.log("key: ", key1)
      let key = key1.replace(/\s+/g, '.')
      if(key1.indexOf(":")!= -1){
        let prefixNum = key1.split(":")
        this.rgraph.add(store.rdf.createTriple(n,
        store.rdf.createNamedNode(store.rdf.resolve("ILX:ilx_"+prefixNum[1])),
        store.rdf.createLiteral(rsObj[key1])))
      }else{
        if(key1 === 'SubID'){
          let agentNode = store.rdf.createNamedNode(store.rdf.resolve(rsObj))
          this.rgraph.add(store.rdf.createTriple(n,
            store.rdf.createNamedNode(store.rdf.resolve("prov:wasAttributedTo")),
            agentNode))
        }

        this.rgraph.add(store.rdf.createTriple(n,
        store.rdf.createNamedNode(store.rdf.resolve("nidm:"+key)),
        store.rdf.createLiteral(rsObj[key1])))
      }
    }
  return n
  }
  addILXEntity(key, ilxObj){
    //console.log("key: ", key)
    let prefixNum = key.split(":")
    let n = store.rdf.createNamedNode(store.rdf.resolve("ILX:ilx_"+prefixNum[1]))
    this.rgraph.add(store.rdf.createTriple(n,
      store.rdf.createNamedNode(store.rdf.resolve("rdf:type")),
      store.rdf.createNamedNode(store.rdf.resolve("prov:Entity"))))

    for(var subkey in ilxObj){
      let key1 = subkey.replace(/\s+/g, '.')

      this.rgraph.add(store.rdf.createTriple(n,
      store.rdf.createNamedNode(store.rdf.resolve("nidm:"+key1)),
      store.rdf.createLiteral(ilxObj[subkey])))

      }
      return n
  }
} // End of Class definition

/**
** Add/Insert the NIDM graph created to the store with specifc URI
**/
function _addToStore(nidmGraph,graphId,addCallback){
  store.insert(nidmGraph.rgraph, graphId, function(err) {
    if(err){
      console.log("Not able to insert subgraph to nidm:graph")
    }
    addCallback(graphId)
  })//insert
}

/**
** Serialize To Turtle
**/
function serializeToTurtle(sObj){
  let s = ""
  let num_nodes = Object.keys(sObj).length
  let count = 0
  console.log("Serialize: ", sObj)
  for(var key in sObj){
    let pfname = key.split("/")
    let iri = key.split("#")
    let kname = pfname[pfname.length-1].split("#")
    let kname1 = pfname[pfname.length-1].split("_")
    let iri_complete = ''
    let prefix_name = ''
    let node_name = ''
    if(iri[0].indexOf("_") === -1){
      iri_complete = iri[0] + "#"
      prefix_name = getPrefix(iri_complete)
      node_name = prefix_name+":"+ kname[1]
    }else{
      iri_complete = key.substr(0, key.indexOf(pfname[pfname.length-1]))
      //iri_complete = iri1[0] +"_"
      //console.log("key:::", iri_complete)
      prefix_name = getPrefix(iri_complete)
      node_name = prefix_name+":"+ kname1[1]
    }


    //console.log("~~node name:~~~ ", node_name)
    s = s + node_name + " "

    let node_length = sObj[key].length
    let pObj = sObj[key]
    for(let i = 0; i<node_length-1; i++){
      //console.log("key'predicate and object's value: ", pObj[i])
      let pf_key = getPrefixKeyForm(pObj[i])
      s = s + pf_key + " ;\n"
      s = s + "  "
    }
    let pf_key = getPrefixKeyForm(pObj[node_length-1])
    s = s + pf_key + " .\n"
  }//for
  return s
}

/**
** Convert to Prefix:Key Form from URI
**/
function getPrefixKeyForm(sobj){
  let key_name = ''
  let iri_complete = ''
  let prefix_name = ''
  let node_name = ''

  let key = Object.keys(sobj)[0]

  let pfname = key.split("/")
  let iri = key.split("#")

  let kname = pfname[pfname.length-1].split("#")
  let kname1 = pfname[pfname.length-1].split("_")

  if(key.indexOf('ilx_') !== -1){
    iri_complete = key.substr(0, key.indexOf(pfname[pfname.length-1]))
    prefix_name = getPrefix(iri_complete)
    node_name = prefix_name+":"+ kname1[1] + " "
  } else if(kname.length==1){
    key_name = kname[0]
    iri_complete = key.substring(0,key.indexOf(kname[0]))
    prefix_name = getPrefix(iri_complete)
    node_name = prefix_name + ":" + key_name + " "
  } else{
      key_name = kname[1].replace(/\s+/g, '')
      iri_complete = iri[0] + "#"
      prefix_name = getPrefix(iri_complete)
      node_name = prefix_name + ":" + key_name + " "
    }

  let value = sobj[key]
  //dateTime
  if(value.indexOf('^^') === -1){
    pfname = value.split("/")
    if(pfname.length>1){
      kname = pfname[pfname.length-1].split("#")
      kname1 = pfname[pfname.length-1].split("_")
      //console.log("kname 2: ", kname)
      if(value.indexOf('ilx_') !== -1){
        iri_complete = key.substr(0, key.indexOf(pfname[pfname.length-1]))
        prefix_name = getPrefix(iri_complete)
        node_name = prefix_name+":"+ kname1[1] + " "
      }
      if(kname.length>1){
        key_name = kname[1].replace(/\s+/g, '')
      }else{
        key_name = kname[1]
      }
      prefix_name = kname[0]
      node_name = node_name + prefix_name+":"+ key_name + " "
    }else{
      node_name = node_name + value
    }
  }else{
    console.log("daTETIME TYPE")
    let xtype = value.split("^^")
    console.log("xtype: ", xtype)
    let parr = xtype[1].substring(1, xtype[1].length-1).split("#")
    console.log("parr: ", parr)
    prefix_name = getPrefix(parr[0]+"#")
    node_name = node_name + xtype[0] + "^^"+ prefix_name+":"+parr[1]
  }
    return node_name
}

/**
** Saves the RDF Graph to Store
** Serializes to Turtle file
**/
var _saveToRDFstore = function(nidmGraph, graphId, fileName,callback_tstring){
  let tstring = ""
  //let cpath = path.join(__dirname,'/../../../uploads/acquisition/')
  //let cpath = path.join(userData,'/uploads/acquisition/')
  let cpath = path.join(__dirname, '/../outputFiles/'+fileName)
  fs.stat(cpath+fileName, function(err, stat) {
    console.log(cpath+fileName)
    if(err == null){
      console.log('File exists')
      tstring = tstring + "\n"
    } else if(err.code == 'ENOENT') {
      console.log("File does not exist")
      // TODO: Add a method to automatically identify the namespace, add prefix and object properties
      tstring = "@prefix nidm: <"+ store.rdf.prefixes.get("nidm")+"> .\n"
      tstring = tstring + "@prefix rdf: <"+ store.rdf.prefixes.get("rdf")+"> .\n"
      tstring = tstring + "@prefix prov: <"+ store.rdf.prefixes.get("prov")+"> .\n"
      tstring = tstring + "@prefix dc: <"+ store.rdf.prefixes.get("dc")+"> .\n"
      tstring = tstring + "@prefix xsd: <"+ store.rdf.prefixes.get("xsd")+"> .\n"
      tstring = tstring + "@prefix provone: <"+ store.rdf.prefixes.get("provone")+"> .\n"
      tstring = tstring + "@prefix ILX: <"+ store.rdf.prefixes.get("ILX")+"> .\n"
    } else{
      console.log('Some other error: ', err.code);
    }
    /*
      Adding to Store
    */
    _addToStore(nidmGraph,graphId,function(graphId){
      console.log("addToStore callback:", graphId)
      store.graph(graphId,function(err, graph){
        console.log("---inside graph ------", graphId)
        let subject={}
        let objS = {}
        graph.forEach(function(triple){
          //console.log("triple:", triple)
          if(!(triple.subject.nominalValue in subject)){
            subject[triple.subject.nominalValue] = []
          }
          objS = {}
          objS[triple.predicate.toString()] = triple.object.toString()
          subject[triple.subject.nominalValue].push(objS)
        })
        //console.log("graphToNT: ---->\n", graph.toNT())
        //console.log("subject list: ", subject)
        console.log("----Serializing graph to turtle --->>>")
        let s = serializeToTurtle(subject)
        tstring = tstring + s
        //console.log(tstring)
        callback_tstring(graphId,tstring)
      })//graph
    })
  }) //fs.stat
}

module.exports = {
  addToStoreNamespace : _addToStoreNamespace,
  rdfStoreSetup : _rdfStoreSetup,
  getRegisteredGraphsList: _getRegisteredGraphsList,
  saveToRDFstore: _saveToRDFstore,
  addToStore: _addToStore,
  NIDMGraph : NIDMGraph
}
