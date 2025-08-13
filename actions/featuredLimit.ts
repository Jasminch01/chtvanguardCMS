export function withFeatureLimit(originalAction : any) {
  return (props : any) => {
    const original = originalAction(props)

    return {
      ...original,
      onHandle: async () => {
        const {published, draft} = props
        const doc = draft || published
        const client = props.client.withConfig({apiVersion: '2023-05-03'})

        if (doc.featured) {
          const featuredDocs = await client.fetch(
            `*[
              (_type == "newsItem" || _type == "videocontent") 
              && featured == true 
              && _id != $id
            ] | order(_createdAt asc)`,
            {id: doc._id.replace('drafts.', '')},
          )

          if (featuredDocs.length >= 4) {
            const oldest = featuredDocs[0]
            await client
              .patch(oldest._id)
              .set({featured: false})
              .commit({autoGenerateArrayKeys: true})
          }
        }

        original.onHandle()
      },
    }
  }
}
