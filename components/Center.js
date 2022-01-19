import { useRecoilValue } from "recoil";
import { centerDisplayAtom } from "../atoms/centerDisplayAtom";

function Center() {

    const view = useRecoilValue(centerDisplayAtom)

    return view
}

export default Center
