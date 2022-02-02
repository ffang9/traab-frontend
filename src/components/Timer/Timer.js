import React from "react";
import "animate.css";

const Timer = ( { phase, timerBegan, timer } ) => {

    const lobbyTimerAnimation = () => {
        return (timer < 1 && timerBegan) ? "animate__bounceOut " : "animate__bounceIn "; // fade out when game is about to start
    }

    const lobbyMessageAnimation = () => {
        return timerBegan ? "animate__bounceOut " : "animate__bounceIn "; // if timer has began, then you should fade out
    }

    const gameTimerAnimation = () => {
        return (timer <= 1 && timerBegan) ? "animate__bounceOut " : timer >= 1 && timer <10 ? "animate__pulse animate__infinite " : "animate__bounceIn ";
        //
    }

    let animation;
    let message = "";
    if (phase === "Lobby Phase") {
        if (timerBegan) {
            animation = lobbyTimerAnimation;
             message = `${timer} seconds before game begins`;
        } else {
            animation = lobbyMessageAnimation;
            message = "Waiting for more players to join";
        }
    } else if (phase === "Game Over") {
        if (timerBegan) {
            animation = "";
            message = `${timer} seconds before room closes`;
        }
    } else {
        if (timerBegan) {
            animation = gameTimerAnimation;
            message = `${timer} seconds left in the round`;
        }
    }

    return (
        <div className="animate__animated animate__slideInDown mw6 mt2 center ba bw b--gray br2 bg-dark-opaque h3 flex items-center justify-center">
            <div key={timerBegan} className={`animate__animated ${animation && animation()}f5 f4-m f3-l fw6 mt0 lh-copy`}>{message}</div>
        </div>
    )

}

export default Timer;