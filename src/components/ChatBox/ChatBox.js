import React from "react";
import ScrollToBottom from "react-scroll-to-bottom";

const ChatBox = ( { timerBegan, timer, messages, message, phase, team, messageInputHandler, sendMessageKeyHandler } ) => {

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
        return (timer < 1 && timerBegan) ? "animate__fadeOutRight " : "animate__fadeInLeft "; // if timer has stopped, then you should fade out
    }

    return (
        <section className="animate__animated animate__slideInUp h-100 w-65">
            <div className={`flex items-center justify-center pa2 br--top br1 ${bannerColor}`}>
                <span key={phase} className={`animate__animated ${phaseChangeAnimation()}lh-title fw6`}>{phase}</span>
            </div>
            <ScrollToBottom className={`h-90 w-100 pa2 pl3 bl br ${borderColor} bg-dark-opaque shadow-1 flex flex-column justify-end`}>
                {messages
                .filter(({ phase:messagePhase }) => { // filter out the ones that are not from the current phase
                    return phase === messagePhase;
                })
                .map(({ userName, text }, i) => { // map them out onto the screen
                    if (userName === "Event") {
                        return <p key={i} className="mb0 f6 yellow">{text}</p>
                    }
                    return <p key={i} className="mb0 f6"><span className="silver">{`${userName}: `}</span>{text}</p>
                })}
            </ScrollToBottom>
            <div className={`w-100 pa2 pl3 pr3 br--bottom br1 ${bannerColor}`}>
                <input className={`w-100 ba b--black-20 br2 pa1 db bg-moon-gray`}
                placeholder="" 
                type="text" 
                onChange={messageInputHandler}
                onKeyPress={sendMessageKeyHandler}
                value={message}></input>
            </div>
        </section>
    )
}

export default ChatBox;