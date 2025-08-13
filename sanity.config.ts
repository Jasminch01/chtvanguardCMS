import {defineConfig} from 'sanity'
// import {structureTool} from 'sanity/structure'
// import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
// import {deskTool} from 'sanity/desk'
import {structure} from './structure/deskstructure'
import {structureTool} from 'sanity/structure'
import { colorInput } from '@sanity/color-input'

export default defineConfig({
  name: 'default',
  title: 'CHTVANGUARD',

  projectId: 'eurj1y4m',
  dataset: 'production',

  plugins: [structureTool({structure}),  colorInput(),],

  schema: {
    types: schemaTypes,
  },
})
