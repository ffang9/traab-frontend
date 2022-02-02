import React from "react";

const CreateGameModal = ( { playerLimit, roundCount, timeLimit, playerLimitValueHandler, roundCountValueHandler, timeLimitValueHandler, createRoomHandler, closeCreateGameModal } ) => {
    return (
        <div>
            <h2 className="flex items-center justify-center pa2 br--top br1 bg-lg-mid-gray white mt0 mb0">Create a Lobby</h2>
            <div className="w6 pa3">
                <div className="mt3 mb3">
                    <span className="dib w-30 f4 mr3 fw5">Lobby size:</span>
                    <input className="w-50 mr4" type="range" id="playerLimit" name="playerLimit" onChange={playerLimitValueHandler} min={6} max={14} defaultValue={playerLimit} step={1}></input>
                    <span className="f4 fw5">{playerLimit}</span>
                </div>
                <div className="mt3 mb3">
                    <span className="dib w-30 f4 mr3 fw5">Round count:</span>
                    <input className="w-50 mr4" type="range" id="roundCount" name="roundCount" onChange={roundCountValueHandler} min="2" max="4" defaultValue={roundCount} step="1"></input>
                    <span className="f4 fw5">{roundCount}</span>
                </div>
                <div className="mt3 mb3">
                    <span className="dib w-30 f4 mr3 fw5">Time limit:</span>
                    <input className="w-50 mr4" type="range" id="timeLimit" name="timeLimit" onChange={timeLimitValueHandler} min={"60"} max="300" defaultValue={timeLimit} step="60"></input>
                    <span className="f4 fw5">{timeLimit}</span>
                </div>
                
            </div>
            <div className="br--top br1 bg-lg-mid-gray white">
                <button className="w-50 glow o-70 pa2 bg-lg-dark-blue white fw6 f4 br3 br--bottom br--left" type="button" onClick={createRoomHandler}>Create Room</button>
                <button className="w-50 glow o-70 pa2 bg-lg-dark-red white fw6 f4 br3 br--bottom br--right" onClick={closeCreateGameModal}>Cancel</button>
            </div>
        </div>
    )
}

export default CreateGameModal;