const path = require('path')
const fs = require('fs')
const rdfstore = require('rdfstore')
const uuid = require('uuid-random')
const loadJsonFile = require('load-json-file')
const jquery = require('jQuery')

const rdfConfig = require('./rdfPrefixes.js')
const rdfHelper = require('./rdfGraph.js')

const dataForge = require('data-forge')
if(typeof require !== 'undefined')
  XLSX = require('xlsx')


function readCSVToDataFrame(filePath){
  var dataFrame = dataForge
    .readFileSync(filePath)
    .parseCSV()
  return dataFrame
}

function printInConsole(DataFrameName, dataFrame, indexNumber){
  var columnNames = dataFrame.getColumnNames()
  console.log("DataFrame Name:", DataFrameName,"  columnNames: ", columnNames)

  objects = dataFrame.toArray();
  //console.log("objects:~~~~~> ", objects[0])
  console.log("DataFrame Name:", DataFrameName, " Object for index-",indexNumber, ": ", objects[indexNumber])

  var rows = dataFrame.toRows();
  console.log("DataFrame Name:", DataFrameName, " Rows for index-",indexNumber, ": ", rows[indexNumber])

  var pairs = dataFrame.toPairs()
  console.log("DataFrame Name:", DataFrameName, " Pairs for index-",indexNumber, ": ", pairs[indexNumber])
}

function printThicknessDataFrame(){
  //printInConsole("pheno", pheno,0)
  //printInConsole("ants", ants,0)
  /*printInConsole("ants", ants,1)
  printInConsole("fs5.1", fs5_1_landRV,0)
  printInConsole("fs5.3", fs5_3_landRV,0)
  printInConsole("fs5.1_thick", fs5_1_thick,0)
  printInConsole("fs5.3_thick", fs5_3_thick,0)*/
}
function readXlsxToCSV(filePath){
  var workbook = XLSX.readFile(filePath)
  var first_sheet_name = workbook.SheetNames[2];
  var address_of_cell = 'A1';
  console.log("first_sheet_name: ", first_sheet_name)
  /* Get worksheet */
  var worksheet = workbook.Sheets[first_sheet_name];

  /* Find desired cell */
  var desired_cell = worksheet[address_of_cell];

  /* Get the value */
  var desired_value = (desired_cell ? desired_cell.v : undefined);
  console.log("desired val: ", desired_value)
  var csv = XLSX.utils.sheet_to_csv(worksheet)
  //console.log("csv: ", csv)
  var dataFrame = dataForge.fromCSV(csv)
  //printInConsole("xls", dataFrame,0)
  return dataFrame
}
var antsLabelObj = {}
var fs5_1LabelObj = {}
var fs5_3LabelObj = {}


let snodes = {} //subject nodes

var dkt_atlas = readXlsxToCSV('./../sobp_input/fs_labels_ilx.xlsx')

dkt_atlas.forEach(function (row) {
  //console.log("row: ", row)
  if(row['No'] !== ''){
    antsLabelObj[row['ANTS_labels']] = {
      "ANTS_Interlex": row['ANTS_Interlex'],
      "ILX Term": row['ILX Term'],
      "label_abbrev": row['label_abbrev']
    }
  fs5_1LabelObj[row['FS_5.1_labels']] = {
      "FS_Interlex": row['FS_Interlex'],
      "ILX Term": row['ILX Term']
    }
  fs5_3LabelObj[row['FS_5.3_labels']] = {
      "FS_Interlex": row['FS_Interlex'],
      "ILX Term": row['ILX Term']
    }
  }else{
    console.log("else")
  }
});
//console.log("ANTS Label: ", antsLabelObj)
//console.log("FS Label:",fs5_3LabelObj )


var pheno = readCSVToDataFrame('./../sobp_input/ABIDE_Phenotype.csv')

var ants = readCSVToDataFrame('./../sobp_input/ABIDE_ants_thickness_data_r.csv')

