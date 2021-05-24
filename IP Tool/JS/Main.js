var trueImage = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Flat_tick_icon.svg/1200px-Flat_tick_icon.svg.png';
var falseImage = 'https://icebag.fr/wp-content/uploads/2020/10/remove-300x300.png';

function CheckAndShowResults(id){
    let firstField = document.getElementById("firstField").value.trim();
    let secondField = document.getElementById("secondField").value.trim();

    if(IsAValidDottedDecimal(firstField) 
    && !IsNullOrWhiteSpace(secondField)
    && IsAValidNSubnets(firstField, secondField)){

        if(firstField.split('.')[0] > 223){
            alert("Inserire un indirizzo IP tra le classi A, B o C.");
            return;
        }

        if(secondField == 0){
            alert("Non puoi inserire 0 sottoreti.");
            return;
        }

        let nMaxHosts = (GetNHost(firstField, secondField) - 1);

        let parallaxDivDivs = document.getElementsByTagName("input");
        Array.from(parallaxDivDivs).forEach(element => {
            if(element.id.includes("hostsSubnet")){
                if(parseInt(element.value) > nMaxHosts){
                    throw alert("Inserire un valore minore di " + nMaxHosts + " (Il numero massimo di indirizzi hosts assegnabili per ogni sottorete).");
                }
            }
        });

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

function GenerateHostsTextBoxes(){
    let nSubnets = document.getElementById("secondField").value;

    if(nSubnets != ""){
        console.log("Generating textboxes...");
        let parallaxDivDivs = document.getElementsByTagName("div");
        Array.from(parallaxDivDivs).forEach(element => {
            if(element.id.includes("hostsDiv")){
                element.remove();
            }
        });

        for(let i=0; i<nSubnets; i++){
            let textBoxDiv = document.createElement("div");
            textBoxDiv.classList.add("form-group");
            textBoxDiv.classList.add("margintop");
            textBoxDiv.id = "hostsDiv" + (i + 1);
    
            let label = document.createElement("label");
            label.textContent = "Host per subnet " + (i + 1);
            textBoxDiv.appendChild(label);
    
            let textBox = document.createElement("input");
            textBox.type = "text";
            textBox.id = "hostsSubnet" +  (i + 1);
            textBox.classList.add("form-control");
            textBox.placeholder = "Se non inserisci nulla daremo per scontato che ci sarà un solo host."
            textBoxDiv.appendChild(textBox);

            document.getElementById("fields").appendChild(textBoxDiv);
        }
    }
    else{
        let parallaxDivDivs = document.getElementsByTagName("div");
        Array.from(parallaxDivDivs).forEach(element => {
            if(element.id.includes("hostsDiv")){
                element.remove();
            }
        });
    }
}

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

    document.getElementById("maximumHostsForeachSubnet").textContent = GetNHost(IP, nSubnets) + " (" + (GetNHost(IP, nSubnets) - 1) + " senza gateway).";

    let SubnetsIps = GetAllSubnetsIps(IP, nSubnets);
    let ranges = GetRange(IP, SubnetsIps, nSubnets);
    let usedHosts = GetUsedHosts(IP, SubnetsIps, nSubnets)
    let t = "<tr><th><h5>Indirizzo di rete</h5></th><th><h5>Indirizzo di broadcast</h5></th><th><h5>Indirizzo di gateway</h5></th><th><h5>Range</h5></th></tr>";
    for (let i = 0; i < SubnetsIps.length; i++){
        let tr = "<tr>";
        tr += "<td>" + SubnetsIps[i].networkIp + "</td>";
        tr += "<td>" + SubnetsIps[i].broadcasIp + "</td>";
        tr += "<td>" + SubnetsIps[i].gatewayIp + "</td>";
        tr += '<td class="tooltipx">' + ranges[i].innerHTML + '<span class="tooltiptextx nonewline">' + usedHosts[i].innerHTML + '</span></td>';
        tr += '<td> <canvas id="canvas' + i + '" width="0" height="0"></canvas> </td>';
        tr += "</tr>";
        t += tr;
    }
    document.getElementById("Table").innerHTML = t;
    DrawPiesChart(IP, nSubnets);
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
        console.log(str + " is not a valid IP!");
        return null;
    }

    let octects = str.split('.');

    let binaryIP = OctectToBinary(parseInt(octects[0])) + "." + OctectToBinary(parseInt(octects[1])) + "." + OctectToBinary(parseInt(octects[2])) + "." + OctectToBinary(parseInt(octects[3]));
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

    let subnetMask = GetSubnetMask(IP, nSubnets);
    let idkMask = subnetMask.split(".");
    let idkIP = IP.split(".");
    
    let magicNumber;
    let index;
    let firstPartIP = "";

    for(let i = 0; i < idkMask.length; i++){
        if(idkMask[i] != "255" && idkMask[i] != "0"){
            magicNumber = 256 - idkMask[i];
            index = i;
            break;
        }
    }

    for(let i = 0; i < index; i++){
        firstPartIP += idkIP[i] + ".";
    }

    let nOctectMissing = 4 - (index + 1);
    let secondPartNetworkIp = "";
    let secondPartBroadcastIp = "";
    let secondPartGatewayIp = "";
    for(let i = 0; i < nOctectMissing; i++){

        if(i == nOctectMissing - 1){
            secondPartNetworkIp += ".0";
            secondPartBroadcastIp += ".255";
            secondPartGatewayIp += ".1";
        }else{
            secondPartNetworkIp += ".0";
            secondPartBroadcastIp += ".255";
            secondPartGatewayIp += ".0";
        }
    }

    if(GetIPClass(IP) == "Classe C"){
        secondPartGatewayIp = 1;
    }

    console.log("index: " + index + ". nOctectMissing: " + nOctectMissing + ". magic number: " + magicNumber);
    //da sistemare (link un po' utile)
    //https://community.infosecinstitute.com/discussion/67245/quick-subnetting-all-in-your-head#:~:text=To%20find%20the%20magic%20number,interesting%20octet%20in%20the%20mask.&text=Next%20you%20need%20to%20take,octet%20in%20the%20IP%20address.
    //Casi speciali (tipo):
    //fare in modo che in alcuni casi bisgona tornare all'ottetto prima e incrementare di 1 e poi ricominciare
    //fare in modo tale che l'indirizzo di gateway prendi uno giusto e non solo quello dopo ( magic number = 2) spostarsi all'ottetto successivo
    let subnetsIps = [];
    for(let i = 0; i < nSubnets; i++){

        var subnet = {
            networkIp: firstPartIP + (i * magicNumber) + secondPartNetworkIp,
            broadcasIp: firstPartIP + ( (i * magicNumber) + (magicNumber - 1) ) + secondPartBroadcastIp,
            gatewayIp: firstPartIP + ((i * magicNumber) + secondPartGatewayIp),
            usedIps: []
        }

        subnetsIps[i] = subnet;
    }
    
    console.log(subnetsIps);
    return subnetsIps;
}

