const inputField = document.getElementById('inputField');
const messagesArea = document.getElementById("messagesArea");
// const sendButton = document.getElementById("sendButton");
let history_messages = [];

inputField.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        handleSubmit();
    }
});

setTimeout(() => {
    addNewMessage("agent", "Hi! I am Logme. What would you like to log today?");
    scrollToBottom();
}, 500);

setTimeout(() => {
    inputField.focus();
}, 1000);

async function handleSubmit() {
    const text = inputField.value.trim();

    if (text == "") {
        inputField.value = "";
        return;
    }

    inputField.blur();
    // lockInput();

    addNewMessage("user", text);

    history_messages.push({ "role": "user", "content": text });

    inputField.value = "";

    // scrollToBottom();

    addLoader();

    setTimeout(() => {
        scrollToBottom();
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

    removeLoader();

    const data = await response.json();
    console.log(data);
    history_messages.push({ "role": "assistant", "content": JSON.stringify(data) });

    // addNewMessage("agent", data.date + " " + data.project_name + " " + data.type + " " + data.description + " " + data.hours_spent);

    const followupQuestion = data.followup_question;

    if (followupQuestion) {
        addNewMessage("agent", followupQuestion);
    }
    else {
        history_messages = []
        addNewMessage("agent", "Saving...");
        saveNewTimelog(data);
        addNewMessage("agent", "Saved.")
        addNewMessage("agent", "What else did you work on?")
    }

    scrollToBottom();
    inputField.focus();
    // releaseInput();
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

function addLoader() {
    const loaderWrapper = document.createElement("div");
    loaderWrapper.id = "loaderWrapper";
    const loader = document.createElement("div");
    loader.id = "loader";
    loaderWrapper.appendChild(loader);
    messagesArea.append(loaderWrapper);
}

function removeLoader() {
    const loaderWrapper = document.getElementById("loaderWrapper");
    loaderWrapper.remove();
}

// function lockInput() {
//     inputField.disabled = true;
//     sendButton.disabled = true;
// }

// function releaseInput() {
//     inputField.disabled = false;
//     sendButton.disabled = true;
// }

function saveNewTimelog(timelogData) {
    const id = window.api.addLog(timelogData);
}

function openDeveloperTools() {
    window.api.openDevTools();
}

function handleMinimize() {
    window.api.minimize();
}

function handleMaximize() {
    window.api.maximize();
}

function handleClose() {
    window.api.close();
}