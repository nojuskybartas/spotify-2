import { useSession } from "next-auth/react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import { useState, useEffect, useCallback } from 'react'
import { debounce } from 'lodash'
import useSpotify from "../hooks/useSpotify"
import useSongInfo from "../hooks/useSongInfo";
import { SwitchHorizontalIcon, VolumeUpIcon as VolumeDownIcon } from "@heroicons/react/outline";
import { RewindIcon, FastForwardIcon, PauseIcon, PlayIcon, ReplyIcon, VolumeUpIcon } from "@heroicons/react/solid";

function Player() {

    const spotifyApi = useSpotify();
    const { data: session, status } = useSession();
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
    const [volume, setVolume] = useState(50);
    const [currentDevice, setCurrentDevice] = useState(null)

    const songInfo = useSongInfo();

    const fetchCurrentSong = () => {
        if (!songInfo) {
            spotifyApi.getMyCurrentPlayingTrack().then(data => {
                setCurrentTrackId(data.body?.item?.id)
                spotifyApi.getMyCurrentPlaybackState().then(data => {
                    setIsPlaying(data.body?.is_playing)
                })
            })
        }
    }

    const handlePlayPause = () => {
        
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
            if (data.body.is_playing) {
                spotifyApi.pause();
                setIsPlaying(false)
            } else {
                spotifyApi.play();
                setIsPlaying(true)
            }
        })
    }

    useEffect(() => {

        const CreateWebPlayback = async() => {

            // Load spotify player script
            const script = document.createElement("script");
            script.src = "https://sdk.scdn.co/spotify-player.js";
            script.async = true;
            document.body.appendChild(script);
        
            // create the player
            await new Promise((resolve, reject) => {
                window.onSpotifyWebPlaybackSDKReady = () => {
                    const player = new window.Spotify.Player({
                        name: 'Spotify UI Clone',
                        getOAuthToken: cb => { cb(spotifyApi.getAccessToken()); },
                        volume: 0.5
                    });

                    player.addListener('player_state_changed', ( state => {
                        if (!state) return;
                        setIsPlaying(state.body?.is_playing)
                        fetchCurrentSong()
                    }));

                    player.connect();
                    resolve()
                };
            })
        }

        const getDevice = async () => {

            if (!currentDevice) {
                await CreateWebPlayback()
                console.log('created new player device')
            }

            // wrapping it in a loop because after the device is initialized, the api needs a bit of time (or more preciselly, couple of calls) to find it and return it, and the exact time / number of calls is unknown
            while (true) {
                const devices = await spotifyApi.getMyDevices()
                const device = (devices.body?.devices).find(dev => {
                    return dev.name === 'Spotify UI Clone'
                }) 
                if (device) { setCurrentDevice(device); break}
                else { await new Promise(resolve => setTimeout(resolve, 500)) }

            }
        }
        
        getDevice()

     }, [])

    useEffect(() => {
        if (currentDevice) { spotifyApi.transferMyPlayback([currentDevice.id]); }
    }, [currentDevice])
    

    useEffect(() => {
        if (spotifyApi.getAccessToken() && !currentTrackId) {
            fetchCurrentSong();
            setVolume(50);
        }
    }, [currentTrackId, spotifyApi, session])

    useEffect(() => {
        if (volume > 0 && volume < 100) {
            debouncedAdjustVolume(volume)
        }
    }, [volume])

    const debouncedAdjustVolume = useCallback(
        debounce((volume) => {
            spotifyApi.setVolume(volume).catch((err) => {})
        }, 300),
        []
    )

    return (
        <div>
        { currentTrackId &&
        <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
            {/* left */}
            <div className="flex items-center space-x-4">
                <img className="hidden md:inline h-10 w-10" src={songInfo?.album.images?.[0]?.url} alt=""></img>
                <div>
                    <h3>{songInfo?.name}</h3>
                    <p>{songInfo?.artists?.[0]?.name}</p>
                </div>
            </div>
            <div className="flex items-center justify-evenly">
                <SwitchHorizontalIcon 
                    className="button"/>
                <RewindIcon
                    onClick={() => spotifyApi.skipToPrevious()} 
                    className="button"/>

                {isPlaying ? (
                    <PauseIcon onClick={handlePlayPause} className="button w-10 h-10" />
                ) : (
                    <PlayIcon onClick={handlePlayPause} className="button w-10 h-10" />
                )}

                <FastForwardIcon
                    onClick={() => spotifyApi.skipToNext()}
                    className="button"
                />
                <ReplyIcon className="button" />
            </div>
            <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
                <VolumeDownIcon className="button" onClick={() => volume > 0 && setVolume(volume-10)}/>
                <input className="rounded-lg overflow-hidden appearance-none bg-gray-700 h-3 w-24 md:w-32" type="range" value={volume} min={0} max={100} onChange={(e) => setVolume(Number(e.target.value))} />
                {/* <input  className='w-14 md:w-28' type='range' value={volume} min={0} max={100} onChange={(e) => setVolume(Number(e.target.value))} /> */}
                <VolumeUpIcon className="button" onClick={() => volume < 100 && setVolume(volume+10)}/>
            </div>
        </div>}
        </div>
    )
}

export default Player
