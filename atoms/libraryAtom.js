import { atom } from 'recoil'

export const libraryViewState = atom({
    key: 'libraryViewState',
    default: 'userPlaylists',
});