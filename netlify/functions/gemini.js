// Ye aapka chota sa 'Secret Backend' hai
exports.handler = async function(event, context) {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    // Netlify ki tijori se API key nikalna
    const API_KEY = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`;
    
    try {
        const body = JSON.parse(event.body);
        const userCode = body.code;
        
        const promptText = "You are an expert web developer. Find the bugs in this code, explain the fixes briefly, and output the fully corrected code. Do not use markdown format for the code output, just plain text so it looks clean: \n\n" + userCode;

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptText }] }]
            })
        });

        const data = await response.json();
        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };

    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: "Backend System Error!" }) };
    }
}
