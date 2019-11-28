import React , {Fragment} from 'react';
import './App.css';
import * as SpotifyWebApi from 'spotify-web-api-js';
import Track from './components/Track';
import Playlist from './components/Playlist';
import Playlists from './components/Playlists';
import Breadcrumbs from './components/Breadcrumbs';

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
// console.log(window.location)
function App() {

  const authorizeSpotify = () => {
    console.log("authorizeSpotify");
    console.log(window.location.href)
    let queryParams = {
      response_type : "token",
      client_id : "e104679a4aea401182b875161a94e9e0",
      scope: "user-read-private%20user-read-email",
      redirect_uri : (window.location && window.location.origin) ? window.location.origin : "http://localhost:3000"
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
      if(user.country){
        setCountry(user.country);
      }
      
      spotifyApi.getFeaturedPlaylists({ country: ((user && user.country) ? user.country : "US")})  // note that we don't pass a user id
  .then(function(data) {
    console.log('User playlists', data);
    if(data.playlists){
      setPlaylists(data.playlists.items);
    }
  }, function(err) {
    console.error(err);
  });
    })
    // fetch('http://ip-api.com/json' ,{cors: true})
    // .then(
    //     function success(response) {
    //         console.log('User\'s Location Data is ', response);
    //         console.log('User\'s Country', response.country);
    //         return response.json()
    //     },
  
    //     function fail(data, status) {
    //         console.log('Request failed.  Returned status of',
    //                     status);
    //     }
    // ).then(res => {
    //   console.log(res);
      
    // });
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
  
  return (
    <div className="App">
      <header className="App-header">    
      {country &&<h1 style={{marginTop : "0px", textDecoration: "underline"}}>country , {country}</h1>}        
      
      {!user && <button onClick={() => {authorizeSpotify()}} className="block" style={user ? {position :"absolute" , top : "1em" , left: "90%"} : {position :"absolute" , top : "calc(50% - 50px)" , left: "calc(50% - 150px)" , width : "300px" , height: "100px" , fontSize: "24px"}}>authorize spotify</button>}
      {user && <button onClick={() => {

      }} className="block accent" style={{position :"absolute" , top : "1em" , left: "90%"}}>{user && user.display_name ? user && user.display_name : "" }</button>}
      <Breadcrumbs playlists={playlists} selectedPlaylist={selectedPlaylist} selectedTrack={selectedTrack} setPlaylist={setPlaylist} setTracks={setTracks} setSelectedTrack={setSelectedTrack}  />
      
       
      {tracks.length === 0 && playlists && playlists.length > 0 && <Playlists setTracks={setTracks} spotifyApi={spotifyApi} setSelectedTrack={setSelectedTrack} setPlaylist={setPlaylist} playlists={playlists} />}
      
      <div style={{display: "flex" , flexDirection:"row" , width : "80%" , margin: "auto" , justifyContent : "flex-start"}}>

      
      {!selectedTrack && <div className="tracks-container">
        {tracks.map(track => (<Playlist setSelectedTrack={setSelectedTrack} track={track} />))}
        </div>}
        {selectedTrack && <Track setSelectedTrack={setSelectedTrack} selectedTrack={selectedTrack} />}
        </div>
      </header>
      

      
      
    </div>
  );
}

export default App;
