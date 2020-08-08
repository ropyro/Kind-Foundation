import React from 'react';
import { T } from '@deity/falcon-i18n';
import { Box, Breadcrumbs, Breadcrumb, Link } from '@deity/falcon-ui';
import { BlogPostsQuery, BlogPostsLayout, BlogPostExcerpt, BlogPostsPaginator } from '@deity/falcon-ecommerce-uikit';

const Blog = props => (
  <Box as="section">
    <Breadcrumbs my="md" alignSelf="flex-start">
      <Breadcrumb key="index">
        <Link to="/">
          <T id="home.title" />
        </Link>
      </Breadcrumb>
      <Breadcrumb key="post">
        <T id="blog.title" />
      </Breadcrumb>
    </Breadcrumbs>

    <BlogPostsQuery
      variables={{
        pagination: {
          page: +props.match.params.page || 1
        }
      }}
    >
      {({ blogPosts }) => (
        <React.Fragment>
          <BlogPostsLayout>
            {blogPosts.items.map((item, index) => (
              <BlogPostExcerpt key={item.slug} gridColumn={index < 2 ? 'span 3' : 'span 2'} excerpt={item} />
            ))}
          </BlogPostsLayout>
          <BlogPostsPaginator pagination={blogPosts.pagination} />
        </React.Fragment>
      )}
    </BlogPostsQuery>
  </Box>
);

export default Blog;
