const axios = require('axios')

const ask_sensei = async(req,res) =>{
    const{email, message} = req.body

    if (!email || !message) {
        return res.status(400).json({ error: "Email and message are required." });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try{

            const response = await axios({
            method: 'post',
            url: `${process.env.AI}/api/chat`, 
            data: { email: email, message: message },
            responseType: 'stream' 
        });

        req.on('close', () => {
            if (response.data) response.data.destroy();
        });

        response.data.on('error', (err) => {
            console.error("Stream interrupted mid-flight:", err.message);
            if (!res.writableEnded) {
                res.write("data: Sensei's connection dropped.\n\n");
                res.end();
            }
        });

        response.data.pipe(res);

    } catch(error) {
        // 1. Print the actual error safely to the Render console
        console.error("💥 AI Connection Error:", error.message);
        if (error.response) {
            console.error("AI Engine Details:", error.response.status, error.response.statusText);
        }

        // 2. Send the error safely to the React frontend via the stream
        if (!res.writableEnded) {
            res.write("data: Sensei is currently meditating (Connection Error).\n\n");
            res.write("data: [DONE]\n\n");
            res.end();
        }
    }
}

module.exports = ask_sensei;