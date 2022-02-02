import React from "react";

import traabOfficial from "../../assets/images/traabOfficial.jpeg"

const HowToPlay = ( { howToRef } ) => {

    const goBackHandler = () => {
        window.scrollTo({ top:0, behavior: 'smooth' });
    }

    return (
        <section className="sans-serif vh-100 dt w-100 black">
            <article ref={howToRef} className="cf ph3 ph5-ns pv2">
                <header className="tc ph4 mb4">
                    <h1 className="f3 f2-m f1-l fw5 black-90 mv3">
                        How to Play
                    </h1>
                </header>
                <div className="flex flex-wrap justify-around items-center">    
                    <img className=" b--dark-blue ba br3 bw2" src={traabOfficial}></img>
                    <div>
                        <p className="lh-copy measure mt4 mt0-ns">
                            In Two Rooms and a Boom there are <span className="b">2 teams and 2 rooms</span>. 
                            The 2 teams are the <span className="dark-blue b">Blue Team</span> and the <span className="dark-red b">Red Team</span>. 
                            The <span className="dark-blue b">Blue Team has a President</span>. 
                            The <span className="dark-red b">Red Team has a Bomber</span>. Players are first equally distributed between 
                            2 separate rooms and then each player is randomly assigned a role.
                        </p>
                        <p className="lh-copy measure">
                            Players play the game by saying what they want in order to select a <span className="b">leader</span> for their room. 
                            The leader chooses <span className="b">hostages</span> (players who will be sent to the other room at the end of the round).
                        </p>
                        <p className="lh-copy measure">
                            The game usually consists of <span className="b">3 timed rounds</span>. Each round is shorter than the previous round. 
                            At the end of each round, the hostages selected by the leaders will be traded into opposing rooms.
                        </p>
                        <p className="b lh-copy measure">
                            The game ends after the last hostage exchange.
                        </p>
                        <p className="lh-copy measure">
                            Everyone reveals their card. If Red Team’s Bomber is in the same room as the President, 
                            then the Red Team wins. Otherwise the Blue Team wins. 
                        </p>
                    </div>
                </div>
                <div className="flex justify-center">
                    <button onClick={goBackHandler} className="f6 link dim ba bw2 ph3 pv2 mb2 dib black mt4">Back to top</button>
                </div>
            </article>
        </section>
    )
}

export default HowToPlay