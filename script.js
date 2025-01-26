// Lijsten met namen per groep
const groepen = {
    speelclubs: [
        { voornaam: "Harley", achternaam: "Billet" },
        { voornaam: "Umut", achternaam: "Unal" },
        { voornaam: "Utku", achternaam: "Unal" },
        { voornaam: "Eloise", achternaam: "Vanzier" },
        { voornaam: "Robbe", achternaam: "Deferme" },
        { voornaam: "Fleur", achternaam: "Schroyen" },
        { voornaam: "Billie", achternaam: "Oeyen" },
        { voornaam: "Eliza", achternaam: "Nijs" },
        { voornaam: "Louise", achternaam: "Heylen" },
        { voornaam: "Aeryn", achternaam: "Goemaere" },
        { voornaam: "Stan", achternaam: "Verherstraeten" },
        { voornaam: "Roos", achternaam: "Thijs" },
        { voornaam: "Nore", achternaam: "Konix" },
        { voornaam: "Alicia", achternaam: "Braeckman" },
        { voornaam: "Allesandra", achternaam: "Nlookianowska" },
        { voornaam: "Liene", achternaam: "Konix" },
        { voornaam: "Axana", achternaam: "Volders" },
        { voornaam: "Sophia", achternaam: "Braeckman" },
        { voornaam: "Quinn", achternaam: "Nijs" }
    ],
    rakwis: [
        { voornaam: "Julie", achternaam: "Tournicourt" },
        { voornaam: "Léonie", achternaam: "Vanzier" },
        { voornaam: "Julie", achternaam: "Kenens" },
        { voornaam: "Eline", achternaam: "Moons" },
        { voornaam: "Elise", achternaam: "Wallaert" },
        { voornaam: "Stella", achternaam: "Oeyen" },
        { voornaam: "Axelle", achternaam: "Wolf" },
        { voornaam: "Aren", achternaam: "Cuypers" },
        { voornaam: "Marie", achternaam: "Vanzier" },
        { voornaam: "Olivia", achternaam: "Jastrzebska" },
        { voornaam: "Nathan", achternaam: "Loos" },
        { voornaam: "Lucas", achternaam: "Loos" },
        { voornaam: "Alexa", achternaam: "Hulsmans" },
        { voornaam: "Inaya", achternaam: "Vrijssen" },
        { voornaam: "Sterre", achternaam: "Nouwen" },
        { voornaam: "Toon", achternaam: "Deferme" },
    ],
    titos: [  // Voeg hier de gegevens voor Titos toe
        { voornaam: "Marie", achternaam: "Tournicourt" },
        { voornaam: "Jinte", achternaam: "Tureluren" },
        { voornaam: "Oona", achternaam: "Gijsbers" },
        { voornaam: "Rhune", achternaam: "Dausy" },
        { voornaam: "Rohan", achternaam: "Goemaere" },
        { voornaam: "Louise", achternaam: "Vints" },
        { voornaam: "Margo", achternaam: "Borremans" },
        { voornaam: "Noor", achternaam: "Veuchelen" },
        { voornaam: "Lotte", achternaam: "Das" },
        { voornaam: "Alexi", achternaam: "Monnens" },
        { voornaam: "Annelien", achternaam: "Troonbeeckx" },
        { voornaam: "Lore", achternaam: "Janssen" },
        { voornaam: "Ada", achternaam: "Unal" },
        { voornaam: "Elise", achternaam: "Wolf" },
        { voornaam: "Lars", achternaam: "Cuypers" },
        { voornaam: "Senne", achternaam: "Vanzier" },
        { voornaam: "Tristan", achternaam: "Schroyen" },
        { voornaam: "Seppe", achternaam: "Winten" }
    ]
};

// Functie om namen in de tabel te laden
function loadNames() {
    const group = document.getElementById("groupSelect").value;
    const table = document.getElementById("attendanceTable");
    const tbody = table.querySelector("tbody");

    if (!group) {
        table.classList.add("hidden");
        return;
    }

    tbody.innerHTML = ""; // Oude gegevens wissen
    groepen[group].forEach((persoon, index) => {
        let row = tbody.insertRow();
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);

        cell1.textContent = persoon.voornaam;
        cell2.textContent = persoon.achternaam;

        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `aanwezig-${group}-${index}`;
        checkbox.checked = false;

        checkbox.addEventListener("change", () => {
            localStorage.setItem(checkbox.id, checkbox.checked);
        });

        cell3.appendChild(checkbox);
    });

    table.classList.remove("hidden");
}

// Zet de datum standaard op vandaag
window.onload = function() {
    const today = new Date().toISOString().split('T')[0]; // Verkrijg de datum in het formaat YYYY-MM-DD
    document.getElementById("dateInput").value = today; // Zet deze waarde als de waarde van het date input veld
};


// Functie om aanwezigheidsgegevens direct naar een Excel-bestand te exporteren
function exportToExcel() {
    const group = document.getElementById("groupSelect").value;
    const date = document.getElementById("dateInput").value;
    
    if (!group || !date) {
        alert("Selecteer eerst een groep en een datum!");
        return;
    }

    let attendanceData = groepen[group].map((persoon, index) => {
        let checkbox = document.getElementById(`aanwezig-${group}-${index}`);
        return {
            "Voornaam": persoon.voornaam,
            "Achternaam": persoon.achternaam,
            "Aanwezig": checkbox.checked ? "Ja" : "Nee"
        };
    });

    let worksheet = XLSX.utils.json_to_sheet(attendanceData);
    let workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Aanwezigheid");

    XLSX.writeFile(workbook, `Aanwezigheidslijst-${group}-${date}.xlsx`);
}

// Functie om aanwezigheidsgegevens direct naar een tekstbestand te exporteren (voor Notes)
function exportToTextFile() {
    const group = document.getElementById("groupSelect").value; // Haal de geselecteerde groep op
    const date = document.getElementById("dateInput").value;
    
    if (!group || !date) {
        alert("Selecteer eerst een groep en een datum!");
        return;
    }

    let attendanceData = groepen[group].map((persoon, index) => {
        let checkbox = document.getElementById(`aanwezig-${group}-${index}`);
        let aanwezigheid = checkbox.checked ? "Aanwezig" : "Niet aanwezig";
        return `${persoon.voornaam} ${persoon.achternaam} - ${aanwezigheid}`;
    });

    let content = `Aanwezigheidslijst voor groep: ${group}\nDatum: ${date}\n\n` + attendanceData.join("\n");

    // Maak een Blob van de tekst
    let blob = new Blob([content], { type: "text/plain" });

    // Maak een downloadlink voor het bestand
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Aanwezigheidslijst-${group}-${date}.txt`;

    // Simuleer een klik om het bestand te downloaden
    link.click();
}
