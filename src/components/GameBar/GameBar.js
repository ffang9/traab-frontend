import React from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import ReactTooltip from "react-tooltip";

const GameBar = ( { timerBegan, timer, userId, roomId, phase, playerList, subroom, team, role, amLeader, amGambler, haveLeader, haveHostageThisTurn, leaderVoteHandler, gambleHandler, abdicateHandler, hostageHandler } ) => {

    let borderColor; // different color schemes depending on what team is assigned
    if (team==="Blue") {
        borderColor = "b--dark-blue"
    } else if (team==="Red") {
        borderColor = "b--dark-red"
    } else {
        borderColor = "b--mid-gray"
    }

    let teamColor;
    if (team==="Blue") {
        teamColor = "blue";
    } else if (team==="Red") {
        teamColor = "red";
    } else {
        teamColor = "silver";
    }

    const phaseChangeAnimation = () => {
        if (phase === "Lobby Phase") {
            return (timer < 1 && timerBegan) ? "animate__slideOutRight " : "animate__slideInRight "; // if timer has stopped, then you should fade out
        } else if (phase === "Round 1") {
            return "animate__slideInRight "
        } else {
            return ""
        }
    }

    const getRoleToolTip = () => { // could be improved by putting it in a different format
        if (role === "Bomber") {
            return <div>Try to find out who the president is<br></br><br></br>If you are in the same room as the<br></br>president by the end of the game,<br></br>you win</div>
        } else if (role === "President") {
            return <div>Try to find out who the bomber is<br></br><br></br>If you are not in the same room<br></br>as the bomber by the end of the<br></br>game, you win</div>
        } else if (role === "Gambler") {
            return <div>Try to figure out who the president<br></br>and bomber are<br></br><br></br>Pick a team and if they win, you<br></br>also win</div>
        } else if (role === "Citizen") {
            if (team === "Red") {
                return <div>Try to help the bomber find out<br></br>who the president is.<br></br><br></br>If the bomber is in the same room<br></br>as the president by the end of the<br></br>game, you win</div>
            } else if (team === "Blue") {
                return <div>Try to help the president find out<br></br>who the bomber is.<br></br><br></br>If the president is not in the same<br></br>room as the bomber by the end of<br></br>the game, you win</div>
            }
        }
    }

    const renderGameInfo = () => {
        if (phase !== "Lobby Phase" && phase !=="Game Over") {
            return (
                <div>
                    <p>Room {subroom}</p>
                    {role !== "Citizen" ? // if the player is citizen just display their team instead
                    <p>Your role is: <span className={`fw6 ${teamColor}`} data-tip data-for="registerTip">{role}</span></p> : 
                    <p>You're on team <span className={`fw6 ${teamColor}`}>{team}</span></p>}
                    {amLeader && <p>You are currently the leader of the room!</p>}
                    <ReactTooltip id="registerTip" place="left" effect="float" multiline={true}>
                        {getRoleToolTip()}
                    </ReactTooltip>
                </div>
            )
        }
    }

    const renderLeaderVote = () => {
        if (!amLeader && phase !== "Lobby Phase" && phase !=="Game Over") {
            return (
                <div className="w-100 mt3 mb3">
                    <form id="leaderVote" onSubmit={leaderVoteHandler}>
                        <label className="db mt1 tc" for="leaderVote">{haveLeader ? "Usurp the Leader:" : "Choose a leader:"}</label>
                        <select className="w-100 mt1 mb1" name="leaderVote" id="leaderVote" >
                            {playerList.map(({ _id, userName, leader, subroom:inScopeSubroom }, i) => {
                                if (subroom === inScopeSubroom && (_id !== userId || haveLeader) && !leader) {
                                    return <option value={_id} key={i}>{userName}</option>
                                }
                            })}
                        </select>
                        <button class="w-100 f6 glow-hover o-70 ba bw1 br2 ph3 pv1 mt1 mb1 dib mid-gray" form="leaderVote" type="submit">Vote</button>
                    </form>
                </div>
            )
        }
    }

    const renderAbdicate = () => {
        if (amLeader && phase !== "Lobby Phase" && phase !=="Game Over") {
            return (
                <div className="w-100 mt3 mb3">
                    <form id="abdicateVote" onSubmit={abdicateHandler}>
                        <label className="db mt1 tc" for="abdicateVote">Hand over power:</label>
                        <select className="w-100 mt1 mb1" name="abdicateVote" id="abdicateVote" >
                            {playerList.map(({ _id, userName, leader, subroom:inScopeSubroom }, i) => {
                                if (subroom === inScopeSubroom && _id !== userId && !leader) {
                                    return <option value={_id} key={i}>{userName}</option>
                                }
                            })}
                        </select>
                        <button class="w-100 f6 glow-hover o-70 ba bw1 br2 ph3 pv1 mt1 mb1 dib mid-gray" form="abdicateVote" type="submit">Abdicate</button>
                    </form>
                </div>
            )
        }
    }

    const renderHostagePick = () => {
        if (amLeader && !haveHostageThisTurn && phase !== "Lobby Phase" && phase !=="Game Over") {
            return (
                <div className="w-100 mt3 mb3">
                    <form id="hostagePick" onSubmit={hostageHandler}>
                        <label className="db mt1 tc" for="hostagePick">Pick a hostage:</label>
                        <select className="w-100 mt1 mb1" name="hostagePick" id="hostagePick" >
                            {playerList.map(({ _id, userName, leader, subroom:inScopeSubroom }, i) => {
                                if (subroom === inScopeSubroom && !leader) {
                                    return <option value={_id} key={i}>{userName}</option>
                                }
                            })}
                        </select>
                        <button class="w-100 f6 glow-hover o-70 ba bw1 br2 ph3 pv1 mt1 mb1 dib mid-gray" form="hostagePick" type="submit">Confirm</button>
                    </form>
                </div>
            )
        }
    }

    const renderGamblerPick = () => {
        if (amGambler && phase !== "Lobby Phase" && phase !=="Game Over") {
            return (
                <div className="w-100 mt3 mb3">
                    <form id="gambleChoice" onSubmit={gambleHandler}>
                        <label className="db mt1 tc" for="gambleChoice">Pick a team:</label>
                        <select className="w-100 mt1 mb1" name="gambleChoice" id="gambleChoice" >
                            <option value="Blue">Blue Team</option>
                            <option value="Red">Red Team</option>
                        </select>
                        <button class="w-100 f6 glow-hover o-70 ba bw1 br2 ph3 pv1 mt1 mb1 dib mid-gray" form="gambleChoice" type="submit">Gamble</button>
                    </form>
                </div>
            )
        }
    }

    const renderInviteInfo = () => {
        if (phase === "Lobby Phase") {
            return (
                <div className="w-100 flex flex-column items-center">
                    <p className="fw6 tc">Lobby for room</p>
                    <button className="f6 pointer glow-hover o-70 ba ph3 pv1 mb2 br1 dib black bg-white shadow-1" onClick={copyRoomLink}>{roomId}</button>
                    <p className="tc">Give the code to your friends, or click for an invite link</p>
                </div>
            )
        }
    }

    const copyRoomLink = () => {
        const roomLink = `https://traab-backend.herokuapp.com/room/${roomId}`
        navigator.clipboard.writeText(roomLink);
    }

    return (
        <section className={`animate__animated ${phaseChangeAnimation()}w-15`}>
            <div className={`h-100 w-100 mb5`}>
                <ScrollToBottom className={`h-100 w-100 pa2 ba br1 ${borderColor} bg-dark-opaque shadow-1 f6`}>
                    {renderGameInfo()}
                    {renderLeaderVote()}
                    {renderAbdicate()}
                    {renderHostagePick()}
                    {renderGamblerPick()}
                    {renderInviteInfo()}
                </ScrollToBottom>
            </div>
        </section>
    )

}

export default GameBar;