// Sources for links between supplements. Key: "A|B" with ids in the same order as in E (data/supplements.js).
// Every entry was opened and read before it was added: the abstract supports the text of the link.
// pmid: PubMed id. pmc: free full text in PubMed Central, when there is one. y: year, when known.
const SRC={
 "D3|Ca":[
  {pmid:"12672710",y:2003,t:"Calcium absorption varies within the reference range for serum 25-hydroxyvitamin D"},
  {pmid:"22855333",t:"The effect of vitamin D on calcium absorption in older women"},
  {pmid:"20660223",pmc:"PMC2937584",t:"Serum vitamin D metabolites and intestinal calcium absorption efficiency in women"}],
 "Fe|C":[
  {pmid:"3700141",t:"Effect of ascorbic acid on iron absorption from different types of meals"},
  {pmid:"6940487",t:"Interaction of vitamin C and iron"}],
 "B12|B9":[
  {pmid:"9569395",pmc:"PMC28491",t:"Lowering blood homocysteine with folic acid based supplements: meta-analysis of randomised trials"},
  {pmid:"14584018",t:"Folic acid with or without vitamin B12 for cognition and dementia"}],
 "Ca|Fe":[
  {pmid:"1984335",y:1991,t:"Calcium: effect of different amounts on nonheme- and heme-iron absorption in humans"},
  {pmid:"19087437",t:"The effect of calcium on iron absorption"},
  {pmid:"21795430",t:"Calcium does not inhibit the absorption of 5 mg of nonheme or heme iron at doses less than 800 mg in nonpregnant women"}],
 "Zn|Cu":[
  {pmid:"26085547",t:"The risk of copper deficiency in patients prescribed zinc supplements"},
  {pmc:"PMC2872358",t:"The essential toxin: impact of zinc on human health"}],
 "Cof|Fe":[
  {pmid:"6402915",y:1983,t:"Inhibition of food iron absorption by coffee"},
  {pmid:"10999016",y:1999,t:"Inhibition of non-haem iron absorption in man by polyphenolic-containing beverages"}],
 "GTE|Fe":[
  {pmid:"10999016",y:1999,t:"Inhibition of non-haem iron absorption in man by polyphenolic-containing beverages"},
  {pmid:"42613905",pmc:"PMC13487353",t:"Effect of epigallocatechin gallate supplementation on inflammation, iron status, and metabolomic profiles in women with obesity: a pilot randomized controlled trial"}]
};
