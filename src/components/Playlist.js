import React from 'react';

const Playlist = (props) => {
    if(props.track.track){
        return <div className="block" onClick={() => {props.setSelectedTrack(props.track.track)}}>
        {props.track.track.name}
      </div>
    }
        return ""
        
    
}

export default Playlist;
