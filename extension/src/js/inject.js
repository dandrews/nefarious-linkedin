/* globals chrome, localStorage */

//
// Fetch the encoded extension data from LinkedIn's local storage and send the
// encoded data to our Chrome extension. 
// 
// Needless to say, this will only work on LinkedIn. This file should be 
// injected into any LinkedIn page.
//

chrome.runtime.sendMessage(chrome.runtime.id, {
    encodedData: localStorage.getItem('C_C_M')
});
