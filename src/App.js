import React , {Fragment} from 'react';
import './App.css';
import * as SpotifyWebApi from 'spotify-web-api-js';

var spotifyApi = new SpotifyWebApi();





const initialState = {
  playlists : [
    {
      name: "playlist-1",
      tracks: [
        {
          trackName : "gaga"
        }
      ]
    }
  ]
}

function buildUrl(url, parameters) {
  let qs = "";
  for (const key in parameters) {
      if (parameters.hasOwnProperty(key)) {
          const value = parameters[key];
          qs +=
              key + "=" + encodeURIComponent(value) + "&";
              // encodeURIComponent(key) + "=" + encodeURIComponent(value) + "&";
      }
  }
  if (qs.length > 0) {
      qs = qs.substring(0, qs.length - 1); //chop off last "&"
      url = url + "?" + qs;
  }

  return url;
}

function App() {

  const authorizeSpotify = () => {
    console.log("authorizeSpotify");
    let queryParams = {
      response_type : "token",
      client_id : "e104679a4aea401182b875161a94e9e0",
      redirect_uri : (window.localtion && window.localtion.href) ? window.localtion.href : "http://localhost:3000"
  }
  let url = buildUrl("https://accounts.spotify.com/authorize" , queryParams);
  window.location = url;
    // window.location = "https://accounts.spotify.com/authorize?client_id=e104679a4aea401182b875161a94e9e0&redirect_uri=http:%2F%2Flocalhost:3000%2Fcallback&scope=user-read-private%20user-read-email&response_type=token&state=123"
  }
  
  const hash = window.location.hash
  .substring(1)
  .split('&')
  .reduce(function (initial, item) {
    if (item) {
      var parts = item.split('=');
      initial[parts[0]] = decodeURIComponent(parts[1]);
    }
    return initial;
  }, {});
  window.location.hash = '';
  
  // Set token
  let _token = hash.access_token;
  console.log(_token);
  if(_token){
    
    spotifyApi.setAccessToken(_token);
    spotifyApi.getMe().then(user => {
      console.log("user");
      console.log(user);
      setUser(user);
    })
    fetch('http://ip-api.com/json')
    .then(
        function success(response) {
            console.log('User\'s Location Data is ', response);
            console.log('User\'s Country', response.country);
            return response.json()
        },
  
        function fail(data, status) {
            console.log('Request failed.  Returned status of',
                        status);
        }
    ).then(res => {
      console.log(res);
      setCountry(res);
      spotifyApi.getFeaturedPlaylists({ country: (res.countryCode ? res.countryCode : "US")})  // note that we don't pass a user id
  .then(function(data) {
    console.log('User playlists', data);
    if(data.playlists){
      setPlaylists(data.playlists.items);
    }
  }, function(err) {
    console.error(err);
  });
    });
    // spotifyApi.setPromiseImplementation(Q);
    // spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE', function(err, data) {
    //   if (err) console.error(err);
    //   else console.log('Artist albums', data);
    // });

    
  }
  const [state, setstate] = React.useState(initialState)
  const [playlists, setPlaylists] = React.useState([]);
  const [tracks, setTracks] = React.useState([]);
  const [selectedTrack, setSelectedTrack] = React.useState(null);
  const [selectedPlaylist, setPlaylist] = React.useState();
  const [user , setUser] = React.useState(null);
  const [country , setCountry] = React.useState(null);

  const getSongDuration = (durationinms) => {
    let durationinsecs = Math.round(durationinms/1000);
    let minutes = Math.floor(durationinsecs/60);
    let seconds = durationinsecs - (minutes*60)
    return minutes+ ":"+seconds
  }
  
  return (
    <div className="App">
      <header className="App-header">    
      {country &&<h1 style={{textDecoration: "underline"}}>country , {country.country}</h1>}
        {/* <div className="block input-block"  >
        <input type="email" name="email" id="email"/>
        </div> */}
      
      {!user && <button onClick={() => {authorizeSpotify()}} className="block" style={{position :"absolute" , top : "1em" , left: "90%"}}>authorize spotify</button>}
      {user && <button onClick={() => {

      }} className="block accent" style={{position :"absolute" , top : "1em" , left: "90%"}}>{user && user.display_name ? user && user.display_name : "" }</button>}
      {/* <div className="block">gaga</div> */}
      {true && <div style={{display: "flex" , flexDirection:"row" , justifyContent: "end" , alignItems : "flex-start" , width: "80%"}}> <div className="block nav" style={{textDecoration: "underline"}} onClick={() => {
        setPlaylist(null);
        setTracks([]);
        setSelectedTrack(null);
      }}>{"playlists"}</div> 
      {selectedPlaylist && 
      <div className="block nav" style={{textDecoration: "underline"}} onClick={() => {
        setSelectedTrack(null);
      }}>{" / "+(selectedPlaylist.name)} 
      </div>}
      {selectedTrack && <div className="block nav" style={{textDecoration: "underline"}} onClick={() => {
        setSelectedTrack(null);
      }}>{" / "+ selectedTrack.name}</div>}</div>
      }
      {tracks.length === 0 && <div className="playlist-container">
      {playlists.map(playlist => {
        return (<div className="block" onClick={() => {
          spotifyApi.getPlaylist(playlist.id)
  .then(function(data) {
    console.log('User playlist', data);
    setTracks(data.tracks.items);
    setPlaylist(data);
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
      </div>}
      <div style={{display: "flex" , flexDirection:"row" , width : "80%" , margin: "auto" , justifyContent : "flex-start"}}>

      
      {!selectedTrack && <div className="tracks-container">
        {tracks.map(track => (
          <div className="block" onClick={() => {setSelectedTrack(track.track)}}>
            {track.track.name}
          </div>
        ))}
        </div>}
        {selectedTrack && <div className="track-container">
        <div className="block track" style={{display: "flex" , flexDirection : "column" }}>
            <img style={{maxWidth: "200px"}} src={selectedTrack.album.images[0].url} alt={selectedTrack.name} />             
          </div>
          <div className="block p-10">
            <div>{selectedTrack.name}</div>
            <div> <div className="highlite" style={{position:"relative", display:"inline-block", fontStyle:"italic"}}> {selectedTrack.artists[0].name}</div>
            </div><div>{getSongDuration(selectedTrack.duration_ms)}</div>
            </div>
          
          
        </div>}
        </div>
      </header>
      

      
      
    </div>
  );
}

export default App;
