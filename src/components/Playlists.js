import React from 'react';

const Playlists = (props) => {
    return (
        <div className="playlist-container">
        {props.playlists.map(playlist => {
        return (<div className="block" onClick={() => {
          props.spotifyApi.getPlaylist(playlist.id)
  .then(function(data) {
    console.log('User playlist', data);
    props.setTracks(data.tracks.items);
    props.setPlaylist(data);
    props.setSelectedTrack(null);
  }, function(err) {
    console.error(err);
  });
        }}>
          <div className="smol-header" style={{display : "flex" , flexDirection : "column"}}>
            <div className="playlist-img" style={{textAlign : "left", flexGrow: 1}}>
              <img style={{maxWidth:  "200px"}} alt={playlist.playlist} src={playlist.images[0].url} />
            </div>
            <div>
            <div className="playlist-title" style={{flexGrow: 3}}>{playlist.name}</div>
            <div className="playlist-about" style={{textAlign : "left", fontSize: "12px", fontWeight : 100, flexGrow: 3}}>{playlist.tracks.total + " tracks"}</div>            
            </div>
            
            
            </div>
        </div>)
      })}    
        </div>
    );
}

export default Playlists;