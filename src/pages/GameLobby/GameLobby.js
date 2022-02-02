import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom"
import Modal from 'react-modal';

import "animate.css";
import "./GameLobby.scss"

import CreateGameModal from "../../components/CreateGameModal/CreateGameModal";
import JoinGameModal from "../../components/JoinGameModal/JoinGameModal";
import HowToPlay from "../../components/HowToPlay/HowToPlay";

import bgDesktop from "../../assets/images/bg-desktop.jpg"
import traab from "../../assets/images/traab.png"
import bomb1 from "../../assets/images/bomb1.png"
import githubIcon from "../../assets/images/github-icon.png"

const ENDPOINT = "https://traab-backend.herokuapp.com:8080";

const customStyles = {
    overlay: {
        backgroundColor: 'rgba(0,0,0,0)' // remove the weird background color
    },
    content: {
        top: '50%', // these seem to center the modal box
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        background: 'rgba(0, 0, 0, 0.9)', // slight transparency
        borderRadius: '0.5rem',
        overflow: 'hidden',
        padding: '0rem'
    },
};

Modal.setAppElement(document.getElementById('root')); // not 100% about this line, gotta look more into it

const GameLobby = () => {
    const [createGameModalIsOpen, setCreateGameModalIsOpen] = useState(false);
    const [joinGameModalIsOpen, setJoinGameModalIsOpen] = useState(false);
    const [playerLimit, setPlayerLimit] = useState(10);
    const [roundCount, setRoundCount] = useState("3");
    const [timeLimit, setTimeLimit] = useState("180");

    const [bombAnimation, setBombAnimation] = useState("");
    const [traabAnimation, setTraabAnimation] = useState("");
    const [createGameAnimation, setCreateGameAnimation] = useState("");
    const [joinGameAnimation, setJoinGameAnimation] = useState("");
    const [howToPlayAnimation, setHowToPlayAnimation] = useState("");

    const canvasRef = useRef(null);
    const bombImgRef = useRef(null);
    const howToRef = useRef(null);

    let createCircles;
    
    useEffect(() => { // animation stuff should happen on mount
        setBombAnimation("animate__animated animate__rollIn ")
        setTraabAnimation("animate__animated animate__zoomIn ")
        setCreateGameAnimation("animate__animated animate__fadeInTopLeft ")
        setJoinGameAnimation("animate__animated animate__fadeInTopRight ")
        setHowToPlayAnimation("animate__animated animate__bounceInUp ")

        setTimeout(() => { // avoid animation conflict
            setBombAnimation("animate__animated animate__pulse animate__infinite ")
            setCreateGameAnimation("");
            setJoinGameAnimation("");
            setHowToPlayAnimation("");
        }, 1000)
    }, [])

    const bombExplodeAnim = () => {
        // code belong is canvas animation, subject to heavy change in the future, taken and modified from https://speckyboy.com/explosions-in-web-design/
        const canvas = canvasRef.current;
        const c = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const bombImgLocation = {
            x: bombImgRef.current.getBoundingClientRect().left,
            y: bombImgRef.current.getBoundingClientRect().bottom
        };
        console.log(bombImgRef.current.getBoundingClientRect().left)
        console.log(bombImgRef.current.getBoundingClientRect().bottom)
        let circles = [];
        let colors = ["#FF9666", "#FFE184", "#F5E9BE"];
        createCircles = (amount) => {
            for (let i = 0; i < amount; i++) {
            let radius = Math.random() * 30;
            let color = colors[Math.floor(Math.random() * colors.length)];
            circles.push(new Circle(bombImgLocation.x, bombImgLocation.y, radius, color));
            }
        }
        function Circle(x, y, radius, color) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.color = color;
            this.velocity = {
            x: (Math.random() * 70 - 35),
            y: (Math.random() * 70 - 35),
            };
            this.isAlive = true;
            this.update = function () {
            if (
                this.x - this.radius > canvas.width ||
                this.x + this.radius < 0 ||
                this.y - this.radius > canvas.height ||
                this.y + this.radius < 0
            ) {
                this.isAlive = false;
            }
            this.x += this.velocity.x;
            this.y += this.velocity.y;
            this.draw();
            };
            this.draw = function () {
            c.beginPath();
            c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            c.fillStyle = this.color;
            c.fill();
            c.closePath();
            };
        }
        let timer = 0;
        function animate() {
            window.requestAnimationFrame(animate);
            timer += 1;
            c.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < circles.length; i++) {
            if (circles[i].isAlive === false) circles.splice(i, 1);
        
            // Placed below splice since having it above caused circles to flash
            if (circles[i] !== undefined) circles[i].update();
            }
        }
        animate();
        createCircles(500);
        const fadeOverTime = setInterval(() => { // fade over time to make the explosion look a bit cooler
            c.globalAlpha = c.globalAlpha - 0.1
            if (c.globalAlpha <=0) {
                clearInterval(fadeOverTime);
            }
        }, 100);
        // end of canvas code
    }

    const history = useHistory();

    const openCreateGameModal = () => {
        setCreateGameModalIsOpen(true);
    }

    const closeCreateGameModal = () => {
        setCreateGameModalIsOpen(false);
    }

    const openJoinGameModal = () => {
        setJoinGameModalIsOpen(true);
    }

    const closeJoinGameModal = () => {
        setJoinGameModalIsOpen(false);
    }

    const fadeEverything = () => {
        setBombAnimation("o-0 "); // bomb explodes so it becomes invisible
        setTraabAnimation("animate__animated animate__hinge ");
        setCreateGameAnimation("animate__animated animate__zoomOutDown ");
        setJoinGameAnimation("animate__animated animate__zoomOutDown ");
        setHowToPlayAnimation("animate__animated animate__fadeOutDown ");
    }

    const joinRoomHandler = (e) => {
        e.preventDefault();
        if(e.target.joinGameInput.value) {
            window.scrollTo(0, 0);
            closeJoinGameModal();
            fadeEverything();
            bombExplodeAnim();
            setTimeout(() => {
                history.push(`/room/${e.target.joinGameInput.value}`)
            }, 2000);
        }
    }

    const createRoomHandler = (e) => {
        e.preventDefault();
        window.scrollTo(0, 0);
        closeCreateGameModal();
        fadeEverything();
        bombExplodeAnim();
        axios.post(`${ENDPOINT}/room`, { playerLimit, roundCount, timeLimit })
        .then((res)=> {
            setTimeout(() => {
                history.push(`/room/${res.data}`)
            }, 2000);
        })
        .catch(error => (`Error: ${error}`));
    }

    const playerLimitValueHandler = (e) => {
        setPlayerLimit(e.target.value);
    }

    const roundCountValueHandler = (e) => {
        setRoundCount(e.target.value);
        setTimeLimit(timeLimit)
    }

    const timeLimitValueHandler = (e) => {
        setTimeLimit(e.target.value);
    }

    const howToHandler = () => {
        window.scrollTo({ top:howToRef.current.getBoundingClientRect().top + window.scrollY, behavior: 'smooth' });
    }

    return (
        <div>
            <section style={{ backgroundImage:`url(${bgDesktop})` }} className="overflow-hidden vh-100 dt w-100 relative tc bg-dark-gray white cover bg-center">
                <canvas ref={canvasRef} className="z-1 absolute"></canvas>
                <Link to={{ pathname: "https://github.com/ffang9/traab" }} target="_blank">
                    <img className="z-1 absolute h2 w2 top-1 left-1" src={githubIcon}></img>
                </Link>
                <div className="relative z-0 dtc v-mid" >
                    <div className={`${bombAnimation}flex justify-center ml6 mt3`}>
                        <img ref={bombImgRef} className="db h4 w4"src={bomb1}></img>
                    </div>
                    <Link to={{ pathname: "https://www.tuesdayknightgames.com/tworoomsandaboom" }} target="_blank">
                        <img className={`${traabAnimation}`} src={traab} alt="traab logo"></img>
                    </Link>
                    <div className="mt5 flex justify-center">
                        <a onClick={openCreateGameModal} className={`${createGameAnimation}f2 glow-yellow grow pointer fw9 mr7 light-yellow`}>CREATE GAME</a>
                        <Modal
                            closeTimeoutMS={500} 
                            isOpen={createGameModalIsOpen}
                            onRequestClose={closeCreateGameModal}
                            style={customStyles}
                            contentLabel="Create Game Lobby"
                        >
                            <CreateGameModal 
                                playerLimit={playerLimit}
                                roundCount={roundCount}
                                timeLimit={timeLimit}
                                playerLimitValueHandler={playerLimitValueHandler} 
                                roundCountValueHandler={roundCountValueHandler} 
                                timeLimitValueHandler={timeLimitValueHandler} 
                                createRoomHandler={createRoomHandler} 
                                closeCreateGameModal={closeCreateGameModal}
                            />
                        </Modal>
                    </div>
                    <div className="mt4 flex justify-center">
                        <a onClick={openJoinGameModal} className={`${joinGameAnimation}f2 glow-yellow grow pointer fw9 ml7 light-yellow`}>JOIN GAME</a>
                        <Modal
                            closeTimeoutMS={500} 
                            isOpen={joinGameModalIsOpen}
                            onRequestClose={closeJoinGameModal}
                            style={customStyles}
                            contentLabel="Create Game Lobby"
                        >
                            <JoinGameModal
                                joinRoomHandler={joinRoomHandler}
                                closeJoinGameModal={closeJoinGameModal}
                            />
                        </Modal>
                    </div>
                    <p onClick={howToHandler}className={`${howToPlayAnimation}glow o-70 grow pointer mt6 f4 light-red fw6`}>How To Play</p>
                </div>
            </section>
            <HowToPlay howToRef={howToRef} />
        </div>
    )
}

export default GameLobby;