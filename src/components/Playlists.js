import React from 'react';
import Playlist from "./Playlist.js";
import Track from "./Track.js";
import Breadcrumbs from "./Breadcrumbs.js";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  withRouter,
  useParams
} from "react-router-dom";

const Playlists = (props) => {
  let match = useRouteMatch();

  const [playlists, setPlaylists] = React.useState([]);
  const [tracks, setTracks] = React.useState([]);
  const [selectedTrack, setSelectedTrack] = React.useState(null);
  const [selectedPlaylist, setPlaylist] = React.useState(null);

React.useEffect(() => {
  console.log(props);
  if(!props.user){
    return
  }
      props.spotifyApi.getFeaturedPlaylists({ country: ((props.user && props.user.country) ? props.user.country : "US")})  // note that we don't pass a user id
    .then(function(data) {
      console.log('User playlists', data);
      if(data.playlists){
        setPlaylists(data.playlists.items);
      }
    }, function(err) {
      console.error(err);
      props.resetAll()
    });
  return () => {
    // cleanup
    // props.setPlaylists([]);
  };
}, [])

React.useEffect(() => {
  console.log(selectedPlaylist);
  if(tracks && tracks.length > 0 && selectedPlaylist && selectedPlaylist.id){
    props.history.push(`/playlists/${selectedPlaylist.id}`);
  }
  
} , [tracks , selectedPlaylist])

    return (
      <React.Fragment>
      <Breadcrumbs playlists={playlists} selectedPlaylist={selectedPlaylist} selectedTrack={selectedTrack} setPlaylist={setPlaylist} setTracks={setTracks} setSelectedTrack={setSelectedTrack}  />
        <div className="playlist-container">
                

      <Switch>
        <Route exact path={`${match.path}/:topicId`}>
        <Playlist selectedPlaylist={selectedPlaylist} setSelectedTrack={setSelectedTrack} tracks={tracks} />
        </Route>
        <Route exact path={`${match.path}/:playlistId/track/:trackId`}>
          <Track setSelectedTrack={setSelectedTrack} selectedTrack={selectedTrack} />
        </Route>
        <Route path={match.path}>
          {playlists.map(playlist => {
        return (
          
          <div className="block" onClick={() => {
          props.spotifyApi.getPlaylist(playlist.id)
  .then(function(data) {
    console.log('User playlist', data);
    setPlaylist(data);
    setTracks(data.tracks.items);
    
    setSelectedTrack(null);
    
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
        </Route>
      </Switch>
      {/* {!selectedTrack && <div className="tracks-container">
        <Playlist selectedPlaylist={selectedPlaylist} setSelectedTrack={setSelectedTrack} tracks={tracks} />
        </div>} */}
        
        </div>
        </React.Fragment>
    );
}

export default withRouter(Playlists);