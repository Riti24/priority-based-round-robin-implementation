const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const { PriorityRoundRobin } = require("round-robin-js");
app.use(cors());
app.use(bodyParser.json());

const availableServers1 = new PriorityRoundRobin(
    (a, b) => a.load - b.load, // select next available server with lowest load
    [
        { teamName: "Team 1",teamMember: 1 ,load: 30 },
        { teamName: "Team 1",teamMember: 2 , load: 50 },
        { teamName: "Team 1",teamMember: 3 ,load: 40 },
    ],
);
const availableServers2 = new PriorityRoundRobin(
    (a, b) => a.load - b.load, // select next available server with lowest load
    [
        { teamName: "Team 2",teamMember: 1 , load: 60 },
        { teamName: "Team 2",teamMember: 2 , load: 80 },
        { teamName: "Team 2",teamMember: 3 ,load: 70 },
    ],
);
const availableServers3 = new PriorityRoundRobin(
    (a, b) => a.load - b.load, // select next available server with lowest load
    [
        { teamName: "Team 2",teamMember: 1 , load: 90 },
        { teamName: "Team 2",teamMember: 2 , load: 100 },
        { teamName: "Team 2",teamMember: 3 , load: 110 },
    ],
);
//app.get("/", (req, res) => res.send("hello"));
app.post("/serverReset", (req, res) => {
    availableServers1.reset();
    availableServers2.reset();
    availableServers3.reset();
    res.send("Servers are reset");
});

app.post("/allocation", (req, res) => {
    switch(req.body.team){
        case 'Team 1' :
            res.send(availableServers1.next());
            break;
        case 'Team 2' :
            res.send(availableServers2.next());
            break;
        case 'Team 3' :
            res.send(availableServers3.next());
            break;
    }
});


app.listen(4000, () => console.log("Hi I am listening to 4000"));

