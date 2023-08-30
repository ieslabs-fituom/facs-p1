var port, textEncoder, writableStreamClosed, writer;

async function connectSerial() {
    try {        
        port = await navigator.serial.requestPort();
          
        await port.open({ baudRate: 115200 });
        
        textEncoder = new TextEncoderStream();
        writableStreamClosed = textEncoder.readable.pipeTo(port.writable);
        writer = textEncoder.writable.getWriter();
        
        await listenToPort();
    } catch (e){
        alert("Serial Connection Failed" + e);
    }
}

async function listenToPort() {
    const textDecoder = new TextDecoderStream();
    const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
    const reader = textDecoder.readable.getReader();
    
    // Listen to data coming from the serial device.
    while (true) {
        const { value, done } = await reader.read();
        if (done) {
            // Allow the serial port to be closed later.
            console.log('[readLoop] DONE', done);
            reader.releaseLock();
            break;
        }
        // value is a string.
        appendToTerminal(value);
    }
}




const serialResultsDiv = document.getElementById("serialResults");
async function appendToTerminal(newStuff) {
    serialResultsDiv.innerHTML += newStuff;
}
