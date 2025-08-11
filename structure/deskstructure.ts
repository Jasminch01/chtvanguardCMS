import {StructureBuilder} from 'sanity/structure'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Content Management')
    .items([
      // Featured News Section
      S.listItem()
        .title('Featured News')
        .icon(() => '⭐')
        .child(
          S.documentList()
            .title('Featured News')
            .filter('_type == "newsItem" && featured == true')
            .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
            .canHandleIntent((intentName, params) => {
              // Allow creating new documents from this view
              return intentName === 'create' && params.type === 'newsItem'
            }),
        ),

      // All News Section
      S.listItem()
        .title('All News')
        .icon(() => '📰')
        .child(
          S.documentList()
            .title('All News Items')
            .filter('_type == "newsItem"')
            .defaultOrdering([{field: 'publishedAt', direction: 'desc'}]),
        ),

      // Regional News Categories
      S.listItem()
        .title('Regional News')
        .icon(() => '🏛️')
        .child(
          S.list()
            .title('Regional Categories')
            .items([
              // Rangamati
              S.listItem()
                .title('Rangamati')
                .icon(() => '🌄')
                .child(
                  S.documentList()
                    .title('Rangamati News')
                    .filter('_type == "newsItem" && category == "rangamati"')
                    .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
                    .canHandleIntent((intentName, params) => {
                      return intentName === 'create' && params.type === 'newsItem'
                    }),
                ),

              // Khagrachari
              S.listItem()
                .title('Khagrachari')
                .icon(() => '🏔️')
                .child(
                  S.documentList()
                    .title('Khagrachari News')
                    .filter('_type == "newsItem" && category == "khagrachari"')
                    .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
                    .canHandleIntent((intentName, params) => {
                      return intentName === 'create' && params.type === 'newsItem'
                    }),
                ),

              // Bandarban
              S.listItem()
                .title('Bandarban')
                .icon(() => '⛰️')
                .child(
                  S.documentList()
                    .title('Bandarban News')
                    .filter('_type == "newsItem" && category == "bandarban"')
                    .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
                    .canHandleIntent((intentName, params) => {
                      return intentName === 'create' && params.type === 'newsItem'
                    }),
                ),
            ]),
        ),

      // National & International News
      S.listItem()
        .title('National & International')
        .icon(() => '🌍')
        .child(
          S.list()
            .title('National & International Categories')
            .items([
              // National
              S.listItem()
                .title('National News')
                .icon(() => '🇧🇩')
                .child(
                  S.documentList()
                    .title('National News')
                    .filter('_type == "newsItem" && category == "national"')
                    .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
                    .canHandleIntent((intentName, params) => {
                      return intentName === 'create' && params.type === 'newsItem'
                    }),
                ),

              // International
              S.listItem()
                .title('International News')
                .icon(() => '🌐')
                .child(
                  S.documentList()
                    .title('International News')
                    .filter('_type == "newsItem" && category == "international"')
                    .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
                    .canHandleIntent((intentName, params) => {
                      return intentName === 'create' && params.type === 'newsItem'
                    }),
                ),
            ]),
        ),

      // Opinion & Press Release
      S.listItem()
        .title('Opinion & Press')
        .icon(() => '📝')
        .child(
          S.list()
            .title('Opinion & Press Categories')
            .items([
              // Opinion
              S.listItem()
                .title('Opinion')
                .icon(() => '💭')
                .child(
                  S.documentList()
                    .title('Opinion Articles')
                    .filter('_type == "newsItem" && category == "opinion"')
                    .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
                    .canHandleIntent((intentName, params) => {
                      return intentName === 'create' && params.type === 'newsItem'
                    }),
                ),

              // Press Release
              S.listItem()
                .title('Press Release')
                .icon(() => '📢')
                .child(
                  S.documentList()
                    .title('Press Releases')
                    .filter('_type == "newsItem" && category == "press-release"')
                    .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
                    .canHandleIntent((intentName, params) => {
                      return intentName === 'create' && params.type === 'newsItem'
                    }),
                ),
            ]),
        ),

      S.listItem()
        .title('Video Content')
        .icon(() => '🎥')
        .child(
          S.list()
            .title('Video Content Management')
            .items([
              // Featured Videos
              S.listItem()
                .title('Featured Videos')
                .icon(() => '⭐')
                .child(
                  S.documentList()
                    .title('Featured Videos')
                    .filter('_type == "videocontent" && featured == true')
                    .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
                    .canHandleIntent((intentName, params) => {
                      return intentName === 'create' && params.type === 'videocontent'
                    }),
                ),

              // All Videos
              S.listItem()
                .title('All Videos')
                .icon(() => '📹')
                .child(
                  S.documentList()
                    .title('All Video Content')
                    .filter('_type == "videocontent"')
                    .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
                    .canHandleIntent((intentName, params) => {
                      return intentName === 'create' && params.type === 'videocontent'
                    }),
                ),

              // Video Drafts
              S.listItem()
                .title('Video Drafts')
                .icon(() => '📝')
                .child(
                  S.documentList()
                    .title('Video Drafts')
                    .filter('_type == "videocontent" && _id in path("drafts.**")')
                    .defaultOrdering([{field: '_updatedAt', direction: 'desc'}]),
                ),
            ]),
        ),
      // Add a divider
      S.divider(),

      // Quick Actions
      S.listItem()
        .title('Quick Actions')
        .icon(() => '⚡')
        .child(
          S.list()
            .title('Quick Actions')
            .items([
              S.listItem()
                .title('Create New News Item')
                .icon(() => '➕')
                .child(
                  S.documentTypeList('newsItem')
                    .title('Create New News Item')
                    .child((documentId) =>
                      S.document().documentId(documentId).schemaType('newsItem'),
                    ),
                ),

              S.listItem()
                .title('Recent Drafts')
                .icon(() => '📝')
                .child(
                  S.documentList()
                    .title('Recent Drafts')
                    .filter('_type == "newsItem" && _id in path("drafts.**")')
                    .defaultOrdering([{field: '_updatedAt', direction: 'desc'}]),
                ),

              S.listItem()
                .title('Recently Published')
                .icon(() => '🚀')
                .child(
                  S.documentList()
                    .title('Recently Published')
                    .filter('_type == "newsItem" && !(_id in path("drafts.**"))')
                    .defaultOrdering([{field: 'publishedAt', direction: 'desc'}]),
                ),
            ]),
        ),
    ])
