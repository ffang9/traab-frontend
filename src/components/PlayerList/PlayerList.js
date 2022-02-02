import React from "react";
import ScrollToBottom from "react-scroll-to-bottom";

import crownIcon from "../../assets/images/crown.png"
import disconnectedIcon from "../../assets/images/disconnect.png"

const PlayerList = ( { timerBegan, timer, userId, playerList, phase, team } ) => {

    let bannerColor; // different color schemes depending on what team is assigned
    let borderColor;
    if (team==="Blue") {
        bannerColor = "bg-lg-dark-blue white"
        borderColor = "b--dark-blue"
    } else if (team==="Red") {
        bannerColor = "bg-lg-dark-red white"
        borderColor = "b--dark-red"
    } else {
        bannerColor = "bg-lg-mid-gray white"
        borderColor = "b--mid-gray"
    }

    const phaseChangeAnimation = () => {
        if (phase === "Lobby Phase") {
            return (timer < 1 && timerBegan) ? "animate__slideOutLeft " : "animate__slideInLeft "; // if timer has stopped, then you should fade out
        } else if (phase === "Round 1") {
            return "animate__slideInLeft "
        } else {
            return ""
        }
    }

    const renderOneBox = (phase, subroom) => {

        let titleText;
        if (phase === "Lobby Phase") {
            titleText = "Player List:";
        } else {
            titleText = `Players in Room ${subroom}:`;
        } 

        return (
            <div className={`h-40 w-100 mb5`}>
                <div className={`flex items-center justify-center pa2 br--top br1 ${bannerColor}`}>
                    <span className={`lh-title fw6`}>{titleText}</span>
                </div>
                <ScrollToBottom className={`h-100 w-100 pa2 bl br bb br1 br--bottom ${borderColor} bg-dark-opaque shadow-1 `}>
                    {playerList
                        .filter(({ subroom:subroomInScope}) => { // filter out the people in different rooms first
                            return !subroom ? true : subroomInScope === subroom; 
                        })
                        .map(({ _id, userName, leader, disconnected }, i) => {
                            let playerColor;
                            playerColor = disconnected ? "mid-gray" : userId === _id ? "yellow" : "";
                            return (
                                <p key={i} className={`${playerColor} mt1 mb2 f6 flex items-center`}>{`${userName}`}
                                    {disconnected && <img className="h1 w1 ml1" src={disconnectedIcon} alt="disc icon"></img>}
                                    {leader && <img className="h1 w1 ml1" src={crownIcon} alt="crown icon"></img>}
                                </p>
                            )
                        }) // map them out
                    }
                </ScrollToBottom>
            </div>
        )
    }

    return (
        <section className={`animate__animated ${phaseChangeAnimation()}w-15`}>
            {phase === "Lobby Phase" && renderOneBox(phase)}
            {phase !== "Lobby Phase" && renderOneBox(phase, 1)}
            {phase !== "Lobby Phase" && renderOneBox(phase, 2)}
        </section>
    )

}

export default PlayerList;