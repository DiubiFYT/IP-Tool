var trueImage = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Flat_tick_icon.svg/1200px-Flat_tick_icon.svg.png';
var falseImage = 'https://icebag.fr/wp-content/uploads/2020/10/remove-300x300.png';

function CheckAndShowResults(id){
    let firstField = document.getElementById("firstField").value;
    let secondField = document.getElementById("secondField").value;

    if(IsAValidDottedDecimal(firstField) 
    && !IsNullOrWhiteSpace(secondField)
    && IsAValidNSubnets(firstField, secondField)){

        console.log(firstField + ", " + secondField);
        let e = document.getElementById(id);
        let form = document.getElementById("FirstForm");
        console.log(e)
        //e.scrollIntoView({block: 'end', behavior: 'smooth', inline: 'nearest'});
        //e.scrollBy(0, -1000);
        //document.getElementById('FirstForm').style.opacity = 0;
        //document.body.style.overflow = "auto";
        //document.getElementById('results').style.marginTop = "-1750px";
        e.classList.remove("hidden");
        e.classList.add("fadeinanim");

        form.classList.add("hidden");
        PrintResults();

    }
    else{
        console.log(firstField);
        alert("Compilare tutti i campi e controllare che i dati siano scritti in notazione dotted-decimal.");
    }
}

async function Reset(){
    let resultsTab = document.getElementById("results");
    let form = document.getElementById("FirstForm");

    form.classList.remove("hidden");

    resultsTab.classList.remove("fadeinanim");
    resultsTab.classList.add("fadeoutanim")
    await sleep(500);
    resultsTab.classList.remove("fadeoutanim")
    resultsTab.classList.add("hidden");
}

function sleep(ms) {
    return new Promise(
      resolve => setTimeout(resolve, ms)
    );
}

//Per mantenere il background fissato allo sfondo
window.addEventListener('scroll',() => { 
    console.log('Scrolling...');
    document.body.style.overflow = "visible";
});