function GetRange(IP, subnets, nSubnets){
    let ranges = [];
    let subnetsNHost = GetSubnetsHosts();

    for(let i = 0; i < subnetsNHost.length; i++){
        let networkAddress = subnets[i].networkIp;

        let splittedNetworkAddress = networkAddress.split('.');
        let lastNetworkOctect = parseInt(splittedNetworkAddress[3]) + 1;
        if(lastNetworkOctect == subnets[i].gatewayIp.split('.')[3]){
            lastNetworkOctect = parseInt(lastNetworkOctect) + 1;
        }

        let firstRange = splittedNetworkAddress[0] + "." + splittedNetworkAddress[1] + "." + splittedNetworkAddress[2] + "." + lastNetworkOctect;

        let broadcastAddress = subnets[i].broadcasIp;
        let splittedBroadcastAddress = broadcastAddress.split('.');
        let lastBroadcastOctect = parseInt(splittedBroadcastAddress[3]) - 1;

        let fourthRange = splittedBroadcastAddress[0] + "." + splittedBroadcastAddress[1] + "." + splittedBroadcastAddress[2] + "." + lastBroadcastOctect;

        let string = document.createElement("td");
        string.textContent = firstRange + " - " + fourthRange;       

        let subnetMask = GetSubnetMask(IP, nSubnets);
        let idkMask = subnetMask.split(".");
        let index;
    
        for(let i = 0; i < idkMask.length; i++){
            if(idkMask[i] != "255" && idkMask[i] != "0"){
                index = i;
                break;
            }
        }
        
        ranges[i] = string;
    }

    return ranges;
}

