const inputField = document.getElementById('inputField');
const messagesArea = document.getElementById("messagesArea");

inputField.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        handleSubmit();
    }
});

function handleSubmit() {
    const text = inputField.value.trim();

    if (text == "") return;

    const newUserMessage = document.createElement("div");
    newUserMessage.textContent = text;
    newUserMessage.classList.add("message", "user-message");
    messagesArea.appendChild(newUserMessage);
    
    inputField.value = "";
    
    const newAgentMessage = document.createElement("div");
    newAgentMessage.textContent = "Hi! I am Logme. What did you work on today?";
    newAgentMessage.classList.add("message", "agent-message");
    messagesArea.appendChild(newAgentMessage);

    messagesArea.scrollTo({
        top: messagesArea.scrollHeight - messagesArea.clientHeight,
        behavior: "smooth"
    });

}