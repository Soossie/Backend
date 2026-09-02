# Kurssiprojekti
## Pohjautuu taustajärjestelmä-kurssin tunti 5:een asti tehtyyn pohjaan, jota on kehitetty
### Admin tunnukset
- Käyttäjä voi luoda adminkäyttäjän, jos antaa kutsussa AdminPassword headerin ja oikean salasanan
- Tallentaa tietokantaan käyttäjän admin statuksen is_admin
- Admin käyttäjä voi käyttää admin kutsuja, jotka vaativat requireAdmin middlewaren, kuten käyttäjien listaaminen ja poisto sekä profiilien haku

### HTTPS
- Palvelin käyttää sekä vaatii HTTPS-yhteyden, eikä tunnista HTTP-yhteyksiä. 
- Käyttää Noden omaa https moduulia
- Käyttää itse allekirjoitettua sertifikaattia sekä private avainta
- Verkkopeli ohittaa sertifikaatin varmennuksen, jotta itse allekirjoitettu menee läpi
- Verkkopeli hakee HTTPS-yhteyden

### Refresh Token (palvelin)
- Palvelin käyttää refresh tokenia käyttäjien tokenien uudelleen luomiseen
- Käyttäjä voi pyytää uuden access tokenin refresh tokenilla
- Palvelin suorittaa refresh tokenien rotaatiota, eli vanhentaa annetun validin refresh tokenin, luo uuden ja tallentaa sekä palauttaa sen. Samalla se luo ja palauttaa myös uuden access tokenin
- Palvelin tarkastaa, onko token "Active", "Used", vai "Revoked" sekä onko se erääntynyt
- Jos token on vanhentunut, palvelin ei luo uutta access tokenia
- Jos token on jo käytetty, palvelin invalidoi kaikki saman "perheen" refresh tokenit, eli kaikki jotka ovat samalta sessiolta. Palvelin ei myöskään hyväksy invalidoituja tokeneita uudelleen

### Refresh Token (Verkkopeli)
- Kirjautumissivulla on "Stay signed in" toggle, joka aktiivisena pyytää palvelimelta myös refresh tokenin ja tallettaa sen uutena RefreshToken AccessTokenina (uudelleenkäytin samaa struktia)
- Jos session palautus ei onnistu (access token on vanhentunut yms), verkkopeli yrittää saada uuden access tokenin refresh tokenilla ja onnistuessa kirjaa sisään sekä tallettaa uudet refresh ja access tokenit

Main menu controller ottaa myös käyttäjän profiilin värin ja nimen ja tervehtii niillä päävalikossa!