import React from 'react';
import { BlogPostQuery, BlogPost } from '@deity/falcon-ecommerce-uikit';

const Post = ({ path }) => (
  <BlogPostQuery variables={{ path }}>{postProps => <BlogPost {...postProps} />}</BlogPostQuery>
);

export default Post;
