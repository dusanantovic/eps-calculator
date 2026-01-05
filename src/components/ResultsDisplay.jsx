import ZoneDisplay from './ZoneDisplay';

function ResultsDisplay({ rezultat, inputs }) {
  if (!rezultat) return null;

  const {
    visaTarifa, nizaTarifa, obracunskaSnagazKW, cenaObracunskeSanage,
    popust, naknadaPodsticanje, naknadaUnapredjenje, akciza, pdv, zaduzenjePrethodni
  } = inputs;

  return (
    <div id="rezultat">
      <h3>POTROŠNJA U OBRAČUNSKOM PERIODU {rezultat.ukupnoUtroseno.toFixed(0)} kWh</h3>
      <div className="spec">
        <span className="label">Utrošeno u višoj tarifi (VT):</span> {visaTarifa.toFixed(0)} kWh ({rezultat.odnosVT.toFixed(2)}%)
      </div>
      <div className="spec">
        <span className="label">Utrošeno u nižoj tarifi (NT):</span> {nizaTarifa.toFixed(0)} kWh ({rezultat.odnosNT.toFixed(2)}%)
      </div>
      <hr />

      <h4>Distribucija po zonama:</h4>
      <ZoneDisplay
        zoneName="Zelena zona"
        className="zone-green"
        range={`do ${rezultat.zelenaGranica.toFixed(2)} kWh`}
        zone={rezultat.zone.zelena}
        cene={{ visa: rezultat.cenePoZonama.visa.zelena, niza: rezultat.cenePoZonama.niza.zelena }}
      />

      <ZoneDisplay
        zoneName="Plava zona"
        className="zone-blue"
        range={`${rezultat.zelenaGranica.toFixed(2)} - ${rezultat.plavaGranica.toFixed(2)} kWh`}
        zone={rezultat.zone.plava}
        cene={{ visa: rezultat.cenePoZonama.visa.plava, niza: rezultat.cenePoZonama.niza.plava }}
      />

      <ZoneDisplay
        zoneName="Crvena zona"
        className="zone-red"
        range={`preko ${rezultat.plavaGranica.toFixed(2)} kWh`}
        zone={rezultat.zone.crvena}
        cene={{ visa: rezultat.cenePoZonama.visa.crvena, niza: rezultat.cenePoZonama.niza.crvena }}
      />

      <hr />
      <h4>OBRAČUN ZA ELEKTIČNU ENERGIJU</h4>
      <div className="spec">
        <span className="label">1. Obračunska snaga:</span> {obracunskaSnagazKW} kW × {cenaObracunskeSanage} = {rezultat.stavka1.toFixed(2)} RSD
      </div>
      <div className="spec">
        <span className="label">2. Trošak garantovanog snabdevača:</span> {rezultat.stavka2.toFixed(2)} RSD
      </div>
      <div className="spec">
        <span className="label">3. Energija:</span> {rezultat.stavka3.toFixed(2)} RSD
      </div>
      <div className="spec indent">
        Ostvarena prosečna cena el. energije: {rezultat.prosecnaCena.toFixed(2)} RSD/kWh
      </div>
      <div className="spec">
        <span className="label">4. Zaduženje za el. energiju (1+2+3):</span> {rezultat.stavka4.toFixed(2)} RSD
      </div>
      <div className="spec">
        <span className="label">5. Popust {popust.toFixed(0)}%:</span> {rezultat.stavka5.toFixed(2)} RSD
      </div>
      <div className="spec">
        <span className="label">6. Naknada za podsticanje:</span> {rezultat.ukupnoUtroseno.toFixed(0)} × {naknadaPodsticanje} = {rezultat.stavka6.toFixed(2)} RSD
      </div>
      <div className="spec">
        <span className="label">7. Naknada za unapređenje:</span> {rezultat.ukupnoUtroseno.toFixed(0)} × {naknadaUnapredjenje} = {rezultat.stavka7.toFixed(2)} RSD
      </div>
      <div className="spec">
        <span className="label">8. Osnovica za obračun akcize (4+5+6+7):</span> {rezultat.stavka8.toFixed(2)} RSD
      </div>
      <div className="spec">
        <span className="label">9. Iznos akcize ({akciza.toFixed(1)}%):</span> {rezultat.stavka9.toFixed(2)} RSD
      </div>
      <div className="spec">
        <span className="label">10. Osnovica za PDV (4+5+6+7+9):</span> {rezultat.stavka10.toFixed(2)} RSD
      </div>
      <div className="spec">
        <span className="label">11. Iznos PDV ({pdv.toFixed(1)}%):</span> {rezultat.stavka11.toFixed(2)} RSD
      </div>
      <div className="spec">
        <span className="label">14. Zaduženje za obračunski period (10+11):</span> {rezultat.stavka14.toFixed(2)} RSD
      </div>
      <div className="spec">
        <span className="label">15. Taksa za javni medijski servis:</span> {rezultat.stavka15.toFixed(2)} RSD
      </div>
      <hr />
      <div className="total">
        A. UKUPNO ZADUŽENJE ZA OBRAČUNSKI PERIOD: {rezultat.stavkaA.toFixed(2)} RSD
      </div>
      {zaduzenjePrethodni > 0 && (
        <>
          <div className="spec">
            <span className="label">Zaduženje za prethodni period:</span> +{zaduzenjePrethodni.toFixed(2)} RSD
          </div>
          <div className="total">ZA UPLATU: {rezultat.zaUplatu.toFixed(2)} RSD</div>
        </>
      )}
    </div>
  );
}

export default ResultsDisplay;
