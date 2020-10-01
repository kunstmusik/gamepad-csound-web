import React, { useEffect, useState } from "react";
import './App.css';
import CsoundObj from "@kunstmusik/csound";
// eslint-disable-next-line import/no-webpack-loader-syntax
import orc from "!!raw-loader!./instrument.orc";

const buttons = new Array(14).fill(false);

function App() {

    const [csound, setCsound] = useState(null);
    const [started, setStarted] = useState(false);



const pollGamepads = () => {
  const gamePads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);

  if(gamePads.length > 0) {
    const gp = gamePads[0];

    if(gp) {
      for(let i = 0; i < gp.buttons.length; i++) {
        if(gp.buttons[i].pressed !== buttons[i]) {
          buttons[i] =  gp.buttons[i].pressed;

          if(buttons[i]) {
             csound.evaluateCode(`schedule(1.${i}, 0, -2, cpsmidinn(48 + 2 * ${i}), ampdbfs(-12))`)
          } else {
             csound.evaluateCode(`schedule(-1.${i}, 0, 2, cpsmidinn(48 + 2 * ${i}), ampdbfs(-12))`)
          }
        }
      }

      for(let i = 0; i < gp.axes.length; i++) {
        csound.setControlChannel(`axis${i}`, gp.axes[i]);
      }
    }

  }

  requestAnimationFrame(pollGamepads);
};


    useEffect(() => {
        if (csound == null) {
            CsoundObj.initialize().then(() => {
                const cs = new CsoundObj();
                setCsound(cs);
            });
        }
    }, [csound]);

  const startApp = () => {
    csound.setOption("-+msg_color=false");
    csound.compileOrc(orc);
    csound.start();
    csound.audioContext.resume();
    setStarted(true);

    requestAnimationFrame(pollGamepads);
  };

  return (
    <div className="App">
    {csound ? 
      <header className="App-header">
        <div>
          <h1>Xbox One Controller + Csound</h1>
          <div style={{maxWidth: 800, textAlign: "left"}}>
<p>This is a proof-of-concept web application that uses input from the GamePad API together with WebAudio Csound 
to create an interactive instrument.  The site is currently hardcoded for use with an Xbox One controller.</p>

<p>To use: button presses turn on notes and releases turn off notes. Analog input is used to control filter cutoff, pitch bend, and vibrato frequency and amplitude.</p>
          </div>
        </div>
        <div>
        { started ? 
          <div>Running...</div>
          : <button onClick={startApp}>Start App</button>
        }
        </div>
        <p><a href="https://github.com/kunstmusik/gamepad-csound-web">View Source</a></p>
      </header>
      :
      <header className="App-header">Loading...</header>
    }
    </div>
  );
}

export default App;
