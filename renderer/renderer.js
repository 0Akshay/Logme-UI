const inputField = document.getElementById('inputField');
const messagesArea = document.getElementById("messagesArea");

inputField.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        handleSubmit();
    }
});

setTimeout(() => {
    const newAgentMessage = document.createElement("div");
    newAgentMessage.textContent = "Hi! I am Logme. What did you work on today?";
    newAgentMessage.classList.add("message", "agent-message");
    messagesArea.appendChild(newAgentMessage);
    
    messagesArea.scrollTo({
        top: messagesArea.scrollHeight - messagesArea.clientHeight,
        behavior: "smooth"
    });
}, 500);

async function handleSubmit() {
    const text = inputField.value.trim();

    if (text == "") return;

    const newUserMessage = document.createElement("div");
    newUserMessage.textContent = text;
    newUserMessage.classList.add("message", "user-message");
    messagesArea.appendChild(newUserMessage);
    
    inputField.value = "";
    
    // const newAgentMessage = document.createElement("div");
    // newAgentMessage.textContent = "Hi! I am Logme. What did you work on today?";
    // newAgentMessage.classList.add("message", "agent-message");
    // messagesArea.appendChild(newAgentMessage);

    messagesArea.scrollTo({
        top: messagesArea.scrollHeight - messagesArea.clientHeight,
        behavior: "smooth"
    });

    const response = await fetch(`http://127.0.0.1:8000/logme/?user_message=${encodeURIComponent(text)}`, {
        method: "POST"
    });

    console.log(response);
    
    const data = await response.json();

    const newAgentMessage = document.createElement("div");
    newAgentMessage.textContent = data.followup_question;
    newAgentMessage.classList.add("message", "agent-message");
    messagesArea.appendChild(newAgentMessage);

    messagesArea.scrollTo({
        top: messagesArea.scrollHeight - messagesArea.clientHeight,
        behavior: "smooth"
    });


}