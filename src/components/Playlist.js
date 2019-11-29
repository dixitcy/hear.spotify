import React from 'react';
import {Link} from "react-router-dom";

const Playlist = (props) => {
  console.log(props);
  console.log(props.selectedPlaylist.id)
  return (<div>{props.tracks.map(track => (
(track.track && track.track.id) ? <Link to={`/playlists/${props.selectedPlaylist.id}/track/${track.track.id}`}><div className="block" onClick={() => {props.setSelectedTrack(track.track)}}>
{track.track.name}
</div>
</Link> : ""
  ))}
  </div>
  )
    
}

export default Playlist;
