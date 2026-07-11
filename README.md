# Portfolio website
A personal portfolio website I made. 

## Design choices
<ul>
   <li>Static - shows data that doesn't change over time</li>
   <li>No-backed - static, defined data with no CRUD functionality does not require a server or database</li>
   <li>Single page slide-based - simpler than multi-page for the small amount of data it contains</li>
</ul>

## Features
Dark mode toggle <br />
Loading animation <br />
Skip button for animations <br />

## Design
[Figma](https://www.figma.com/design/Yc4OGKSCCefIzgg2P9tXu6/Portfolio-Website?node-id=3-73&t=ALfNXldsPVyxVNo5-0)
A fuller written spec (slide content, fixed shell, animations, colours) lives in [`docs/design-spec.md`](docs/design-spec.md) within the repo.

## Tools used 
Framework: [Svelte 5](https://svelte.dev)
Bundler: [Vite 8](https://vite.dev)
Language: [TypeScript](https://www.typescriptlang.org)
Styling: [my own sass library](https://github.com/axlothecook/axlothecook-sass-library)
Deployment: [Cloudflare](https://www.cloudflare.com) Pages via a subdomain `axlothecook.com`
3D (later): [Three.js](https://threejs.org)

## Getting started
1) download the repo via git clone
2) in terminal, type following commands:
```bash
npm install
npm run dev      # start the dev server
npm run build    # production build to dist/
npm run preview  # preview the production build
npm run check    # svelte-check + tsc type checking
```
3) view live via localhost link from the terminal

## Future updates
<ul>
   <li>Animated section with Three.js showcasing my best projects</li>
</ul>

## Demo photos
### Dark mode landing page
![image](https://github.com/user-attachments/assets/2bb7e871-936e-4982-9ed1-4dd3b73e106b)

### Light mode landing page
![image](https://github.com/user-attachments/assets/c66820b7-00ee-4327-8eb3-ae91da26cb3c)
