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
  {pmid:"42613905",pmc:"PMC13487353",t:"Effect of epigallocatechin gallate supplementation on inflammation, iron status, and metabolomic profiles in women with obesity: a pilot randomized controlled trial"}],
 "D3|K2":[
  {pmid:"11886767",t:"Effect of continuous combined therapy with vitamin K2 and vitamin D3 on bone mineral density and coagulofibrinolysis function in postmenopausal women"},
  {pmid:"32060566",t:"Effect of low-dose vitamin K2 supplementation on bone mineral density in middle-aged and elderly Chinese: a randomized controlled study"},
  {pmid:"42524357",t:"Investigating the interrelationship of vitamin K and vitamin D status on bone density: results from the VITAL trial"}],
 "D3|Mg":[
  {pmid:"30541089",t:"Magnesium status and supplementation influence vitamin D status and metabolism: results from a randomized trial"},
  {pmid:"3840173",t:"Low serum concentrations of 1,25-dihydroxyvitamin D in human magnesium deficiency"},
  {pmid:"29480918",y:2018,t:"Role of magnesium in vitamin D activation and function"}],
 "B6|B9":[
  {pmid:"9569395",pmc:"PMC28491",t:"Lowering blood homocysteine with folic acid based supplements: meta-analysis of randomised trials"}],
 "Cur|Pip":[
  {pmid:"9619120",y:1998,t:"Influence of piperine on the pharmacokinetics of curcumin in animals and human volunteers"}],
 "LT|Cof":[
  {pmid:"24946991",t:"Acute effects of tea constituents L-theanine, caffeine, and epigallocatechin gallate on cognitive function and mood: a systematic review and meta-analysis"},
  {pmid:"18681988",y:2008,t:"The combined effects of L-theanine and caffeine on cognitive performance and mood"},
  {pmid:"18006208",y:2008,t:"The effects of L-theanine, caffeine and their combination on cognition and mood"}],
 "E|K2":[
  {pmid:"15213041",t:"Effect of vitamin E supplementation on vitamin K status in adults with normal coagulation status"}],
 "Cof|Mel":[
  {pmid:"26378246",y:2015,t:"Effects of caffeine on the human circadian clock in vivo and in vitro"},
  {pmid:"14592218",y:2002,t:"The effects of coffee consumption on sleep and melatonin secretion"}]
};

// Sources for what a supplement does for a goal. Key: supplement id, then goal id.
const SRC_S={
 D3:{
  immune:[
   {pmid:"28202713",pmc:"PMC5310969",y:2017,t:"Vitamin D supplementation to prevent acute respiratory tract infections: systematic review and meta-analysis of individual participant data"},
   {pmid:"39993397",pmc:"PMC12056739",y:2025,t:"Vitamin D supplementation to prevent acute respiratory infections: systematic review and meta-analysis of stratified aggregate data"}],
  bones:[
   {pmid:"19370554",y:2009,t:"Vitamin D and vitamin D analogues for preventing fractures associated with involutional and post-menopausal osteoporosis"},
   {pmid:"24703049",t:"The effect of vitamin D supplementation on skeletal, vascular, or cancer outcomes: a trial sequential meta-analysis"},
   {pmid:"24119980",y:2014,t:"Effects of vitamin D supplements on bone mineral density: a systematic review and meta-analysis"}]}
};
