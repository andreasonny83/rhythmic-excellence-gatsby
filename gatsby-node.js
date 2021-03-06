const path = require('path');

const { createFilePath } = require('gatsby-source-filesystem');

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions;

  const newsTemplate = path.resolve('src/templates/news.js');
  const disciplineTemplate = path.resolve('src/templates/discipline.js');
  const legalTemplate = path.resolve('src/templates/legal.js');

  return graphql(`
    {
      allMarkdownRemark(
        sort: { fields: [frontmatter___date], order: DESC }
        filter: { frontmatter: { published: { eq: true } } }
        limit: 1000
      ) {
        edges {
          node {
            fields {
              slug
              category
            }
          }
        }
      }
    }
  `).then(res => {
    if (res.errors) {
      return Promise.reject(res.errors);
    }

    res.data.allMarkdownRemark.edges.forEach(({ node }) => {
      let template;

      if (node.fields && node.fields.category === 'news') {
        template = newsTemplate;
      } else if (node.fields && node.fields.category === 'discipline') {
        template = disciplineTemplate;
      } else if (node.fields && node.fields.category === 'legal') {
        template = legalTemplate;
      } else {
        return;
      }

      createPage({
        path: node.fields.slug,
        component: template,
        context: {
          slug: node.fields.slug,
        },
      });
    });
  });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode });

    // Ignore draft pages
    if (!(node.frontmatter.published && node.frontmatter.published === true)) {
      return;
    }

    if (/^.+\/legal\/.+/.test(node.fileAbsolutePath)) {
      createNodeField({
        name: 'slug',
        node,
        value: `/legal${value}`,
      });
    } else {
      createNodeField({
        name: 'slug',
        node,
        value,
      });
    }

    if (/^.+\/news\/.+/.test(node.fileAbsolutePath)) {
      // Dynamically add a `news` category to news posts
      createNodeField({
        name: 'category',
        node,
        value: 'news',
      });
    } else if (/^.+\/disciplines\/.+/.test(node.fileAbsolutePath)) {
      // Dynamically add a `discipline` category to discipline pages
      createNodeField({
        name: 'category',
        node,
        value: 'discipline',
      });
    } else if (/^.+\/team\/.+/.test(node.fileAbsolutePath)) {
      // Dynamically add a `team` category to team members
      createNodeField({
        name: 'category',
        node,
        value: 'team',
      });
    } else if (/^.+\/home\/.+/.test(node.fileAbsolutePath)) {
      // Dynamically add a `homepage` category to team members
      createNodeField({
        name: 'category',
        node,
        value: 'home',
      });
    } else if (/^.+\/legal\/.+/.test(node.fileAbsolutePath)) {
      // Dynamically add a `legal` category to team members
      createNodeField({
        name: 'category',
        node,
        value: 'legal',
      });
    } else if (/^.+\/socials\/.+/.test(node.fileAbsolutePath)) {
      // Dynamically add a `legal` category to team members
      createNodeField({
        name: 'category',
        node,
        value: 'socials',
      });
    } else if (/^.+\/timetable\/.+/.test(node.fileAbsolutePath)) {
      // Dynamically add a `legal` category to team members
      createNodeField({
        name: 'category',
        node,
        value: 'timetable',
      });
    } else {
      createNodeField({
        name: 'category',
        node,
        value: 'undefined',
      });
    }
  }
};
