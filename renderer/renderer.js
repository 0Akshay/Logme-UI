const inputField = document.getElementById('inputField');
const messagesArea = document.getElementById("messagesArea");
let history_messages = []

inputField.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        handleSubmit();
    }
});

setTimeout(() => {
    addNewMessage("agent", "Hi! I am Logme. What would you like to log today?");
    
    messagesArea.scrollTo({
        top: messagesArea.scrollHeight - messagesArea.clientHeight,
        behavior: "smooth"
    });
}, 500);

async function handleSubmit() {
    const text = inputField.value.trim();

    if (text == "") return;

    addNewMessage("user", text);

    history_messages.push({"role": "user", "content": text});
    
    inputField.value = "";

    scrollToBottom();
    
    const response = await fetch("http://127.0.0.1:8000/logme", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            data: JSON.stringify(history_messages)
        })
    });
    
    const data = await response.json();
    console.log(data);
    history_messages.push({"role": "assistant", "content": JSON.stringify(data)});

    // addNewMessage("agent", data.date + " " + data.project_name + " " + data.type + " " + data.description + " " + data.hours_spent);

    const followupQuestion = data.followup_question;

    if (followupQuestion) {
        addNewMessage("agent", followupQuestion);
    }
    else {
        history_messages = []
        addNewMessage("agent", "Saved.")
        addNewMessage("agent", "What else did you work on?")
    }

    scrollToBottom();
}

function addNewMessage(type, message) {
    const newMessage = document.createElement("div");
    newMessage.textContent = message;
    newMessage.classList.add("message")
    type === "user" ? newMessage.classList.add("user-message") : newMessage.classList.add("agent-message");
    messagesArea.appendChild(newMessage);
}

function scrollToBottom() {
    messagesArea.scrollTo({
        top: messagesArea.scrollHeight - messagesArea.clientHeight,
        behavior: "smooth"
    });
}