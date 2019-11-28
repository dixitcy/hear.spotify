import React from 'react';

const Track = (props) => {
    const getSongDuration = (durationinms) => {
        let durationinsecs = Math.round(durationinms/1000);
        let minutes = Math.floor(durationinsecs/60);
        let seconds = durationinsecs - (minutes*60)
        seconds = seconds < 10 ? "0"+seconds : seconds;
        return minutes+ ":"+seconds
      }
      
    return (
        <div className="track-container">
        <div className="block track" style={{display: "flex" , flexDirection : "column" }}>
            <img style={{maxWidth: "200px"}} src={props.selectedTrack.album.images[0].url} alt={props.selectedTrack.name} />             
          </div>
          <div className="block p-10">
            <div>{props.selectedTrack.name}</div>
            <div> <div className="highlite" style={{position:"relative", display:"inline-block", fontStyle:"italic"}}> {props.selectedTrack.artists[0].name}</div>
            </div><div>{getSongDuration(props.selectedTrack.duration_ms)}</div>
            </div>
          
          
        </div>
    );
}

export default Track;
