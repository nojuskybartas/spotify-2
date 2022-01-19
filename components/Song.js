import { PlayIcon } from "@heroicons/react/solid";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSpotify from "../hooks/useSpotify"
import { formatTime } from "../lib/time";
import UseAnimations from "react-useanimations";
import activity from 'react-useanimations/lib/activity'
import AudioWave from "./AudioWave";

function Song({order, track}) {

    const spotifyApi = useSpotify();
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState)
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)

    const playSong = () => {
        setCurrentTrackId(track.track.id);
        setIsPlaying(true);
        spotifyApi.play({
            uris: [track.track.uri],
        })
    }

    const thisPlaying = () => {
        if (!isPlaying) return
        if (currentTrackId === track.track.id) {
            return true
        }
        return false
    }


    return (
        <div className={`grid grid-cols-2 text-gray-500 py-4 px-4 hover:bg-gray-900 rounded-lg cursor-pointer ${thisPlaying() && 'bg-gray-800'}`} onClick={playSong}>
            <div className="flex items-center space-x-5">
            {/* <PlayIcon className="w-5 h-5"/> */}
                {thisPlaying() ? <AudioWave/> : <p>{order + 1}</p>}
                <img className="h-10 w-10" src={track.track.album.images[0].url} alt=""/>
                <div>
                    <p className="w-36 lg:w-80 truncate text-white">{track.track.name}</p>
                    <p className="w-40">{track.track.artists[0].name}</p>
                </div>
            </div>
            <div className="flex items-center justify-between ml-auto md:ml-0">
                <p className="w-40 hidden md:inline">{track.track.album.name}</p>
                <p>{formatTime(track.track.duration_ms)}</p>
            </div>
        </div>
    )
}

export default Song
