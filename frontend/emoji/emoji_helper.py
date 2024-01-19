import json
import re
import urllib.request

import unicodedata

out = "./src/emoji_helpers/emoji_list.json"


def remove_nonspacing_marks(s):
    return ''.join(c for c in unicodedata.normalize('NFKD', s)
                   if unicodedata.category(c) != 'Mn')


def download_specs():
    return open(urllib.request.urlretrieve(url="https://unicode.org/Public/emoji/latest/emoji-test.txt")[0], mode='r+', encoding="utf8")


file = download_specs()

entries = {}

for line in file.readlines():
    if not line.startswith("#") and not line == '\n':
        if "unqualified" not in line and "minimally-qualified" not in line:
            actual_line = line.replace("; fully-qualified", '')
            actual_line = actual_line.replace("\n", '')
            members = actual_line.split("#", 1)
            codepoints = members[0]
            text = members[1]
            text = re.split(r"E\d+.\d ", text,1)
            emoji_chars = text[0]
            name = text[1]
            name = (name.lower()
                     .replace(": ", "_").replace(", ", "_").replace(" - ", "-").replace(".", "")
                     .replace("\"", "").replace("’", "").replace("!", "").replace("&", "and")
                     .replace("-","_").replace("(", "").replace(")", "").replace(" ", "_"))
            name = remove_nonspacing_marks(name)
            codepoints = codepoints.strip()

            entries[name] = {"codepoints": codepoints, "character_sequence": emoji_chars.strip()}



file.close()

output = open(out, mode='w+', encoding="utf8")

output.writelines(json.dumps(entries, indent=4))