function GetUsedHosts(IP, subnets, nSubnets){
    let ranges = [];
    let subnetsNHost = GetSubnetsHosts();

    let subnetMask = GetSubnetMask(IP, nSubnets);
    let idkMask = subnetMask.split(".");
    let index;

    for(let i = 0; i < idkMask.length; i++){
        if(idkMask[i] != "255" && idkMask[i] != "0"){
            index = i;
            break;
        }
    }

    for(let i = 0; i < subnetsNHost.length; i++){


        let networkAddress = subnets[i].networkIp;

        let splittedNetworkAddress = networkAddress.split('.');
        let lastOctect = parseInt(splittedNetworkAddress[3]) + 1;
        if(lastOctect == subnets[i].gatewayIp.split('.')[3]){
            lastOctect = parseInt(lastOctect) + 1;
        }

        let firstRange = splittedNetworkAddress[0] + "." + splittedNetworkAddress[1] + "." + splittedNetworkAddress[2] + "." + lastOctect;

        let binaryIP = IPToBinary(subnets[i].gatewayIp).split('.');
        let hostID = OctectToBinary(lastOctect);

        console.log(binaryIP.toString().split('0'));

        console.log("subnetsnhost: " + subnetsNHost[i])

        for(let j = 0; j < subnetsNHost[i] - 1; j++){ 
            hostID = addBinary(hostID, "1")
        }

        if(hostID.toString().length > 16){
            hostID = hostID.toString().substring(0, hostID.length - 16) + "." + hostID.toString().substring(hostID.length - 16, hostID.length - 8) + "." + hostID.toString().substring(hostID.length - 8, hostID.length);
        }
        else if(hostID.toString().length > 8){
            hostID = hostID.toString().substring(0, hostID.length - 8) + "." + hostID.toString().substring(hostID.length - 8, hostID.length);
        }

        let joinedIP = binaryIP[0] + "." + binaryIP[1] + "." + binaryIP[2] + "." + binaryIP[3];
        let result = joinedIP.toString().slice(0 , joinedIP.length - hostID.length) + hostID;
        let finalResult = result.split('.');

        for(let j = 0; j < finalResult.length; j++){
            if(finalResult[j].length > 3){
                finalResult[j] = parseInt(finalResult[j], 2);
            }
        }

        finalResult = finalResult.join('.');

        let tooltip = document.createElement("span");
    
        if(subnetsNHost[i] > 1){
            tooltip.textContent = "Range di indirizzi host assegnati: " + firstRange + " - " + finalResult;
        }
        else{
            tooltip.textContent = "Indirizzo host assegnato: " + firstRange;
        }

        ranges[i] = tooltip;   
    }
    return ranges;  
}

function DrawPiesChart(IP, nSubnets){
    let nUsedHosts = GetSubnetsHosts();

    for(let i = 0; i < nSubnets; i++){
        let nRemainingHost = GetNHost(IP, nSubnets) - nUsedHosts[i];

console.log(GetNHost(IP, nSubnets));    

        let canvas = document.getElementById("canvas" + i);
        let ctx = canvas.getContext('2d');
        let chart = new Chart(ctx, {
            type: 'pie',
            data : {
                labels:[ 
                    'Red',
                    'Blue',
                  ],
                  datasets: [{
                    label: 'My First Dataset',
                    data: [nRemainingHost, nUsedHosts[i]],
                    backgroundColor: [
                      'rgb(255, 99, 132)',
                      'rgb(54, 162, 235)',
                    ],
                    hoverOffset: 4,
                  }]
                }
            });
        
    }
}

function GetSubnetsHosts(){
    let data = [];
    let counter = 0;
    let textboxes = document.getElementsByTagName("input");
    Array.from(textboxes).forEach(element => {
        if(element.id.includes("hostsSubnet")){
            data[counter] = element.value;
            counter++;
        }
    })
    return data;
}

function halfAdder(a, b){
    const sum = xor(a,b);
    const carry = and(a,b);
    return [sum, carry];
  }  
function fullAdder(a, b, carry){
    halfAdd = halfAdder(a,b);
    const sum = xor(carry, halfAdd[0]);
    carry = and(carry, halfAdd[0]);
    carry = or(carry, halfAdd[1]);
    return [sum, carry];
}  

  function xor(a, b){return (a === b ? 0 : 1);}
  function and(a, b){return a == 1 && b == 1 ? 1 : 0;}
  function or(a, b){return (a || b);}
  
function addBinary(a, b){
    var result = "",
    carry = 0;

while(a || b || carry){
  let sum = +a.slice(-1) + +b.slice(-1) + carry; // get last digit from each number and sum 

  if( sum > 1 ){  
    result = sum%2 + result;
    carry = 1;
  }
  else{
    result = sum + result;
    carry = 0;
  }
  
  // trim last digit (110 -> 11)
  a = a.slice(0, -1)
  b = b.slice(0, -1)
}

return result;
}