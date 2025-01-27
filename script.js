const groepen = {
    speelclubs: [
        { voornaam: "Harley" },
        { voornaam: "Umut" },
        { voornaam: "Utku" },
        { voornaam: "Eloise" },
        { voornaam: "Robbe" },
        { voornaam: "Fleur" },
        { voornaam: "Billie" },
        { voornaam: "Eliza" },
        { voornaam: "Louise H" },
        { voornaam: "Aeryn" },
        { voornaam: "Stan" },
        { voornaam: "Roos" },
        { voornaam: "Nore" },
        { voornaam: "Alicia" },
        { voornaam: "Allesandra" },
        { voornaam: "Liene" },
        { voornaam: "Axana" },
        { voornaam: "Sophia" },
        { voornaam: "Quinn" }
    ],
    rakwis: [
        { voornaam: "Julie T" },
        { voornaam: "Léonie" },
        { voornaam: "Julie K" },
        { voornaam: "Eline" },
        { voornaam: "Elise Wa" },
        { voornaam: "Stella" },
        { voornaam: "Axelle" },
        { voornaam: "Aren" },
        { voornaam: "Marie V" },
        { voornaam: "Olivia" },
        { voornaam: "Nathan" },
        { voornaam: "Lucas" },
        { voornaam: "Alexa" },
        { voornaam: "Inaya" },
        { voornaam: "Sterre" },
        { voornaam: "Toon" }
    ],
    titos: [
        { voornaam: "Marie T" },
        { voornaam: "Jinte" },
        { voornaam: "Oona" },
        { voornaam: "Rhune" },
        { voornaam: "Rohan" },
        { voornaam: "Louise V" },
        { voornaam: "Margo" },
        { voornaam: "Noor" },
        { voornaam: "Lotte" },
        { voornaam: "Alexi" },
        { voornaam: "Annelien" },
        { voornaam: "Lore" },
        { voornaam: "Ada" },
        { voornaam: "Elise Wo" },
        { voornaam: "Lars" },
        { voornaam: "Senne" },
        { voornaam: "Tristan" },
        { voornaam: "Seppe" }
    ]
};

function loadNames() {
    const container = document.getElementById("groupTables");
    container.innerHTML = ""; // Oude inhoud wissen

    Object.keys(groepen).forEach(groupName => {
        let groupData = groepen[groupName].sort((a, b) => a.voornaam.localeCompare(b.voornaam));

        // Maak een sectie voor de groep
        let groupSection = document.createElement("section");
        groupSection.classList.add("group-section");

        let title = document.createElement("h2");
        title.textContent = groupName.charAt(0).toUpperCase() + groupName.slice(1);
        groupSection.appendChild(title);

        // Maak een tabel voor de groep
        let table = document.createElement("table");
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Voornaam</th>
                    <th>Aanwezig?</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;

        let tbody = table.querySelector("tbody");

        // Voeg namen toe aan de tabel
        groupData.forEach((persoon, index) => {
            let row = tbody.insertRow();
            let cell1 = row.insertCell(0);
            let cell2 = row.insertCell(1);

            cell1.textContent = persoon.voornaam;

            let checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = `aanwezig-${groupName}-${index}`;

            checkbox.addEventListener("change", () => {
                localStorage.setItem(checkbox.id, checkbox.checked);
            });

            cell2.appendChild(checkbox);
        });

        groupSection.appendChild(table);
        container.appendChild(groupSection);
    });
}

// Functie om alle groepen naar Excel te exporteren
function exportToExcel() {
    const date = document.getElementById("dateInput").value;
    let workbook = XLSX.utils.book_new();

    Object.keys(groepen).forEach(group => {
        let attendanceData = groepen[group].map((persoon, index) => {
            let checkbox = document.getElementById(`aanwezig-${group}-${index}`);
            return {
                "Voornaam": persoon.voornaam,
                "Aanwezig": checkbox.checked ? "Ja" : "Nee"
            };
        });

        let worksheet = XLSX.utils.json_to_sheet(attendanceData);
        XLSX.utils.book_append_sheet(workbook, worksheet, group.charAt(0).toUpperCase() + group.slice(1));
    });

    XLSX.writeFile(workbook, `Aanwezigheidslijst-${date}.xlsx`);
}

// Functie om alle groepen naar een tekstbestand te exporteren
function exportToTextFile() {
    const date = document.getElementById("dateInput").value;
    let content = `Aanwezigheidslijst\nDatum: ${date}\n\n`;

    Object.keys(groepen).forEach(group => {
        content += `--- ${group.charAt(0).toUpperCase() + group.slice(1)} ---\n`;

        let groupData = groepen[group].map((persoon, index) => {
            let checkbox = document.getElementById(`aanwezig-${group}-${index}`);
            return `${persoon.voornaam}: ${checkbox.checked ? "Aanwezig" : "Niet aanwezig"}`;
        });

        content += groupData.join("\n") + "\n\n";
    });

    let blob = new Blob([content], { type: "text/plain" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Aanwezigheidslijst-${date}.txt`;

    link.click();
}

// Zet de datum standaard op vandaag en laad de namen
window.onload = function () {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById("dateInput").value = today;
    loadNames();
};