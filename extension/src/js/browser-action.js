/* globals chrome, atob */

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
        'h': 'M',
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
    // Wait for message from the web page
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            if (sender.url && sender.url.match(/linkedin\.com/i)) {
                if (!request || !request.encodedData) {
                    return;
                }

                // Assumes this is well formatted...
                var parsed = JSON.parse(atob(request.encodedData));

                var resultsTable = document.querySelector('table');
                
                var extensions = [];
                
                parsed.Metadata.ext.forEach(function (ext) {
                    extensions.push(decode(ext.name)); 
                });
                
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
