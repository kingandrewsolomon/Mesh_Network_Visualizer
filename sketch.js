let cWidth = Math.max(document.documentElement.clientWidth, window.innerWidth);
let cHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);

let nodes = [];
let c = 0;

function setup() {
    createCanvas(cWidth, cHeight);
    // createCanvas(300, 300);
    for (let i = 0; i < 70; i++) {
        nodes.push(new Node(i));
    }

    createData();
}

function draw() {
    background(255);
    for (let node of nodes) {
        node.findNeighbors(nodes);
        if (node.neighbors.size > 0 && node.data.length > 0) {
            node.transmitDataToNeighbors();
            node.checkData();
        }

        node.show();
        node.move();
    }

    // let it = Date.now();
    // if (it % 100 == 0) {
    //     console.log(it);
    //     createData();
    // }
}

function mousePressed() {
    createData();
}

function createData() {
    let recieverID = floor(random(nodes.length));
    let senderID = floor(random(nodes.length));
    // console.log("RecieverID: " + recieverID + "\tSenderID: " + senderID);
    if (recieverID != senderID) {
        let data = "asdf";
        nodes[senderID].createData(data, recieverID);
    }
    // console.log(nodes.reduce((acc, curr) => {
    //     return acc + curr.data.length;
    // }, 0)); 
}