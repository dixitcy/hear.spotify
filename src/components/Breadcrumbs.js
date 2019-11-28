import React from 'react';

const Breadcrumbs = (props) => {
    return (
        <div style={{width: "80%" , margin : "auto"}}>
            {(props.playlists && props.playlists.length > 0) && <div style={{display: "flex" , flexDirection:"row" , justifyContent: "end" , alignItems : "flex-start" , width: "80%"}}> <div className="block nav" style={{textDecoration: "underline"}} onClick={() => {
        props.setPlaylist(null);
        props.setTracks([]);
        props.setSelectedTrack(null);
      }}>{"playlists"}</div> 
      {props.selectedPlaylist && 
      <div className="block nav" style={{textDecoration: "underline"}} onClick={() => {
        props.setSelectedTrack(null);
      }}>{" / "+(props.selectedPlaylist.name)} 
      </div>}
      {props.selectedTrack && <div className="block nav" style={{textDecoration: "underline"}} onClick={() => {
        props.setSelectedTrack(null);
      }}>{" / "+ props.selectedTrack.name}</div>}</div>
      }
        </div>
    );
}

export default Breadcrumbs;
