/* globals chrome, atob */

// 
// This function attemps to decode the substitution cipher used by LinkedIn
// to obfuscate each extension's name. 
//
function decode(str) {
    if (!str) { return str; }

    var mapping = {
        'r': 'a',
        'O': 'a',
        'x': 'b',
        'L': 'b',
        'G': 'c',
        'I': 'C',
        'w': 'd',
        'v': 'd',
        'f': 'e',
        'P': 'E',
        'B': 'F',
        'H': 'f',
        'U': 'g',
        'k': 'G',
        'F': 'h',
        'n': 'H',
        'T': 'i',
        'D': 'i',
        'u': 'k',
        'd': 'l',
        'a': 'L',
        'h': 'm',
        'A': 'M',
        'X': 'n',
        'W': 'o',
        'c': 'O',
        'o': 'P',
        'S': 'p',
        'M': 'q',
        'l': 'r',
        's': 'r',
        'j': 'S',
        'C': 's',
        'Y': 't',
        'y': 't',
        'R': 'u',
        'V': 'u',
        'K': 'v',
        'Q': 'W',
        'm': 'x',
        'Z': 'y',
        'i': 'z',
    };

    var decoded = '';

    str.split('').forEach(function (char) {
        if (mapping[char] ) {
            decoded += mapping[char];
        } else {
            decoded += char;
        }
    });

    return decoded;
}

window.onload = function () {
    // 
    // Listen for a message from LinkedIn. If the message contains the encoded
    // data from localStorage, then we will decode and render it. 
    //
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            if (sender.url && sender.url.match(/linkedin\.com/i)) {
                if (!request || !request.encodedData) {
                    return;
                }

                // Assumes this is well formatted...
                
                
                var parsed;
                
                try {
                    parsed = JSON.parse(atob(request.encodedData));
                } catch(error) {
                    // Either the data wasn't passed to us, localStorage did 
                    // not contain the data or LinkedIn changed the way they
                    // hide this information. 
                }

                var resultsTable = document.querySelector('table');
                
                var extensions = [];
                
                if (parsed !== undefined) {
                    parsed.Metadata.ext.forEach(function (ext) {
                        extensions.push(decode(ext.name)); 
                    });
                } else {
                    extensions.push(
                        '...nothing at this time...'
                    );
                }
                
                extensions.sort(function (a, b) {
                    return a.toLowerCase().localeCompare(b.toLowerCase());
                });

                extensions.forEach(function (ext) {
                    var tr = document.createElement('tr');
                    var td = document.createElement('td');
                    
                    td.innerText = ext;
                    
                    tr.appendChild(td);
                    
                    resultsTable.appendChild(tr);
                });
                
                document.querySelector('#linkedin').classList.remove('hidden');
            }
        }
    );

    // 
    // Get the active tab. If the tab is LinkedIn, inject our own content 
    // script. If it's not, let the user know to open the extension on LinkedIn.
    //
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        var tab = tabs[0];

        if (tab && tab.url.match(/linkedin\.com/i)) {
            chrome.tabs.executeScript(tab.id, {
                file: 'src/js/inject.js'
            });
        } else {
            document.querySelector('#unsupported').classList.remove('hidden');
            document.querySelector('html').classList.add('short');
            document.querySelector('body').classList.add('short');
        }
    });
};
