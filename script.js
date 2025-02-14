document.addEventListener("DOMContentLoaded", function () {
    const inputField = document.getElementById("userInput");
    const sendButton = document.getElementById("sendBtn");
    const textArea = document.querySelector(".textArea");

    function showLoadingMessage() {
        const loadingMessage = document.createElement("div");
        loadingMessage.classList.add("aiResponse", "loading");
        loadingMessage.innerHTML = `<span class="loading-text">Just a second...</span>
                                    <div class="loader"></div>`;
        textArea.appendChild(loadingMessage);
        textArea.scrollTop = textArea.scrollHeight;
        return loadingMessage;
    }

    function formatResponse(text) {
        text = text.replace(/\*\*/g, "").replace(/\*/g, ""); 
        text = text.replace(/\n/g, "<br>"); 
        return text;
    }

    function addMessage(text, className) {
        const message = document.createElement("div");
        message.classList.add(className);
        message.innerHTML = formatResponse(text);
        textArea.appendChild(message);
        textArea.scrollTop = textArea.scrollHeight;
        document.querySelector(".main h1").textContent = "";
    }

    sendButton.addEventListener("click", async function () {
        const query = inputField.value.trim();
        if (query) {
            addMessage(query, "userQuery");
            inputField.value = "";
            await fetchGeminiResponse(query);
        }
    });

    inputField.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            sendButton.click();
        }
    });

    async function fetchGeminiResponse(query) {
        const API_KEY = "AIzaSyBa3rnt-2hgL8VSEaVWWSYDksIPDk29zXY"; 
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${API_KEY}`;

        const requestBody = {
            contents: [{ role: "user", parts: [{ text: query }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 200 } 
        };

        const loadingElement = showLoadingMessage(); 

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }

            const data = await response.json();
            const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI.";

            loadingElement.remove(); 
            addMessage(aiText, "aiResponse");

        } catch (error) {
            console.error("Error fetching response:", error);
            loadingElement.remove();
            addMessage("Error fetching response from AI.", "aiResponse");
        }
    }
});
