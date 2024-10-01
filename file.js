const CSVToJSON = require("csvtojson");
const fs = require('fs');

CSVToJSON().fromFile("./source.csv").then(source => {

    let tmpcolumnsArr = [];
    for(let i = 0; i < source.length; i++){
        for(let key in source[i] ){
            if(!key.includes('field')) tmpcolumnsArr.push(key);
        }
    }

    let columnsArr = tmpcolumnsArr.filter((value, index, arr) => arr.indexOf(value) === index)

    let commonArr = [];
    let rowColArr = [];

    for(let key in source[0]){
        for(let i = 0; i < source.length; i++){
              if(source[i].hasOwnProperty(key)){
                commonArr.push(source[i][key])
              }
        }
        rowColArr.push({[key] : commonArr})
        commonArr = []
    }


    let requiredRowColArr = [];
    for(let i = 0; i < columnsArr.length; i++){
        requiredRowColArr.push(rowColArr[i])
    }


    let tmpRowsArr1 = [];
    for(let i = 0; i < requiredRowColArr.length; i++){
        tmpRowsArr1.push(requiredRowColArr[i][columnsArr[i]])
    }
    

    let res = [];
    for(let i = 0; i < columnsArr.length; i++){
        res.push({section : columnsArr[i]})
    }


    let tmpArrforRows = [];
    let tmpRowStore1 = {};
    for(let j = 0; j < tmpRowsArr1.length; j++){
        for(let i = 0; i < tmpRowsArr1[j].length; i++){
            if(!tmpRowsArr1[j][i].includes('(')){
                tmpRowStore1[tmpRowsArr1[j][i]] = []
            }else{
                let numArr = tmpRowsArr1[j][i].split(' ');
                let str1 = numArr[numArr.length - 1]
                let strArr = str1.match(/[0-9]/g);
                let num1;
                if(strArr){
                    num1 = strArr.join('');
                    num1 = Number(num1);
                }
                
                tmpRowStore1[tmpRowsArr1[j][i]] = num1;
                
            }
    
            if(typeof(tmpRowStore1[tmpRowsArr1[j][i]]) === 'number'){
                let arr = tmpRowsArr1[j][i].split(' ');
                let str = arr[arr.length - 1];
                let strArr = str.match(/[a-zA-Z]/g);
                str = strArr.join('')
                arr[arr.length - 1] = str
                let prop = arr.join(' ')
                for(let key in tmpRowStore1){
                    if(typeof(tmpRowStore1[key]) === 'number'){
                        tmpRowStore1[prop] = tmpRowStore1[key];
                    }
                    if(key.includes('(')){
                        delete tmpRowStore1[key];
                    }
                }
                
            }
    
        }

        tmpArrforRows.push(tmpRowStore1);
        tmpRowStore1 = {};
    }
    

    let helperArr = [];
    for(let i = 0; i < tmpArrforRows.length; i++){
        let tmp = [];
        for(let key in tmpArrforRows[i]){
            tmp.push(key)
        }
        helperArr.push(tmp)
    }


    for(let i = 0; i < tmpArrforRows.length; i++){
        for(let key in tmpArrforRows[i]){
            if(typeof(tmpArrforRows[i][key]) === 'number'){
                let index = helperArr[i].indexOf(key);
                let num = tmpArrforRows[i][key];
                let max = index + num + 1
                tmpArrforRows[i][key] = [];
                for(let j = index + 1; j < max; j++){
                    tmpArrforRows[i][key].push(helperArr[i][j])
                    delete tmpArrforRows[i][helperArr[i][j]];
                }
            }
        }
    }

    let res2 = [];
    for(let i = 0; i < tmpArrforRows.length; i++){
        res2.push({subSection : tmpArrforRows[i]})
    }

    
    for(let i = 0; i < tmpArrforRows.length; i++){
        res[i]['subSection'] = res2[i]['subSection']
    }


    for(let i = 0; i < res.length; i++){
        for(let key in res[i]['subSection']){
            if(key === ''){
               delete res[i]['subSection'][key];
            }
        }
    }

    console.log(res)
    
    fs.writeFile('output.json', JSON.stringify(res), function(err) {
        if (err) throw err;
    });

});