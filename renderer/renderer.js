const inputField = document.getElementById('inputField');
const messagesArea = document.getElementById("messagesArea");
let history_messages = []

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
    history_messages.push({"role": "user", "content": text});
    
    inputField.value = "";
    
    // const newAgentMessage = document.createElement("div");
    // newAgentMessage.textContent = "Hi! I am Logme. What did you work on today?";
    // newAgentMessage.classList.add("message", "agent-message");
    // messagesArea.appendChild(newAgentMessage);

    messagesArea.scrollTo({
        top: messagesArea.scrollHeight - messagesArea.clientHeight,
        behavior: "smooth"
    });
    
    const response = await fetch("http://127.0.0.1:8000/logme", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            data: JSON.stringify(history_messages)
        })


    });

    console.log(response);
    
    const data = await response.json();
    console.log(data);
    const newAgentMessage0 = document.createElement("div");
    newAgentMessage0.textContent = data.date + " " + data.project_name + " " + data.type + " " + data.description + " " + data.hours_spent;
    newAgentMessage0.classList.add("message", "agent-message");
    messagesArea.appendChild(newAgentMessage0);

    const newAgentMessage = document.createElement("div");
    newAgentMessage.textContent = data.followup_question;
    newAgentMessage.classList.add("message", "agent-message");
    messagesArea.appendChild(newAgentMessage);

    history_messages.push({"role": "assistant", "content": JSON.stringify(data)});

    if (data.followup_question == "") {
        history_messages = []
    }

    messagesArea.scrollTo({
        top: messagesArea.scrollHeight - messagesArea.clientHeight,
        behavior: "smooth"
    });


}