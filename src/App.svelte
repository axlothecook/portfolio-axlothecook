<script lang="ts">
  import Shell from './lib/Shell.svelte'
  import IconSprite from './lib/IconSprite.svelte'
  import WelcomeSlide from './lib/slides/WelcomeSlide.svelte'
  import ProjectsSlide from './lib/slides/ProjectsSlide.svelte'
  import SkillsSlide from './lib/slides/SkillsSlide.svelte'
  import AboutSlide from './lib/slides/AboutSlide.svelte'

  // Slide order (Welcome is the hero, unlabelled). Per the user's ordering:
  // Projects = Top, Skills = Middle, About = Bottom.
  const slides = [
    { component: WelcomeSlide, label: '' },
    { component: ProjectsSlide, label: 'Top' },
    { component: SkillsSlide, label: 'Middle' },
    { component: AboutSlide, label: 'Bottom' },
  ]

  let activeIndex = $state(0)
  const indicator = $derived(slides[activeIndex]?.label ?? '')

  // Track which slide is in view to drive the indicator. Each slide section
  // registers itself; the one most in view wins.
  let sections: HTMLElement[] = []

  function observe(node: HTMLElement, index: number) {
    sections[index] = node
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) activeIndex = index
        }
      },
      { threshold: 0.6 },
    )
    observer.observe(node)
    return {
      destroy() {
        observer.disconnect()
      },
    }
  }
</script>

<IconSprite />

<Shell {indicator}>
  <div class="scroll">
    {#each slides as slide, i}
      <div class="snap" use:observe={i}>
        <slide.component />
      </div>
    {/each}
  </div>
</Shell>

<style lang="scss">
  // Full-viewport vertical scroll container with snap. Wheel + touch both work
  // natively; each .snap is one slide.
  .scroll {
    height: 100vh;
    overflow-y: scroll;
    scroll-snap-type: y mandatory;
    scrollbar-width: none; // hide scrollbar (Firefox)

    &::-webkit-scrollbar {
      display: none; // hide scrollbar (Chrome/Safari)
    }
  }

  .snap {
    scroll-snap-align: start;
  }
</style>
