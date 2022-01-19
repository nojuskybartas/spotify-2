import { atom } from 'recoil'
import PlaylistView from '../components/PlaylistView'

export const centerDisplayAtom = atom({
    key: 'centerDisplay',
    default: <PlaylistView/>,
});
