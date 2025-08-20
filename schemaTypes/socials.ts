import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'socials',
  title: 'Socials',
  type: 'document',
  liveEdit: false,
  fields: [
    defineField({
      name: 'social',
      title: 'Social Title',
      type: 'string',
    }),
    defineField({
      name: 'url',
      title: 'Social URL',
      type: 'string',
    }),
  ],
})