var antsRowSubset = ants.between(1, 2)
//console.log("ants RowSubset: ", antsRowSubset.toArray())
var thicknessArray = []
var ilxObj = {}

antsRowSubset.forEach(function(row){
  var tObj = {}
  tObj['SubID'] = row['Code']
  for(key in row){
    var key1 = key.replace(/\s+/g, '.')
    if(key !== 'Code' && key !=='File'){
      if(antsLabelObj.hasOwnProperty(key1)){
        tObj[antsLabelObj[key1]['ANTS_Interlex']] = row[key]

        if(!ilxObj.hasOwnProperty(antsLabelObj[key1]['ANTS_Interlex'])){
          ilxObj[antsLabelObj[key1]['ANTS_Interlex']] = {
            'ILX_Term': antsLabelObj[key1]['ILX Term'],
            'ANTS_Label': key1,
            'label_abbrev': antsLabelObj[key1]['label_abbrev']
          }
        }
      }else{
        tObj[key] = row[key]
      }
    }
  }
  tObj['Method'] = 'ANTS'
  thicknessArray.push(tObj)
})

/*antsRowSubset.forEach(function(row){
  for(key in row){
    var tObj = {}
    var key1 = key.replace(/\s+/g, '.')
    if(key !== 'Code' && key !=='File'){
      if(antsLabelObj.hasOwnProperty(key1)){
        tObj['SubID'] = row['Code']
        tObj['ROI'] = key
        tObj['Thickness'] = row[key]
        tObj['Method'] = 'ANTS'
        tObj['ILX_Term'] = antsLabelObj[key1]['ILX Term']
        tObj['ANTS_Interlex'] = antsLabelObj[key1]['ANTS_Interlex']
        tObj['ANTS_Label'] = key1
        tObj['label_abbrev'] = antsLabelObj[key1]['label_abbrev']

      }else{
        tObj['SubID'] = row['Code']
        tObj['ROI'] = key
        tObj['Thickness'] = row[key]
        tObj['Method'] = 'ANTS'
      }
      thicknessArray.push(tObj)
    }
  }
})*/
//console.log("ThicknessArray: ", thicknessArray)
//console.log("ilx_obj:", ilxObj)

/*var fs5_1_landRV = readCSVToDataFrame('./../sobp_input/ABIDE_fs5.1_landrvolumes.csv')
var fs5_3_landRV = readCSVToDataFrame('./../sobp_input/ABIDE_fs5.3_landrvolumes.csv')

var fs_5_1_thick = readCSVToDataFrame('./../sobp_input/cortical_fs5.1_measuresenigma_thickavg.csv')
var fs_5_3_thick = readCSVToDataFrame('./../sobp_input/ABIDE_fs5.3_thickness.csv')*/

let gId = 'result-graph-'+ uuid()
let fName = gId + '.ttl'
let graphId = "nidm:"+gId
let ilxNodes = []
let tnodes = []

global.setup = {}
global.store = {}

setup = rdfHelper.rdfStoreSetup()

store = setup.store
//console.log("store: ", store)

let nidmr = new rdfHelper.NIDMGraph()

for(var key in ilxObj){
  ilxNodes.push(nidmr.addILXEntity(key, ilxObj[key]))
}

for(var i = 0; i<thicknessArray.length; i++){
  tnodes.push(nidmr.addResultEntity(thicknessArray[i]))
}


/**
** Saving Graph to RDF Store
**/
rdfHelper.saveToRDFstore(nidmr, graphId, fName, function(graphId,tstring){
  console.log("callback fn: tstring: ", tstring)
  let cpath = path.join(__dirname, '/../outputFiles/'+fName)

  fs.writeFile(cpath, tstring, function(err) {
    if(err) {
      return console.log(err);
    }
    console.log("The file was saved!");
    //res.json({'tid': obj_info['objID'], 'fid': fName})
  })
})
