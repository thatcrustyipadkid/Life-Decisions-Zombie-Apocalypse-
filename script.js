// GAME STATE
let game = {
    hp: 100,
    food: 3,
    ammo: 0,
    day: 1,
    inventory: ["Pisau Dapur", "Senter"],
    scene: "start",
    log: ["[06:00] Game dimulai..."]
};

// ALL GAME SCENES
const scenes = {
    "start": {
        story: "<p><strong>HARI PERTAMA - 06:00</strong></p><p>Kota dalam kekacauan. Zombie di mana-mana. Alarm sirene berbunyi tanpa henti. Kamu harus bertahan hidup.</p>",
        choices: [
            {text: "🏃 LARI KE ATAP", next: "roof", effect: () => addLog("Memutuskan naik ke atap")},
            {text: "🔪 CARI SENJATA", next: "weapon", effect: () => {game.inventory.push("Golf Club"); updateUI();}},
            {text: "📱 CARI INFORMASI", next: "info", effect: () => addLog("Mencari info di internet")},
            {text: "🚗 EVAKUASI", next: "car", effect: () => {game.food--; updateUI();}}
        ]
    },
    "roof": {
        story: "<p>Kamu di atap. Ada helikopter di kejauhan dan tangga darurat.</p><p>Pilihan:</p>",
        choices: [
            {text: "🚁 TERIAK KE HELIKOPTER", next: "heli", effect: () => playSound()},
            {text: "👇 TURUN LEWAT TANGGA", next: "stairs", effect: () => addLog("Turun lewat tangga darurat")},
            {text: "🔍 CARI PETUNJUK", next: "clue", effect: () => {game.inventory.push("Peta"); updateUI();}},
            {text: "😴 TUNGGU SAMPAI MALAM", next: "wait", effect: () => {game.day++; updateUI();}}
        ]
    },
    "weapon": {
        story: "<p>Kamu nemu Golf Club dan kotak P3K. Zombie ngedobrak pintu!</p>",
        choices: [
            {text: "⚔️ LAWAN ZOMBIE", next: "fight", effect: () => {game.hp -= 30; game.ammo += 5; updateUI();}},
            {text: "🏃 KABUR DARI JENDELA", next: "escape", effect: () => addLog("Kabur lewat jendela belakang")},
            {text: "🤫 SEMBUNYI", next: "hide", effect: () => addLog("Bersembunyi di bawah tempat tidur")},
            {text: "🆘 PANGGIL BANTUAN", next: "help", effect: () => playSound()}
        ]
    },
    "heli": {
        story: "<p>Helikopter tidak melihatmu. Zombie muncul di atap!</p><p>ENDING: Kamu terjebak...</p>",
        choices: [
            {text: "🔄 MAIN LAGI", next: "start", effect: resetGame}
        ]
    },
    "stairs": {
        story: "<p>Kamu bertemu survivor lain! Mereka punya persediaan.</p>",
        choices: [
            {text: "👥 GABUNG DENGAN MEREKA", next: "group", effect: () => {game.food += 2; updateUI();}},
            {text: "💀 SERANG MEREKA", next: "betray", effect: () => {game.hp -= 40; updateUI();}},
            {text: "🏃 KABUR SENDIRIAN", next: "alone", effect: () => addLog("Memilih untuk sendiri")},
            {text: "💰 TUKAR BARANG", next: "trade", effect: () => {game.inventory.push("Radio"); updateUI();}}
        ]
    },
    "group": {
        story: "<p><strong>🎉 GOOD ENDING!</strong></p><p>Kamu bergabung dengan kelompok survivor. Bersama-sama, kamu membangun pertahanan dan bertahan hidup lebih lama!</p>",
        choices: [
            {text: "🎮 MAIN LAGI", next: "start", effect: resetGame}
        ]
    },
    "fight": {
        story: "<p><strong>💀 BAD ENDING</strong></p><p>Kamu kalah melawan zombie. Terlalu banyak yang menyerang...</p>",
        choices: [
            {text: "🔄 COBA LAGI", next: "start", effect: resetGame}
        ]
    }
};

// GAME FUNCTIONS
function choose(choiceIndex) {
    const current = scenes[game.scene];
    const choice = current.choices[choiceIndex - 1];
    
    if (choice.effect) choice.effect();
    
    game.scene = choice.next;
    updateUI();
    
    playSound();
}

function updateUI() {
    // Update story
    document.getElementById("story").innerHTML = scenes[game.scene].story;
    
    // Update choices
    const choicesDiv = document.getElementById("choices");
    choicesDiv.innerHTML = "";
    
    scenes[game.scene].choices.forEach((choice, index) => {
        const button = document.createElement("button");
        button.textContent = choice.text;
        button.onclick = () => choose(index + 1);
        choicesDiv.appendChild(button);
    });
    
    // Update stats
    document.getElementById("hp").textContent = game.hp;
    document.getElementById("food").textContent = game.food;
    document.getElementById("ammo").textContent = game.ammo;
    
    // Update inventory
    document.getElementById("inv").textContent = game.inventory.join(", ");
    
    // Check if dead
    if (game.hp <= 0) {
        game.scene = "fight";
        updateUI();
    }
}

function addLog(message) {
    game.log.push(`[Day ${game.day}] ${message}`);
    const logDiv = document.getElementById("log");
    logDiv.innerHTML = game.log.map(msg => `<p>${msg}</p>`).join("");
    logDiv.scrollTop = logDiv.scrollHeight;
}

function playSound() {
    const sound = document.getElementById("sound");
    sound.currentTime = 0;
    sound.play().catch(e => console.log("Sound error"));
}

function resetGame() {
    game = {
        hp: 100,
        food: 3,
        ammo: 0,
        day: 1,
        inventory: ["Pisau Dapur", "Senter"],
        scene: "start",
        log: ["[06:00] Game dimulai..."]
    };
    updateUI();
}

// Initialize game
window.onload = updateUI;
