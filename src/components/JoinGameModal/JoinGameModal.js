import React from "react";

const JoinGameModal = ( { joinRoomHandler, closeJoinGameModal } ) => {
    return (
        <div>
            <h2 className="flex items-center justify-center pa2 br--top br1 bg-lg-mid-gray white mt0 mb0">Join a Game</h2>
            <form onSubmit={joinRoomHandler} id="joinGameInputForm" className="w6 pa3 flex flex-column items-center">
                <label className="mt1" htmlFor="joinGameInput">Please enter the room number</label>
                <input className="w-30 mt3 mb3 f2 fw6 tc" maxLength={5} id="joinGameInput" name="joinGameInput"></input>
            </form>
            <div className="br--top br1 bg-lg-mid-gray white">
                <button className="w-50 glow o-70 pa2 bg-lg-dark-blue white fw6 f4 br3 br--bottom br--left" type="submit" form="joinGameInputForm">Join Room</button>
                <button className="w-50 glow o-70 pa2 bg-lg-dark-red white fw6 f4 br3 br--bottom br--right" onClick={closeJoinGameModal}>Cancel</button>
            </div>
        </div>
    )
}

export default JoinGameModal;