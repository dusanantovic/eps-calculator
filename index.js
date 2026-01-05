function izracunajRacun() {
    // Unosi potrošnje
    let visaTarifaUtroseno = parseFloat(document.getElementById("visaInput").value) || 0;
    let nizaTarifaUtroseno = parseFloat(document.getElementById("nizaInput").value) || 0;
    let ukupnoUtroseno = visaTarifaUtroseno + nizaTarifaUtroseno;

    // Fiksni troškovi
    let obracunskaSnagazKW = parseFloat(document.getElementById("obracunskaSnagazKW").value) || 0;
    let cenaObracunskeSanage = parseFloat(document.getElementById("cenaObracunskeSanage").value) || 0;
    let trosakGarantovanogSnabdevaca = parseFloat(document.getElementById("trosakGarantovanogSnabdevaca").value) || 0;

    // Broj dana u obračunskom periodu
    let brojDana = parseFloat(document.getElementById("brojDana").value) || 30;

    // Popust
    let popust = parseFloat(document.getElementById("popust").value) / 100 || 0;

    // Parametri iz inputa
    let naknadaZaPodsticanje = parseFloat(document.getElementById("naknadaPodsticanje").value) || 0;
    let naknadaZaUnapredjenje = parseFloat(document.getElementById("naknadaUnapredjenje").value) || 0;
    let akciza = parseFloat(document.getElementById("akciza").value) / 100 || 0;
    let pdv = parseFloat(document.getElementById("pdv").value) / 100 || 0;
    let taksaZaJavniMedijskiServis = parseFloat(document.getElementById("taksaJavniServis").value) || 0;
    let zaduzenjeZaPrethodniPeriod = parseFloat(document.getElementById("zaduzenjePrethodni").value) || 0;

    // Cene po zonama
    const cenePoZonama = {
        visa: {
            zelena: 9.6136,
            plava: 14.4203,
            crvena: 28.8407
        },
        niza: {
            zelena: 2.4034,
            plava: 3.6051,
            crvena: 7.2102
        }
    };

    // Prilagođavanje granica zona prema broju dana
    let zelenaGranica = 350 + (brojDana - 30) * 11.67;
    let plavaGranica = 1200 + (brojDana - 30) * 40;

    // Odnos VT:NT u ukupnoj potrošnji
    let odnosVT = visaTarifaUtroseno / ukupnoUtroseno;
    let odnosNT = nizaTarifaUtroseno / ukupnoUtroseno;

    // Distribucija po zonama
    let zone = {
        zelena: { vt: 0, nt: 0, ukupno: 0 },
        plava: { vt: 0, nt: 0, ukupno: 0 },
        crvena: { vt: 0, nt: 0, ukupno: 0 }
    };

    let ostatak = ukupnoUtroseno;

    // Zelena zona
    if (ostatak > 0) {
        let zelenaKolicina = Math.min(ostatak, zelenaGranica);
        zone.zelena.ukupno = zelenaKolicina;
        zone.zelena.vt = zelenaKolicina * odnosVT;
        zone.zelena.nt = zelenaKolicina * odnosNT;
        ostatak -= zelenaKolicina;
    }

    // Plava zona
    if (ostatak > 0) {
        let plavaKolicina = Math.min(ostatak, plavaGranica - zelenaGranica);
        zone.plava.ukupno = plavaKolicina;
        zone.plava.vt = plavaKolicina * odnosVT;
        zone.plava.nt = plavaKolicina * odnosNT;
        ostatak -= plavaKolicina;
    }

    // Crvena zona
    if (ostatak > 0) {
        zone.crvena.ukupno = ostatak;
        zone.crvena.vt = ostatak * odnosVT;
        zone.crvena.nt = ostatak * odnosNT;
    }

    // Obračun energije po zonama
    let iznosZelena = zone.zelena.vt * cenePoZonama.visa.zelena + zone.zelena.nt * cenePoZonama.niza.zelena;
    let iznosPlava = zone.plava.vt * cenePoZonama.visa.plava + zone.plava.nt * cenePoZonama.niza.plava;
    let iznosCrvena = zone.crvena.vt * cenePoZonama.visa.crvena + zone.crvena.nt * cenePoZonama.niza.crvena;
    let ukupnaEnergija = iznosZelena + iznosPlava + iznosCrvena;

    // 1. Obračunska snaga
    let stavka1 = obracunskaSnagazKW * cenaObracunskeSanage;

    // 2. Trošak garantovanog snabdevača
    let stavka2 = trosakGarantovanogSnabdevaca;

    // 3. Energija
    let stavka3 = ukupnaEnergija;

    // 4. Zaduženje za električnu energiju (1+2+3)
    let stavka4 = stavka1 + stavka2 + stavka3;

    // 5. Popust
    let stavka5 = -stavka4 * popust;

    // 6. Naknada za podsticanje
    let stavka6 = ukupnoUtroseno * naknadaZaPodsticanje;

    // 7. Naknada za unapređenje
    let stavka7 = ukupnoUtroseno * naknadaZaUnapredjenje;

    // 8. Osnovica za obračun akcize (4+5+6+7)
    let stavka8 = stavka4 + stavka5 + stavka6 + stavka7;

    // 9. Iznos akcize
    let stavka9 = stavka8 * akciza;

    // 10. Osnovica za PDV (4+5+6+7+9)
    let stavka10 = stavka8 + stavka9;

    // 11. Iznos PDV
    let stavka11 = stavka10 * pdv;

    // 14. Zaduženje za obračunski period (10+11)
    let stavka14 = stavka10 + stavka11;

    // 15. Taksa za javni medijski servis
    let stavka15 = taksaZaJavniMedijskiServis;

    // A. Ukupno zaduženje za obračunski period (14+15)
    let stavkaA = stavka14 + stavka15;

    // Prosečna cena energije
    let prosecnaCena = ukupnaEnergija / ukupnoUtroseno;

    // Prikaz rezultata
    document.getElementById("rezultat").innerHTML = `
        <h3>POTROŠNJA U OBRAČUNSKOM PERIODU ${ukupnoUtroseno.toFixed(0)} kWh</h3>
        <div class="spec"><span class="label">Utrošeno u višoj tarifi (VT):</span> ${visaTarifaUtroseno.toFixed(0)} kWh (${(odnosVT * 100).toFixed(2)}%)</div>
        <div class="spec"><span class="label">Utrošeno u nižoj tarifi (NT):</span> ${nizaTarifaUtroseno.toFixed(0)} kWh (${(odnosNT * 100).toFixed(2)}%)</div>
        <hr>
        <h4>Distribucija po zonama:</h4>
        <div class="zone-green">
            <div class="spec"><span class="label">Zelena zona (do ${zelenaGranica.toFixed(2)} kWh):</span> ${zone.zelena.ukupno.toFixed(0)} kWh</div>
            <div class="spec indent">VT: ${zone.zelena.vt.toFixed(0)} kWh × ${cenePoZonama.visa.zelena} = ${(zone.zelena.vt * cenePoZonama.visa.zelena).toFixed(2)} RSD</div>
            <div class="spec indent">NT: ${zone.zelena.nt.toFixed(0)} kWh × ${cenePoZonama.niza.zelena} = ${(zone.zelena.nt * cenePoZonama.niza.zelena).toFixed(2)} RSD</div>
            <div class="spec indent"><strong>Ukupno: ${iznosZelena.toFixed(2)} RSD</strong></div>
        </div>
        <div class="zone-blue">
            <div class="spec"><span class="label">Plava zona (${zelenaGranica.toFixed(2)} - ${plavaGranica.toFixed(2)} kWh):</span> ${zone.plava.ukupno.toFixed(0)} kWh</div>
            <div class="spec indent">VT: ${zone.plava.vt.toFixed(0)} kWh × ${cenePoZonama.visa.plava} = ${(zone.plava.vt * cenePoZonama.visa.plava).toFixed(2)} RSD</div>
            <div class="spec indent">NT: ${zone.plava.nt.toFixed(0)} kWh × ${cenePoZonama.niza.plava} = ${(zone.plava.nt * cenePoZonama.niza.plava).toFixed(2)} RSD</div>
            <div class="spec indent"><strong>Ukupno: ${iznosPlava.toFixed(2)} RSD</strong></div>
        </div>
        <div class="zone-red">
            <div class="spec"><span class="label">Crvena zona (preko ${plavaGranica.toFixed(2)} kWh):</span> ${zone.crvena.ukupno.toFixed(0)} kWh</div>
            <div class="spec indent">VT: ${zone.crvena.vt.toFixed(0)} kWh × ${cenePoZonama.visa.crvena} = ${(zone.crvena.vt * cenePoZonama.visa.crvena).toFixed(2)} RSD</div>
            <div class="spec indent">NT: ${zone.crvena.nt.toFixed(0)} kWh × ${cenePoZonama.niza.crvena} = ${(zone.crvena.nt * cenePoZonama.niza.crvena).toFixed(2)} RSD</div>
            <div class="spec indent"><strong>Ukupno: ${iznosCrvena.toFixed(2)} RSD</strong></div>
        </div>
        <hr>
        <h4>OBRAČUN ZA ELEKTIČNU ENERGIJU</h4>
        <div class="spec"><span class="label">1. Obračunska snaga:</span> ${obracunskaSnagazKW} kW × ${cenaObracunskeSanage} = ${stavka1.toFixed(2)} RSD</div>
        <div class="spec"><span class="label">2. Trošak garantovanog snabdevača:</span> ${stavka2.toFixed(2)} RSD</div>
        <div class="spec"><span class="label">3. Energija:</span> ${stavka3.toFixed(2)} RSD</div>
        <div class="spec indent">Ostvarena prosečna cena el. energije: ${prosecnaCena.toFixed(2)} RSD/kWh</div>
        <div class="spec"><span class="label">4. Zaduženje za el. energiju (1+2+3):</span> ${stavka4.toFixed(2)} RSD</div>
        <div class="spec"><span class="label">5. Popust ${(popust * 100).toFixed(0)}%:</span> ${stavka5.toFixed(2)} RSD</div>
        <div class="spec"><span class="label">6. Naknada za podsticanje:</span> ${ukupnoUtroseno.toFixed(0)} × ${naknadaZaPodsticanje} = ${stavka6.toFixed(2)} RSD</div>
        <div class="spec"><span class="label">7. Naknada za unapređenje:</span> ${ukupnoUtroseno.toFixed(0)} × ${naknadaZaUnapredjenje} = ${stavka7.toFixed(2)} RSD</div>
        <div class="spec"><span class="label">8. Osnovica za obračun akcize (4+5+6+7):</span> ${stavka8.toFixed(2)} RSD</div>
        <div class="spec"><span class="label">9. Iznos akcize (${(akciza * 100).toFixed(1)}%):</span> ${stavka9.toFixed(2)} RSD</div>
        <div class="spec"><span class="label">10. Osnovica za PDV (4+5+6+7+9):</span> ${stavka10.toFixed(2)} RSD</div>
        <div class="spec"><span class="label">11. Iznos PDV (${(pdv * 100).toFixed(1)}%):</span> ${stavka11.toFixed(2)} RSD</div>
        <div class="spec"><span class="label">14. Zaduženje za obračunski period (10+11):</span> ${stavka14.toFixed(2)} RSD</div>
        <div class="spec"><span class="label">15. Taksa za javni medijski servis:</span> ${stavka15.toFixed(2)} RSD</div>
        <hr>
        <div class="total">A. UKUPNO ZADUŽENJE ZA OBRAČUNSKI PERIOD: ${stavkaA.toFixed(2)} RSD</div>
        ${zaduzenjeZaPrethodniPeriod > 0 ? `<div class="spec"><span class="label">Zaduženje za prethodni period:</span> +${zaduzenjeZaPrethodniPeriod.toFixed(2)} RSD</div>
        <div class="total">ZA UPLATU: ${(stavkaA + zaduzenjeZaPrethodniPeriod).toFixed(2)} RSD</div>` : ''}
    `;
}
