import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom"
import io from "socket.io-client";

import Timer from "../../components/Timer/Timer"; 
import PlayerList from "../../components/PlayerList/PlayerList"; 
import ChatBox from "../../components/ChatBox/ChatBox";
import GameBar from "../../components/GameBar/GameBar"; 

import bgDesktop from "../../assets/images/bg-desktop.jpg"
import githubIcon from "../../assets/images/github-icon.png"

let socket;

const GameRoom = ( props ) => {
    const [userId, setUserId] = useState("");
    const [roomId, setRoomId] = useState("");
    const [message, setMessage] = useState(""); // the message current being typed
    const [incomingMessage, setIncomingMessage] = useState(""); // when a message is received
    const [messages, setMessages] = useState([]); // all messages in this game
    const [playerList, setPlayerList] = useState([]); // player list bar
    const [team, setTeam] = useState(""); // what team the player is on
    const [role, setRole] = useState(""); // the player's role
    const [subroom, setSubroom] = useState(0); // which subroom currently in
    const [timerBegan, setTimerBegan] = useState(false);
    const [timer, setTimer] = useState(1000);
    const [phase, setPhase] = useState("");
    const [amGambler, setAmGambler] = useState(false);
    const [amLeader, setAmLeader] = useState(false);
    const [haveLeader, setHaveLeader] = useState(false);
    const [haveHostageThisTurn, setHaveHostageThisTurn] = useState(false);
    const [joinAccepted, setJoinAccepted] = useState(false);
    const ENDPOINT = "https://traab-backend.herokuapp.com";

    const history = useHistory();

    useEffect(() => {
        const linkRoomId = props.match.params.id;

        socket = io(ENDPOINT);

        setRoomId(linkRoomId);

        socket.emit("requestJoin", { roomId:linkRoomId });

        socket.on("roomExists", (result) => {
            setUserId(result.userId);
            setJoinAccepted(true);
        })

        socket.on("roomFull", ()=> {
            alert("Room is full");
        })

        socket.on("roomIsInvalid", ()=> {
            alert("Room is Invalid");
        })

        socket.on("roomOver", ()=> {
            alert("Room has already finished the game");
        })

        socket.on("roomIsInProgress", ()=> {
            alert("Room is already in progress");
        })
    }, [ENDPOINT, props.location.search])

    useEffect(() => {
        setMessages([...messages, incomingMessage])
    }, [incomingMessage])

    useEffect(() => {
        playerList.forEach((player) => {
            if (player.leader && player.subroom === subroom) {
                setHaveLeader(true);
            }
            if (player._id === userId && player.leader) {
                setAmLeader(true); //
            } else if (player._id === userId && !player.leader) {
                setAmLeader(false); //
            }
        })
    }, [playerList])

    useEffect(() => {
        if (joinAccepted) {
            socket.emit("join", { roomId: roomId, userId:userId });

            socket.on("oldMessageList", (result)=> {
                setMessages(result); // receive the trimmed old message list
            })

            socket.on("playerListUpdate", (result) => {
                setPlayerList(result);
            })

            socket.on("timerRunning", (value) => {
                setTimerBegan(value); // value is a boolean
            });

            socket.on("timerUpdate", (countDownTimer) => {
                setTimerBegan(true);
                setTimer(countDownTimer);
            });

            socket.on("phaseChange", (phase) => {
                setPhase(phase);
            });

            socket.on("assignSubroom", (subroom) => {
                setSubroom(subroom);
            });

            socket.on("assignRole", (role) => {
                setRole(role);
            });

            socket.on("assignTeam", (team) => {
                setTeam(team);
            });

            socket.on("haveHostageThisTurn", () => {
                setHaveHostageThisTurn(true);
            })

            socket.on('message', (message) => {
                setIncomingMessage(message);
            })

            socket.on("noLongerHaveHostageThisTurn", () => {
                setHaveHostageThisTurn(false);
            })

            socket.on("gameFinished", () => {
                history.push("/");
            })
        }
    }, [joinAccepted])

    useEffect(() => {
        if (role === "Gambler") {
            setAmGambler(true);
        }
    }, [role])

    useEffect(() => {
        setHaveHostageThisTurn(false);
    }, [phase])

    const messageInputHandler = (e) => {
        setMessage(e.target.value);
    }

    const sendMessageKeyHandler = (e) => {;
        if (e.key === "Enter") {
            if (message) {
                socket.emit("sendMessage", { message, userId, roomId, phase, subroom });
                setMessage('');
            }
        }
    }

    const leaderVoteHandler = (e) => {
        e.preventDefault();

        socket.emit("leaderVote", { userId, targetId:e.target.leaderVote.value, subroom, roomId } );
    }

    const gambleHandler = (e) => {
        e.preventDefault();

        socket.emit("gambleChoice", { userId, teamChoice:e.target.gambleChoice.value, roomId } );
    }

    const abdicateHandler = (e) => {
        e.preventDefault();

        socket.emit("abdicateVote", { userId, targetId:e.target.abdicateVote.value, subroom, roomId } );
    }

    const hostageHandler = (e) => {
        e.preventDefault();

        socket.emit("hostagePick", { userId, targetId:e.target.hostagePick.value, subroom, roomId } );
    }

    if (phase) {
        return (
            <div style={{ backgroundImage:`url(${bgDesktop})` }} className="overflow-hidden db bg-center cover aspect-ratio--object">
                <Link to={{ pathname: "https://github.com/ffang9/traab" }} target="_blank"><img className="absolute h2 w2 top-1 left-1" src={githubIcon}></img></Link>
                <Timer phase={phase} timerBegan={timerBegan} timer={timer} />
                <br></br>
                <div className="flex justify-between vh-75 pl3 pr3">
                    <PlayerList 
                        timerBegan={timerBegan} 
                        timer={timer} 
                        userId={userId} 
                        playerList={playerList} 
                        phase={phase} 
                        team={team} 
                        subroom={subroom} 
                    />
                    <ChatBox 
                        timerBegan={timerBegan} 
                        timer={timer} 
                        messages={messages} 
                        message={message} 
                        phase={phase} 
                        team={team} 
                        messageInputHandler={messageInputHandler} 
                        sendMessageKeyHandler={sendMessageKeyHandler} 
                    />
                    <GameBar 
                        timerBegan={timerBegan}
                        timer={timer}
                        userId={userId}
                        roomId={roomId}
                        phase={phase}
                        playerList={playerList}
                        subroom={subroom} 
                        team={team} 
                        role={role} 
                        amLeader={amLeader} 
                        amGambler={amGambler} 
                        haveLeader={haveLeader} 
                        haveHostageThisTurn={haveHostageThisTurn} 
                        leaderVoteHandler={leaderVoteHandler}
                        gambleHandler={gambleHandler}
                        abdicateHandler={abdicateHandler}
                        hostageHandler={hostageHandler}
                    />
                </div>
            </div>
        )
    }

    return (
        <div style={{ backgroundImage:`url(${bgDesktop})` }} className="overflow-hidden db bg-center cover aspect-ratio--object">
            <Link to={{ pathname: "https://github.com/ffang9/traab" }} target="_blank"><img className="absolute h2 w2 top-1 left-1" src={githubIcon}></img></Link>
        </div>
    )
}

export default GameRoom;