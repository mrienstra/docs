---
layout: ~/layouts/MainLayout.astro
title: Framework-Komponenten
description: Lerne, wie du React, Svelte, etc. nutzen kannst.
i18nReady: true
---
Erstelle deine Astro-Website, ohne dein favorisiertes Komponenten-Framework aufzugeben.

Astro unterstützt eine Vielzahl von beliebten Frameworks wie [React](https://reactjs.org/), [Preact](https://preactjs.com/), [Svelte](https://svelte.dev/), [Vue](https://vuejs.org/), [SolidJS](https://www.solidjs.com/), [AlpineJS](https://alpinejs.dev/) und [Lit](https://lit.dev/).

## Integrationen installieren

Astro kommt mit optionalen Integrationen für React, Preact, Svelte, Vue, SolidJS, AlpineJS und Lit. Beliebig viele dieser Astro-Integrationen können in deinem Projekt installiert und konfiguriert werden.

Um Astro für die Verwendung dieser Frameworks zu konfigurieren, installiere zunächst die Integration mit ihren Abhängigkeiten:

```bash
npm install --save-dev @astrojs/react react react-dom
```

Importiere anschließend ihre Funktion und füge sie deiner Liste von Integrationen in `astro.config.mjs` hinzu:

```js title="astro.config.mjs" ins={3} ins=/(?<!p)react\\(\\)/
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import preact from '@astrojs/preact';
import svelte from '@astrojs/svelte';
import vue from '@astrojs/vue';
import solid from '@astrojs/solid-js';
import lit from '@astrojs/lit';
import alpine from '@astrojs/alpinejs';

export default defineConfig({
	integrations: [react(), preact(), svelte(), vue(), solid(), lit(), alpine()],
});
```

⚙️ Sieh dir den [Integrationsleitfaden](/de/guides/integrations-guide/) an, um mehr Details zum Installieren und Konfigurieren von Astro-Integrationen zu erfahren.

⚙️ Möchtest du ein Beispiel für ein Framework deiner Wahl sehen? Besuche [astro.new](https://astro.new/) und wähle eine Framework-Vorlage.

## Framework-Komponenten nutzen

Nutze deine JavaScript-Framework-Komponenten in deinen Astro-Seiten, -Layouts und -Komponenten genauso wie deine Astro-Komponenten. Du kannst alle deine Komponenten zusammen in `/src/components` unterbringen oder sie auf eine andere Weise organisieren, die dir gefällt.

Um eine Framework-Komponente zu nutzen, importiere sie relativ in deine Astro-Komponente. Anschließend kannst du die Komponente neben anderen Komponenten, HTML-Elementen und JSX-ähnlichen Ausdrücken in der Komponentenvorlage verwenden.

```astro title="src/pages/static-components.astro" ins={2,7}
---
import MyReactComponent from '../components/MyReactComponent.jsx';
---
<html>
  <body>
    <h1>Nutze React-Komponenten direkt in Astro!</h1>
    <MyReactComponent />
  </body>
</html>
```

Standardmäßig werden die Framework-Komponenten als statisches HTML gerendert. Dies ist hilfreich für Template-Komponenten, die nicht interaktiv sind. Dadurch wird verhindert, dass unnötiges JavaScript an den Client gesendet wird.

## Interaktive Komponenten hydratisieren

Eine Framework-Komponente kann interaktiv gemacht (hydratisiert) werden, indem eine der [`client:*`-Direktiven](/de/reference/directives-reference/#client-directives) verwendet wird. Es handelt sich dabei um Komponenten-Attribute, die festlegen, wann der JavaScript-Code der Komponente an den Browser gesendet werden soll.

Bei allen Client-Direktiven außer `client:only` wird deine Komponente zuerst auf dem Server gerendert, um statisches HTML zu erzeugen. Der JavaScript-Code der Komponente wird entsprechend der Direktive deiner Wahl an den Browser gesendet. Die Komponente wird dann hydratisiert und wird interaktiv. 

```astro title="src/pages/interactive-components.astro" /client:\S+/
---
// Beispiel: Framework-Komponenten im Browser hydratisieren. 
import InteractiveButton from '../components/InteractiveButton.jsx';
import InteractiveCounter from '../components/InteractiveCounter.jsx';
import InteractiveModal from "../components/InteractiveModal.svelte"
---
<!-- Das JS dieser Komponente wird geladen, wenn die Seite lädt -->
<InteractiveButton client:load />

<!-- Das JS dieser Komponente wird nicht an den Client übertragen,
bis man herunterscrollt und die Komponente auf der Seite sichtbar ist -->
<InteractiveCounter client:visible />

<!-- Die Komponente wird nicht auf dem Server gerendert,
sondern wird vom Client gerendert, wenn die Seite lädt -->
<InteractiveModal client:only="svelte" />
```

Das zum Rendern der Komponente benötigte JavaScript-Framework (React, Svelte etc.) wird gemeinsam mit dem Komponenten-JavaScript an den Browser gesendet. Falls zwei oder mehr Komponenten auf einer Seite dasselbe Framework nutzen, wird das Framework nur einmal gesendet.

:::note[Barrierefreiheit]
Die meisten Framework-spezifischen Patterns für Barrierefreiheit sollten genauso funktionieren, wenn sie in Astro verwendet werden. Vergewissere dich, dass du eine client-Direktive verwendest, die sicherstellt, dass das JavaScript für die Barrierefreiheit korrekt geladen und zur richtigen Zeit ausgeführt wird!
:::

### Verfügbare Hydratisierungs-Direktiven 

Es sind einige Hydratisierungs-Direktiven für UI-Framework-Komponenten verfügbar: `client:load`, `client:idle`, `client:visible`, `client:media={QUERY}` und `client:only={FRAMEWORK}`.

📚 Sieh dir unsere [Direktiven-Referenz](/de/reference/directives-reference/#client-directives) für eine vollständige Beschreibung der Direktiven und deren Nutzung an.

## Frameworks mischen

Du kannst Komponenten aus verschiedenen Frameworks in dieselbe Astro-Komponente importieren und dort rendern.

```astro title="src/pages/mixing-frameworks.astro"
---
// Beispiel: Mehrere Framework-Komponenten auf der gleichen Seite verwenden.
import MyReactComponent from '../components/MyReactComponent.jsx';
import MySvelteComponent from '../components/MySvelteComponent.svelte';
import MyVueComponent from '../components/MyVueComponent.vue';
---
<div>
  <MySvelteComponent />
  <MyReactComponent />
  <MyVueComponent />
</div>
```

:::caution
Nur **Astro**-Komponenten (`.astro`) können Komponenten von verschiedenen Frameworks enthalten.
:::

## Props an Framework-Komponenten durchreichen

Du kannst Props von Astro-Komponenten an Framework-Komponenten durchreichen: 

```astro title="src/pages/frameworks-props.astro"
---
import TodoList from '../components/TodoList.jsx';
import Counter from '../components/Counter.svelte';
---
<div>
  <TodoList initialTodos={["Lerne Astro", "PRs prüfen"]} />
  <Counter startingCount={1} />
</div>
```

:::caution[Funktionen als Props durchreichen]
Du kannst eine Funktion als Prop an eine Framework-Komponente durchreichen, jedoch funktioniert dies nur mit serverseitigen Rendering. Versuchst du eine Funktion in einer hydratisierten Komponente zu nutzen (z.B. als Event-Handler), wird ein Fehler auftreten.

Das liegt daran, dass Funktionen von Astro nicht _serialisiert_ (vom Server zum Client übertragen) werden können.
:::

## Kinder an Framework-Komponenten durchreichen 

Innerhalb einer Astro-Komponente **kannst** du Kinder an die Framework-Komponenten durchreichen. Jedes Framework hat dabei seine eigene Vorgehensweise, wie die Kinder referenziert werden sollen: React, Preact und Solid nutzen eine spezielle `children`-Prop, wohingegen Svelte und Vue ein `<slot />`-Element nutzen.

```astro title="src/pages/component-children.astro" {5}
---
import MyReactSidebar from '../components/MyReactSidebar.jsx';
---
<MyReactSidebar>
  <p>Hier ist eine Sidebar mit etwas Text und einem Button</p>
</MyReactSidebar>
```

Zusätzlich kannst du [Benannte Slots](/de/core-concepts/astro-components/#benannte-slots) verwenden, um spezifische Kinder zu gruppieren.

Für React, Preact und Solid werden die Slots in Eigenschaften auf oberster Ebene konvertiert. Slot-Namen in `kebab-case` werden in `camelCase` konvertiert.

```astro title="src/pages/named-slots.astro" /slot="(.*)"/
---
import MySidebar from '../components/MySidebar.jsx';
---
<MySidebar>
  <h2 slot="title">Menü</h2>
  <p>Hier ist eine Sidebar mit etwas Text und einem Button</p>
  <ul slot="social-links">
    <li><a href="https://twitter.com/astrodotbuild">Twitter</a></li>
    <li><a href="https://github.com/withastro">GitHub</a></li>
  </ul>
</MySidebar>
```

```jsx /{props.(title|socialLinks)}/
// src/components/MySidebar.jsx
export default function MySidebar(props) {
  return (
    <aside>
      <header>{props.title}</header>
      <main>{props.children}</main>
      <footer>{props.socialLinks}</footer>
    </aside>
  )
}
```

In Svelte und Vue können diese Slots durch ein `<slot>`-Element mit `name`-Attribut referenziert werden. Slot-Namen in `kebab-case` bleiben erhalten.

```jsx /slot name="(.*)"/
// src/components/MySidebar.svelte
<aside>
  <header><slot name="title" /></header>
  <main><slot /></main>
  <footer><slot name="social-links" /></footer>
</aside>
```

## Framework-Komponenten verschachteln

Innerhalb einer Astro-Datei können Framework-Komponenten ebenfalls hydratisierte Komponenten sein. Das bedeutet, dass du rekursiv Komponenten von beliebigen dieser Frameworks ineinander verschachteln kannst.

```astro title="src/pages/nested-components.astro" {10-11}
---
import MyReactSidebar from '../components/MyReactSidebar.jsx';
import MyReactButton from '../components/MyReactButton.jsx';
import MySvelteButton from '../components/MySvelteButton.svelte';
---

<MyReactSidebar>
  <p>Hier ist eine Sidebar mit etwas Text und einem Button</p>
  <div slot="actions">
    <MyReactButton client:idle />
    <MySvelteButton client:idle />
  </div>
</MyReactSidebar>
```

:::caution
Beachte: Innerhalb von Framework-Komponenten-Dateien selbst (z.B. `.jsx`, `.svelte`) kannst du keine Frameworks mischen.
:::

Dies erlaubt es dir, gesamte "Anwendungen" mit deinem bevorzugten JavaScript-Framework zu bauen und sie durch eine Eltern-Komponente zu einer Astro-Seite zu rendern.

:::note
Astro-Komponenten werden immer als statisches HTML gerendet, sogar wenn sie hydratisierte Framework-Komponenten enthalten. Das bedeutet, dass du nur Props übergeben kannst, die kein HTML-Rendering verursachen. Es ist z.B. nicht möglich, Reacts "Render Props" aus einer Astro-Komponente heraus an Framework-Komponenten zu übergeben, da Astro-Komponenten nicht das clientseitige Laufzeitverhalten zur Verfügung stellen, welches dafür benötigt wird. Nutze stattdessen Benannte Slots.
:::

## Kann ich Astro-Komponenten innerhalb meiner Framework-Komponenten verwenden?

Jede UI-Framework-Komponente wird zu einer "Astro-Insel" dieses Frameworks. Solche Komponenten müssen komplett in Code geschrieben werden, der für das jeweilige Framework gültig ist, und können nur ihre eigenen Importe und Pakete verwenden. Du kannst keine `.astro`-Komponenten in eine UI-Framework-Komponente (z.B. `.jsx` oder `.svelte`) importieren.

Du kannst allerdings das [Astro-`<slot />`-Muster](/de/core-concepts/astro-components/#slots) **innerhalb einer `.astro`-Komponente** verwenden, um statische Inhalte, die von Astro-Komponenten erzeugt wurden, als Kinder an deine Framework-Komponenten zu übergeben.

```astro title="src/pages/astro-children.astro" {6}
---
import MyReactComponent from  '../components/MyReactComponent.jsx';
import MyAstroComponent from '../components/MyAstroComponent.astro';
---
<MyReactComponent>
  <MyAstroComponent slot="name" />
</MyReactComponent>
```

## Kann ich Astro-Komponenten hydratisieren?

Wenn du versuchst, eine Astro-Komponente mit einer `client:`-Direktive zu hydratisieren, wirst du einen Fehler erhalten.

[Astro-Komponenten](/de/core-concepts/astro-components/) sind reine HTML-Komponenten ohne clientseitigen Laufzeit-Code. Jedoch kannst du ein `<script>`-Tag innerhalb der Komponentenvorlage deiner Astro-Komponente verwenden, um JavaScript-Code an den Browser zu senden, der auf globaler Ebene ausgeführt werden soll.

📚 Erfahre mehr über das [clientseitige `<script>`-Tag in Astro-Komponenten](/de/core-concepts/astro-components/#clientseitige-skripte)

[mdn-io]: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
[mdn-ric]: https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback
[mdn-mm]: https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia
