var trueImage = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Flat_tick_icon.svg/1200px-Flat_tick_icon.svg.png';
var falseImage = 'https://icebag.fr/wp-content/uploads/2020/10/remove-300x300.png';

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
        //e.scrollIntoView({block: 'end', behavior: 'smooth', inline: 'nearest'});
        //e.scrollBy(0, -1000);
        //document.getElementById('FirstForm').style.opacity = 0;
        //document.body.style.overflow = "auto";
        //document.getElementById('results').style.marginTop = "-1750px";
        //Ciao
        e.classList.remove("hidden");
        PrintResults();

    }
    else{
        console.log(firstField);
        alert("Compilare tutti i campi e controllare che i dati siano scritti in notazione dotted-decimal.");
    }
}

//Per mantenere il background fissato allo sfondo
window.addEventListener('scroll',() => { 
    console.log('Scrolling...');
    document.body.style.overflow = "visible";
});

function PrintResults(){
    console.log("Printing...");

    let firstIP = document.getElementById("firstField").value;
    let secondIP = document.getElementById("thirdField").value;

    let detected1stIPClass = DetectIPClass(firstIP);
    document.getElementById("1stIPbelongsToWhichClass").textContent = detected1stIPClass;
    console.log("First IP Class: " + detected1stIPClass);

    let detected2ndIPClass = DetectIPClass(secondIP);
    document.getElementById("2ndIPbelongsToWhichClass").textContent = detected2ndIPClass;
    console.log("Second IP Class: " + detected2ndIPClass);

    let firstSubnetMask = document.getElementById("secondField").value;
    let secondSubnetMask = document.getElementById("fourthField").value;

    let firstSMCorrespondsImage = document.getElementById("firstCorrespondingSubnetMask");
    let secondSMCorrespondsImage = document.getElementById("secondCorrespondingSubnetMask");

    if(firstSubnetMask == DefaultSubnetMask(document.getElementById("firstField").value)){
        firstSMCorrespondsImage.src = trueImage;
    }
    else{
        firstSMCorrespondsImage.src = falseImage;
    }

    if(secondSubnetMask == DefaultSubnetMask(document.getElementById("thirdField").value)){
        secondSMCorrespondsImage.src = trueImage;
    }
    else{
        secondSMCorrespondsImage.src = falseImage;
    }

    let sameNetworkImage = document.getElementById("sameNetwork");
    if(detected1stIPClass == detected2ndIPClass){
        if(detected1stIPClass == "Classe A"){
            let Octets1 = firstIP.split('.', 1).toString();
            let Octets2 = secondIP.split('.', 1).toString();

            console.log(detected1stIPClass + ": " + Octets1 + ", " + Octets2);

            if(Octets1 == Octets2){
                console.log("Class A ==")
                sameNetworkImage.src = trueImage;
            }
            else{
                sameNetworkImage.src = falseImage;
            }
        }
        else if(detected1stIPClass == "Classe B"){
            let Octets1 = firstIP.split('.', 2).toString();
            let Octets2 = secondIP.split('.', 2).toString();

            console.log(detected1stIPClass + ": " + Octets1 + ", " + Octets2);

            if(Octets1 == Octets2){
                console.log("Class B ==")
                sameNetworkImage.src = trueImage;
            }
            else{
                sameNetworkImage.src = falseImage;
            }
        }
        else if(detected1stIPClass == "Classe C"){
            let Octets1 = firstIP.split('.', 3).toString();
            let Octets2 = secondIP.split('.', 3).toString();

            console.log(detected1stIPClass + ": " + Octets1 + ", " + Octets2);

            if(Octets1 == Octets2){
                console.log("Class C ==")
                sameNetworkImage.src = trueImage;
            }
            else{
                sameNetworkImage.src = falseImage;
            }
        }
    }
    else{
        sameNetworkImage.src = falseImage;
    }
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
    let regex = /^(25[0-5]|2[0-4][0-9]|[1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if(regex.test(str)){
        return true;
    }
    else{
        return false;
    }
}

function FirstOctetToBinary(str){
    let firstOctet = parseInt(str.split('.', 1));
    return ("000000000" + firstOctet.toString(2)).substr(-8)
}

function StringToBinary(str){
    let firstOctet = parseInt(str.split('.'));
    console.log(firstOctet.toString(2));
}

function DetectIPClass(IP){
    let firstOctet = FirstOctetToBinary(IP);
    console.log("First octect in binary of " + IP + ": " + firstOctet);

    let firstNumber = firstOctet.slice(0, 1);
    let firstTwoNumbers = firstOctet.slice(0, 2);
    let firstThreeNumbers = firstOctet.slice(0, 3);

    if(firstNumber == "0"){
        return "Classe A";
    }
    else if(firstTwoNumbers == "10"){
        return "Classe B";
    }
    else if(firstThreeNumbers == "110"){
        return "Classe C";
    }
}

function DefaultSubnetMask(IP){
    let ipClass = DetectIPClass(IP);

    if(ipClass == "Classe A"){
        return "255.0.0.0";
    }
    else if(ipClass == "Classe B"){
        return "255.255.0.0";
    }
    else if(ipClass == "Classe C"){
        return "255.255.255.0";
    }
}