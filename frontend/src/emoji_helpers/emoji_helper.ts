import list from "./emoji_list.json"
import type {EmojiList} from "@/libs/types";
let emojiList : EmojiList
emojiList = list

export function findEmoji(name: string) {
    if (emojiList[name] == undefined) {
        return name;
    }

    return emojiList[name].character_sequence as string;
}
