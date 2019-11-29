import React from 'react';
import {Link} from "react-router-dom";

const Breadcrumbs = (props) => {
    return (
        <div style={{width: "80%" , margin : "auto"}}>
            {(props.playlists && props.playlists.length > 0) && 
           
            <div style={{display: "flex" , flexDirection:"row" , justifyContent: "end" , alignItems : "flex-start" , width: "80%"}}> 
             <Link to="/playlists">
            <div className="block nav" style={{textDecoration: "underline"}} onClick={() => {
        props.setPlaylist(null);
        props.setTracks([]);
        props.setSelectedTrack(null);
      }}>{"playlists"}</div> 
      </Link>
      
      {props.selectedPlaylist && 
      <Link to={"/playlists/"+props.selectedPlaylist.id}><div className="block nav" style={{textDecoration: "underline"}} onClick={() => {
        props.setSelectedTrack(null);
      }}>{" / "+(props.selectedPlaylist.name)} 
      </div></Link>}
      {props.selectedTrack && <div className="block nav" style={{textDecoration: "underline"}} onClick={() => {
        props.setSelectedTrack(null);
      }}>{" / "+ props.selectedTrack.name}</div>}</div>
      }
        </div>
    );
}

export default Breadcrumbs;
