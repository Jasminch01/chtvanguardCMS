import {StructureBuilder, StructureResolverContext} from 'sanity/structure'

export const structure = (S: StructureBuilder, context: StructureResolverContext) =>
  S.list()
    .title('Content')
    .items([
      // Featured News Section
      S.listItem()
        .title('⭐ Featured News')
        .child(
          S.documentList()
            .title('Featured News Items')
            .filter('_type == "newsItem" && featured == true')
            .params({})
            .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
        ),

      // All News Section  
      S.listItem()
        .title('📰 All News')
        .child(
          S.documentList()
            .title('All News Items')
            .filter('_type == "newsItem"')
            .params({})
            .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
        ),

      // Divider
      S.divider(),

      // Category-wise News
      S.listItem()
        .title('📍 Regional News')
        .child(
          S.list()
            .title('Regional Categories')
            .items([
              S.listItem()
                .title('🏔️ Rangamati')
                .child(
                  S.documentList()
                    .title('Rangamati News')
                    .filter('_type == "newsItem" && category == "rangamati"')
                    .params({})
                    .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
                ),
              S.listItem()
                .title('🌄 Khagrachari')
                .child(
                  S.documentList()
                    .title('Khagrachari News')
                    .filter('_type == "newsItem" && category == "khagrachari"')
                    .params({})
                    .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
                ),
              S.listItem()
                .title('⛰️ Bandarban')
                .child(
                  S.documentList()
                    .title('Bandarban News')
                    .filter('_type == "newsItem" && category == "bandarban"')
                    .params({})
                    .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
                ),
            ])
        ),

      S.listItem()
        .title('🌐 National & International')
        .child(
          S.list()
            .title('Broader Coverage')
            .items([
              S.listItem()
                .title('🏛️ National')
                .child(
                  S.documentList()
                    .title('National News')
                    .filter('_type == "newsItem" && category == "national"')
                    .params({})
                    .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
                ),
              S.listItem()
                .title('🌍 International')
                .child(
                  S.documentList()
                    .title('International News')
                    .filter('_type == "newsItem" && category == "international"')
                    .params({})
                    .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
                ),
            ])
        ),

      S.listItem()
        .title('📝 Editorial & Press')
        .child(
          S.list()
            .title('Editorial Content')
            .items([
              S.listItem()
                .title('📄 Press Release')
                .child(
                  S.documentList()
                    .title('Press Release')
                    .filter('_type == "newsItem" && category == "press-release"')
                    .params({})
                    .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
                ),
              S.listItem()
                .title('💭 Opinion')
                .child(
                  S.documentList()
                    .title('Opinion Articles')
                    .filter('_type == "newsItem" && category == "opinion"')
                    .params({})
                    .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
                ),
            ])
        ),

      // Divider
      S.divider(),

      // Stats Section (optional)
      S.listItem()
        .title('📊 Quick Stats')
        .child(
          S.list()
            .title('Content Statistics')
            .items([
              S.listItem()
                .title('📈 Recently Published')
                .child(
                  S.documentList()
                    .title('Last 10 Published')
                    .filter('_type == "newsItem"')
                    .params({})
                    .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
                    .limit(10)
                ),
              S.listItem()
                .title('✏️ Drafts')
                .child(
                  S.documentList()
                    .title('Draft Articles')
                    .filter('_type == "newsItem" && !defined(_id)')
                    .params({})
                ),
            ])
        ),
    ])