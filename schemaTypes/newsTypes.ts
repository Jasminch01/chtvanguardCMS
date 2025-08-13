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
          // If not featured, always valid
          if (!value) return true

          const currentDocId = context.document?._id?.replace(/^drafts\./, '')

          // Type guard: ensure we have a valid document ID
          if (!currentDocId) {
            return 'Document ID is required'
          }

          const client = context.getClient({apiVersion: '2023-05-03'})

          try {
            // Fetch all currently featured items, ordered by featuredAt (oldest first)
            const featuredItems = await client.fetch(
              `*[
            (_type == "newsItem" || _type == "videocontent")
            && featured == true
            && _id != $currentDocId
            && defined(featuredAt)
          ] | order(featuredAt asc)`,
              {currentDocId},
            )

            console.log(`📊 Current featured items: ${featuredItems.length}`)

            // If we already have 4 featured items, remove the oldest one
            if (featuredItems.length >= 4) {
              const oldestItem = featuredItems[0]
              const oldestItemId = oldestItem._id.replace(/^drafts\./, '')

              console.log(`🗑️ Removing oldest featured item: ${oldestItemId}`)

              // Unfeature the oldest item
              await client
                .patch(oldestItemId)
                .set({
                  featured: false,
                  featuredAt: null,
                })
                .commit({autoGenerateArrayKeys: true})

              console.log(`✅ Successfully unfeatured oldest item: ${oldestItemId}`)
            }

            // Set featuredAt timestamp for the current item
            const currentTime = new Date().toISOString()

            await client
              .patch(currentDocId)
              .set({featuredAt: currentTime})
              .commit({autoGenerateArrayKeys: true})

            console.log(`⭐ Featured new item: ${currentDocId} at ${currentTime}`)

            return true // Validation passes
          } catch (error) {
            console.error('❌ Error in featured items management:', error)
            return 'Failed to manage featured items. Please try again.'
          }
        }),
    }),
    // Optional: Add the featuredAt field to schema if not already present
    defineField({
      name: 'featuredAt',
      title: 'Featured At',
      type: 'datetime',
      description: 'Timestamp when this item was featured',
      hidden: true, // Hide from editor UI since it's managed automatically
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
      description: 'News content with text, images, YouTube videos, and highlight blocks',
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

        // Highlight Block - NEW
        {
          name: 'highlightBlock',
          title: 'Highlight Block',
          type: 'object',
          fields: [
            {
              name: 'text',
              title: 'Highlighted Text',
              type: 'array',
              of: [
                {
                  type: 'block',
                  styles: [
                    {title: 'Normal', value: 'normal'},
                    {title: 'H1', value: 'h1'},
                    {title: 'H2', value: 'h2'},
                    {title: 'H3', value: 'h3'},
                    {title: 'H4', value: 'h4'},
                  ],
                  lists: [
                    {title: 'Bullet', value: 'bullet'},
                    {title: 'Number', value: 'number'},
                  ],
                  marks: {
                    decorators: [
                      {title: 'Strong', value: 'strong'},
                      {title: 'Emphasis', value: 'em'},
                      {title: 'Underline', value: 'underline'},
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
                          },
                          {
                            name: 'blank',
                            type: 'boolean',
                            title: 'Open in new tab',
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
            {
              name: 'backgroundColor',
              title: 'Background Color',
              type: 'string',
              options: {
                list: [
                  {title: 'Yellow Highlight', value: '#fff3cd'},
                  {title: 'Blue Highlight', value: '#d1ecf1'},
                  {title: 'Green Highlight', value: '#d4edda'},
                  {title: 'Red Highlight', value: '#f8d7da'},
                  {title: 'Orange Highlight', value: '#ffeaa7'},
                  {title: 'Purple Highlight', value: '#e2d5f1'},
                  {title: 'Gray Highlight', value: '#e9ecef'},
                  {title: 'Custom', value: 'custom'},
                ],
                layout: 'dropdown',
              },
              initialValue: '#fff3cd',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'customColor',
              title: 'Custom Background Color',
              type: 'color',
              description: 'Only used when "Custom" is selected above',
              options: {
                disableAlpha: false,
              },
              hidden: ({parent}) => parent?.backgroundColor !== 'custom',
            },
            {
              name: 'borderColor',
              title: 'Border Color (Optional)',
              type: 'string',
              options: {
                list: [
                  {title: 'None', value: 'none'},
                  {title: 'Light Gray', value: '#dee2e6'},
                  {title: 'Yellow', value: '#ffc107'},
                  {title: 'Blue', value: '#17a2b8'},
                  {title: 'Green', value: '#28a745'},
                  {title: 'Red', value: '#dc3545'},
                  {title: 'Custom', value: 'custom'},
                ],
                layout: 'dropdown',
              },
              initialValue: 'none',
            },
            {
              name: 'customBorderColor',
              title: 'Custom Border Color',
              type: 'color',
              description: 'Only used when "Custom" border is selected above',
              options: {
                disableAlpha: false,
              },
              hidden: ({parent}) => parent?.borderColor !== 'custom',
            },
            {
              name: 'padding',
              title: 'Padding',
              type: 'string',
              options: {
                list: [
                  {title: 'Small', value: 'small'},
                  {title: 'Medium', value: 'medium'},
                  {title: 'Large', value: 'large'},
                ],
                layout: 'radio',
              },
              initialValue: 'medium',
            },
          ],
          preview: {
            select: {
              blocks: 'text',
              backgroundColor: 'backgroundColor',
              customColor: 'customColor',
            },
            prepare(selection) {
              const {blocks, backgroundColor, customColor} = selection
              const block = (blocks || []).find((block: {_type: string}) => block._type === 'block')
              const plainText = block
                ? block.children
                    ?.filter((child: {_type: string}) => child._type === 'span')
                    ?.map((span: {text: any}) => span.text)
                    ?.join('') || ''
                : ''

              const bgColor = backgroundColor === 'custom' ? customColor?.hex : backgroundColor

              return {
                title: plainText?.substring(0, 50) + (plainText?.length > 50 ? '...' : ''),
                subtitle: `Highlight Block (${bgColor || 'Default'})`,
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
