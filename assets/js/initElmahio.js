new Elmahio({
    apiKey: 'e8fe46913b034fcd8100b095d032bb6b',
    logId: '24c89075-e32a-4a79-9f7e-e78381e0d761',
    filter: function(msg) {
        try {
            if(msg && msg.title) {
                return (msg.title.toLowerCase().indexOf("ResizeObserver loop limit exceeded".toLowerCase()) >= 0 || msg.title.toLowerCase().indexOf("Identifier 'originalPrompt' has already been declared".toLowerCase()) >= 0);
            }
            return false;
        } catch (e) {
            return false;
        }
    }
});