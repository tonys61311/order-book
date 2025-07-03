// src/types/svg.d.ts
declare module '*.svg?component' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
