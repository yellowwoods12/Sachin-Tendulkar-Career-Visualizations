const fs  = require("fs");
const app = require("http").createServer();
const io = module.exports.io = require('socket.io')(app);

const PORT = process.env.PORT || 3231;


const dataTemplate = {
    "batting_score" :"n/a",
    "wickets" : "n/a",
    "runs_conceded": "n/a",
    "catches" : "n/a",
    "stumps" : "n/a",
    "opposition" : "n/a",
    "ground": "n/a",
    "date" : "n/a",
    "date": {
        "day": "n/a",
        "month": "n/a",
        "year": "n/a",
      },
    "match_result" : "n/a",
    "result_margin" : {
        "number" : "n/a",
         "runs/wickets" : "n/a",
    },
    "toss": "n/a",
    "batting_innings": "n/a"
};

let RunScored = {
	"notDefined": 0
};

let Wins = {
	"notDefined": 0
};

let Stats = {
	"notDefined": 0
};

let Scores = {
	"twohundreds": 0,
	"hundreds" : 0,
	"fifties" : 0,
    "thirties" : 0
};

let InningWinCount= {
   "Second" : 0,
    "First" :0
};

let Ground ={
	"notDefined" : 0
}
let count = 0;

fs.readFile("datalog/sachin.txt", function(err, f){

		let resultArray = [];
		let requestData = [];
		let filteredData = 0;

    let dataLogArray = f.toString().split('\n');
		dataLogArray.splice(-1,1) //remove last array (empty) element
		dataLogArray.forEach((dataset, dataIdx) => {

			count++;
			let result = {};
			let subArray = [];
			let tempArray = dataset.split(",");

			tempArray[7] = tempArray[7].split(" "); //convert datetime to array
			tempArray[9] = tempArray[9].split(" "); //convert protocol to array

			let arrIdx = 0;

			while(arrIdx !== tempArray.length){
				if(Array.isArray(tempArray[arrIdx])){
					tempArray[arrIdx].forEach((e) => {
						subArray.push(e);
					})
					arrIdx++;
				} else {
					subArray.push(tempArray[arrIdx]);
					arrIdx++;
                }
            //    console.log(subArray[arrIdx]);
			}

			subArray.forEach((data, idx) => {
                subArray[idx] = data.replace(/[^a-zA-Z0-9./]/g, ''); //clean uncommon chars
                
			})

			let idx = 0;
			const addData = (subKey) => {
				if(dataTemplate[subKey] === "n/a"){
					result[subKey] = subArray[idx];
					idx++;
				} else {
					result[subKey] = {};
					for(let key in dataTemplate[subKey]){
						result[subKey][key] = subArray[idx];
						idx++;
					}
				}
			}

			for(let key in dataTemplate){
				addData(key);
			}

			resultArray.push(result);

			if(dataIdx === 0 || dataIdx === dataLogArray.length - 1){
				requestData.push(result.datetime);
			}

			if(RunScored[result.opposition]){
				RunScored[result.opposition]+=parseInt(result.batting_score);
			} else if (result.opposition.length < 2){
				RunScored.notDefined++;
			} else {
				RunScored[result.opposition] = parseInt(result.batting_score);
			}
         
			if(Wins[result.opposition] && result.match_result==="won"){
				Wins[result.opposition]++;
			} else if (result.match_result === undefined){
				Wins.notDefined++;
			} else if(result.match_result==="won"){
				Wins[result.opposition] = 1;
			}

			if(Stats[result.match_result]){
				Stats[result.match_result]++;
			} else if (result.match_result > 4){
				Stats.notDefined++;
			} else{
				Stats[result.match_result] = 1;
			}

			if( result.batting_score>=parseInt("200")){

				Scores.twohundreds++;
			}
			if(result.batting_score>=parseInt("100") &&   result.batting_score<parseInt("200")){

					Scores.hundreds++;
				
				
			} else if (result.batting_score>=parseInt("50") && result.batting_score<parseInt("100")){
				
				Scores.fifties++;

			} else if(result.batting_score>=parseInt("30") && result.batting_score<parseInt("50")){

				Scores.thirties++;

			}
			if(result.match_result ==="won" && result.batting_innings ==="2nd"){

				InningWinCount.Second++;

			}
			else if(result.match_result ==="won" && result.batting_innings ==="1st"){

				InningWinCount.First++;

			}
			if(Ground[result.ground] && result.match_result === "won"){
				Ground[result.ground]++;
			} else if(result.match_result ==="won"){
				Ground[result.ground]=1;
			}
		//	console.log(Scores);
       
		});
      //   console.log(Stats);
       // console.log(resultArray[0]);

		const dataToClient = {
			RunScored,
			Wins,
			Stats,
			Scores,
			InningWinCount,
			Ground
		}
        console.log(count);
		io.on('connection', () => {
			io.emit("data", dataToClient);
		});

		app.listen(PORT, () => {
			console.log("Connected to port: " + PORT)
		})
});
