import { useState ,useEffect} from "react";
import axios from "axios";
import '../App.css';

export const TaskAllocator=()=>{
    const [task, setTask] = useState("");
    const [team, setTeam] = useState("");
    const [error, setError] = useState("");
    const [tableData, setTableData] = useState([]);
    const [viewToggler, setviewToggler] = useState(false);
    let Array=[];
    useEffect(()=>{

    },[viewToggler])

    const submitHandler = (e) => {
        e.preventDefault();
        if(task === "" || team === "Select" ){ setError("You must select a team for allocation of your task");}
        else {
            axios
                .post("http://localhost:4000/allocation", {task, team})
                .then((res) => {
                    if (res.statusText === 'OK') {
                        return res.data
                    }
                })
                .then(data => {
                    Array.push({teamName : data.value.teamName,teamMember:data.value.teamMember,load:data.value.load});
                    console.log(Array);
                    setTableData([...tableData,...Array]);
                    })
                .catch((err) => console.log(err));
        }
    };
    const resetHandler=()=>{
        axios
            .post("http://localhost:4000/serverReset", {task, team})
            .then((res) => {
                if (res.statusText === 'OK') {
                    setTableData([]);
                    Array=[];
                    setError("");
                    setTeam("");
                    setTask("");
                    return res.data
                }
            })
            .then(data => console.log(data))
            .catch((err) => console.log(err));
    }
    const changeHandler = (e) => {
        if (e.target.id === "task") {
            setTask(e.target.value);
            setError("");
        }
        if (e.target.id === "team") {
            setTeam(e.target.value);
            setError("");
        }
    };
    const ViewHandler=()=>{
        if(tableData.length ===0){setError("Nothing to view ! Please add Data first")}
        else{setError("");setviewToggler(!viewToggler);}
       }
    const values = viewToggler === true && tableData.length !==0  ? tableData.map((data,key)=>{
        return(
            <div key={key}>{data.teamName}--TEAM MEMBER : {data.teamMember}--Load : {data.load}</div>
        )
    }) : null;

    return (
        <>
            <div className='form-container'>
                <h2>Task Allocator</h2>
                {error && <div className='error'>{error}</div>}
        <div className='form'>
        <form  onSubmit={submitHandler}>
            <input id="task" value={task} placeholder='Task' required onChange={changeHandler}></input>
            <select id="team" value={team} onChange={changeHandler}>
                <option>Select</option>
                <option>Team 1</option>
                <option>Team 2</option>
                <option>Team 3</option>
            </select>
            <div><button type="submit">Submit</button></div>
        </form>
            <button onClick={resetHandler}>Reset</button>
            <button onClick={ViewHandler}>View Data</button>
        </div>
                { values && <div className='data'> {values}</div>}

            </div>
        </>
    )
}