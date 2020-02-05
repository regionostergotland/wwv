# Wwv 
Wwv är en förkortning av atudentprojektet egenvalda namn "World Wide Vård" som genomfördes som gemensamt kandidatarbete och del i en kurs i programutvecklingsmetodik för civilingenjörer vid Linköpings universiet på uppdrag av Region Östergötland.

* Projektrapport/kandidatarbeten: http://urn.kb.se/resolve?urn=urn%3Anbn%3Ase%3Aliu%3Adiva-157977
* Teknisk dokumentation (PDF): https://github.com/regionostergotland/wwv/raw/master/documentation/build/techdoc.pdf

Uppdateringar:
- Sommaren 2019; En av Wwv-projektets deltagare, Noah Hellman, sommarjobbade hos Region Östergötland (RÖ) och skapade en version av projetet med Bank-ID-inlogg m.m.som kunde kopplas till RÖs interna servrar ochy IDP-lösning. Han hjälpte också till att skapa fler openEHR-arketyper för registrering av fysisk aktivitet, se https://github.com/regionostergotland/Physical_activity
- Vårterminen 2020; en studentgrupp från utbildningen Innovativ Programmering vid Linköpings universitet vidareutvecklar, förbättar och utökar funktionaliteten, se presentation av uppdrag på https://drive.google.com/file/d/1YtftRxhyIiBVuXFA4__K5ZNQ-RY5RUQ9/view?usp=sharing resultat kommer länkas till även härifrån när projektet är avslutat.

## Stilguide

Se stilguide.pdf som baseras på https://angular.io/guide/styleguide

## TypeDoc
Använd [TypeDoc](https://typedoc.org/)  för att dokumentera kod. Exempel:

```TypeScript
  /**
   * This is a test function that returns 42
   * @param number discardable number
   * @returns the number 42
   */
  testFunction(nr: number) : number {
    return 42;
  }
```

Ange kommanot `npm run docs` för att generera dokumentation för projektet. Öppna docs/index.html
i en webbläsare för att se resultatet. Konfiguration finns i typedoc.json.


Läs genom [guiden](https://typedoc.org/guides/doccomments/) (2 min läsning) för
mer info. Funktionskommentarer skrivs på engelska.


## Merge Requests
* Kod ska gå genom testning
* Följ commitreglerna listade nedan
* Kod ska följa stilguiden
* Kod ska godkännas av granskare


## Commit regler
* Separera titel från beskrivande text med ett blanksteg
* Begränsa commit titel till 50 karaktärer
* Stor bokstav i början av titel
* Inga punkter i slutet av titel
* Skriv imperativt (i imperative mood) i titel
* Brödtext radlängd ska vara max 72 karaktärer
* Använd brödtexten för att beskriva varför, inte vad     
* Commit kommentarer ska vara på engelska

## Granskingspointers
* Se till att kooden som granskas:
* Följer koden stilguiden
* Följer rådande arkitektur
* Har tillräckliga tester
* Följer commitregler

## Kodstruktur
I src/app är projektets utvecklingsfiler samlade.

Mappen ehr är samling av filer angående integration till ***REMOVED*** och format ärvda
från openEHRs standard.

Mappen platform är samling av specifika implementationerna av externa
hälsoplattformer och dess abstrakta förälderklass.

Conveyor är den centrala punkten för att koppla samman projektets moduler för
och är fasaden i fasadmönstret.

## Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Diverse
 Angular CLI verison 7.3.4.

