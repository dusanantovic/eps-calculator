import { useState } from 'react';
import './App.css';
import InputField from './components/InputField';
import ResultsDisplay from './components/ResultsDisplay';

function App() {
  const [visaTarifa, setVisaTarifa] = useState(0);
  const [nizaTarifa, setNizaTarifa] = useState(0);
  const [obracunskaSnagazKW, setObracunskaSnagazKW] = useState(11.04);
  const [cenaObracunskeSanage, setCenaObracunskeSanage] = useState(60.8947);
  const [trosakGarantovanogSnabdevaca, setTrosakGarantovanogSnabdevaca] = useState(160.67);
  const [brojDana, setBrojDana] = useState(31);
  const [popust, setPopust] = useState(7);
  const [naknadaPodsticanje, setNaknadaPodsticanje] = useState(0.801);
  const [naknadaUnapredjenje, setNaknadaUnapredjenje] = useState(0.015);
  const [akciza, setAkciza] = useState(7.5);
  const [pdv, setPdv] = useState(20);
  const [taksaJavniServis, setTaksaJavniServis] = useState(349);
  const [zaduzenjePrethodni, setZaduzenjePrethodni] = useState(0);
  const [rezultat, setRezultat] = useState(null);

  const izracunajRacun = () => {
    const ukupnoUtroseno = visaTarifa + nizaTarifa;

    const cenePoZonama = {
      visa: { zelena: 9.6136, plava: 14.4203, crvena: 28.8407 },
      niza: { zelena: 2.4034, plava: 3.6051, crvena: 7.2102 }
    };

    const zelenaGranica = 350 + (brojDana - 30) * 11.67;
    const plavaGranica = 1200 + (brojDana - 30) * 40;

    const odnosVT = visaTarifa / ukupnoUtroseno;
    const odnosNT = nizaTarifa / ukupnoUtroseno;

    const zone = {
      zelena: { vt: 0, nt: 0, ukupno: 0 },
      plava: { vt: 0, nt: 0, ukupno: 0 },
      crvena: { vt: 0, nt: 0, ukupno: 0 }
    };

    let ostatak = ukupnoUtroseno;

    if (ostatak > 0) {
      const zelenaKolicina = Math.min(ostatak, zelenaGranica);
      zone.zelena.ukupno = zelenaKolicina;
      zone.zelena.vt = zelenaKolicina * odnosVT;
      zone.zelena.nt = zelenaKolicina * odnosNT;
      ostatak -= zelenaKolicina;
    }

    if (ostatak > 0) {
      const plavaKolicina = Math.min(ostatak, plavaGranica - zelenaGranica);
      zone.plava.ukupno = plavaKolicina;
      zone.plava.vt = plavaKolicina * odnosVT;
      zone.plava.nt = plavaKolicina * odnosNT;
      ostatak -= plavaKolicina;
    }

    if (ostatak > 0) {
      zone.crvena.ukupno = ostatak;
      zone.crvena.vt = ostatak * odnosVT;
      zone.crvena.nt = ostatak * odnosNT;
    }

    const iznosZelena = zone.zelena.vt * cenePoZonama.visa.zelena + zone.zelena.nt * cenePoZonama.niza.zelena;
    const iznosPlava = zone.plava.vt * cenePoZonama.visa.plava + zone.plava.nt * cenePoZonama.niza.plava;
    const iznosCrvena = zone.crvena.vt * cenePoZonama.visa.crvena + zone.crvena.nt * cenePoZonama.niza.crvena;
    const ukupnaEnergija = iznosZelena + iznosPlava + iznosCrvena;

    const stavka1 = obracunskaSnagazKW * cenaObracunskeSanage;
    const stavka2 = trosakGarantovanogSnabdevaca;
    const stavka3 = ukupnaEnergija;
    const stavka4 = stavka1 + stavka2 + stavka3;
    const stavka5 = -stavka4 * (popust / 100);
    const stavka6 = ukupnoUtroseno * naknadaPodsticanje;
    const stavka7 = ukupnoUtroseno * naknadaUnapredjenje;
    const stavka8 = stavka4 + stavka5 + stavka6 + stavka7;
    const stavka9 = stavka8 * (akciza / 100);
    const stavka10 = stavka8 + stavka9;
    const stavka11 = stavka10 * (pdv / 100);
    const stavka14 = stavka10 + stavka11;
    const stavka15 = taksaJavniServis;
    const stavkaA = stavka14 + stavka15;
    const prosecnaCena = ukupnaEnergija / ukupnoUtroseno;

    setRezultat({
      ukupnoUtroseno,
      odnosVT: odnosVT * 100,
      odnosNT: odnosNT * 100,
      zone,
      zelenaGranica,
      plavaGranica,
      iznosZelena,
      iznosPlava,
      iznosCrvena,
      cenePoZonama,
      stavka1,
      stavka2,
      stavka3,
      stavka4,
      stavka5,
      stavka6,
      stavka7,
      stavka8,
      stavka9,
      stavka10,
      stavka11,
      stavka14,
      stavka15,
      stavkaA,
      prosecnaCena,
      zaUplatu: stavkaA + zaduzenjePrethodni
    });
  };

  return (
    <div className="app">
      <h1>Obračun računa za električnu energiju</h1>

      <div className="container">
        <h3>Unos potrošnje</h3>
        <InputField
          label="Visoka tarifa (kWh):"
          value={visaTarifa}
          onChange={(e) => setVisaTarifa(parseFloat(e.target.value) || 0)}
        />

        <InputField
          label="Niska tarifa (kWh):"
          value={nizaTarifa}
          onChange={(e) => setNizaTarifa(parseFloat(e.target.value) || 0)}
        />

        <h3>Fiksni troškovi</h3>
        <InputField
          label="Obračunska snaga (kW):"
          value={obracunskaSnagazKW}
          onChange={(e) => setObracunskaSnagazKW(parseFloat(e.target.value) || 0)}
          step="0.01"
        />

        <InputField
          label="Cena obračunske snage (RSD/kW):"
          value={cenaObracunskeSanage}
          onChange={(e) => setCenaObracunskeSanage(parseFloat(e.target.value) || 0)}
          step="0.0001"
        />

        <InputField
          label="Trošak garantovanog snabdevača (RSD):"
          value={trosakGarantovanogSnabdevaca}
          onChange={(e) => setTrosakGarantovanogSnabdevaca(parseFloat(e.target.value) || 0)}
          step="0.01"
        />

        <h3>Obračunski period</h3>
        <InputField
          label="Broj dana u obračunskom periodu:"
          value={brojDana}
          onChange={(e) => setBrojDana(parseFloat(e.target.value) || 30)}
        />

        <InputField
          label="Popust (%):"
          value={popust}
          onChange={(e) => setPopust(parseFloat(e.target.value) || 0)}
          step="0.1"
        />

        <h3>Naknade i porezi</h3>
        <InputField
          label="Naknada za podsticanje (RSD/kWh):"
          value={naknadaPodsticanje}
          onChange={(e) => setNaknadaPodsticanje(parseFloat(e.target.value) || 0)}
          step="0.001"
        />

        <InputField
          label="Naknada za unapređenje (RSD/kWh):"
          value={naknadaUnapredjenje}
          onChange={(e) => setNaknadaUnapredjenje(parseFloat(e.target.value) || 0)}
          step="0.001"
        />

        <InputField
          label="Akciza (%):"
          value={akciza}
          onChange={(e) => setAkciza(parseFloat(e.target.value) || 0)}
          step="0.1"
        />

        <InputField
          label="PDV (%):"
          value={pdv}
          onChange={(e) => setPdv(parseFloat(e.target.value) || 0)}
          step="0.1"
        />

        <InputField
          label="Taksa za javni medijski servis (RSD):"
          value={taksaJavniServis}
          onChange={(e) => setTaksaJavniServis(parseFloat(e.target.value) || 0)}
        />

        <InputField
          label="Zaduženje za prethodni period (RSD):"
          value={zaduzenjePrethodni}
          onChange={(e) => setZaduzenjePrethodni(parseFloat(e.target.value) || 0)}
        />

        <button onClick={izracunajRacun}>Izračunaj račun</button>

        <ResultsDisplay
          rezultat={rezultat}
          inputs={{
            visaTarifa,
            nizaTarifa,
            obracunskaSnagazKW,
            cenaObracunskeSanage,
            popust,
            naknadaPodsticanje,
            naknadaUnapredjenje,
            akciza,
            pdv,
            zaduzenjePrethodni
          }}
        />
      </div>
    </div>
  );
}

export default App;
