


# Wwv

Angular CLI verison 7.3.4.

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
