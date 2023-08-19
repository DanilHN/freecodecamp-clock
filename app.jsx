//import React hoooks
const { useEffect } = React;
const { useState } = React;
const { useRef } = React;

//buttons, icons, ids
const buttons = [
    { id: 'start_stop', action: "START_STOP", icon: <i className="fas fa-step-backward fa-lg"></i> },
    { id: 'break-decrement', action: "BREAK-DECREMENT", icon: <i className="fas fa-arrow-circle-down"></i> },
    { id: 'session-decrement', action: "SESSION-DECREMENT", icon: <i className="fas fa-arrow-circle-down"></i> },
    { id: 'break-increment', action: "BREAK-INCREMENT", icon: <i className="fas fa-arrow-alt-circle-up"></i> },
    { id: 'session-increment', action: "SESSION-INCREMENT", icon: <i className="fas fa-arrow-alt-circle-up"></i> },
    { id: 'reset', action: "RESET", icon: <i className="fas fa-retweet fa-lg"></i> },
]

//break component
const Break = ({ breakLenght, setUp }) => {
    return (
        <div id="break">
            <button id={buttons[3].id} onClick={() => setUp(buttons[3].action)}>{buttons[3].icon}</button>
            <div id="break-label">Break Length</div>
            <div id="break-length">{breakLenght}</div>
            <button id={buttons[1].id} onClick={() => setUp(buttons[1].action)}>{buttons[1].icon}</button>
        </div>
    )
}

//session component
const Session = ({ sessionLenght, setUp }) => {
    return (
        <div id="session">
            <button id={buttons[4].id} onClick={() => setUp(buttons[4].action)}>{buttons[4].icon}</button>
            <div id="session-label">Session Length</div>
            <div id="session-length">{sessionLenght}</div>
            <button id={buttons[2].id} onClick={() => setUp(buttons[2].action)}>{buttons[2].icon}</button>

        </div>
    )
}

//timer 
const Timer = ({ count, setUp, startStop, timeFormat, alarmColor, title }) => {
    return (
        <div id="timer">
            <div id="timer-label">{title}</div>
            <div id="time-left" style={alarmColor}>{count >= 0 ? timeFormat(count) : '00:00'}</div>
            <button id={buttons[0].id} onClick={() => startStop()}>{buttons[0].icon}</button>
            <button id={buttons[5].id} onClick={() => setUp(buttons[5].action)}>{buttons[5].icon}</button>
        </div>

    )
}


//main component
const App = () => {
    const [breakLenght, setBreakLenght] = useState(5);
    const [sessionLenght, setSessionLenght] = useState(25);
    const [count, setCount] = useState(sessionLenght * 60);
    const [alarmColor, setAlarmColor] = useState({ color: 'black' });
    const [startStopState, setStartStopState] = useState(false);
    const audioElement = useRef(null);
    const [title, setTitle] = useState('Session')

//setting timeformat
    const timeFormat = (time) => {
        let min = Math.floor(time / 60)
        let sec = time % 60
        return (
            (min < 10 ? "0" + min : min) +
            ":" +
            (sec < 10 ? "0" + sec : sec)
        )
    }

//function to start or stop runnig timer, it switchs a true/false state of startStop
    const startStop = () => {
        setStartStopState(!startStopState)
    }

//useEffect() hook is used to controls the timer 
//new Date().getTime() is used to setting an accurate time count
    useEffect(() => {
        let intervalId;
        if (startStopState && count >= 0) {
            let second = 1000;
            let date = new Date().getTime();
            let nextDate = new Date().getTime() + second;
            if (count === 0) {
                audioElement.current.play();
                setAlarmColor({color: 'red'})
            }
            intervalId = setInterval(() => {
                date = new Date().getTime();
                if (date > nextDate) {
                    setCount(prev => {
                        return prev - 1
                    })
                    nextDate += second;
                }

            }, 30);
        } else if (startStopState && count < 0) {
            setAlarmColor({color: 'black'})
            if (title === 'Session') {
                setTitle('Break')
                setCount(breakLenght * 60)
            } else {
                setTitle('Session')
                setCount(sessionLenght * 60)
            }
        }
        return () => clearInterval(intervalId);
    }, [startStopState, breakLenght, sessionLenght, title, count])

//one function to manage the controls elements 
    const setUp = (value) => {
        switch (value) {
            case ("SESSION-INCREMENT"):
                if (sessionLenght < 60) {
                    setSessionLenght(sessionLenght + 1);
                    setCount(count + 60)
                }
                break;
            case ("SESSION-DECREMENT"):
                if (sessionLenght > 1) {
                    setSessionLenght(sessionLenght - 1);
                    setCount(count - 60)
                }
                break;
            case ("BREAK-INCREMENT"):
                if (breakLenght < 60) {
                    setBreakLenght(breakLenght + 1)
                }

                break;
            case ("BREAK-DECREMENT"):
                if (breakLenght > 1) {
                    setBreakLenght(breakLenght - 1)
                }
                break;
            case ("RESET"):
                audioElement.current.load();
                setBreakLenght(5);
                setSessionLenght(25)
                setCount(25 * 60)
                setStartStopState(false)
                setTitle('Session')
                setAlarmColor({color: 'black'})
                break;
        }
    }

    return (
        <div id='app'>
            <Break breakLenght={breakLenght} setUp={setUp} />
            <Session setUp={setUp} sessionLenght={sessionLenght} />
            <Timer count={count} title={title} setUp={setUp} startStop={startStop} timeFormat={timeFormat} alarmColor={alarmColor} />
            <audio 
                id='beep'
                src='https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav'
                type='audio/wav'
                preload="auto"
                ref={audioElement}
            ></audio>

        </div>
    )
}

ReactDOM.render(<App />, document.getElementById('my-app'))