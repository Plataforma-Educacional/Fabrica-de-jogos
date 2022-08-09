import { wordObj } from '../types'
import textToDraft from 'utils/textToDraft'

const formatTips = (raw: wordObj[]): wordObj[] => {
    raw.map((word: wordObj) => {
        if (typeof word.tip !== 'string') {
            return
        }
        word.tip = textToDraft(word.tip)
    })
    return raw
}

export default formatTips
