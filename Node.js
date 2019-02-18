class Node {
    constructor(id) {
        this.max_wander_offset = 0.3;
        this.wander_theta = random(TWO_PI);
        this.x = random(width);
        this.y = random(height);
        this.size = 30;
        this.r = this.size * 4;
        this.id = id;
        this.neighbors = new Set();
        this.data = [];
        this.recieveData = [];
    }

    findNeighbors(nodes) {
        for (let node of nodes) {
            if (node != this) {
                let d = dist(this.x, this.y, node.x, node.y);
                if (d < this.r) {
                    this.neighbors.add(node);
                } else {
                    this.neighbors.delete(node);
                }
            }
        }
    }

    transmitToNode(data) {
        for (let neighbor of this.neighbors) {
            for (let i = this.data.length - 1; i >= 0; i--) {
                if (!this.data[i].prevID.has(neighbor.id)) {
                    this.data[i].prevID.add(neighbor.id);
                    this.data[i].time = Date.now();
                    neighbor.recieveFromNode(this.data[i]);
                    this.data.splice(i);
                }
            }
        }
    }

    recieveFromNode(data) {
        this.recieveData.push(data);
        if (data.recieverID == this.id) {
            this.accepted(data.senderID, data.createdTime);
            this.recieveData.pop();
        } else {
            this.data.push(this.recieveData.pop());
        }
    }

    createData(dataForNode, id, prevID = new Set()) {
        randomSeed(id);
        let r = random(255);
        let g = random(255);
        let b = random(255);
        prevID.add(this.id);
        let data = {
            color: color(r, g, b),
            data: dataForNode,
            senderID: this.id,
            recieverID: id,
            prevID: prevID,
            time: Date.now(),
            createdTime: Date.now()
        };
        this.data.push(data);
        return data;
    }

    move() {
        randomSeed();
        let wander_offset = random(-this.max_wander_offset, this.max_wander_offset);
        this.wander_theta += wander_offset;

        this.x += cos(this.wander_theta);
        this.y += sin(this.wander_theta);
        this.stayInsideCanvas();
    }

    stayInsideCanvas() {
        if (this.x > width - this.r / 2) {
            this.x = width - this.r / 2;
        } else if (this.x < this.r / 2) {
            this.x = this.r / 2;
        } else if (this.y > height - this.r / 2) {
            this.y = height - this.r / 2;
        } else if (this.y < this.r / 2) {
            this.y = this.r / 2;
        }
    }

    checkData() {
        for (let item of this.data) {
            if (Date.now() - item.time > 10000) {
                item.time = Date.now();
                item.prevID.clear();
                item.prevID.add(this.id);
            }
        }
    }

    accepted(senderID, createdTime) {
        console.log(this.id + " accepted from " + senderID + " and took " + (Date.now() - createdTime) / 1000 + "s");
        let c = color(0, 255, 0);
        fill(c);
        ellipse(this.x, this.y, this.r);
    }

    show() {
        if (this.data.length > 0) {
            for (let i = this.data.length - 1; i >= 0; i--) {
                let c = this.data[i].color;
                fill(c);
                stroke(0);
                ellipse(this.x, this.y, this.r + i * 10);
            }
        }

        for (let neighbor of this.neighbors) {
            line(this.x, this.y, neighbor.x, neighbor.y);
        }

        noStroke();
        randomSeed(this.id);
        let r = random(255);
        let g = random(255);
        let b = random(255);
        fill(color(r, g, b));
        ellipse(this.x, this.y, this.size);

        noFill();
        strokeWeight(1);
        stroke(0);
        ellipse(this.x, this.y, this.r);

    }
}