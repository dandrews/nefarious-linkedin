window.onload = function () {
    var placeholder = document.querySelector('#placeholder');

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

    // Wait for message from the web page
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            if (sender.url && sender.url.match(/linkedin\.com/i)) {
                if (!request || !request.encodedData) {
                    return;
                }

                // Assumes this is well formatted...
                var parsed = JSON.parse(atob(request.encodedData))

                var html = '<table><tr><th>Name</th><th>Encoded</th><th>Path></th></tr>';

                // Process each
                parsed.Metadata.ext.forEach(function (ext) {
                    html += '<tr><td>' + decode(ext.name) + '</td>';
                    html += '<td>' + ext.name + '</td>';
                    html += '<td>' + (ext.path[0] || 'N/A') + '</td></tr>';
                });

                html += '</table>';

                placeholder.innerHTML = html;
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
            placeholder.innerText = 'Open on LinkedIn';
        }
    });
};
