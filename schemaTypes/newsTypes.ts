import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'newsItem',
  title: 'News',
  type: 'document',
  liveEdit: false, // This enables draft/publish workflow
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      description: 'Main image for previews and social sharing',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (Rule: any) => Rule.required(),
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      description: 'News content with text and images',
      of: [
        // Text Block - NO defineField here
        {
          name: 'textBlock',
          title: 'Text Block',
          type: 'object',
          fields: [
            {
              name: 'text',
              title: 'Text',
              type: 'text',
              validation: (Rule: any) => Rule.required(),
            },
          ],
          preview: {
            select: {
              text: 'text',
            },
            prepare(selection: any) {
              const {text} = selection
              return {
                title: text?.substring(0, 50) + '...',
                subtitle: 'Text Block',
              }
            },
          },
        },
        // Image Block - NO defineField here
        {
          name: 'imageBlock',
          title: 'Image Block',
          type: 'object',
          fields: [
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {
                hotspot: true,
              },
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'caption',
              title: 'Caption',
              type: 'string',
            },
          ],
          preview: {
            select: {
              media: 'image',
              caption: 'caption',
              alt: 'alt',
            },
            prepare(selection: any) {
              const {media, caption, alt} = selection
              return {
                title: caption || alt || 'Image',
                subtitle: 'Image Block',
                media,
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Rangamati', value: 'rangamati'},
          {title: 'Khagrachari', value: 'khagrachari'},
          {title: 'Bandarban', value: 'bandarban'},
          {title: 'National', value: 'national'},
          {title: 'International', value: 'international'},
          {title: 'Press Release', value: 'press-release'},
          {title: 'Opinion', value: 'opinion'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author',
      media: 'featuredImage',
      date: 'publishedAt',
    },
    prepare(selection) {
      const {title, author, media, date} = selection
      return {
        title,
        subtitle: `by ${author} • ${new Date(date).toLocaleDateString()}`,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Published Date, New',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
    {
      title: 'Published Date, Old',
      name: 'publishedAtAsc',
      by: [{field: 'publishedAt', direction: 'asc'}],
    },
  ],
})
