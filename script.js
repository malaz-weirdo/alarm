let timer;
let timeLeft = 25 * 60;
let isRunning = false;
const bgMusic = document.getElementById('bgMusic');

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timer').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
    if (isRunning) return;
    
    const customMinutes = document.getElementById('studyMinutes').value;
    if (customMinutes) {
        timeLeft = customMinutes * 60;
    }

    isRunning = true;
    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimerDisplay();
        } else {
            clearInterval(timer);
            document.getElementById('timerSound').play();
            alert("⏳ Time's up! Take a break!");
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    timeLeft = 25 * 60;
    updateTimerDisplay();
}

// Music controls
function playMusic() {
    const selectedTrack = document.getElementById('musicSelect').value;
    if (selectedTrack === "none") {
        bgMusic.pause();
        bgMusic.src = "";
    } else {
        bgMusic.src = selectedTrack;
        bgMusic.play();
    }
}

function pauseMusic() {
    bgMusic.pause();
}

updateTimerDisplay();

// 📅 Study Schedule Functions
function addSchedule() {
    const subject = document.getElementById("subject").value;
    const startTime = document.getElementById("startTime").value;
    const endTime = document.getElementById("endTime").value;

    if (!subject || !startTime || !endTime) {
        alert("Please fill all fields!");
        return;
    }

    const table = document.getElementById("scheduleTable").getElementsByTagName('tbody')[0];

    let newRow = table.insertRow();
    newRow.insertCell(0).textContent = subject;
    newRow.insertCell(1).textContent = startTime;
    newRow.insertCell(2).textContent = endTime;

    let removeButton = document.createElement("button");
    removeButton.textContent = "❌";
    removeButton.onclick = function () {
        table.deleteRow(newRow.rowIndex - 1);
        saveSchedule();
    };

    newRow.insertCell(3).appendChild(removeButton);
    saveSchedule();
}

// 🛠 Save & Load Study Schedule (LocalStorage)
function saveSchedule() {
    let tableData = [];
    document.querySelectorAll("#scheduleTable tbody tr").forEach(row => {
        let rowData = {
            subject: row.cells[0].textContent,
            startTime: row.cells[1].textContent,
            endTime: row.cells[2].textContent
        };
        tableData.push(rowData);
    });
    localStorage.setItem("studySchedule", JSON.stringify(tableData));
}

function loadSchedule() {
    const table = document.getElementById("scheduleTable").getElementsByTagName('tbody')[0];
    const storedData = JSON.parse(localStorage.getItem("studySchedule"));

    if (storedData) {
        storedData.forEach(entry => {
            let newRow = table.insertRow();
            newRow.insertCell(0).textContent = entry.subject;
            newRow.insertCell(1).textContent = entry.startTime;
            newRow.insertCell(2).textContent = entry.endTime;

            let removeButton = document.createElement("button");
            removeButton.textContent = "❌";
            removeButton.onclick = function () {
                table.deleteRow(newRow.rowIndex - 1);
                saveSchedule();
            };
            newRow.insertCell(3).appendChild(removeButton);
        });
    }
}

// Load schedule when the page loads
loadSchedule();
