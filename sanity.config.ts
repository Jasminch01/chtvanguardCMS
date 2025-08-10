import {defineConfig} from 'sanity'
// import {structureTool} from 'sanity/structure'
// import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
// import {deskTool} from 'sanity/desk'
import {structure} from './structure/deskstructure'
import { structureTool } from 'sanity/structure'

export default defineConfig({
  name: 'default',
  title: 'CHTVANGUARD',

  projectId: 'eurj1y4m',
  dataset: 'production',

  plugins: [structureTool({structure})],

  schema: {
    types: schemaTypes,
  },
})
