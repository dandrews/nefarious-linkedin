chrome.runtime.sendMessage(chrome.runtime.id, {
    encodedData: localStorage.getItem('C_C_M')
});
