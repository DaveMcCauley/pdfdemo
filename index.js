'use strict'


const fs = require('fs');
// https://www.npmjs.com/package/pdf-parse
const pdf = require('pdf-parse');

console.log("here we go");

let databuffer = fs.readFileSync('./testtext.pdf');

pdf(databuffer).then(data => {
  
  // number of pages
  console.log('data.numpages >', data.numpages);
  // number of rendered pages
  console.log('\ndata.numrender >', data.numrender);
  // PDF Info
  console.log('\ndata.info >', data.info);
  // PDF Metadata
  console.log('\ndata.metadata >', data.metadata);
  // PDF.js version.
  console.log('\ndata.version >', data.version);
  // PDF text
  console.log('\ndata.text >', data.text);
  
  // All of data...
  // console.log('\ndata > ', data);
  
  // DOB:
  let token = scanFields(data.text, 'DOB:', 'Age:');
  console.log("\n\n=====================\nDOB: ", token.trim());
  
  // Patient name
  token = scanFields(data.text, 'Patient:', 'PatientID:');
  console.log("Patient: ", token.trim());
 
  // Patient ID;
  token = scanFields(data.text, 'PatientID:', 'Home');
  console.log("PatientID: ", token.trim());
  // provider
  token = scanFields(data.text, 'Provider:', 'Collected:');
  console.log("Provider: ", token.trim(), "\n=====================\n\n\n");
  
})
.catch(err => {
  console.log("\nA colossal fuckup has occurrend!", err);
});



function scanFields(text, startToken, endToken) {
  
  let startTokenLen = startToken.length;
  let endTokenLen = endToken.length;
  let textLen = 1000; //text.length;
  let segStart;
  let segEnd;
 
  // promise?
  let i = 0;
  let found = false;
 
  while(!found && i < textLen - startTokenLen) {
    found = (text.substring(i, i + startTokenLen) === startToken);
    // console.log("i >> ", i, "\tseg >>", text.substring(i, i + startTokenLen), "?", startToken, found ? "\tfound!" : "");
    i++;
  }
 
  if(!found) 
    return false;

  segStart = i + startTokenLen;
  
  found = false;
  i = segStart;
  
  while(!found && i < textLen) {
    found = (text.substring(i, i + endTokenLen) === endToken);
    // console.log("i >> ", i, "\tseg >>", text.substring(i, i + endTokenLen), "?", endToken, found ? "\tfound!" : "");
    i++;
  }
  
  if(!found) 
    return false;
  
  segEnd = i - 1;
  
  return text.substring(segStart, segEnd);
  
}
 
 
 