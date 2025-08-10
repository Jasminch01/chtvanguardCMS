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
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Mark this news item as featured content (maximum 4 items)',
      initialValue: false,
      validation: (Rule) =>
        Rule.custom(async (value, context) => {
          // Only validate if trying to set to true
          if (!value) return true

          // Get the current document ID to exclude it from the count
          const currentDocId = context.document?._id?.replace('drafts.', '')

          // Query for currently featured items
          const client = context.getClient({apiVersion: '2023-05-03'})
          const featuredCount = await client.fetch(
            `count(*[_type == "newsItem" && featured == true && _id != $currentDocId])`,
            {currentDocId},
          )

          if (featuredCount >= 4) {
            return 'Maximum of 4 featured items allowed. Please unfeature another item first.'
          }

          return true
        }),
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
        {
          name: 'title',
          title: 'Image Title',
          type: 'string',
          description: 'Optional title for the image (used for tooltips and captions)',
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      description: 'News content with text, images, and YouTube videos',
      of: [
        // Text Block
        {
          name: 'textBlock',
          title: 'Text Block',
          type: 'object',
          fields: [
            {
              name: 'text',
              title: 'Text',
              type: 'array',
              of: [
                {
                  type: 'block',
                  // Specify which styles are allowed
                  styles: [
                    {title: 'Normal', value: 'normal'},
                    {title: 'H1', value: 'h1'},
                    {title: 'H2', value: 'h2'},
                    {title: 'H3', value: 'h3'},
                    {title: 'H4', value: 'h4'},
                    {title: 'Quote', value: 'blockquote'},
                  ],
                  // Specify which list types are allowed
                  lists: [
                    {title: 'Bullet', value: 'bullet'},
                    {title: 'Number', value: 'number'},
                  ],
                  // Specify which marks (inline formatting) are allowed
                  marks: {
                    decorators: [
                      {title: 'Strong', value: 'strong'},
                      {title: 'Emphasis', value: 'em'},
                      {title: 'Underline', value: 'underline'},
                      {title: 'Strike', value: 'strike-through'},
                    ],
                    annotations: [
                      {
                        name: 'link',
                        type: 'object',
                        title: 'External Link',
                        fields: [
                          {
                            name: 'href',
                            type: 'url',
                            title: 'URL',
                            validation: (Rule) =>
                              Rule.uri({
                                allowRelative: false,
                                scheme: ['http', 'https', 'mailto', 'tel'],
                              }),
                          },
                          {
                            name: 'blank',
                            type: 'boolean',
                            title: 'Open in new tab',
                            description: 'Read https://css-tricks.com/use-target_blank/',
                            initialValue: true,
                          },
                        ],
                      },
                    ],
                  },
                },
              ],
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              blocks: 'text',
            },
            prepare(selection) {
              const {blocks} = selection
              const block = (blocks || []).find((block: {_type: string}) => block._type === 'block')
              const plainText = block
                ? block.children
                    ?.filter((child: {_type: string}) => child._type === 'span')
                    ?.map((span: {text: any}) => span.text)
                    ?.join('') || ''
                : ''

              return {
                title: plainText?.substring(0, 50) + (plainText?.length > 50 ? '...' : ''),
                subtitle: 'Rich Text Block',
              }
            },
          },
        },
        // Image Block
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
        // YouTube Video Block
        {
          name: 'youtubeBlock',
          title: 'YouTube Video Block',
          type: 'object',
          fields: [
            {
              name: 'url',
              title: 'YouTube URL',
              type: 'url',
              description: 'YouTube video URL (e.g., https://www.youtube.com/watch?v=VIDEO_ID)',
              validation: (Rule: any) =>
                Rule.required().custom((value: any) => {
                  if (!value) return 'YouTube URL is required'
                  // Basic YouTube URL validation
                  const youtubeRegex =
                    /^https?:\/\/(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)/
                  if (!youtubeRegex.test(value)) {
                    return 'Please enter a valid YouTube URL'
                  }
                  return true
                }),
            },
            {
              name: 'title',
              title: 'Video Title',
              type: 'string',
              description: 'Optional custom title for the video',
            },
            {
              name: 'caption',
              title: 'Caption',
              type: 'string',
              description: 'Optional caption or description',
            },
          ],
          preview: {
            select: {
              title: 'title',
              caption: 'caption',
              url: 'url',
            },
            prepare(selection: any) {
              const {title, caption} = selection
              return {
                title: title || caption || 'YouTube Video',
                subtitle: 'YouTube Video Block',
                media: undefined, // Don't try to show YouTube thumbnails in preview
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
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author',
      media: 'featuredImage',
      date: 'publishedAt',
      featured: 'featured',
    },
    prepare(selection) {
      const {title, author, media, date, featured} = selection
      return {
        title: featured ? `⭐ ${title}` : title,
        subtitle: `by ${author} • ${new Date(date).toLocaleDateString()}`,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Featured First',
      name: 'featuredFirst',
      by: [
        {field: 'featured', direction: 'desc'},
        {field: 'publishedAt', direction: 'desc'},
      ],
    },
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
