
function CheckAndShowResults(id){
    let firstField = document.getElementById("firstField").value;
    let secondField = document.getElementById("secondField").value;
    let thirdField = document.getElementById("thirdField").value;
    let fourthField = document.getElementById("fourthField").value;

    if(!IsNullOrWhiteSpace(firstField) && IsAValidDottedDecimal(firstField) 
    && !IsNullOrWhiteSpace(secondField) && IsAValidDottedDecimal(secondField)
    && !IsNullOrWhiteSpace(thirdField) && IsAValidDottedDecimal(thirdField)
    && !IsNullOrWhiteSpace(fourthField) && IsAValidDottedDecimal(fourthField)){
        console.log(firstField + ", " + secondField + ", " +  thirdField + ", " + fourthField);
        let e = document.getElementById(id);
        console.log(e)
        e.scrollIntoView({block: 'end', behavior: 'smooth', inline: 'center'});
        document.getElementById('FirstForm').style.opacity = 0;
        //document.body.style.overflow = "auto";
    
        //document.getElementById('results').style.marginTop = "-1750px";
        PrintResults();
    }
    else{
        console.log(firstField);
        alert("Compilare tutti i campi e controllare che i dati siano scritti in notazione dotted-decimal.");
    }
}

//Per mantenere il background fissato allo sfondo
window.addEventListener('scroll',(event) => { 
    console.log('Scrolling...');
    document.body.style.overflow = "visible";
});

function PrintResults(){
    console.log("Printing...");

    let belongsToClassText = document.getElementById("belongsToWhichClass");
    let detectedClass = DetectIPClass(document.getElementById("firstField").value);
    document.getElementById("belongsToWhichClass").textContent = detectedClass;
}

function IsNullOrWhiteSpace(str){
    if(str != ""){
        return false
    }
    else{
        return true;
    }
}

function IsAValidDottedDecimal(str){
    let regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if(regex.test(str)){
        return true;
    }
    else{
        return false;
    }
}

function FirstOctetToBinary(str){
    let firstOctet = parseInt(str.split('.', 1));
    return firstOctet.toString(2);
}

function StringToBinary(str){
    let firstOctet = parseInt(str.split('.'));
    console.log(firstOctet.toString(2));
}

function DetectIPClass(IP){
    let firstOctet = FirstOctetToBinary(IP);
    console.log(firstOctet);
    let firstThreeNumbers = firstOctet.slice(0, 3);

    let IPClass;

    if(firstThreeNumbers == "000"){
        IPClass = "Classe A";
    }
    else if(firstThreeNumbers == "100"){
        IPClass = "Classe B";
    }
    else if(firstThreeNumbers == "110"){
        IPClass = "Classe C";
    }

    return IPClass;
}