function PrintResults(){
    console.log("Printing...");

    let IP = document.getElementById("firstField").value;

    let IPClass = GetIPClass(IP);
    document.getElementById("IPbelongsToWhichClass").textContent = IPClass;
    console.log("IP Class: " + IPClass);

    let nSubnets = document.getElementById("secondField").value;
    let IPSubnetMaskDefault = GetDefaultSubnetMask(IP);

    let SubnetMaskBinaryNetID = GetSubnetMaskBinary(IP, nSubnets, "Network");
    let SubnetMaskBinarySubnetID = GetSubnetMaskBinary(IP, nSubnets, "Subnet");
    let SubnetMaskBinaryHostID = GetSubnetMaskBinary(IP, nSubnets, "Host");


    console.log(GetSubnetMaskBinary(IP, nSubnets, "All"));

    document.getElementById("newSM").textContent = GetSubnetMask(IP, nSubnets);

    document.getElementById("NetID").textContent = SubnetMaskBinaryNetID.toString();
    document.getElementById("SubnetID").textContent = SubnetMaskBinarySubnetID.toString();
    document.getElementById("HostID").textContent = SubnetMaskBinaryHostID.toString();

    document.getElementById("maximumHostsForeachSubnet").textContent = GetNHost(IP, nSubnets);

    let SubnetsIps = GetAllSubnetsIps(IP, nSubnets);
    let t = "<tr><th><h5>Indirizzo di rete</h5></th><th><h5>Indirizzo di broadcast</h5></th><th><h5>Indirizzo di gateway</h5></th></tr>";
    for (let i = 0; i < SubnetsIps.length; i++){
        let tr = "<tr>";
        tr += "<td>" + SubnetsIps[i].networkIp + "</td>";
        tr += "<td>" + SubnetsIps[i].broadcasIp + "</td>";
        tr += "<td>" + SubnetsIps[i].gatewayIp + "</td>";
        tr += "</tr>";
        t += tr;
    }
    document.getElementById("Table").innerHTML = t;
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

function IsAValidNSubnets(IP, nSubnets){
    let IPClass = GetIPClass(IP);

    if(IPClass == "Classe A" && nSubnets > 4194304){
        return false;
    }
    else if(IPClass == "Classe B" && nSubnets > 16384){
        return false;
    }
    else if(IPClass == "Classe C" && nSubnets > 64){
        return false;
    }

    return true;
}

function FirstOctetToBinary(str){
    let firstOctet = parseInt(str.split('.', 1));
    return OctectToBinary(firstOctet);
}

function OctectToBinary(octect){
    return ("000000000" + octect.toString(2)).substr(-8);
}

function IPToBinary(str){

    if(!IsAValidDottedDecimal(str)){
        console.log(str + " it's not a valid IP!");
        return null;
    }

    let octetc1 = parseInt(str.split('.', 1));
    let octetc2 = parseInt(str.split('.', 2));
    let octetc3 = parseInt(str.split('.', 3));
    let octetc4 = parseInt(str.split('.', 4));

    let binaryIP = OctectToBinary(octetc1) + "." + OctectToBinary(octetc2) + "." + OctectToBinary(octetc3) + "." + OctectToBinary(octetc4);
    return binaryIP;
}

function GetIPClass(IP){
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

function GetDefaultSubnetMask(IP){
    let IPClass = GetIPClass(IP);

    if(IPClass == "Classe A"){
        return "255.0.0.0";
    }
    else if(IPClass == "Classe B"){
        return "255.255.0.0";
    }
    else if(IPClass == "Classe C"){
        return "255.255.255.0";
    }
}

function GetDefaultNBitHost(IP){
    let IPClass = GetIPClass(IP);

    if(IPClass == "Classe A"){
        return 24;
    }
    else if(IPClass == "Classe B"){
        return 16;
    }
    else if(IPClass == "Classe C"){
        return 8;
    }
}

function GetNSubnets(nSubnets){
    let n = 0;
    let ex = 0;

    do{
        ex++;
        n = Math.pow(2, ex);
    }
    while(n < nSubnets)

    return n;
}

function GetSubnetMaskBinary(IP, nSubnets, whichOne){

    let nBitSubnet = Math.log2(GetNSubnets(nSubnets));
    let nBitHost = GetDefaultNBitHost(IP) - nBitSubnet;
    let nBitNetwork = 32 - nBitSubnet - nBitHost;

    console.log("Bits subnet: " + nBitSubnet + ", bits host: " + nBitHost + ", bits net: " + nBitNetwork + ".")

    let str = 
    {
        network: "",
        subnet: "",
        host: ""
    }

    if(whichOne == "All"){
    for(let i = 0; i < nBitNetwork; i++){

        if(i % 8 == 0 && i != 0){
            str.network +=".";
        }
        str.network += "1";
    }

    for(let i = 0; i < nBitSubnet; i++){

        if(i % 8 == 0){
            str.subnet +=".";
        }
        str.subnet += "1";
    }

    for(let i = 0; i < nBitHost; i++){

        if((i + nBitSubnet) % 8 == 0){            
            str.host += ".";
        }
        str.host += "0";
    }

    return str.network + str.subnet + str.host;
    }

    else if(whichOne == "Network"){
        for(let i = 0; i < nBitNetwork; i++){

            if(i % 8 == 0 && i != 0){
                str.network +=".";
            }
            str.network += "1";
        }
        return str.network;
    }
    else if(whichOne == "Subnet"){
        for(let i = 0; i < nBitSubnet; i++){

            if(i % 8 == 0){
                str.subnet +=".";
            }
            str.subnet += "1";
        }
        return str.subnet;
    }
    else if(whichOne == "Host"){
        for(let i = 0; i < nBitHost; i++){

            if((i + nBitSubnet) % 8 == 0){            
                str.host += ".";
            }
            str.host += "0";
        }
        return str.host;
    }
    else{
        return console.error("Scegliere i tipi di dati da ritornare.")
    }
}

function GetSubnetMask(IP, nSubnets){
    let binarySM = GetSubnetMaskBinary(IP, nSubnets, "All");
    let splittedSM = binarySM.split('.');

    console.log(splittedSM);

    return parseInt(splittedSM[0], 2) + "." + parseInt(splittedSM[1], 2) + "." + parseInt(splittedSM[2], 2) + "." + parseInt(splittedSM[3], 2);
}

function GetNHost(IP, nSubnets){
    let nBitSubnet = Math.log2(GetNSubnets(nSubnets));
    let nBitHost = GetDefaultNBitHost(IP) - nBitSubnet;

    return Math.pow(2,nBitHost) - 2;
}

function GetAllSubnetsIps(IP, nSubnets){

    let idk = IP.split(".");
    
    let ipTemp = idk[0] + "." + idk[1] + "." + idk[2] + ".";

    let IPClass = GetIPClass(IP);

    let nbitHostClass;
    if(IPClass == "Classe A"){
        nbitHostClass = 24;
    }
    else if(IPClass == "Classe B"){
        nbitHostClass = 16;
    }
    else if(IPClass == "Classe C"){
        nbitHostClass = 8;
    }

    let magicNumber = Math.pow(2,nbitHostClass - Math.log2(GetNSubnets(nSubnets)));

    let subnetsIps = [];
    for(let i = 0; i < GetNSubnets(nSubnets); i++){

        var subnet={
            networkIp: ipTemp + (i * magicNumber),
            broadcasIp: ipTemp + ( (i * magicNumber) + (magicNumber - 1) ),
            gatewayIp: ipTemp + ( (i * magicNumber) + 1),
        }
        subnetsIps[i] = subnet;
    }
    
    console.log(subnetsIps);
    return subnetsIps;
}